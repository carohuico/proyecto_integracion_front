import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

let token = localStorage.getItem('authToken');
export default class AddCreditHistoryModalComponent extends Component {
  @service auth;
  
  @tracked clienteId = '';
  @tracked idCredito = '';
  @tracked estado = '';
  @tracked pactado = '';
  @tracked monto = '';
  @tracked idViaje = '';
  @tracked fecha = '';
  @tracked isClosing = false;

  // Actualizar el ID del cliente
  @action
  updateClienteId(event) {
    this.clienteId = event.target.value;
  }

  // Actualizar el estado
  @action
  updateEstado(event) {
    this.estado = event.target.value;
  }

  // Actualizar el valor pactado
  @action
  updatePactado(event) {
    this.pactado = event.target.value;
  }

  // Actualizar el monto del pago inicial
  @action
  updateMonto(event) {
    this.monto = event.target.value;
  }

  // Actualizar el ID del viaje
  @action
  updateIdViaje(event) {
    this.idViaje = event.target.value;
  }

  // Actualizar la fecha
  @action
  updateFecha(event) {
    this.fecha = event.target.value;
  }

  // Guardar una nueva entrada
  @action
  async addEntry(event) {
    event.preventDefault();

    console.log('token:', token);
    // Validar campos requeridos
    if (!this.clienteId || !this.estado || !this.pactado || !this.monto || !this.idViaje || !this.fecha) {
      alert('Por favor, llena todos los campos. Si no hay monto inicial, ingresa 0.');
      return;
    }

    let newEntry = {
      id_cliente: this.clienteId,
      id_viaje: this.idViaje,
      estado_credito: this.estado,
      valor_pactado: parseFloat(this.pactado),
      monto_pago: parseFloat(this.monto),
      fecha_creacion: this.fecha,
    };

    console.log('Enviando datos al backend:', newEntry); // Log para depuración

    try {
      let response = await fetch('http://35.202.214.44:5012/api/historial-credito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        let data = await response.json();
        console.log('Respuesta del backend:', data); // Log para validar respuesta
        this.args.onSave(data); 
        this.closeModal();
      }else if (response.status === 401) {
        const responseData = await response.json();
        if (responseData.message === "El token ha expirado") {
            console.error('El token ha expirado.');
            this.auth.logout();
            this.router.transitionTo('login');
            return;
        }
      } else {
        let errorData = await response.json();
        console.error('Error del backend:', errorData.error);
        alert(`Error al guardar el crédito: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      alert('Hubo un problema al conectarse con el servidor. Intenta nuevamente.');
    }
  }


  // Cerrar el modal
  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300); // Duración de la animación
  }

  @action
  async deleteEntry() {
      const confirmation = window.confirm("¿Estás seguro de que deseas eliminar este crédito y todos los pagos asociados?");
      if (confirmation) {
          try {
              await fetch(`http://35.202.214.44:5015/api/historial-credito/${this.args.entry.id}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
              });
              if (response.status === 401) {
                const responseData = await response.json();
                if (responseData.message === "El token ha expirado") {
                    console.error('El token ha expirado.');
                    this.auth.logout();
                    this.router.transitionTo('login');
                    return;
                }
              }
              this.args.onDelete(this.args.entry);
              alert("Crédito eliminado correctamente.");
          } catch (error) {
              console.error("Error al eliminar el crédito:", error);
              alert("Ocurrió un error al intentar eliminar el crédito.");
          }
          this.closeModal();
      }
  }

}