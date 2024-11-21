import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AddClientModalComponent extends Component {
  @tracked nombre1 = '';
  @tracked nombre2 = '';
  @tracked calle = '';
  @tracked telefono = '';
  @tracked nif = '';
  @tracked ofvta = '';
  @tracked poblacion = '';
  @tracked grupoClientes = '';
  @tracked canalDistribucion = '';
  @tracked tipoCanal = '';
  @tracked gr1 = '';
  @tracked clasificacion = '';
  @tracked digitoControl = '';
  @tracked bloqueoPedido = '';
  @tracked cpag = '';
  @tracked cDistribucion = '';
  @tracked distrito = '';
  @tracked zona = '';
  @tracked central = '';
  @tracked fechaRegistro = '';
  @tracked limiteCredito = '';
  @tracked isClosing = false;

  @action
  updateNombre1(event) {
    this.nombre1 = event.target.value;
  }

  @action
  updateNombre2(event) {
    this.nombre2 = event.target.value;
  }

  @action
  updateCalle(event) {
    this.calle = event.target.value;
  }

  @action
  updateTelefono(event) {
    this.telefono = event.target.value;
  }

  @action
  updateNIF(event) {
    this.nif = event.target.value;
  }

  @action
  updateOfvta(event) {
    this.ofvta = event.target.value;
  }

  @action
  updatePoblacion(event) {
    this.poblacion = event.target.value;
  }

  @action
  updateGrupoClientes(event) {
    this.grupoClientes = event.target.value;
  }

  @action
  updateCanalDistribucion(event) {
    this.canalDistribucion = event.target.value;
  }

  @action
  updateTipoCanal(event) {
    this.tipoCanal = event.target.value;
  }

  @action
  updateGR1(event) {
    this.gr1 = event.target.value;
  }

  @action
  updateClasificacion(event) {
    this.clasificacion = event.target.value;
  }

  @action
  updateDigitoControl(event) {
    this.digitoControl = event.target.value;
  }

  @action
  updateBloqueoPedido(event) {
    this.bloqueoPedido = event.target.value;
  }

  @action
  updateCPAG(event) {
    this.cpag = event.target.value;
  }

  @action
  updateCDistribucion(event) {
    this.cDistribucion = event.target.value;
  }

  @action
  updateDistrito(event) {
    this.distrito = event.target.value;
  }

  @action
  updateZona(event) {
    this.zona = event.target.value;
  }

  @action
  updateCentral(event) {
    this.central = event.target.value;
  }

  @action
  updateLimiteCredito(event) {
    this.limiteCredito = event.target.value;
  }

  @action
  addClient(event) {
    event.preventDefault();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    this.fechaRegistro = today;

    let newClient = {
      nombre_1: this.nombre1,
      nombre_2: this.nombre2,
      calle: this.calle,
      telefono_1: this.telefono,
      num_identificacion_fiscal: this.nif,
      ofvta: this.ofvta,
      poblacion: this.poblacion,
      grupo_clientes: this.grupoClientes,
      canal_distribucion: this.canalDistribucion,
      tipo_canal: this.tipoCanal,
      gr_1: this.gr1,
      clasificacion: this.clasificacion,
      digito_control: this.digitoControl,
      bloqueo_pedido: this.bloqueoPedido,
      cpag: this.cpag,
      c_distribucion: this.cDistribucion,
      distrito: this.distrito,
      zona: this.zona,
      central: this.central,
      fecha_registro: this.fechaRegistro,
      limite_credito: this.limiteCredito,
    };

    this.args.onSave(newClient);
    this.closeModal();
  }

  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300);
  }
}
