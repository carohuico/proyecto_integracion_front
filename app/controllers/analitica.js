/* eslint-disable prettier/prettier */
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';
import fetch from 'fetch';

export default class IndexController extends Controller {
    @tracked impactoEconomicoData = [];
    @tracked riesgoCreditoData = [];
    @tracked impactoEconomicoChart = null;
    @tracked riesgoCreditoChart = null;
  
    @action
    async fetchImpactoEconomico() {
      try {
        let response = await fetch('http://35.202.166.109:5025/api/impacto-economico-cierres');
        if (!response.ok) {
          throw new Error('Error al obtener datos de impacto económico');
        }
        this.impactoEconomicoData = await response.json();
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
        this.renderRiesgoCreditoChart();
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    }
  
    renderImpactoEconomicoChart() {
      let ctx = document.getElementById('impacto-economico-chart').getContext('2d');
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
      this.fetchImpactoEconomico();
      this.fetchRiesgoCredito();
    }
  }
