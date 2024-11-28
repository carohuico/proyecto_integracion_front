import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';

export default class GraficosCreditosPagosComponent extends Component {
  @tracked data = [];
  @tracked isLoading = true;
  @tracked error = null;
  chart = null;

  constructor() {
    super(...arguments);
    this.loadData();
  }

  @action
  async loadData() {
    try {
      console.log("Solictud al endpoint /api/creditos-pagos en formato JSON");
      const response = await fetch(
        'http://35.202.166.109:5023/api/creditos-pagos',
      );
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const json = await response.json();
      console.log('Datos obtenidos para el gráfico:', json);

      if (!Array.isArray(json)) {
        throw new Error('Los datos no tienen el formato esperado.');
      }

      this.data = json;
      this.isLoading = false;

      // Renderizar el gráfico
      this.renderChart();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      this.error = error.message;
      this.isLoading = false;
    }
  }

  @action
  renderChart() {
    const canvas = document.getElementById('creditos-pagos-chart');
    if (!canvas) {
      console.error('Canvas no encontrado en el DOM');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }

    console.log('Datos para el gráfico:', this.data);

    if (!this.data || this.data.length === 0) {
      console.error('No hay datos disponibles para renderizar el gráfico');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data.map((item) => item.periodo),
        datasets: [
          {
            label: 'Núm. de créditos otorgados',
            data: this.data.map((item) => item.total_creditos),
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236, 72, 153, 0.2)', // Fondo semitransparente de la línea
            tension: 0.4,
            borderWidth: 2, // Grosor de la línea
            pointBackgroundColor: '#ec4899', // Color de los puntos
          },
          {
            label: 'Dinero recibido por pagos',
            data: this.data.map((item) => item.total_pagos),
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.2)', // Fondo semitransparente de la línea
            tension: 0.4,
            borderWidth: 2, // Grosor de la línea
            pointBackgroundColor: '#f97316', // Color de los puntos
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
          },
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            title: {
              display: true,
              text: 'Período (Año-Mes)',
              color: '#ffffff',
              font: {
                family: 'Poppins, sans-serif',
                size: 14,
              },
            },
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Poppins, sans-serif',
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)', // Líneas de la cuadrícula tenues
              drawBorder: false,
            },
            title: {
              display: true,
              text: 'Monto',
              color: '#ffffff',
              font: {
                family: 'Poppins, sans-serif',
                size: 14,
              },
            },
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Poppins, sans-serif',
              },
            },
            beginAtZero: true,
          },
        },
        elements: {
          line: {
            borderWidth: 2,
          },
          point: {
            radius: 4,
          },
        },
      },
    });
  }
}
