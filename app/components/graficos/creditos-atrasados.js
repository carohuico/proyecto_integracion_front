import Component from '@ember/component';
import { Chart } from 'chart.js/auto';

export default Component.extend({
  chart: null, // Referencia al gráfico
  canvasElement: null, // Referencia al canvas

  didInsertElement() {
    this._super(...arguments);

    // Encuentra el canvas en el DOM
    const canvas = this.element.querySelector('#creditosAtrasadosChart');
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }

    this.canvasElement = canvas; // Guarda referencia al canvas
    this.loadChartData(); // Carga los datos y renderiza el gráfico
  },

  willDestroyElement() {
    this._super(...arguments);

    // Limpia cualquier gráfico existente si el componente se destruye
    if (this.chart) {
      this.chart.destroy();
    }
  },

  async loadChartData() {
    try {
      // Realizar la solicitud al backend
      const response = await fetch('http://35.202.166.109:5011/api/grafica-creditos-atrasados', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

      // Extraer datos del XML
      const periods = Array.from(xmlDoc.getElementsByTagName('period'));
      const labels = periods.map((p) => p.getElementsByTagName('periodo')[0].textContent);
      const creditosAtrasados = periods.map((p) =>
        parseInt(p.getElementsByTagName('creditos_atrasados')[0].textContent, 10)
      );
      const montoAdeudado = periods.map((p) =>
        parseFloat(p.getElementsByTagName('monto_adeudado')[0].textContent)
      );

      console.log('Datos cargados:', labels, creditosAtrasados, montoAdeudado);

      // Renderizar el gráfico
      this.chart = new Chart(this.canvasElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Créditos Atrasados',
              data: creditosAtrasados,
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.3)',
              borderWidth: 2,
              fill: true,
            },
            {
              label: 'Monto Adeudado',
              data: montoAdeudado,
              borderColor: '#ec4899',
              backgroundColor: 'rgba(236, 72, 153, 0.3)',
              borderWidth: 2,
              fill: true,
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
                    family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                    size: 12,
                  },
                  color: '#ffffff', // Color del texto de la leyenda
                },
              },
            title: {
                display: false,
                text: 'Evolución de Créditos Atrasados y Monto Adeudado',
                color: '#ffffff',
                font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 16,
                  weight: 'bold',
                },
              },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#ffffff', // Color de los números en el eje Y
                font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 12,
                },
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)', // Líneas divisorias en blanco tenue
              },
            },
            x: {
              ticks: {
                color: '#ffffff', // Color de los números en el eje X
                font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 12,
                },
              },
              grid: {
                display: false, // Sin líneas divisorias en el eje X
              },
            },
            },
            },
      });
    } catch (error) {
      console.error('Error al cargar el gráfico:', error);
    }
  },
});
