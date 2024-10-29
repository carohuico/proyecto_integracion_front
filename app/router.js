import EmberRouter from '@ember/routing/router';
import config from 'proyecto/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // index, login, clients
  this.route('login');
  // this.route('clients');
  // this.route('client', { path: '/client/:client_id' });
  // this.route('new-client');
  // this.route('edit-client', { path: '/edit-client/:client_id' });
  
});