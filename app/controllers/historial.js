import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HistoryController extends Controller {
  @tracked isModalOpen = false;
  @tracked isDetailModalOpen = false;
  @tracked isEditModalOpen = false;
  @tracked selectedEntry = null;

  @tracked creditHistory = [
    // Aquí se deberían cargar los historiales de crédito desde la base de datos
    { id: 1, clientName: 'Carolina Huicochea', date: '2023-01-01', amount: 2000, status: 'Paid' },
  ];

  @action
  openModal() {
    this.isModalOpen = true;
  }

  @action
  closeModal() {
    this.isModalOpen = false;
  }

  @action
  openDetailModal(entry) {
    this.selectedEntry = entry;
    this.isDetailModalOpen = true;
  }

  @action
  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.selectedEntry = null;
  }

  @action
  openEditModal(entry) {
    this.selectedEntry = entry;
    this.isEditModalOpen = true;
  }

  @action
  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedEntry = null;
  }

  @action
  saveEntry(updatedEntry) {
    let entryIndex = this.creditHistory.findIndex(entry => entry.id === updatedEntry.id);
    if (entryIndex !== -1) {
      this.creditHistory[entryIndex] = updatedEntry;
    }
    this.closeEditModal();
  }

  @action
  deleteEntry(entry) {
    this.creditHistory = this.creditHistory.filter(e => e.id !== entry.id);
    this.closeDetailModal();
  }
}