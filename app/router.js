import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject as service } from '@ember/service';

export default class Router extends EmberRouter {
  @service loading;

  constructor() {
    super(...arguments);
    this.on('routeWillChange', () => {
      this.loading.startLoading();
    });
    this.on('routeDidChange', () => {
      this.loading.stopLoading();
    });
  }
}

Router.map(function () {
  this.route('clients');
  this.route('login');
  this.route('register');
  this.route('historial');
  this.route('creditos');
  this.route('pagos');
  this.route('reportes');
});
