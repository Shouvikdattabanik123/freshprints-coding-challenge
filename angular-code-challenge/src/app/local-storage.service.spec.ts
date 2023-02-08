import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an item to local storage', () => {
    service.addToLocalStorageArray('users', {
      searchTerm: 'test',
      name: null,
      avatar_url: 'https://avatars.githubusercontent.com/u/383316?v=4',
      login: 'test',
    });
    expect(localStorage.getItem('users')).toEqual(
      '[{"searchTerm":"test","name":null,"avatar_url":"https://avatars.githubusercontent.com/u/383316?v=4","login":"test"}]'
    );
  });

  it('should get data from local storage', () => {
    localStorage.setItem(
      'users',
      '[{"searchTerm":"test","name":null,"avatar_url":"https://avatars.githubusercontent.com/u/383316?v=4","login":"test"}]'
    );
    const data = service.getDataFromLocalStorage('users');
    expect(data).toEqual([
      {
        searchTerm: 'test',
        name: null,
        avatar_url: 'https://avatars.githubusercontent.com/u/383316?v=4',
        login: 'test',
      },
    ]);
  });

  it('should clear search history', () => {
    localStorage.setItem('users', '[{"searchTerm":"test","name":null,"avatar_url":"https://avatars.githubusercontent.com/u/383316?v=4","login":"test"}]');
    service.clearSearchHistory();
    expect(localStorage.getItem('users')).toBeNull();
  });
});
