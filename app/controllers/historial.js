/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

let token = localStorage.getItem('authToken');
let idCliente = localStorage.getItem('id_cliente');

export default class HistoryController extends Controller {
  @service auth;

  @tracked isModalOpen = false;
  @tracked isDetailModalOpen = false;
  @tracked isEditModalOpen = false;
  @tracked selectedEntry = null;
  @tracked history = [];
  @tracked searchResults = [];
  @tracked clienteId = '';
  @tracked errorMessage = '';
  @tracked filteredResults = [];
  @tracked filterType = 'todos'; // Puede ser 'todos', 'activos', 'pagados'
  @tracked progress = 0;
  @tracked isLoading = false;
  @tracked notificationMessage = '';
  @tracked showNotification = false;

  // Nuevo crédito
  @tracked newCredit = {
    id_cliente: '',
    estado_credito: '',
    valor_pactado: 'activo',
    monto_pago: '',
  };
  // Cargar historial al iniciar el controlador
  constructor() {
    super(...arguments);
    this.loadHistory();
  }

  // Cargar historial desde el backend
  async loadHistory() {
    try {
      this.isLoading = true;
      this.progress = 0;
      let url = `http://localhost:5013/api/historial-credito/${idCliente}`;
      if (this.auth.userRole === 'admin') {
        url = 'http://localhost:5013/api/historial-credito'; 
      }

      console.log("Solictud al endpoint /api/historial-credito/{id} en formato JSON");
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al cargar el historial crediticio');
      }

      let data = await response.json();
      console.log('Data:', data[0]);
      this.history = data.map(entry => ({
        id: entry.id_credito,
        clienteId: entry.id_cliente,
        viaje: entry.id_viaje,
        estado: entry.estado_credito,
        pactado: entry.valor_pactado,
        pagado: entry.valor_pagado,
        fecha: entry.fecha_creacion,
      }));
      this.filteredResults = this.history; // Inicialmente, mostrar todos los resultados
      console.log('Historial cargado:', this.history[0]);
      for (let i = 0; i <= 100; i++) {
        this.progress = i;
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Guardar un nuevo crédito
  @action
  async saveNewCredit(event) {
    event.preventDefault();
    try {
      console.log("Solictud al endpoint /api/historial-credito en formato JSON");
      let response = await fetch('http://localhost:5012/api/historial-credito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.newCredit),
      });

      if(response.ok) {
        let data = await response.json();
        this.history.push({
          id: data.id_credito,
          viaje: data.id_viaje,
          estado: data.estado_credito,
          pactado: data.valor_pactado,
          pagado: data.valor_pagado,
          fecha: data.fecha_creacion,
          clienteId: data.id_cliente,
        });
        this.filteredResults = this.history; // Actualizar los resultados filtrados
        this.closeModal();
      }else if (response.status === 401) {
        const responseData = await response.json();
        if (responseData.message === 'El token ha expirado') {
          console.error('El token ha expirado.');
          this.auth.logout();
          this.router.transitionTo('login');
          return;
        }
      } else {
        let errorData = await response.json();
        this.errorMessage = errorData.error || 'Hubo un problema al guardar el crédito.';
      }
    } catch (error) {
      console.error('Error saving new credit:', error);
      this.errorMessage = 'Hubo un problema al guardar el crédito.';
    }
  }

  // Actualizar campos del nuevo crédito
  @action
  updateNewCreditField(field, event) {
    this.newCredit[field] = event.target.value;
  }

  // Cambiar el filtro activo
  @action
  setFilter(filterType) {
    this.filterType = filterType;
  
    // Si hay un clienteId en el buscador, aplica el filtro a los resultados de búsqueda
    if (this.clienteId.trim() !== '') {
      // Recalcula los resultados de búsqueda directamente desde el historial general
      const searchedData = this.history.filter(entry => entry.clienteId === parseInt(this.clienteId, 10));
  
      if (filterType === 'activos') {
        this.searchResults = searchedData.filter(entry => entry.estado === 'activo');
      } else if (filterType === 'pagados') {
        this.searchResults = searchedData.filter(entry => entry.estado === 'pagado');
      } else {
        this.searchResults = searchedData; // Mostrar todo si el filtro es "todos"
      }
  
      // Manejar el caso donde no haya resultados compatibles con el filtro
      if (this.searchResults.length === 0) {
        this.errorMessage = 'No se encontraron resultados para el ID y el filtro seleccionados.';
      } else {
        this.errorMessage = '';
      }
    } else {
      // Si no hay búsqueda activa, aplica el filtro a los datos generales
      if (filterType === 'activos') {
        this.filteredResults = this.history.filter(entry => entry.estado === 'activo');
      } else if (filterType === 'pagados') {
        this.filteredResults = this.history.filter(entry => entry.estado === 'pagado');
      } else {
        this.filteredResults = this.history;
      }
      this.errorMessage = ''; // Limpiar cualquier mensaje de error
    }
  }
  


  // Buscar historial por ID de cliente
  @action
  async searchHistory(clienteId) {
    try {
      console.log("Solictud al endpoint /api/historial-credito/{id} en formato JSON");
      let response = await fetch(`http://localhost:5013/api/historial-credito/${clienteId}`);
      if (!response.ok) {
        if (response.status === 404) {
          this.searchResults = [];
          this.errorMessage = 'No se encontró historial para el cliente con el ID proporcionado.';
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      } else {
        let data = await response.json();
        console.log('Datosss encontrados:', data);
        let filteredData = data.map(entry => ({
          id: entry.id_credito,
          viaje: entry.id_viaje,
          estado: entry.estado_credito,
          pactado: entry.valor_pactado,
          pagado: entry.valor_pagado,
          fecha: entry.fecha_creacion,
          clienteId: clienteId,
        }));
        // Filtrar los resultados de la búsqueda según el filtro activo
        if (this.filterType === 'activos') {
          filteredData = filteredData.filter(entry => entry.estado === 'activo');
        } else if (this.filterType === 'pagados') {
          filteredData = filteredData.filter(entry => entry.estado === 'pagado');
        }

        this.searchResults = filteredData;

        // Manejar el caso donde no haya resultados compatibles con el filtro
        if (this.searchResults.length === 0) {
          this.errorMessage = 'No se encontraron resultados para el ID y el filtro seleccionados.';
        } else {
          this.errorMessage = '';
        }
      }
    } catch (error) {
      this.errorMessage = 'Hubo un problema al buscar el historial. Intente nuevamente.';
    }
  }

  // Actualizar el cliente ID desde el formulario
  @action
  updateClienteId(event) {
    this.clienteId = event.target.value;
    console.log('Cliente ID:', this.clienteId);
  }

  // Manejar el evento de búsqueda
  @action
  async handleSearch(event) {
    event.preventDefault();
    await this.searchHistory(this.clienteId);
  }

  @action
  openModal() {
    this.isModalOpen = true;
  }

  @action
  closeModal() {
    this.isModalOpen = false;
  }

  @action
  openDetailModal(entry) {
    this.selectedEntry = entry;
    this.isDetailModalOpen = true;
  }

  @action
  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedEntry = null;
  }

  @action
  openEditModal(entry) {
    this.selectedEntry = entry;
    this.isEditModalOpen = true;
  }

  @action
  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedEntry = null;
  }

  @action
  saveEntry(updatedEntry) {
    let entryIndex = this.history.findIndex(entry => entry.id === updatedEntry.id);
    if (entryIndex !== -1) {
      this.history[entryIndex] = updatedEntry;
    }
    this.closeEditModal();
  }

  @action
  async deleteEntry(entry) {
      try {
          console.log("Solictud al endpoint /api/historial-credito/{id} en formato JSON");
          let response = await fetch(`http://localhost:5015/api/historial-credito/${entry.id}`, {
              method: 'DELETE',
              Authorization: `Bearer ${token}`,
          });
          if (response.status === 401) {
            const responseData = await response.json();
            if (responseData.message === "El token ha expirado") {
                console.error('El token ha expirado.');
                this.auth.logout();
                this.router.transitionTo('login');
                return;
            }
          }
          this.history = this.history.filter(e => e.id !== entry.id);
          this.filteredResults = this.history; // Actualizar los resultados filtrados
      } catch (error) {
          console.error("Error al eliminar el crédito:", error);
      }
  }


  @action
  async onSave(){
    await this.loadHistory();
    this.showSuccessNotification('Crédito guardado exitosamente.');
  }

  @action
  showSuccessNotification(message) {
    this.notificationMessage = message;
    this.showNotification = true;

    // Ocultar la notificación después de 3 segundos
    setTimeout(() => {
      this.showNotification = false;
    }, 6000);
  }

  /*@action
  updateEntry(updatedEntry){
    const index = this.history.findIndex(entry => entry.id === updatedEntry.id);
    if(index !== -1){
      this.history[index] = updatedEntry;
    } else {
      this.history.push(updatedEntry);
    }
    this.history = [...this.history];
  }*/

  async saveEntry(updatedEntry) {

    // Aviso de que esta cargando el historial mientras se actualiza

    // Encuentra el índice correspondiente y actualiza
    let entryIndex = this.history.findIndex(entry => entry.id === updatedEntry.id);

    if (entryIndex !== -1) {
      this.history[entryIndex] = updatedEntry; // Actualiza la entrada existente
    } else {
      this.history.push(updatedEntry); // Añade una nueva entrada
    }

    // Forzar a Ember a detectar el cambio
    this.history = [...this.history];

    // Actualiza la lista de resultados filtrados
    await this.loadHistory();

    // Cierra el modal después de guardar
    this.closeDetailModal();
  }

}