import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

let token = localStorage.getItem('authToken');

export default class CreditHistoryDetailModalComponent extends Component {
  @service auth;
  
  @tracked isClosing = false;
  @tracked isEditing = false;
  @tracked editableFields = {
    clienteId: '',
    viaje: '',
    pactado: '',
    monto: '',
    fecha: '',
  };

  //Cambiar a modo edición
  @action
  enableEditing(){
    this.isEditing = true;

    const formattedDate = new Date(this.args.entry.fecha).toISOString().split('T')[0];

    //Inicializar los campos editables con los valores actuales
    this.editableFields = {
      clienteId: this.args.entry.clienteId,
      viaje: this.args.entry.viaje,
      pactado: this.args.entry.pactado,
      //pagado: this.args.entry.pagado,
      fecha: formattedDate,
    };
  }

  // Guardar los cambios realizados en los campos editables
  @action
  async saveChanges(event) {
    event.preventDefault();

    // Validar campos requeridos
    if (!this.editableFields.clienteId || !this.editableFields.viaje || !this.editableFields.pactado /*|| !this.editableFields.pagado*/ || !this.editableFields.fecha) {
      alert('Por favor, llena todos los campos. Si no hay monto inicial, ingresa 0.');
      return;
    }

    try {

      //Transformar los nombres de los campos para que coincidan con los de la API
      const transformedFields = {
        id_cliente: parseInt(this.editableFields.clienteId, 10),
        id_viaje: parseInt(this.editableFields.viaje, 10),
        valor_pactado: parseFloat(this.editableFields.pactado).toFixed(2),
        /*valor_pagado: parseFloat(this.editableFields.pagado).toFixed(2),*/
        fecha_creacion: this.editableFields.fecha,
      };

      console.log("Datos enviados al back", transformedFields);

      let response = await fetch(`http://34.172.213.102:5014/api/historial-credito/${this.args.entry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedFields),
      });

      //console.log(response);

      if (response.ok) {
        const updatedEntry = await response.json();
        alert("Crédito actualizado correctamente. Has clic en 'Aceptar' para ver los cambios, puede tardar un momento.");
        this.args.onSave(updatedEntry); // Llama al método para actualizar la lista en el controlador
        this.disableEditing();
      } else {
        const errorData = await response.json();
        console.log("Error al actualizar el crédito:", errorData);
        alert("Ocurrió un error al intentar actualizar el crédito.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Hubo un problema al conectarse con el servidor. Intenta nuevamente.");
    }
  }

  //Cancelar la edición y volver a la vista de detalle
  @action
  disableEditing(){
    this.isEditing = false;
  }
  
  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300);
  }

  //Eliminar un crédito
  @action
  async deleteEntry() {
      const confirmation = window.confirm("¿Estás seguro de que deseas eliminar este crédito y todos los pagos asociados?");
      if (confirmation) {
        console.log("Confirmo eliminar");
        console.log("tokeeeeeeeeen", token);
          try {
              const response = await fetch(`http://35.202.214.44:5015/api/historial-credito/${this.args.entry.id}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      Autorization: `Bearer ${token}`,
                  },
              });
              if (response.ok) {
                alert("Crédito eliminado correctamente.");
                this.args.onDelete(this.args.entry); // Llama al método para actualizar la lista en el controlador
              }else if (response.status === 401) {
                const responseData = await response.json();
                if (responseData.message === "El token ha expirado") {
                    console.error('El token ha expirado.');
                    this.auth.logout();
                    this.router.transitionTo('login');
                    return;
                }
              }
          } catch (error) {
              console.error("Error al eliminar el crédito:", error);
              alert("Ocurrió un error al intentar eliminar el crédito.");
          }
          this.closeModal(); // Cierra el modal
      } else {
        console.log("Cancelo eliminar");
      }
  }

}