import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class LoadingSpinnerComponent extends Component {
  @service loading;
}