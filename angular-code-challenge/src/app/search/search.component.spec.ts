import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { UserService } from './user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from '../local-storage.service';
import { StoreModule, Store } from '@ngrx/store';
import { userReducer } from './store/user.reducer';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: Store;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          user: userReducer,
        }),
        FormsModule,
        MatTabsModule,
      ],
      providers: [UserService, LocalStorageService],
    }).compileComponents();

    store = TestBed.get(Store);
    userService = TestBed.get(UserService);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(userService, 'searchUser').and.returnValue(<any>{
      subscribe: () => {},
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the searchUser function of the UserService when the form is submitted', () => {
    component.username = 'test-user';
    component.onSubmit();
    expect(userService.searchUser).toHaveBeenCalledWith('test-user');
  });
});
