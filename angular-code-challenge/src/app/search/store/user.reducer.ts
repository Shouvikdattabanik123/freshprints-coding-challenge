import * as UserActions from './user.actions';

export interface UserState {
  data: any;
  error: boolean;
}

export const initialState: UserState = {
  data: null,
  error: false,
};

export function userReducer(state = initialState, action: any) {
  switch (action.type) {
    case UserActions.SEARCH_USER_SUCCESS.type:
      return {
        ...state,
        data: action.data,
        error: false,
      };
    case UserActions.SEARCH_USER_FAIL.type:
      return {
        ...state,
        error: true,
        data: false,
      };
    default:
      return state;
  }
}
