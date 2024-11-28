import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ResumenFinancieroComponent extends Component {
  @tracked totalCreditos = null;
  @tracked montoPromedioOtorgado = null;
  @tracked porcentajeCreditosEnDemora = null;

  constructor() {
    super(...arguments);
    this.loadResumenFinanciero(); // Cargar datos al inicializar el componente
  }

  @action
  async loadResumenFinanciero() {
    try {
      const response = await fetch(
        'http://35.202.166.109:5011/api/resumen_financiero',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/xml',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

      // Extraer datos del XML
      this.totalCreditos = parseInt(
        xmlDoc.getElementsByTagName('total_creditos')[0].textContent,
        10,
      );
      this.montoPromedioOtorgado = parseFloat(
        xmlDoc.getElementsByTagName('monto_promedio_otorgado')[0].textContent,
      );
      this.porcentajeCreditosEnDemora = parseFloat(
        xmlDoc.getElementsByTagName('porcentaje_creditos_en_demora')[0]
          .textContent,
      );

      console.log('Resumen Financiero cargado:', {
        totalCreditos: this.totalCreditos,
        montoPromedioOtorgado: this.montoPromedioOtorgado,
        porcentajeCreditosEnDemora: this.porcentajeCreditosEnDemora,
      });
    } catch (error) {
      console.error('Error al cargar el resumen financiero:', error);
    }
  }
}
