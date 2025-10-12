import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(selectUserState, (state) => state.user);

export const selectBalanceColor = createSelector(selectUser, (user): string => {
  const credit = user?.Credit ?? 0;
  if (!user) return 'text-gray-500';
  if (credit < 250) return 'text-red-500';
  if (credit <= 500) return 'text-orange-500';
  if (credit <= 1000) return 'text-green-500';
  return 'animate-shine';
});
