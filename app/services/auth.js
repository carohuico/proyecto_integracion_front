import Service from '@ember/service';
import { inject as service } from '@ember/service'; // Importa la inyección de servicios
import jwtDecode from 'jwt-decode';

export default class AuthService extends Service {
  @service router; // Inyecta el servicio router

  token = localStorage.getItem('authToken') || null;

  get isAuthenticated() {
    return !!this.token;
  }

  get userRole() {
    if (this.token) {
      const decodedToken = jwtDecode(this.token);
      console.log('Decoded Token:', decodedToken); 
      return decodedToken.role;
    }
    return null;
  }  

  login(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  logout() {
    if (!this.router) {
      console.error('El servicio router no está disponible');
      return;
    }

    localStorage.removeItem('authToken');

    this.router.transitionTo('login');
  }
}
