/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Chart from 'chart.js/auto';
import fetch from 'fetch';

export default class IndexController extends Controller {
    @service auth;
    @tracked impactoEconomicoData = [];
    @tracked riesgoCreditoData = [];
    @tracked impactoEconomicoChart = null;
    @tracked riesgoCreditoChart = null;
    @tracked cierreVialData = [];
    @tracked cierreVialChart = null;

    @action
    didInsertElement() {
      this._super(...arguments);
      this.renderImpactoEconomicoChart();
      this.renderRiesgoCreditoChart();
      this.renderCierreVialChart();
    }
  
    @action
    async fetchImpactoEconomico() {
      try {
        let response = await fetch('http://35.202.166.109:5025/api/impacto-economico-cierres');
        if (!response.ok) {
          throw new Error('Error al obtener datos de impacto económico');
        }
        this.impactoEconomicoData = await response.json();
        console.log('Datos de impacto económico:', this.impactoEconomicoData);
        this.renderImpactoEconomicoChart();
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    }
  
    @action
    async fetchRiesgoCredito() {
      try {
        let response = await fetch('http://35.202.166.109:5025/api/riesgo-credito-rutas');
        if (!response.ok) {
          throw new Error('Error al obtener datos de riesgo de crédito');
        }
        this.riesgoCreditoData = await response.json();
        console.log('Datos de riesgo de crédito:', this.riesgoCreditoData);
        this.renderRiesgoCreditoChart();
      } catch (error) {
        console.error('Error al obtener datos:', error);
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

    @action
    renderImpactoEconomicoChart() {
      let canvas = document.getElementById('impacto-economico-chart');
      if (!canvas) {
        console.error('Canvas de Impacto Económico no encontrado');
        return;
      }
      let ctx = canvas.getContext('2d'); // Aquí se usa la variable 'canvas' directamente
    
      const labels = this.impactoEconomicoData.map(d => d.tipo_cierre);
      const values = this.impactoEconomicoData.map(d => d.monto_perdida);
    
      if (this.impactoEconomicoChart) {
        this.impactoEconomicoChart.destroy();
      }
    
      this.impactoEconomicoChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Monto de Pérdida por Tipo de Cierre',
            data: values,
            backgroundColor: 'rgba(236, 72, 153, 0.3)',
            borderColor: '#ec4899',
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
                color: '#ffffff', font: {
                  family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                  size: 12,
                  maxRotation: 45, // Rota las etiquetas del eje X para mayor legibilidad
                  minRotation: 45,
                },
              }
            },
            x: {
              title: { display: true, text: 'Tipo de Cierre', color: '#ffffff', font: {
                family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                size: 12,
              }, },
              ticks: { color: '#ffffff', font: {
                family: 'Poppins, sans-serif', // Cambia esto a la fuente que estás usando en el resto de la página
                size: 12,
                maxRotation: 45, // Rota las etiquetas del eje X para mayor legibilidad
                minRotation: 45,
              }, },
            }
          }
        }
      });
    }
    
    @action
    renderRiesgoCreditoChart() {
        let ctx = document.getElementById('riesgo-credito-chart').getContext('2d');
      
        const labels = this.riesgoCreditoData.map(d => d.ruta); // Rutas
        const values = this.riesgoCreditoData.map(d => d.monto_pendiente); // Monto pendiente
      
        console.log('Labels:', labels);
        console.log('Values:', values);
      
        if (this.riesgoCreditoChart) {
          this.riesgoCreditoChart.destroy();
        }
      
        this.riesgoCreditoChart = new Chart(ctx, {
          type: 'bar', // Cambiar a 'line' si prefieres una gráfica de líneas
          data: {
            labels: labels,
            datasets: [{
              label: 'Monto Pendiente por Ruta',
              data: values,
              backgroundColor: 'rgba(249, 115, 22, 0.3)', // Color de las barras
              borderColor: '#f97316', // Color del borde de las barras
              borderWidth: 1,
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
                  color: '#ffffff', 
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#ffffff', font: {
                    family: 'Poppins, sans-serif', 
                    size: 12,
                    maxRotation: 45, 
                    minRotation: 45,
                  },
                  callback: function(value) {
                    return value.toLocaleString(); 
                  }
                }
              },
              x: {
                title: { display: true, text: 'Grupo de Cliente', color: '#ffffff', font: {
                  family: 'Poppins, sans-serif', 
                  size: 12,
                }, },
                ticks: { color: '#ffffff', font: {
                  family: 'Poppins, sans-serif', 
                  size: 12,
                  maxRotation: 45, 
                  minRotation: 45,
                }, },
              }
            }
          }
        });
      }
      
    // Llamamos a las acciones cuando el controlador se inicie
    constructor() {
      super(...arguments);
    
      if (this.auth.isAuthenticated) {
        this.fetchImpactoEconomico();
        this.fetchRiesgoCredito();
      } else {
        this.fetchCierreVialData();
      }
    }
    
  }
