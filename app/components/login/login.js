import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginFormComponent extends Component {
  @tracked username = '';
  @tracked password = '';

  @action
  updateUsername(event) {
    this.username = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  @action
  login(event) {
    event.preventDefault();
    if (!this.username || !this.password) {
      window.alert('Favor de llenar todos los campos');
      return;
    }
    let payload = {
      username: this.username,
      password: this.password,
    };

    //!TODO: llamada al servicio de autenticación

    console.log('Payload:', payload);
    this.username = '';
    this.password = '';
  }
}
