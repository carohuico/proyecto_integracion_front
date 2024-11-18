/* eslint-disable prettier/prettier */
// controllers/creditos.js
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CreditosController extends Controller {
  @tracked searchId = '';  // Para almacenar el ID del cliente
  @tracked model = []; // Aquí se guardarán los créditos
  @tracked pagos = []; // Aquí se guardarán los pagos de un crédito
  @tracked historialPagosVisible = false; // Controla la visibilidad del historial de pagos
  @tracked selectedCredito = null; // Guarda el crédito seleccionado para mostrar en la modal
  @tracked isModalVisible = false; // Controla la visibilidad de la modal de actualización
  @tracked nuevoValorPactado = ''; // Valor del nuevo valor pactado
  @tracked nuevoEstado = ''; // Nuevo estado del crédito
  @service router; // Inyectamos el servicio router

  queryParams = ['id_cliente']; // Establecer query param

  // Se actualizará el valor de searchId con el cambio en el input
  @action
  updateSearchId(event) {
    this.searchId = event.target.value; // Extraer el valor del input
  }

  // Realizamos la transición para buscar créditos
  @action
  async searchCreditos() {
    const searchId = this.searchId.trim();

    if (!searchId || isNaN(searchId)) {
      console.log("Por favor, ingresa un ID de cliente válido.");
      return;  // No hace la transición si no hay un ID o es inválido
    }

    console.log("Buscando créditos para el ID:", searchId);

    try {
      // Primero realizamos la solicitud para obtener los créditos
      const response = await fetch(`http://34.31.19.169:5006/api/creditos/${searchId}`);
      const data = await response.json();
      this.model = data; // Actualiza los créditos
      // Ahora hacemos la transición a la ruta 'creditos' con el ID del cliente
      this.router.transitionTo('creditos', {
        queryParams: { id_cliente: searchId },
      });
    } catch (error) {
      console.error('Error al buscar créditos:', error);
      this.model = []; // Si hay error, vaciar la tabla
    }
  }

  // Acción para obtener historial de pagos cuando se hace clic en "Ver más"
  @action
  async verHistorialPagos(idCredito) {
    // Busca el crédito en la lista de créditos
    const creditoSeleccionado = this.model.find(credito => credito.id_credito === idCredito);

    // Verifica si se encontró el crédito seleccionado
    if (creditoSeleccionado) {
      console.log('Obteniendo historial de pagos para el cliente con ID:', creditoSeleccionado.id_cliente); // ID del cliente del crédito seleccionado

      // Verifica si ya se cargaron los pagos para este crédito
      const pagosGuardados = this.pagos.find(pago => pago.id_credito === idCredito);
        if (pagosGuardados) {
        this.pagos = pagosGuardados.pagos; // Si ya están cargados, solo los mostramos
        this.historialPagosVisible = true;
        return;
        }

      try {
        // Realiza la solicitud al backend para obtener el historial de pagos
        const response = await fetch(`http://34.31.19.169:5007/api/pagos/${creditoSeleccionado.id_cliente}`);
        const data = await response.json();
        console.log('Historial de pagos:', data);

        this.pagos = data.map(item => ({
        id_pago: item.id_pago,
        id_credito: item.id_credito,
        fecha_pago: item.fecha_pago,
        monto_pago: item.monto_pago
        }));

        this.historialPagosVisible = true;  // Mostrar la modal
            } catch (error) {
        console.error('Error al obtener el historial de pagos:', error);
        this.pagos = []; // Si hay error, vaciar los pagos
      }
    } else {
      console.error('No se encontró el crédito seleccionado');
    }
  }

  // Acción para ocultar el historial de pagos
  @action
  ocultarHistorialPagos() {
    this.historialPagosVisible = false;  // Ocultar historial
  }

  // Acción para actualizar los términos del crédito
  @action
  async actualizarCredito(idCredito) {
    const updatedCredito = {
      valor_pactado: this.nuevoValorPactado,
      estado_credito: this.nuevoEstado
    };

    try {
      // Hacemos una solicitud PUT para actualizar el crédito
      const response = await fetch(`http://34.31.19.169:5005/api/creditos/${idCredito}/actualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCredito),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Crédito actualizado:', updatedData);

        // Actualizar el modelo con el crédito modificado
        const creditoIndex = this.model.findIndex(credito => credito.id_credito === idCredito);
        if (creditoIndex !== -1) {
          this.model[creditoIndex] = updatedData;
        }
        // Ocultar la modal después de actualizar
        this.isModalVisible = false;
      } else {
        console.error('Error al actualizar el crédito:', response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud PUT:', error);
    }
  }

  // Acción para mostrar la modal con el crédito seleccionado
  @action
  mostrarModalActualizar(creditoId) {
    const creditoSeleccionado = this.model.find(credito => credito.id_credito === creditoId);
    
    if (creditoSeleccionado) {
        // Asignar el crédito seleccionado a la propiedad 'selectedCredito'
        this.selectedCredito = { ...creditoSeleccionado }; // Copia de los datos para evitar referencia directa
        this.nuevoValorPactado = creditoSeleccionado.valor_pactado; // Asignar el valor pactado actual
        this.nuevoEstado = creditoSeleccionado.estado_credito; // Asignar el estado actual
        this.isModalVisible = true; // Establecer la propiedad que controla la visibilidad de la modal
    } else {
        console.error('Crédito no encontrado.');
    }
  }

  // Acción para ocultar la modal
  @action
  ocultarModalActualizar() {
    this.isModalVisible = false;  // Ocultar la modal
  }
}