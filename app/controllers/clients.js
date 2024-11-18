/* eslint-disable prettier/prettier */
// client.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ClientsController extends Controller {
  @tracked isModalOpen = false;
  @tracked clients = [];
  @tracked selectedClient = null;
  @tracked isDetailModalOpen = false;
  @tracked isEditModalOpen = false;

  constructor() {
    super(...arguments);
    // Cargar clientes al iniciar el controlador
    this.loadClients();
  }

  // Cargar clientes desde el backend
  async loadClients() {
    try {
      let response = await fetch('http://34.29.77.59:5002/get_clientes'); // URL del servicio de lectura
      let data = await response.json();
      // nombre_1, nombre_2, calle, telefono_1, num_identificacion_fiscal, ofvta, poblacion, grupo_clientes, canal_distribucion, tipo_canal, gr_1, clasificacion, digito_control, bloqueo_pedido, cpag, c_distribucion, distrito, zona, central, fecha_registro, limite_credito
      this.clients = data.map(client => ({
        id: client.id_cliente,
        // concatenar nombre_1 y nombre_2
        nombre: `${client.nombre_1} ${client.nombre_2}`,
        calle: client.calle,
        telefono: client.telefono_1,
        nif: client.num_identificacion_fiscal,
        ofvta: client.ofvta,
        poblacion: client.poblacion,
        grupo: client.grupo_clientes,
        canal: client.canal_distribucion,
        tipoCanal: client.tipo_canal,
        gr1: client.gr_1,
        clasificacion: client.clasificacion,
        digitoControl: client.digito_control,
        bloqueoPedido: client.bloqueo_pedido,
        cpag: client.cpag,
        cDistribucion: client.c_distribucion,
        distrito: client.distrito,
        zona: client.zona,
        central: client.central,
        fechaRegistro: client.fecha_registro,
        limiteCredito: client.limite_credito,
      }));
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
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
  async saveClient(updatedClient) {
    try {
      let response = await fetch(`http://<IP-de-tu-VM>:5003/update_cliente/${updatedClient.id}`, { // URL del servicio de actualización
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient),
      });
      if (response.ok) {
        this.loadClients(); // Recargar clientes después de actualizar
      }
      this.closeEditModal();
    } catch (error) {
      console.error('Error actualizando cliente:', error);
    }
  }

  @action
  async deleteClient(client) {
    try {
      let response = await fetch(`http://<IP-de-tu-VM>:5004/delete_cliente/${client.id}`, { // URL del servicio de eliminación
        method: 'DELETE',
      });
      if (response.ok) {
        this.clients = this.clients.filter(c => c.id !== client.id);
      }
      this.closeDetailModal();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
    }
  }

  @action
  async addClient(newClient) {
    try {
      let response = await fetch('http://<IP-de-tu-VM>:5001/create_cliente', { // URL del servicio de creación
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (response.ok) {
        this.loadClients(); // Recargar clientes después de agregar
      }
      this.closeModal();
    } catch (error) {
      console.error('Error agregando cliente:', error);
    }
  }
}
