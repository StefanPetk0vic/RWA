import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

//allows components to select pieces of state
export const selectUserState = createFeatureSelector<UserState>('user');
export const selectUser = createSelector(selectUserState, (state) => state.user);
