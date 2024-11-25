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
  @tracked mostrarCreditoModal = false;
  @tracked nuevoCredito = {
    id_cliente: '',
    valor_pactado: '',
    valor_pagado: 0,
    fecha_creacion: '',
    id_viaje: '',
  };

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
      const response = await fetch(`http://35.202.166.109:5006/api/creditos/${searchId}`);
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

    if(!creditoSeleccionado) {
      console.error('No se encontró el crédito seleccionado');
      return;
    }

    // Verifica si se encontró el crédito seleccionado
      console.log('Obteniendo historial de pagos para el cliente con ID:', creditoSeleccionado.id_cliente); // ID del cliente del crédito seleccionado

      // Verifica si ya se cargaron los pagos para este crédito
    const pagosGuardados = this.pagos.find(pago => pago.id_credito === idCredito);
    if (pagosGuardados) {
      console.log('Pagos previamente cargados:', pagosGuardados);
      this.historialPagosVisible = true;
      return;
    }

    try {
      // Realiza la solicitud al backend
      const response = await fetch(`http://35.202.166.109:5007/api/pagos/${creditoSeleccionado.id_cliente}`);
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error('El backend no devolvió un array de pagos:', data.message || data);
        alert('No se encontraron pagos para este cliente.');
        return;
      }

      // Mapeo de los datos a un formato uniforme
      this.pagos = data.map(item => ({
        id_pago: item.id_pago,
        id_credito: item.id_credito,
        fecha_pago: item.fecha_pago,
        monto_pago: item.monto_pago,
      }));

      console.log('Historial de pagos cargado:', this.pagos);
      this.historialPagosVisible = true;
    } catch (error) {
      console.error('Error al obtener el historial de pagos:', error);
      alert('Hubo un problema al cargar el historial de pagos. Inténtalo nuevamente.');
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
      const response = await fetch(`http://35.202.166.109:5005/api/creditos/${idCredito}/actualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCredito),
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Crédito actualizado en el backend:', updatedData);

        //Recargar los créditos desde el backend
        console.log('Recargando créditos desde el backend...');
        this.searchId = this.selectedCredito.id_cliente.toString(); // Actualizar el ID de cliente
        await this.searchCreditos();

        //Mostrar mensaje de éxito
        alert('Crédito actualizado correctamente.');

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

  // Acción para mostrar la modal de nuevo crédito
  @action
  mostrarModalNuevoCredito() {
    this.mostrarCreditoModal = true; // Mostrar la modal
  }

  // Acción para ocultar la modal de nuevo crédito
  @action
  ocultarModalNuevoCredito() {
    this.mostrarCreditoModal = false; // Ocultar la modal
  }

  @action
  actualizarNuevoCredito(field, event) {
    this.nuevoCredito[field] = event.target.value;
    console.log(`Campo actualizado: ${field}, Valor: ${event.target.value}`);
  }

  resetNuevoCredito() {
    this.nuevoCredito = {
      id_cliente: '',
      valor_pactado: '',
      valor_pagado: '',
      fecha_creacion: '',
      id_viaje: '',
    };
  }

  @action
  async verificarCliente(id_cliente) {
    try {
      const response = await fetch(`http://35.202.166.109:5008/api/clientes/${id_cliente}`);
      if (response.ok) {
        const cliente = await response.json();
        console.log("Cliente encontrado:", cliente);
        return true; // Cliente válido
      } else {
        console.error("Cliente no encontrado");
        alert("El cliente especificado no existe. Verifica el ID.");
        return false;
      }
    } catch (error) {
      console.error("Error al verificar el cliente:", error);
      alert("Error al verificar el cliente. Inténtalo de nuevo.");
      return false;
    }
  }


  @action
  async guardarNuevoCredito() {

    // Validación de los datos
    const { id_cliente, valor_pactado, valor_pagado, fecha_creacion, id_viaje } = this.nuevoCredito;

    const valorPactadoNum = parseFloat(valor_pactado);
    const valorPagadoNum = parseFloat(valor_pagado);


    if (!id_cliente || !valorPactadoNum || !valorPagadoNum || !fecha_creacion || !id_viaje) {
      alert('Por favor, completa todos los campos. Si no realiza un pago inicial el campo valor pagado debe ser 0.');
      return;
    }

    const clienteExiste = await this.verificarCliente(id_cliente);
    if (!clienteExiste) return; // Detener si el cliente no existe

    console.log('Datos a enviar al backend:', {
      id_cliente,
      valor_pactado: valorPactadoNum,
      valor_pagado: valorPagadoNum,
      fecha_creacion,
      id_viaje
    });

    try {
      const response = await fetch('http://35.202.166.109:5008/api/creditos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cliente,
          valor_pactado: valorPactadoNum,
          valor_pagado: valorPagadoNum,
          fecha_creacion,
          id_viaje
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Crédito creado:', data);
        alert('Crédito creado correctamente.'); // Mostrar mensaje de éxito
        this.ocultarModalNuevoCredito(); // Ocultar la modal
        this.resetNuevoCredito(); // Restablecer los valores del nuevo crédito
        this.searchCreditos(); // Recargar los créditos
      } else {
        const error = await response.json();
        console.error('Error al crear el crédito:', error);
        alert(`Error al guardar el crédito: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al crear el crédito:', error);
      alert('Hubo un problema al crear el crédito. Inténtalo nuevamente.');
    }
  }
}