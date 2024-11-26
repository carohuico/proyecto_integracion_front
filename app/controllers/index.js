import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexController extends Controller {

    @service auth;
  @tracked startDate = "2010-05-01";
  @tracked endDate = "2011-01-01";

  get isAuthenticated() {
    console.log('Verificando si el usuario está autenticado:', this.auth.isAuthenticated);
    return this.auth.isAuthenticated;
  }

  get userRole() {
    return this.auth.userRole;
  }

  @action
  updateStartDate(event) {
    this.startDate = event.target.value;
    console.log('Fecha de inicio actualizada:', this.startDate);
  }

  @action
  updateEndDate(event) {
    this.endDate = event.target.value;
    console.log('Fecha de fin actualizada:', this.endDate);
  }

  @action
  updateChart(event) {
    event.preventDefault();
    console.log(`Actualizando gráfico con rango de fechas: ${this.startDate} - ${this.endDate}`);
  }
}
