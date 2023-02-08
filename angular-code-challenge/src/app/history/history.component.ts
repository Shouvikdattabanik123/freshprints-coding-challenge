import { Component } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  searchResults:any = null;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.searchResults = this.localStorageService
      .getDataFromLocalStorage('users')
      ?.reverse();
  }

  clearSearchHistory() {
    this.localStorageService.clearSearchHistory();
    this.searchResults = null;
  }
}
