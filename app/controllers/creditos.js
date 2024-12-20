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
  @tracked nuevoValorPagado = ''; // Valor del nuevo valor pagado (agregado)
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
      return;
    }

    console.log("Buscando créditos para el ID:", searchId);

    try {
      // Primero realizamos la solicitud para obtener los créditos
      const response = await fetch(`http://127.0.0.1:5006/api/creditos/${searchId}`);
      const data = await response.json();
      this.model = data; // Actualiza los créditos
      console.log("Datos cargados:", data);

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
        const response = await fetch(`http://127.0.0.1:5007/api/pagos/${creditoSeleccionado.id_cliente}`);
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
      valor_pagado: this.nuevoValorPagado
    };
    console.log('Datos a enviar en la solicitud PUT:', updatedCredito); 
    

    try {
      // Hacemos una solicitud PUT para actualizar el crédito
      const response = await fetch(`http://127.0.0.1:5005/api/creditos/${idCredito}/actualizar`, {
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
    console.log('Primer objeto de this.model:', this.model[0]);  // Imprime el primer objeto para verificar su estructura
    console.log('CreditoId recibido:', creditoId); 
    console.log('Mostrando modal para actualizar crédito:', creditoSeleccionado);
    
    if (creditoSeleccionado) {
        // Asignar el crédito seleccionado a la propiedad 'selectedCredito'
        this.selectedCredito = Object.assign({}, creditoSeleccionado); 
        console.log('SelectedCredito:', this.selectedCredito);
        this.nuevoValorPactado = creditoSeleccionado.valor_pactado; // Asignar el valor pactado actual
        this.nuevoValorPagado = creditoSeleccionado.valor_pagado; // Asignar el estado actual
        this.isModalVisible = true; 
    } else {
        console.error('Crédito no encontrado.');
        console.log("Datos de model:", this.model);
    }
  }

  @action
async confirmarActualizacion(event) {
  event.preventDefault();
  console.log('Confirmando actualización con los siguientes valores:');
  
  // Conversión de valores a número (float)
  const valorPactado = parseFloat(this.nuevoValorPactado);
  const valorPagado = parseFloat(this.nuevoValorPagado);

  // Verificar si la conversión fue exitosa
  if (isNaN(valorPactado) || isNaN(valorPagado)) {
    console.log("Error: los valores ingresados no son números válidos.");
    return;
  }

  console.log('Nuevo valor pactado:', valorPactado);
  console.log('Nuevo valor pagado:', valorPagado);
  
  const creditoId = this.selectedCredito.id_credito; // Obtén el ID del crédito seleccionado
  await this.actualizarCredito(creditoId, valorPactado, valorPagado); // Llamada a la acción de actualizar
}

@action
actualizarCampo(campo, event) {
  if (campo === 'valorPactado') {
    this.nuevoValorPactado = event.target.value;
    console.log('Nuevo valor pactado:', this.nuevoValorPactado); 
  } else if (campo === 'valorPagado') {
    this.nuevoValorPagado = event.target.value;
    console.log('Nuevo valor pagado:', this.nuevoValorPagado);
  }
}

  // Acción para ocultar la modal
  @action
  ocultarModalActualizar() {
    this.isModalVisible = false;  // Ocultar la modal
  }
}