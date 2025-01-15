import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';

export default class RiesgoCreditoChartComponent extends Component {
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
      console.log("Solictud al endpoint /api/riesgo-credito-rutas en formato JSON");
      const response = await fetch('http://localhost:5025/api/riesgo-credito-rutas');
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }
      const json = await response.json();
      this.data = json;
      this.isLoading = false;

      // Renderizar gráfico
      this.renderChart();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      this.error = error.message;
      this.isLoading = false;
    }
  }

  @action
  renderChart() {
    const canvas = document.getElementById('riesgo-credito-chart');
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }
    const ctx = canvas.getContext('2d');
    const labels = this.data.map(item => item.ruta);
    const values = this.data.map(item => item.monto_pendiente);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Riesgo de Crédito',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
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
              color: '#ffffff'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Poppins, sans-serif',
                size: 12,
              }
            }
          },
          x: {
            ticks: {
              color: '#ffffff',
              font: {
                family: 'Poppins, sans-serif',
                size: 12,
              }
            }
          }
        }
      }
    });
  }
}