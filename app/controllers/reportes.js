/* eslint-disable prettier/prettier */
/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
// app/controllers/reportes.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import Chart from 'chart.js/auto';
import { tracked } from '@glimmer/tracking';

export default class ReportesController extends Controller {
  @tracked pagos = [];
  @tracked creditosActivos = [];
  @tracked creditosTotales = [];
  @tracked reporteCliente = [];
  @tracked resumen = [];
  @tracked reporteSeleccionado = null;
  @tracked clienteId = ''; // ID del cliente para el reporte
  @tracked actividadCliente = []; // Actividad específica del cliente

  @action
  actualizarClienteId(event) {
    console.log('Actualizando cliente ID:', event.target.value);
    this.clienteId = event.target.value;
    console.log('Cliente ID actualizado:', this.clienteId); 
  }

  // Acción para manejar el envío del formulario del reporte del cliente
  @action
  obtenerReporteCliente() {
    const clienteId = 92625; // ID estático
    console.log("Solictud al endpoint /api/reportes/creditos en formato JSON");
    fetch("http://35.202.166.109:5020/api/reportes/creditos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:4200", 
      },
      body: JSON.stringify({ cliente_id: clienteId }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Reporte del cliente recibido:", data);
      this.reporteCliente = data; // Asigna los datos al tracked property
    })
    .catch((error) => console.error("Error al obtener el reporte:", error));
  }

  // Acción para manejar la selección del reporte
  @action
  async cargarReporte(event) {
    const tipoReporte = event.target.value;
    this.reporteSeleccionado = tipoReporte;

    switch (tipoReporte) {
      case 'pagos-atrasados':
        console.log("Solictud al endpoint /api/pagos-atrasados en formato JSON");
        const responseCredit = await fetch('http://35.202.166.109:5019/api/pagos-atrasados');
        if (responseCredit.ok) {
          this.pagos = await responseCredit.json();
          this.crearGraficaEvolucionPagosAtrasados();
        } else {
          console.error('Error al obtener créditos atrasados:', responseCredit.statusText);
          this.pagos = [];
        }
        break;

      case 'creditos-activos':
        console.log("Solictud al endpoint /api/creditos-activos en formato JSON");
        const responsecreditosActivos = await fetch('http://35.202.166.109:5018');
        if (responsecreditosActivos.ok) {
          this.creditosActivos = await responsecreditosActivos.json();

          console.log("Solictud al endpoint /api/creditos-totales en formato JSON");
          const responseCreditosTotales = await fetch('http://35.202.166.109:5022/api/creditos-totales');
          if (responseCreditosTotales.ok) {
            this.creditosTotales = await responseCreditosTotales.json();
            this.crearGraficaCreditosActivos();
          }
        }
        break;

      case 'reporte-cliente':
        this.obtenerReporteCliente();
        break;

      case 'resumen-financiero':
        console.log("Solictud al endpoint /api/resumen-financiero en formato JSON");
        const responseResumen = await fetch('http://35.202.166.109:5021/api/resumen-financiero');
        if (responseResumen.ok) {
          this.resumen = await responseResumen.json();
          this.crearGraficasResumenFinanciero();
        }
        break;

      default:
        this.creditosActivos = [];
        this.reporteCliente = [];
        this.resumen = [];
        this.actividadCliente = [];
    }
  }

  // Crear gráfica de Créditos Activos
  crearGraficaCreditosActivos() {
    const ctx = document.getElementById('creditosActivosChart').getContext('2d');
  
    // Calcular datos
    const totalCreditos = this.creditosTotales.length;
    const creditosActivos = this.creditosActivos.length;
    const creditosPagados = totalCreditos - creditosActivos;
  
    // Datos para la gráfica
    const data = {
      labels: ['Créditos Activos', 'Créditos Pagados'],
      datasets: [
        {
          label: 'Distribución de Créditos',
          data: [creditosActivos, creditosPagados],
          backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(236, 72, 153, 0.2)'],
          borderColor: ['#f97316', '#ec4899'],
          borderWidth: 1,
        },
      ],
    };
  
    // Configuración de opciones
    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Créditos Activos y Pagados',
          font: {
            size: 18,
            family: 'Poppins, sans-serif',
          },
          color: '#ffffff',
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#ffffff',
            font: {
              family: 'Poppins, sans-serif',
              size: 12,
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Estado de Créditos',
            font: {
              size: 14,
              family: 'Poppins, sans-serif',
            },
            color: '#ffffff',
          },
          ticks: {
            color: '#ffffff',
            font: {
              family: 'Poppins, sans-serif',
              size: 12,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Cantidad de Créditos',
            font: {
              size: 14,
              family: 'Poppins, sans-serif',
            },
            color: '#ffffff',
          },
          ticks: {
            color: '#ffffff',
            font: {
              family: 'Poppins, sans-serif',
              size: 12,
            },
          },
          beginAtZero: true,
        },
      },
    };
  
    // Crear gráfica
    new Chart(ctx, {
      type: 'bar',
      data,
      options,
    });
  }  

  // Crear gráficas de Resumen Financiero
  crearGraficasResumenFinanciero() {
    // Gráfica 1: Distribución de Ingresos por Estado General
    const ingresosPorEstadoCtx = document.getElementById('ingresosPorEstadoChart')?.getContext('2d');
    if (ingresosPorEstadoCtx) {
      const estados = ['Completado', 'En Proceso', 'Pendiente'];

      // Calcular datos
      const ingresosPorEstado = estados.map(estado => ({
        estado,
        total_creditos: this.resumen
          .filter(cliente => cliente.estado_general === estado)
          .reduce((sum, cliente) => sum + (cliente.total_creditos || 0), 0),
        total_pagado: this.resumen
          .filter(cliente => cliente.estado_general === estado)
          .reduce((sum, cliente) => sum + (cliente.total_pagado || 0), 0),
      }));

      const data = {
        labels: estados,
        datasets: [
          {
            label: 'Total Créditos',
            data: ingresosPorEstado.map(item => item.total_creditos),
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            borderColor: '#f97316',
            borderWidth: 1,
          },
          {
            label: 'Total Pagado',
            data: ingresosPorEstado.map(item => item.total_pagado),
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
            borderColor: '#ec4899',
            borderWidth: 1,
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribución de Ingresos por Estado General',
            font: { size: 18, family: 'Poppins, sans-serif' },
            color: '#ffffff',
          },
          legend: {
            display: true,
            position: 'top',
            labels: { color: '#ffffff', font: { family: 'Poppins, sans-serif', size: 12 } },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Estado General',
              font: { size: 14, family: 'Poppins, sans-serif' },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
              font: { family: 'Poppins, sans-serif', size: 12 },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Monto ($)',
              font: { size: 14, family: 'Poppins, sans-serif' },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
              font: { family: 'Poppins, sans-serif', size: 12 },
            },
            beginAtZero: true,
          },
        },
      };

      new Chart(ingresosPorEstadoCtx, { type: 'bar', data, options });
    }

    // Gráfica 2: Porcentaje de Créditos Pagados vs Activos
    const porcentajeCreditosCtx = document.getElementById('porcentajeCreditosChart')?.getContext('2d');
    if (porcentajeCreditosCtx) {
      const totalCreditos = this.resumen.length;
      const totalPagados = this.resumen.filter(cliente => cliente.estado_general === 'Completado').length;
      const totalActivos = totalCreditos - totalPagados;
    
      const data = {
        labels: ['Créditos Pagados', 'Créditos Activos'],
        datasets: [
          {
            label: 'Cantidad de Créditos',
            data: [totalPagados, totalActivos],
            backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(236, 72, 153, 0.2)'],
            borderColor: ['#f97316', '#ec4899'],
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Porcentaje de Créditos Pagados vs Activos',
            font: { size: 18, family: 'Poppins, sans-serif' },
            color: '#ffffff',
          },
          legend: {
            display: true,
            position: 'top',
            labels: { color: '#ffffff', font: { family: 'Poppins, sans-serif', size: 12 } },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Estado de Créditos',
              font: { size: 14, family: 'Poppins, sans-serif' },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
              font: { family: 'Poppins, sans-serif', size: 12 },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad de Créditos',
              font: { size: 14, family: 'Poppins, sans-serif' },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
              font: { family: 'Poppins, sans-serif', size: 12 },
            },
            beginAtZero: true,
          },
        },
      };
    
      new Chart(porcentajeCreditosCtx, { type: 'bar', data, options });
    }    
  }
  
  //Graficas de Pagos Atrasados
  crearGraficaEvolucionPagosAtrasados() {
    const ctx = document.getElementById('evolucionPagosAtrasadosChart').getContext('2d');
  
    // Verificar si hay datos
    if (!this.pagos || !Array.isArray(this.pagos) || this.pagos.length === 0) {
      console.warn('No hay datos válidos para mostrar en la gráfica.');
      return;
    }
  
    console.log('Datos originales (this.pagos):', this.pagos);
  
    // Filtrar registros con fechas válidas
    const pagosValidos = this.pagos.filter(pago => pago.fecha_ultimo_pago);
    console.log('Registros válidos:', pagosValidos);
  
    if (pagosValidos.length === 0) {
      console.error('No hay registros con fechas válidas.');
      return;
    }
  
    // Obtener fechas únicas (usando fecha_ultimo_pago)
    const fechas = [...new Set(pagosValidos.map(pago => pago.fecha_ultimo_pago))].sort();
    console.log('Fechas únicas ordenadas:', fechas);
  
    // Conteo de pagos atrasados por fecha
    const conteoPorFecha = fechas.map(fecha => 
      pagosValidos.filter(pago => pago.fecha_ultimo_pago === fecha).length
    );
    console.log('Conteo de pagos atrasados por fecha:', conteoPorFecha);
  
    // Crear gráfica solo si los datos son válidos
    if (fechas.length > 0 && conteoPorFecha.length > 0) {
      const data = {
        labels: fechas,
        datasets: [
          {
            label: 'Pagos Atrasados',
            data: conteoPorFecha,
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
            borderColor: '#ec4899',
            borderWidth: 1,
            tension: 0.4,
          },
        ],
      };
  
      const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolución de Pagos Atrasados',
            font: { size: 18, family: 'Poppins, sans-serif' },
            color: '#ffffff',
          },
          legend: {
            display: true,
            position: 'top',
            labels: { color: '#ffffff', font: { family: 'Poppins, sans-serif', size: 12 } },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha',
              font: { size: 14, family: 'Poppins, sans-serif' },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
              font: { family: 'Poppins, sans-serif', size: 12 },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Número de Créditos',
              font: { size: 14, family: 'Poppins, sans-serif' },
              color: '#ffffff',
            },
            ticks: {
              color: '#ffffff',
              font: { family: 'Poppins, sans-serif', size: 12 },
            },
          },
        },
      };
  
      new Chart(ctx, {
        type: 'line',
        data,
        options,
      });
    } else {
      console.warn('No hay datos suficientes para crear la gráfica.');
    }
  }
}