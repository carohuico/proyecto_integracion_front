/* eslint-disable prettier/prettier */
// app/routes/pagos.js
import Route from '@ember/routing/route';
import fetch from 'fetch';
import { action } from '@ember/object';

export default class PagosRoute extends Route {
  queryParams = {
    id_cliente: {
      refreshModel: true, // Actualiza el modelo si cambia el parámetro en la URL
    },
  };

  async model(params) {
    try {
      const clienteId = params.id_cliente; // Obtén el ID del cliente desde los parámetros de la URL
      let url = 'http://35.202.214.44:5016/api/pagos'; // URL del servicio para pagos

      // Si se pasa un ID de cliente, agrega un parámetro de consulta
      if (clienteId) {
        url = `${url}?id_cliente=${clienteId}`;
      }

      const response = await fetch(url);

      // Manejo de respuesta
      if (response.ok) {
        const data = await response.json();
        return data; // Devuelve los datos obtenidos al template
      } else {
        throw new Error('Error al obtener los pagos');
      }
    } catch (error) {
      console.error('Error al consumir el servicio de pagos:', error);
      return []; 
    }
  }

  // Maneja el evento 'refreshModel' y recarga el modelo
  @action
  refreshModel() {
    this.refresh();  // Esto recarga el modelo de la ruta
  }
  
}
