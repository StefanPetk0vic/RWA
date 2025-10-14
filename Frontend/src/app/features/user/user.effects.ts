import { Injectable, inject } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { setUser, clearUser } from '../user/user.actions';
import { UserProfile } from '../../shared/interfaces/user.interface';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const user: UserProfile = JSON.parse(storedUser);
          return of(setUser({ user }));
        }
        return this.authService.getProfile().pipe(
          map((user) => {
            sessionStorage.setItem('user', JSON.stringify(user));
            return setUser({ user });
          }),
          catchError(() => {
            sessionStorage.removeItem('user');
            return of(clearUser());
          })
        );
      })
    )
  );
}
