/* eslint-disable prettier/prettier */
// app/routes/reportes.js
import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class ReportesRoute extends Route {
  queryParams = {
    tipo_reporte: {
      refreshModel: true
    },
    id_cliente: {
      refreshModel: true
    }
  };

  async model(params) {
    try {
      const { tipo_reporte, id_cliente } = params;
  
      if (tipo_reporte === 'reporte-cliente') {
        console.log("Solictud al endpoint /api/reportes/creditos en formato JSON");
        const response = await fetch('http://35.202.166.109:5020/api/reportes/creditos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cliente_id: id_cliente || 92625 }),
        });
  
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error(`Error al obtener el reporte: ${response.statusText}`);
        }
      }
  
      // Para otros reportes (GET)
      let url = 'http://35.202.166.109:5018/api';
      if (tipo_reporte === 'creditos-atrasados') {
        url = `${url}/creditos-atrasados`;
      } else if (tipo_reporte === 'creditos-activos') {
        url = `${url}/creditos-activos`;
      } else if (tipo_reporte === 'resumen-financiero') {
        url = `${url}/resumen-financiero`;
      }
  
      const response = await fetch(url);
  
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error al obtener el reporte: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error en el modelo de reportes:', error);
      return {};
    }
  }
  
}
