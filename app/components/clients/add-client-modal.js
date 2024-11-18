import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { w } from '@ember/string';

export default class AddClientModalComponent extends Component {
  @tracked name = '';
  @tracked limit = '';
  @tracked phone = '';
  @tracked isClosing = false;

  @action
  updateName(event) {
    this.name = event.target.value;
  }

  @action
  updateEmail(event) {
    this.email = event.target.value;
  }

  @action
  updatePhone(event) {
    this.phone = event.target.value;
  }

  @action
  addClient(event) {
    event.preventDefault();
    if (!this.name || !this.email || !this.phone) {
      window.alert('Favor de llenar todos los campos');
      return;
    } else if (this.email.indexOf('@') === -1) {
      window.alert('Favor de ingresar un correo válido');
      return;
    }
    if (isNaN(this.phone)) {
      window.alert('Favor de ingresar un número de teléfono válido');
      return;
    }

    let payload = {
      name: this.name,
      email: this.email,
      phone: this.phone,
    };
    console.log(payload);

    this.name = '';
    this.email = '';
    this.phone = '';

    this.closeModal();
  }

  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300);
  }
}
