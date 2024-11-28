import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [31, 31],
});

export default class GraficosMapaImpactoComponent extends Component {
  @tracked mapaData = [];
  @tracked isLoading = true;
  @tracked error = null;
  mapa = null; // Evita reinicializar el mapa múltiples veces

  constructor() {
    super(...arguments);
    this.loadMapaImpacto(); // Cargar datos al inicializar el componente
  }

  @action
  async loadMapaImpacto() {
    console.log('Iniciando carga de datos del mapa de impacto...');
    try {
      const response = await fetch(
        'http://35.202.166.109:5023/api/mapa-rutas-impacto',
        {
          method: 'GET',
        },
      );

      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('Datos del mapa de impacto:', jsonData);
      if (!Array.isArray(jsonData)) {
        throw new Error('Formato de datos inválido. Se esperaba un arreglo.');
      }

      this.mapaData = jsonData.filter((data) => data.latitud && data.longitud);
      this.isLoading = false;

      // Inicializar el mapa después de cargar los datos
      this.initializeMap();
    } catch (error) {
      console.error('Error al cargar los datos del mapa de impacto:', error);
      this.error = error.message;
      this.isLoading = false;
    }
  }

  initializeMap() {
    // Evita reinicializar el mapa si ya existe
    if (this.mapa) {
      console.log('El mapa ya está inicializado');
      return;
    }

    // Crear el mapa centrado en Colombia
    this.mapa = L.map('map').setView([4.711, -74.0721], 6); // Coordenadas de Bogotá, Colombia

    // Añadir una capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.mapa);

    // Agregar marcadores al mapa
    this.mapaData.forEach((data) => {
      L.marker([data.latitud, data.longitud], { icon: defaultIcon }).addTo(
        this.mapa,
      ).bindPopup(`
          <div style="color: black; font-size: 14px;"> 
            <b>Ruta:</b> ${data.via_afectada_evento || 'Desconocida'}<br>
            <b>Impacto Financiero:</b> $${data.impacto_financiero?.toLocaleString() || 'N/A'}<br>
            <b>Evento:</b> ${data.descripcion_evento || 'N/A'}
          </div>
          `);
    });
  }
}
