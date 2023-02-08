import { Component } from '@angular/core';
import { UserService } from './user.service';
import { LocalStorageService } from '../local-storage.service';
import { Store } from '@ngrx/store';
import * as UserActions from './store/user.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  username = '';
  user: any;
  error = false;

  constructor(
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store
      .select((state: any) => state.user)
      .subscribe((user) => {
        this.user = user.data;
        this.username = this.user?.searchTerm;
        this.error = user.error;
      });
  }

  onSubmit() {
    this.userService.searchUser(this.username).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          const { name, avatar_url, login } = response.body;
          this.user = { searchTerm: this.username, name, avatar_url, login };
          this.error = false;
          this.localStorageService.addToLocalStorageArray('users', this.user);
          this.store.dispatch(
            UserActions.SEARCH_USER_SUCCESS({ data: this.user })
          );
        }
      },
      error: () => {
        this.error = true;
        this.user = null;
        this.localStorageService.addToLocalStorageArray('users', {
          searchTerm: this.username,
          name: 'Search result not found',
        });
        this.store.dispatch(UserActions.SEARCH_USER_SUCCESS({ data: false }));
      },
    });
  }
}
