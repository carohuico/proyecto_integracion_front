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
    this.args.onEdit(this.args.client);
    this.args.onClose();
  }

  @action
  deleteClient() {
    this.args.onDelete(this.args.client);
  }
}
