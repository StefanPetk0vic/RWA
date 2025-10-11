import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../auth/auth.service';

//Used to set, clear actions
export const setUser = createAction('[User] Set User', props<{ user: UserProfile }>());
export const clearUser = createAction('[User] Clear User');
