import { Injectable, inject } from '@angular/core';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { setUser, clearUser } from '../user/user.actions';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        this.authService.getProfile().pipe(
          map((user) => setUser({ user })),
          catchError(() => of(clearUser()))
        )
      )
    )
  );
}
