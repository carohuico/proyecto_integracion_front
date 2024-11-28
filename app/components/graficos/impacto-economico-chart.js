import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';

export default class ImpactoEconomicoChartComponent extends Component {
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
      const response = await fetch('http://35.202.166.109:5025/api/impacto-economico-cierres');
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }
      const json = await response.json();
      this.data = json;
      this.isLoading = false;
      console.log('Datos obtenidos para el gráfico:', this.data);

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
    const canvas = document.getElementById('impacto-economico-chart');
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.data.map(item => item.tipo_cierre);
    const values = this.data.map(item => item.monto_perdida);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Impacto Económico',
          data: values,
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderColor: '#f97316',
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