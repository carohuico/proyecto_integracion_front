import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CreditHistoryDetailModalComponent extends Component {
  @tracked isClosing = false;

  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300); // Duración de la animación en milisegundos
  }

  @action
  editEntry() {
    this.args.onEdit(this.args.entry);
    this.closeModal();
  }

  @action
  async deleteEntry() {
      const confirmation = window.confirm("¿Estás seguro de que deseas eliminar este crédito y todos los pagos asociados?");
      if (confirmation) {
        console.log("Confirmo eliminar");
          try {
              await fetch(`http://34.172.213.233:5015/api/historial-credito/${this.args.entry.id}`, {
                  method: 'DELETE',
              });
              this.args.onDelete(this.args.entry); // Llama al método para actualizar la lista en el controlador
              alert("Crédito eliminado correctamente.");
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