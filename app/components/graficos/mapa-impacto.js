import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GraficosMapaImpactoComponent extends Component {
  @tracked mapaData = [];
  @tracked isLoading = true;
  @tracked error = null;

  constructor() {
    super(...arguments);
    this.loadMapaImpacto(); // Cargar datos al inicializar el componente
  }

  @action
  async loadMapaImpacto() {
    console.log("Iniciando carga de datos del mapa de impacto...");
    try {
      const response = await fetch('http://35.202.166.109:5111/api/mapa-rutas-impacto', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Respuesta del servidor:', response);
  
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }
  
      const jsonData = await response.json();
      console.log('Datos JSON recibidos:', jsonData);
  
      if (!Array.isArray(jsonData)) {
        throw new Error('Formato de datos inválido. Se esperaba un arreglo.');
      }
  
      this.mapaData = jsonData;
      console.log('Datos cargados correctamente en mapaData:', this.mapaData);
    } catch (error) {
      console.error('Error al cargar los datos del mapa:', error.message);
      this.error = error.message;
    } finally {
      this.isLoading = false;
      console.log('Estado de carga actualizado:', this.isLoading);
    }
  }
  
}
