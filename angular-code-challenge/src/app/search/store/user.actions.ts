import { createAction, props } from '@ngrx/store';

export const SEARCH_USER_SUCCESS = createAction(
  '[User] Search User Success',
  props<{ data: any }>()
);
export const SEARCH_USER_FAIL = createAction(
  '[User] Search User Fail',
  props<{ error: boolean }>()
);
