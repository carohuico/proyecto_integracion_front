import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ClientDetailModalComponent extends Component {
  @service store;
  @tracked isClosing = false;
  @tracked historial = [];
  @tracked isLoadingHistorial = false;
  @tracked error = null;

  constructor() {
    super(...arguments);
    this.loadHistorial();
  }

  @action
  async loadHistorial() {
    this.isLoadingHistorial = true;
    this.error = null;
    try {
      console.log("Solicitud hacia el endpoint /api/historial-credito/{id} en formato JSON");
      let response = await fetch(
        `http://localhost:5013/api/historial-credito/${this.args.client.id}`,
      );
      if (!response.ok) {
        throw new Error('Error al cargar el historial crediticio');
      } else if (response.status === 401) {
        const responseData = await response.json();
        if (responseData.message === 'El token ha expirado') {
          console.error('El token ha expirado.');
          this.auth.logout();
          this.router.transitionTo('login');
          return;
        }
      }
      let data = await response.json();
      this.historial = data;
      console.log('Historial crediticio:', this.historial);
    } catch (error) {
      console.error('No hay historial crediticio de este cliente', error);
      this.error = 'No hay historial crediticio de este cliente';
    } finally {
      this.isLoadingHistorial = false;
    }
  }

  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300);
  }

  @action
  editClient() {
    console.log('Edit client', this.args.client);
    this.args.onEdit(this.args.client);
    this.args.onClose();
  }

  @action
  deleteClient() {
    this.args.onDelete(this.args.client);
  }
}
