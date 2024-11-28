import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';

export default class PerdidasProductoFinancieroChartComponent extends Component {
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
      const response = await fetch('http://35.202.166.109:5026/api/perdidas-producto-financiero', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/xml',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

      // Obtener todos los elementos <producto> dentro de <perdidas_por_producto_financiero>
      const productos = xmlDoc.getElementsByTagName('producto');

      this.data = Array.from(productos).map(producto => {
        // Aseguramos que los elementos existan
        const codProducto = producto.getElementsByTagName('cod_producto')[0];
        const nombreProducto = producto.getElementsByTagName('producto')[0];
        const perdidasTotales = producto.getElementsByTagName('perdidas_totales')[0];

        return {
          cod_producto: codProducto ? codProducto.textContent : 'N/A',
          producto: nombreProducto && nombreProducto.textContent ? nombreProducto.textContent : 'Desconocido', // Verificación más robusta
          perdidas_totales: perdidasTotales ? parseFloat(perdidasTotales.textContent) : 0, // Valor por defecto
        };
      });

      console.log('Datos de Perdidas Producto Financiero:', this.data);
      this.isLoading = false;

      // Renderizar gráfico
      this.renderChart();
    } catch (error) {
      console.error('Error al cargar las perdidas producto financiero:', error);
      this.error = error.message;
      this.isLoading = false;
    }
  }

  @action
  renderChart() {
    const canvas = document.getElementById('perdidas-productos-financieros-chart');
    if (!canvas) {
      console.error('Canvas no encontrado');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }

    // Filtramos los productos con pérdidas > 0
    const filteredData = this.data.filter(item => item.perdidas_totales > 0);

    const data = filteredData.map(item => item.perdidas_totales); // Pérdidas totales de cada producto filtrado
    const labels = filteredData.map(item => item.cod_producto); // Usamos los IDs de los productos para las leyendas
    const nombres = filteredData.map(item => item.producto); // Nombres de los productos

    const colors = this.generateColorPalette('#f97316', '#ec4899', 23);

    // Crear el gráfico circular
    this.chart = new Chart(ctx, {
      type: 'pie', // Tipo de gráfico
      data: {
        labels: labels, // Etiquetas (IDs de los productos)
        datasets: [{
          label: 'Pérdidas Totales por Producto',
          data: data, // Datos (pérdidas totales)
          backgroundColor: colors, // Colores generados
          hoverOffset: 10, // Efecto de hover (cuando el ratón pasa sobre una sección)
          borderColor: '#fff', // Borde blanco para cada sección
          borderWidth: 1, // Grosor del borde
          hoverBorderColor: '#fff', // Borde negro al pasar el ratón
          hoverBorderWidth: 2, // Grosor del borde en hover
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Ocultar la leyenda
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro para los tooltips
            titleFont: {
              size: 10, // Tamaño de la fuente del título
              family: 'Poppins, sans-serif',
              color: '#ffffff', // Texto del título en blanco
            },
            bodyFont: {
              size: 10, // Tamaño de la fuente del cuerpo
              family: 'Poppins, sans-serif',
              color: '#ffffff', // Texto del cuerpo en blanco
            },
            callbacks: {
              label: function(tooltipItem) {
                const index = tooltipItem.dataIndex; // Índice de la sección
                return `Pérdida: $${tooltipItem.raw.toFixed(2)}\nProducto: ${nombres[index]}`;
              },
            },
          },
        },
        animation: {
          animateRotate: true, // Activar la rotación al animar
          animateScale: true, // Activar el escalado al animar
        },
      }
    });
  }

  generateColorPalette(startColor, endColor, steps) {
    const start = this.hexToRgb(startColor);
    const end = this.hexToRgb(endColor);
    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray = [];

    for (let i = 0; i < steps; i++) {
      interpolatedColorArray.push(this.interpolateColor(start, end, stepFactor * i));
    }

    return interpolatedColorArray.map(this.rgbToHex);
  }

  interpolateColor(color1, color2, factor) {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return result;
  }

  hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = (bigint & 255);
    return [r, g, b];
  }

  rgbToHex(rgb) {
    const hex = rgb.map(value => {
      const hexValue = value.toString(16);
      return hexValue.length === 1 ? '0' + hexValue : hexValue;
    });
    return `#${hex.join('')}`;
  }
}