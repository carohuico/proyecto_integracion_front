import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RegisterController extends Controller {
  @service router;
  @tracked nombre = '';
  @tracked apellido = '';
  @tracked telefono = '';
  @tracked nif = '';
  @tracked username = '';
  @tracked password = '';
  @tracked isLoading = false;

  @action
  updateNombre(event) {
    this.nombre = event.target.value;
  }

  @action
  updateApellido(event) {
    this.apellido = event.target.value;
  }

  @action
  updateTelefono(event) {
    this.telefono = event.target.value;
  }

  @action
  updateNif(event) {
    this.nif = event.target.value;
  }

  @action
  updateUsername(event) {
    this.username = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  @action
  async register(event) {
    event.preventDefault();
    this.isLoading = true;
    try {
      //validar
      if (
        this.nombre === '' ||
        this.apellido === '' ||
        this.telefono === '' ||
        this.nif === '' ||
        this.username === '' ||
        this.password === ''
      ) {
        window.alert('Campos faltantes');
        this.isLoading = false;
        return;
      }

      const payload = {
        username: this.username,
        password: this.password,
      };

      const response = await fetch('http://35.202.166.109:5100/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(`Error: ${errorData.message}`);
        this.isLoading = false;
        return;
      }

      const data = await response.json();
      console.log('Registrado:', data);
      // crear cliente
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0');
      let yyyy = today.getFullYear();
      today = yyyy + '-' + mm + '-' + dd;
      this.fechaRegistro = today;

      //generar id de cliente aleatorio
      let id = Math.floor(Math.random() * (90000 - 10000 + 1)) + 10000;

      let response2 = await fetch('http://35.202.166.109:5001/create_cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cliente: id,
          nombre_1: this.nombre,
          nombre_2: this.apellido,
          telefono_1: this.telefono,
          num_identificacion_fiscal: this.nif,
          fecha_registro: this.fechaRegistro,
          limite_credito: 5000,
        }),
      });
      if (response2.ok) {
        alert('Cliente agregado correctamente');
      } else {
        throw new Error('Error al agregar cliente');
      }
      this.nombre = '';
      this.apellido = '';
      this.telefono = '';
      this.nif = '';
      this.username = '';
      this.password = '';

      // Redirigir al usuario a la página de inicio de sesión
      this.router.transitionTo('login');
    } catch (error) {
      console.error('Error de red:', error);
      window.alert('Error de red, favor de intentar más tarde');
    } finally {
      this.isLoading = false;
    }
  }
}
