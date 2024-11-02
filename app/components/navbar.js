import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class NavbarComponent extends Component {
  @tracked isMenuOpen = false;

  @action
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

    @action
    handleResize() {
      if(window.innerWidth > 640) {
        this.isMenuOpen = false;
      }
    }
}