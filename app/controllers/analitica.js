/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Chart from 'chart.js/auto';
import fetch from 'fetch';


// Función para generar un color aleatorio en formato hexadecimal
function getRandomColor() {
  const letters = '0123456789ABCDEF'; // Caracteres válidos para un color hexadecimal
  let color = '#'; // Inicializar el color con el símbolo de color hexadecimal
  for (let i = 0; i < 6; i++) { // Generar 6 caracteres (código de color de 6 dígitos)
    color += letters[Math.floor(Math.random() * 16)]; // Agregar un carácter aleatorio
  }
  return color; // Devolver el color generado
}

export default class IndexController extends Controller {
    @service auth;
    @service router;
    @tracked cierreVialData = [];
    @tracked cierreVialChart = null;
    @tracked perdidasProductoFinanciero = [];
    @tracked perdidasProductoFinancieroChart = null;

    @action
    didInsertElement() {
      this._super(...arguments);
      this.renderCierreVialChart();
      this.renderPerdidasProductoFinancieroChart();
    }
  
    @action
    async loadPerdidasProductoFinanciero() {
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

        this.perdidasProductoFinanciero = Array.from(productos).map(producto => {
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

        console.log('Datos de Perdidas Producto Financiero:', this.perdidasProductoFinanciero);
        this.createPieChart(); // Llamamos a la función para crear el gráfico
      } catch (error) {
        console.error('Error al cargar las perdidas producto financiero:', error);
      }
    }


    @action
    async fetchCierreVialData() {
      try {
        let response = await fetch('http://35.202.166.109:5026/api/cierre-vial-analitica');
        if (!response.ok) {
          throw new Error('Error al obtener datos de cierres viales');
        }
        let xml = await response.text();
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
        let cierres = Array.from(xmlDoc.getElementsByTagName("cierre_vial")).map(cierre => ({
          id_evento: cierre.getElementsByTagName("id_evento")[0].textContent,
          duracion_cierre_promedio: parseFloat(cierre.getElementsByTagName("duracion_cierre_promedio")[0].textContent),
          impacto_economico_total: parseFloat(cierre.getElementsByTagName("impacto_economico_total")[0].textContent)
        }));
        this.cierreVialData = cierres;
        console.log('Datos de cierres viales:', this.cierreVialData);
        this.renderCierreVialChart();
      } catch (error) {
        console.error('Error al obtener datos de cierres viales:', error);
      }
    }

    @action
    createPieChart() {
      const ctx = document.getElementById('perdidasProductosFinancierosChart');
    
      if (!ctx) {
        console.error('Canvas de Perdidas por Producto Financiero no encontrado');
        return;
      }
    
      // Filtramos los productos con pérdidas > 0
      const filteredData = this.perdidasProductoFinanciero.filter(item => item.perdidas_totales > 0);
    
      const data = filteredData.map(item => item.perdidas_totales); // Pérdidas totales de cada producto filtrado
      const labels = filteredData.map(item => item.cod_producto); // Usamos los IDs de los productos para las leyendas
      const ids = filteredData.map(item => item.cod_producto); // IDs de productos filtrados
      const nombres = filteredData.map(item => item.producto); // Nombres de los productos filtrados
    
      // Generar un color aleatorio para cada producto
      const colors = filteredData.map(() => getRandomColor());
    
      // Crear el gráfico circular
      new Chart(ctx, {
        type: 'pie', // Tipo de gráfico
        data: {
          labels: labels, // Etiquetas (ahora usamos los IDs de los productos)
          datasets: [{
            label: 'Pérdidas Totales por Producto',
            data: data, // Datos (pérdidas totales)
            backgroundColor: colors, // Colores generados aleatoriamente
            hoverOffset: 10, // Efecto de hover (cuando el ratón pasa sobre una sección)
            borderColor: '#fff', // Borde blanco para cada sección
            borderWidth: 2, // Grosor del borde
            hoverBorderColor: '#000', // Borde negro al pasar el ratón
            hoverBorderWidth: 3, // Grosor del borde en hover
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top', // Colocar la leyenda en la parte superior
              labels: {
                font: {
                  size: 8, // Tamaño de la fuente de la leyenda (más pequeño)
                  family: 'Arial, sans-serif',
                  weight: 'bold', // Negrita
                },
                padding: 5, // Espaciado entre los elementos de la leyenda
                boxWidth: 10, // Ancho de las cajas de color en la leyenda
              },
              // Organizar las leyendas en varias columnas
              labels: {
                filter: function(legendItem, chartData) {
                  return true;
                },
                generateLabels: function(chart) {
                  const data = chart.data;
                  return data.labels.map(function(label, index) {
                    return {
                      text: `ID: ${data.labels[index]}`, // Usamos el ID como texto
                      fillStyle: data.datasets[0].backgroundColor[index], // El color del segmento
                      hidden: false,
                      index: index
                    };
                  });
                }
              },
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro para los tooltips
              titleFont: {
                size: 10, // Tamaño de la fuente del título
                weight: 'bold', // Título en negrita
              },
              bodyFont: {
                size: 10, // Tamaño de la fuente del cuerpo
              },
              callbacks: {
                // Personalización del contenido del tooltip
                label: function (tooltipItem) {
                  const index = tooltipItem.dataIndex; // Índice de la sección sobre la que se pasa el mouse
                  // Mostrar tanto el id del producto como el monto de pérdida
                  return `Pérdida: $${tooltipItem.raw.toFixed(2)} \nProducto: ${nombres[index]}`;
                }
              },
            },
          },
          animation: {
            animateRotate: true, // Activar la rotación al animar
            animateScale: true, // Activar el escalado al animar
          },
        },
      });
    }

    @action
    renderCierreVialChart() {
      let canvas = document.getElementById('cierre-vial-chart');
      if (!canvas) {
        console.error('Canvas de Cierre Vial no encontrado');
        return;
      }
      let ctx = canvas.getContext('2d'); // Usamos la variable 'canvas' directamente

      const labels = this.cierreVialData.map(d => d.id_evento); // IDs de eventos
      const durations = this.cierreVialData.map(d => d.duracion_cierre_promedio); // Duración del cierre
      const impacts = this.cierreVialData.map(d => d.impacto_economico_total); // Impacto económico

      if (this.cierreVialChart) {
        this.cierreVialChart.destroy();
      }

      this.cierreVialChart = new Chart(ctx, {
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
          
    // Llamamos a las acciones cuando el controlador se inicie
    constructor() {
      super(...arguments);
        this.fetchCierreVialData();
        this.loadPerdidasProductoFinanciero();
      }
    
  }
