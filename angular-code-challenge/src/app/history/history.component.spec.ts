import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { LocalStorageService } from '../local-storage.service';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryComponent],
      providers: [LocalStorageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.get(LocalStorageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve data from local storage and reverse it', () => {
    const data = [
      {
        searchTerm: 'test',
        name: null,
        avatar_url: 'https://avatars.githubusercontent.com/u/383316?v=4',
        login: 'test',
      },
      {
        searchTerm: 'shouvik',
        name: 'Shouvik',
        avatar_url: 'https://avatars.githubusercontent.com/u/316364?v=4',
        login: 'shouvik',
      },
    ];
    spyOn(localStorageService, 'getDataFromLocalStorage').and.returnValue(data);
    fixture.detectChanges();
    expect(component.searchResults).toEqual([
      {
        searchTerm: 'shouvik',
        name: 'Shouvik',
        avatar_url: 'https://avatars.githubusercontent.com/u/316364?v=4',
        login: 'shouvik',
      },
      {
        searchTerm: 'test',
        name: null,
        avatar_url: 'https://avatars.githubusercontent.com/u/383316?v=4',
        login: 'test',
      },
    ]);
  });

  it('should clear search history', () => {
    spyOn(localStorageService, 'clearSearchHistory');
    component.clearSearchHistory();
    expect(localStorageService.clearSearchHistory).toHaveBeenCalled();
    expect(component.searchResults).toBeNull();
  });
});
