import { createReducer, on } from '@ngrx/store';
import { setUser, clearUser } from './user.actions';
import { UserProfile } from '../auth/auth.service';

export interface UserState {
  user: UserProfile | null;
}

const storedUser = localStorage.getItem('user');
export const initialState: UserState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

export const userReducer = createReducer(
  initialState,

  on(setUser, (state, { user }) => {
    localStorage.setItem('user', JSON.stringify(user));
    return { ...state, user };
  }),

  on(clearUser, (state) => {
    localStorage.removeItem('user');
    return { ...state, user: null };
  })
);
