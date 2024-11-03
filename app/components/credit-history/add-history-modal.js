import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AddCreditHistoryModalComponent extends Component {
  @tracked clientName = '';
  @tracked date = '';
  @tracked amount = '';
  @tracked status = '';
  @tracked isClosing = false;

  @action
  updateClientName(event) {
    this.clientName = event.target.value;
  }

  @action
  updateDate(event) {
    this.date = event.target.value;
  }

  @action
  updateAmount(event) {
    this.amount = event.target.value;
  }

  @action
  updateStatus(event) {
    this.status = event.target.value;
  }

  @action
  addEntry(event) {
    event.preventDefault();
    let newEntry = {
      id: Date.now(), // Generar un ID único
      clientName: this.clientName,
      date: this.date,
      amount: this.amount,
      status: this.status
    };
    this.args.onSave(newEntry);
    this.closeModal();
  }

  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300); // Duración de la animación en milisegundos
  }
}