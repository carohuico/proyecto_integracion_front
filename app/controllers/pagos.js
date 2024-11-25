/* eslint-disable prettier/prettier */
// Controller
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

let id_cliente = localStorage.getItem('id_cliente');

export default class PagosController extends Controller {
  @service auth;

  @tracked searchId = '';  // Para almacenar el ID del cliente
  @tracked idCredito = '';
  @tracked montoPago = '';
  @tracked fechaPago = '';  // Nueva propiedad para la fecha de pago
  @tracked showPaymentModal = false;

  @service router; // Inyectar el servicio router

  queryParams = ['id_cliente']; 

  @action
  updateSearchId(event) {
   this.searchId = event.target.value;
   console.log("ID de cliente:", this.searchId);
  }

  get userRole() {
    return this.auth.userRole;
  }

  constructor() {
    super(...arguments);
    if (this.userRole === 'normal') {
      this.searchPagos();
    }
  }

  // Realizamos la transición para buscar créditos
  @action
  async searchPagos() {
    let searchId = null;

    try {
      if(this.auth.role === 'normal'){
        this.searchId = id_cliente;
        searchId = this.searchId;
        console.log("Buscando pagos para el ID de cliente:", searchId);
        console.log("ID:", this.searchId);
      }else{
        searchId = this.searchId.trim();
        if (!searchId || isNaN(searchId)) {
          console.log("Por favor, ingresa un ID de cliente válido.");
          return;
        }
      }
      // Primero realizamos la solicitud para obtener los pagos
      const response = await fetch(`http://35.202.166.109:5017/api/pagos/${searchId}`);
      const data = await response.json();
      this.model = data; // Actualiza los créditos
      console.log("Datos cargados:", data);
      this.searchResults = data;

      // Ahora hacemos la transición a la ruta 'creditos' con el ID del cliente
      this.router.transitionTo('pagos', {
        queryParams: { id_cliente: searchId },
      });
    } catch (error) {
      console.error('Error al buscar créditos:', error);
      this.model = []; 
    }
  }

  // Al abrir el modal, configuramos la fecha por defecto
  @action
  openPaymentModal() {
    console.log('Botón presionado'); // Agrega esta línea
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.fechaPago = formattedDate;  // Establecer la fecha actual
    this.showPaymentModal = true;
  }

  @action
  closePaymentModal() {
    this.showPaymentModal = false;
  }

  @action
  actualizarCampo(campo, event) {
    this[campo] = event.target.value;
  }

  @action
  async registrarPago(event) {
    event.preventDefault(); 
    try {
      const payload = {
        id_credito: this.idCredito,
        fecha_pago: this.fechaPago,
        monto_pago: this.montoPago,
      };
      console.log('Payload:', payload);

      const response = await fetch('http://35.202.166.109:5009/api/pagos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el pago');
      }

      const responseData = await response.json();
      alert(responseData.message || 'Pago registrado con éxito');
      this.send('refreshModel');
      this.closePaymentModal(); 
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al registrar el pago');
    }
  }
}
