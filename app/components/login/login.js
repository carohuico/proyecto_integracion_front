import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';


export default class LoginFormComponent extends Component {
  @service router;
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
  async login(event) {
    event.preventDefault();
    if (!this.username || !this.password) {
      window.alert('Favor de llenar todos los campos');
      return;
    }

    let payload = {
      username: this.username,
      password: this.password,
    };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log('Autenticado:', data);

      // Guardar el token en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('role', data.role);

      if (data.role === 'admin') {
        this.router.transitionTo('clients');

      } else {
        this.router.transitionTo('clients');
      }
      this.username = '';
      this.password = '';
    } catch (error) {
      console.error('Error de red:', error);
      window.alert('Error de red, favor de intentar más tarde');
    }
  }
}
