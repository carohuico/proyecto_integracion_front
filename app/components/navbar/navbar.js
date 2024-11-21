import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class NavbarComponent extends Component {
  @service router;
  @service auth;

  @tracked isMenuOpen = false;
  @tracked isDropdownOpen = false;

  @action
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @action
  logout() {
    this.auth.logout();
  }

  @action
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}