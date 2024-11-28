import Component from '@ember/component';
import { Chart } from 'chart.js/auto';
import { start } from 'qunit';

export default Component.extend({
  canvasElement: null,
  chart: null, // Referencia al gráfico

  didReceiveAttrs() {
    this._super(...arguments);

    // Cargar la gráfica cada vez que cambian las fechas
    this.loadChartData();
  },

  didInsertElement() {
    this._super(...arguments);

    // Encuentra el canvas en el DOM
    const canvas = this.element.querySelector('#clientesCreditosChart');
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }
    this.canvasElement = canvas; // Guarda referencia al canvas
    this.loadChartData(); // Carga los datos del gráfico inicialmente
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
      let { startDate, endDate } = this || {
        startDate: '2009-01-01',
        endDate: '2024-12-31',
      };

      // Validar que las fechas estén disponibles
      if (!startDate || !endDate) {
        console.warn('Fechas no disponibles para cargar el gráfico');
        return;
      }

      // Crear el XML para enviar
      const xmlData = `
        <request>
          <start_date>${startDate}</start_date>
          <end_date>${endDate}</end_date>
        </request>
      `;

      console.log(`Solicitud al endpoint /api/grafica-clientes-creditos, enviando fechas en el XML: ${xmlData}`);

      // Realizar la solicitud al backend
      const response = await fetch(
        'http://35.202.166.109:5011/api/grafica-clientes-creditos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/xml',
          },
          body: xmlData,
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error en la respuesta del servidor: ${response.status}`,
        );
      }

      const xmlText = await response.text();

      // Parsear el XML a un objeto DOM
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

      // Extraer datos del XML
      const periods = Array.from(xmlDoc.getElementsByTagName('period'));
      const labels = periods.map(
        (period) => period.getElementsByTagName('periodo')[0].textContent,
      );
      const clientesActivos = periods.map((period) =>
        parseInt(
          period.getElementsByTagName('clientes_activos')[0].textContent,
          10,
        ),
      );
      const creditosOtorgados = periods.map((period) =>
        parseInt(
          period.getElementsByTagName('creditos_otorgados')[0].textContent,
          10,
        ),
      );

      console.log(
        'Datos cargados:',
        labels,
        clientesActivos,
        creditosOtorgados,
      );

      // Renderizar el gráfico en el canvas
      if (this.chart) {
        // Si el gráfico ya existe, actualiza los datos
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = clientesActivos;
        this.chart.data.datasets[1].data = creditosOtorgados;
        this.chart.update();
      } else {
        // Si el gráfico no existe, créalo
        this.chart = new Chart(this.canvasElement, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Clientes Activos',
                data: clientesActivos,
                backgroundColor: '#ec4899',
                borderColor: '#ec4899',
                borderWidth: 1,
              },
              {
                label: 'Créditos Otorgados',
                data: creditosOtorgados,
                backgroundColor: '#f97316',
                borderColor: '#f97316',
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
                    family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                    size: 12,
                  },
                  color: '#ffffff', // Color del texto de la leyenda
                },
              },
              title: {
                display: false,
                text: 'Clientes Activos y Créditos Otorgados por Periodo',
                color: '#ffffff',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)',
                },
                ticks: {
                  color: '#ffffff',
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#ffffff',
                },
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Error al cargar el gráfico:', error);
    }
  },
});
