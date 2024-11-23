/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HistoryController extends Controller {

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
      let response = await fetch('http://127.0.0.1:5013/api/historial-credito'); //TODO: Compaginar
      let data = await response.json();
      console.log('Data:', data[0]);
      this.history = data.map(entry => ({
        id: entry.id_credito,
        estado: entry.estado_credito,
        pactado: entry.valor_pactado,
        pagado: entry.valor_pagado,
        fecha: entry.fecha_pago, //! REVISAR 
        monto: entry.monto_pago,
        clienteId: entry.id_cliente,
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
      let response = await fetch(`http://127.0.0.1:5013/api/historial-credito/${clienteId}`);
      if (!response.ok) {
        if (response.status === 404) {
          this.searchResults = [];
          this.errorMessage = 'No se encontró historial para el cliente con el ID proporcionado.';
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      } else {
        let data = await response.json();
        let filteredData = data.map(entry => ({
          id: entry.id_credito,
          estado: entry.estado_credito,
          pactado: entry.valor_pactado,
          pagado: entry.valor_pagado,
          fecha: entry.fecha_pago,
          monto: entry.monto_pago,
          clienteId: entry.id_cliente,
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
      console.error('Error fetching history:', error);
      this.errorMessage = 'Hubo un problema al buscar el historial. Intente nuevamente.';
    }
  }

  // Actualizar el cliente ID desde el formulario
  @action
  updateClienteId(event) {
    this.clienteId = event.target.value;
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
  deleteEntry(entry) {
    this.history = this.history.filter(e => e.id !== entry.id);
    this.closeDetailModal();
  }
}
