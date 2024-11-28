import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import L from 'leaflet';
import 'leaflet.heat';

export default class MapaEficienciaComponent extends Component {
  @tracked mapaData = [];
  @tracked isLoading = true;
  @tracked error = null;
  mapa = null;

  constructor() {
    super(...arguments);
    this.loadMapaEficiencia(); // Cargar datos al inicializar el componente
  }

  @action
  async loadMapaEficiencia() {
    console.log('Solicitud al endpoint /api/mapa-rutas-eficiencia en formato JSON');
    try {
      const response = await fetch(
        'http://35.202.166.109:5023/api/mapa-rutas-eficiencia',
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('Datos JSON recibidos:', jsonData);

      if (!Array.isArray(jsonData)) {
        throw new Error('Formato de datos inválido. Se esperaba un arreglo.');
      }

      // Mapear y filtrar los datos relevantes
      this.mapaData = jsonData
        .map((data) => ({
          latitud: data.latitud_destino,
          longitud: data.longitud_destino,
          eficiencia: data.eficiencia,
        }))
        .filter((data) => data.latitud && data.longitud && data.eficiencia);
      this.isLoading = false;

      // Inicializar el mapa después de cargar los datos
      this.initializeMap();
    } catch (error) {
      console.error('Error al cargar los datos del mapa de eficiencia:', error);
      this.error = error.message;
      this.isLoading = false;
    }
  }

  initializeMap() {
    if (this.mapa) {
      console.log('El mapa ya está inicializado');
      return;
    }

    // Crear el mapa centrado en Colombia
    this.mapa = L.map('mapa-eficiencia').setView([4.711, -74.0721], 6); // Coordenadas de Bogotá, Colombia

    // Añadir una capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapa);

    // Configurar el mapa de calor
    const heatmapData = this.mapaData.map((data) => [
      data.latitud,
      data.longitud,
      data.eficiencia, // Usamos el valor de eficiencia para la intensidad
    ]);

    L.heatLayer(heatmapData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(this.mapa);
  }
}
