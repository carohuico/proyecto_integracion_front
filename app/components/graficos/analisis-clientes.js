import Component from '@ember/component';
import { Chart } from 'chart.js/auto';

export default Component.extend({
  chart: null,

  didInsertElement() {
    this._super(...arguments); // Llama al método base

    const canvasElement = this.element.querySelector('#analisisClientesChart');
    if (!canvasElement) {
      console.error('Canvas no encontrado');
      return;
    }

    this.setupChart(canvasElement); // Configura el gráfico
  },

  willDestroyElement() {
    this._super(...arguments);

    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico si el componente se elimina
    }
  },

  async setupChart(canvasElement) {
    try {
      console.log("Solictud al endpoint /api/grafica-analisis-clientes en formato JSON");
      // Realizar la solicitud al backend
      const response = await fetch(
        'http://localhost:5011/api/grafica-analisis-clientes',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error en la respuesta del servidor: ${response.status}`,
        );
      }

      const jsonResponse = await response.json();

      // Extraer datos del JSON
      const clientesActivos = jsonResponse.clientes_activos;
      const clientesEnDemora = jsonResponse.clientes_en_demora;
      const clientesPagados = jsonResponse.clientes_pagados;

      // Datos para el gráfico
      const data = [clientesActivos, clientesEnDemora, clientesPagados];
      const labels = [
        'Clientes Activos',
        'Clientes en Demora',
        'Clientes Pagados',
      ];

      console.log('Datos cargados:', {
        clientesActivos,
        clientesEnDemora,
        clientesPagados,
      });

      // Renderizar el gráfico en el canvas
      this.chart = new Chart(canvasElement, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: ['#ec4899', '#d35400', '#f97316'],
              borderColor: ['#ec4899', '#d35400', '#f97316'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  family: 'Poppins, sans-serif',
                  size: 12,
                },
                color: '#ffffff',
              },
            },
            title: {
              display: false,
              text: 'Análisis de Clientes Activos y Créditos en Demora',
              color: '#ffffff',
            },
          },
        },
      });
    } catch (error) {
      console.error('Error al cargar el gráfico:', error);
    }
  },
});
