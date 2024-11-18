import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EditClientModalComponent extends Component {
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

  constructor() {
    super(...arguments);
    if (this.args.client) {
      this.nombre1 = this.args.client.nombre_1.split(' ')[0];
      this.nombre2 = this.args.client.nombre_2.split(' ')[1] || '';
      this.calle = this.args.client.calle;
      this.telefono = this.args.client.telefono_1;
      this.nif = this.args.client.num_identificacion_fiscal;
      this.ofvta = this.args.client.ofvta;
      this.poblacion = this.args.client.poblacion;
      this.grupoClientes = this.args.client.grupo_clientes;
      this.canalDistribucion = this.args.client.canal_distribucion;
      this.tipoCanal = this.args.client.tipo_canal;
      this.gr1 = this.args.client.gr1;
      this.clasificacion = this.args.client.clasificacion;
      this.digitoControl = this.args.client.digito_control;
      this.bloqueoPedido = this.args.client.bloqueo_pedido;
      this.cpag = this.args.client.cpag;
      this.cDistribucion = this.args.client.c_distribucion;
      this.distrito = this.args.client.distrito;
      this.zona = this.args.client.zona;
      this.central = this.args.client.central;
      this.fechaRegistro = this.args.client.fecha_registro;
      this.limiteCredito = this.args.client.limite_credito;
    }
  }

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
  updateFechaRegistro(event) {
    this.fechaRegistro = event.target.value;
  }

  @action
  updateLimiteCredito(event) {
    this.limiteCredito = event.target.value;
  }

  @action
  saveClient(event) {
    event.preventDefault();
    let updatedClient = {
      id: this.args.client.id,
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
      limite_credito: this.limiteCredito
    };
    this.args.onSave(updatedClient);
    this.closeModal();
  }

  @action
  closeModal() {
    this.isClosing = true;
    setTimeout(() => {
      this.args.onClose();
      this.isClosing = false;
    }, 300); // Duración de la animación en milisegundos
  }
}