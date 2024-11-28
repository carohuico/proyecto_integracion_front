import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';

export default class CierreVialChartComponent extends Component {
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
      const response = await fetch('http://35.202.166.109:5026/api/cierre-vial-analitica');
      if (!response.ok) {
        throw new Error('Error al obtener datos de cierres viales');
      }
      const xml = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      const cierres = Array.from(xmlDoc.getElementsByTagName("cierre_vial")).map(cierre => ({
        id_evento: cierre.getElementsByTagName("id_evento")[0].textContent,
        duracion_cierre_promedio: parseFloat(cierre.getElementsByTagName("duracion_cierre_promedio")[0].textContent),
        impacto_economico_total: parseFloat(cierre.getElementsByTagName("impacto_economico_total")[0].textContent)
      }));
      this.data = cierres;
      this.isLoading = false;

      // Renderizar gráfico
      this.renderChart();
    } catch (error) {
      console.error('Error al obtener datos de cierres viales:', error);
      this.error = error.message;
      this.isLoading = false;
    }
  }

  @action
  renderChart() {
    const canvas = document.getElementById('cierre-vial-chart');
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.data.map(d => d.id_evento);
    const durations = this.data.map(d => d.duracion_cierre_promedio);
    const impacts = this.data.map(d => d.impacto_economico_total);

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        labels: labels,
        datasets: [{
          label: 'Impacto Económico vs Duración del Cierre',
          data: durations.map((duration, index) => ({
            x: duration,
            y: impacts[index]
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = `Evento ${labels[context.dataIndex]}`;
                return `${label}: (${context.raw.x}, ${context.raw.y})`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Duración del Cierre (horas)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Impacto Económico Total ($)'
            }
          }
        }
      }
    });
  }
}