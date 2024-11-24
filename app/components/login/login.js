import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class LoginComponent extends Component {
  @service auth;
  @service router;
  @tracked username = '';
  @tracked password = '';
  @tracked isLoading = false;

  @action
  async login(event) {
    event.preventDefault(); // Prevent the default form submission
    this.isLoading = true; // Set loading state to true when login starts
    try {
      const payload = {
        username: this.username,
        password: this.password,
      };

      const response = await fetch('http://35.202.214.44:5000/login', { // Asegúrate de que la URL sea correcta
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(`Error: ${errorData.message}`);
        this.isLoading = false; // Set loading state to false if login fails
        return;
      }

      const data = await response.json();
      console.log('Autenticado:', data);

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('role', data.role);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (data.role === 'admin') {
        this.router.transitionTo('clients').then(() => {
          window.location.reload(); 
        });
      } else {
        this.router.transitionTo('historial').then(() => {
          window.location.reload(); 
        });
      }
      this.username = '';
      this.password = '';
    } catch (error) {
      console.error('Error de red:', error);
      window.alert('Error de red, favor de intentar más tarde');
    } finally {
      this.isLoading = false; 
    }
  }

  @action
  updateUsername(event) {
    this.username = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }
}