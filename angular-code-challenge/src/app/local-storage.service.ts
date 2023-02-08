import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  addToLocalStorageArray(key: string, item: any) {
    let items = JSON.parse(localStorage.getItem(key)!) || [];
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
  }

  getDataFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key)!);
  }

  clearSearchHistory() {
    localStorage.clear()
  }
}
