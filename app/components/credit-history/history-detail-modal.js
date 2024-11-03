import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CreditHistoryDetailModalComponent extends Component {
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
  editEntry() {
    this.args.onEdit(this.args.entry);
    this.closeModal();
  }

  @action
  deleteEntry() {
    this.args.onDelete(this.args.entry);
    this.closeModal();
  }
}