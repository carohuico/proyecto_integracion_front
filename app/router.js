import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () {
  this.route('clients');
  this.route('login');
  this.route('register'); 
  this.route('historial');
  this.route('creditos');
  this.route('pagos');
});

export default Router;