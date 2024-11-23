import Service from '@ember/service';
import { inject as service } from '@ember/service';
import jwtDecode from 'jwt-decode';
import { tracked } from '@glimmer/tracking';

export default class AuthService extends Service {
  @service router;

  @tracked token = localStorage.getItem('authToken') || null;
  @tracked role = localStorage.getItem('role') || null;

  get isAuthenticated() {
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
    localStorage.setItem('role', this.role);
  }

  logout() {
    if (!this.router) {
      console.error('El servicio router no está disponible');
      return;
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.token = null;
    this.role = null;
    alert('Sesión cerrada');
    this.router.transitionTo('/');
  }

  updateUserRole() {
    if (this.token) {
      try {
        const decodedToken = jwtDecode(this.token);
        this.role = decodedToken.role;
        localStorage.setItem('role', this.role);
      } catch (error) {
        console.error('Error retrieving user role:', error);
        this.role = null;
        localStorage.removeItem('role');
      }
    }
  }
}