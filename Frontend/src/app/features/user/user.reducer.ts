import { createReducer, on } from '@ngrx/store';
import { setUser, clearUser } from './user.actions';
import { UserProfile } from '../../shared/interfaces/user.interface';

export interface UserState {
  user: UserProfile | null;
}

const storedUser = sessionStorage.getItem('user');
export const initialState: UserState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const userReducer = createReducer(
  initialState,

  on(setUser, (state, { user }) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    return { ...state, user };
  }),

  on(clearUser, (state) => {
    sessionStorage.removeItem('user');
    return { ...state, user: null };
  })
);
