import Service from '@ember/service';
import { inject as service } from '@ember/service';
import jwtDecode from 'jwt-decode';

export default class AuthService extends Service {
  @service router;

  token = localStorage.getItem('authToken') || null;
  role = localStorage.getItem('role') || null;

  get isAuthenticated() {
    console.log('Token:', this.token);
    return !!this.token;
  }

  get userRole() {
    if (this.token) {
      try {
        return this.role;
      } catch (error) {
        console.error('Error retrieving user role:', error);
        return null;
      }
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
    localStorage.removeItem('role');
    this.router.transitionTo('login');
  }
}