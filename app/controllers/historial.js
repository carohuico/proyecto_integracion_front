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

 // Cargar historial al iniciar el controlador
  constructor() {
    super(...arguments);
    this.loadHistory();
  }

// Cargar historial desde el backend
async loadHistory() {
  try {
    let response = await fetch('http://34.31.19.169:5013/api/historial-credito'); // Completar la URL del servicio de lectura
    let data = await response.json();
    this.history = data.map(entry => ({
      id: entry.id_credito,
      estado: entry.estado_credito,
      pactado: entry.valor_pactado,
      pagado: entry.valor_pagado,
      fecha: entry.fecha_pago,
      monto: entry.monto_pago,
      clienteId: entry.id_cliente,
    }));
    //Mostrar solamente el primer historial
    console.log(this.history);
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Buscador de historial por ID de cliente
@action
async searchHistory(clienteId) {
  try {
    let response = await fetch(`http://34.31.19.169:5013/api/historial-credito/${clienteId}`);
    if (!response.ok) {
      // Si el servidor responde con un error (como 404)
      if (response.status === 404) {
        this.searchResults = [];
        if (clienteId !== null && clienteId.trim() !== '') {
          // Si el clienteId no es null o vacío, muestra la notificación
          this.errorMessage = 'No se encontró historial para el cliente con el ID proporcionado.';
        } else {
          // Si el clienteId es null o vacío, limpia el mensaje
          this.errorMessage = '';
        }
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } else {
      let data = await response.json();
      if (data.length === 0) {
        // Si el resultado está vacío, no establecer error
        this.searchResults = [];
        this.errorMessage = ''; // Limpia el mensaje de error
      } else {
        // Si hay resultados, asigna los datos
        this.searchResults = data.map(entry => ({
          id: entry.id_credito,
          estado: entry.estado_credito,
          pactado: entry.valor_pactado,
          pagado: entry.valor_pagado,
          fecha: entry.fecha_pago,
          monto: entry.monto_pago,
          clienteId: entry.id_cliente,
        }));
        this.errorMessage = ''; // Limpia el mensaje de error si se obtuvieron resultados
      }
    }
  } catch (error) {
    console.error('Error fetching history:', error);
    this.errorMessage = 'Hubo un problema al buscar el historial. Intente nuevamente.';
  }
}



  @action
  updateClienteId(event) {
    this.clienteId = event.target.value;
  }

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
    let entryIndex = this.creditHistory.findIndex(entry => entry.id === updatedEntry.id);
    if (entryIndex !== -1) {
      this.creditHistory[entryIndex] = updatedEntry;
    }
    this.closeEditModal();
  }

  @action
  deleteEntry(entry) {
    this.creditHistory = this.creditHistory.filter(e => e.id !== entry.id);
    this.closeDetailModal();
  }
}