import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

let token = localStorage.getItem('authToken');

export default class ClientsController extends Controller {
  @service auth;
  @service router;

  @tracked isModalOpen = false;
  @tracked clients = [];
  @tracked selectedClient = null;
  @tracked isDetailModalOpen = false;
  @tracked isEditModalOpen = false;
  @tracked isLoading = false;
  @tracked progress = 0;

  constructor() {
    super(...arguments);
    this.load();
  }

  async load() {
    await this.loadClients();
  }

  @action
  async loadClients() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error(
        'Token no encontrado. Redirigiendo a la página de inicio de sesión.',
      );
      this.router.transitionTo('login');
      return;
    }

    console.log('token:', token);
    try {
      this.isLoading = true;
      this.progress = 0;
      let response = await fetch('http://35.202.166.109:5002/get_clientes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      let data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Error: la respuesta no es una lista de clientes');
        return;
      }

      for (let i = 0; i <= 100; i++) {
        this.progress = i;
        await new Promise((resolve) => setTimeout(resolve, 3));
      }

      this.clients = data.map((client) => ({
        id: client.id_cliente,
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
      console.error('Error loading clients:', error);
    } finally {
      this.isLoading = false;
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
  }

  @action
  openEditModal(client) {
    this.selectedClient = client;
    console.log('Cliente seleccionado para edición:', this.selectedClient);
    this.isEditModalOpen = true;
  }

  @action
  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedClient = null;
  }

  @action
  async addClient(newClient) {
    if (!token) {
      console.error(
        'Token no encontrado. Redirigiendo a la página de inicio de sesión.',
      );
      this.router.transitionTo('login');
      return;
    }

    try {
      console.log(newClient);
      let response = await fetch('http://35.202.166.109:5001/create_cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });
      if (response.ok) {
        alert('Cliente agregado correctamente');
        this.loadClients(); // Recargar clientes después de agregar
      } else if (response.status === 401) {
        const responseData = await response.json();
        if (responseData.message === 'El token ha expirado') {
          console.error('El token ha expirado.');
          this.auth.logout();
          this.router.transitionTo('login');
          return;
        }
      }
      this.closeModal();
    } catch (error) {
      console.error('Error agregando cliente:', error);
    }
  }

  @action
  async updateClient(updatedClient) {
    const token = localStorage.getItem('authToken');
    console.log('token', token);
    try {
      let response = await fetch(
        `http://335.202.166.109:5003/update_cliente/${updatedClient.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedClient),
        },
      );

      if (response.ok) {
        alert('Cliente actualizado correctamente');
        this.loadClients();
      } else if (response.status === 401) {
        const responseData = await response.json();
        if (responseData.message === 'El token ha expirado') {
          console.error('El token ha expirado.');
          this.auth.logout();
          this.router.transitionTo('login');
          return;
        }
      } else {
        console.error(
          'Error en la respuesta del servidor:',
          response.statusText,
        );
      }

      this.closeEditModal();
    } catch (error) {
      console.error('Error actualizando cliente:', error);
    }
  }

  @action
  async deleteClient(client) {
    this.clients = this.clients.filter((c) => c.id !== client.id);
    try {
      let response = await fetch(
        `http://35.202.166.109:5004/delete_cliente/${client.id}`,
        {
          // URL del servicio de eliminación
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        alert(`Cliente ${client.id} eliminado correctamente`);
        this.loadClients(); // Recargar clientes después de eliminar
      } else if (response.status === 401) {
        const responseData = await response.json();
        if (responseData.message === 'El token ha expirado') {
          console.error('El token ha expirado.');
          this.auth.logout();
          this.router.transitionTo('login');
          return;
        }
      } else {
        console.error(
          'Error en la respuesta del servidor:',
          response.statusText,
        );
      }
    } catch (error) {
      console.error('Error eliminando cliente:', error);
    }
    this.closeDetailModal();
  }
}
