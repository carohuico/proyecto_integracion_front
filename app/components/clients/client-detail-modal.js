import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ClientDetailModalComponent extends Component {
  @tracked isClosing = false;

  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300); // Duración de la animación en milisegundos
  }

  @action
  editClient() {
    // Aquí se debería implementar la lógica para editar un cliente
    this.closeModal();
  }

  @action
  deleteClient() {
    this.args.onDelete(this.args.client);
    this.closeModal();
  }
}
