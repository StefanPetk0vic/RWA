import { createReducer, on } from '@ngrx/store';
import { setUser, clearUser } from './user.actions';
import { UserProfile } from '../auth/auth.service';

export interface UserState {
  user: UserProfile | null;
}

export const initialState: UserState = {
  user: null,
};

//handles how the state changes when actions fire
export const userReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user })),
  on(clearUser, (state) => ({ ...state, user: null }))
);
