import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ClientsController extends Controller {
  @tracked isModalOpen = false;

  @action
  openModal() {
    this.isModalOpen = true;
  }

  @action
  closeModal() {
    this.isModalOpen = false;
  }

  @tracked clients = [
    // Aquí se deberían cargar los clientes desde la base de datos
    { id: 1, name: 'Carolina Huicochea', email: 'carolina.huicochea@udem.edu', phone: '8123227876', limit: 2000 },
  ];
  @tracked selectedClient = null;
  @tracked isDetailModalOpen = false;
  @tracked isEditModalOpen = false;

  @action
  openDetailModal(client) {
    this.selectedClient = client;
    this.isDetailModalOpen = true;
  }

  @action
  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedClient = null;
  }

  @action
  openEditModal(client) {
    this.selectedClient = client;
    this.isEditModalOpen = true;
  }

  @action
  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedClient = null;
  }

  @action
  saveClient(updatedClient) {
    let clientIndex = this.clients.findIndex(client => client.id === updatedClient.id);
    if (clientIndex !== -1) {
      this.clients[clientIndex] = updatedClient;
    }
    this.closeEditModal();
  }

  @action
  deleteClient(client) {
    this.clients = this.clients.filter(c => c.id !== client.id);
    this.closeDetailModal();
  }
}