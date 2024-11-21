/* eslint-disable prettier/prettier */
// app/routes/creditos.js
import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class CreditosRoute extends Route {
  queryParams = {
    id_cliente: {
      refreshModel: true 
    }
  };

  async model(params) {
    try {
      const clienteId = params.id_cliente; // Obtenemos el ID del cliente desde los parámetros de la URL
      let url = 'http://35.188.171.63:5010/api/creditos';

      if (clienteId) {
        // Si el cliente ID está presente, modificamos la URL para hacer la búsqueda por ID de cliente
        url = `${url}?id_cliente=${clienteId}`;
      }

      let response = await fetch(url);

      // Si la respuesta es exitosa, parseamos el JSON
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error al obtener los créditos');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
