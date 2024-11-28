import Component from '@ember/component';
import { Chart } from 'chart.js/auto';

export default class GraficosCreditosAtrasadosGrupoComponent extends Component {
  chart = null;

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.setupChart();
  }

  async setupChart() {
    const canvasElement = this.element.querySelector('canvas');
    if (!canvasElement) {
      console.error('Canvas no encontrado');
      return;
    }

    try {
      console.log(
        'Cargando datos para el gráfico de créditos atrasados por grupo...',
      );
      // Realizar la solicitud al backend
      const response = await fetch(
        'http://35.202.166.109:5011/api/creditos-atrasados-grupo',
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

      const data = await response.json();

      // Procesar los datos para el gráfico
      const labels = data.map((item) => item.grupo_cliente || 'Sin Grupo');
      const values = data.map((item) => item.creditos_atrasados);

      console.log('Datos para el gráfico:', { labels, values });

      // Crear el gráfico
      this.chart = new Chart(canvasElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Créditos Atrasados',
              data: values,
              backgroundColor: '#FF6384',
              borderColor: '#FF6384',
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
            x: {
              title: {
                display: true,
                text: 'Grupo de Cliente',
                color: '#ffffff',
                font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 12,
                },
              },
              ticks: {
                color: '#ffffff',
                font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 12,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Cantidad de Créditos Atrasados',
                color: '#ffffff',
                font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 12,
                },
              },
              ticks: {
                color: '#ffffff',
                font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 12,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error al cargar los datos del gráfico:', error);
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
