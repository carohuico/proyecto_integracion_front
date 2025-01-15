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
      let url = 'http://localhost:5010/api/creditos';

      if (clienteId) {
        // Si el cliente ID está presente, modificamos la URL para hacer la búsqueda por ID de cliente
        url = `${url}?id_cliente=${clienteId}`;
      }else{
        // Si no se especifica el ID del cliente, se obtienen todos los créditos
        url = `${url}?id_cliente=`;
      }

      console.log("Solictud al endpoint /api/creditos/{id} en formato JSON");
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status === 401) {
        const responseData = await response.json();
        if (responseData.message === 'El token ha expirado') {
          console.error('El token ha expirado.');
          this.auth.logout();
          this.router.transitionTo('login');
          return;
        }
      }

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
