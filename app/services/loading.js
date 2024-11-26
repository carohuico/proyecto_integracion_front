import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoadingService extends Service {
  @tracked isLoading = false;

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }
}
