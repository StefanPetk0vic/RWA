import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService, UserProfile } from '../auth/auth.service';
import { Router } from '@angular/router';
import { selectUser } from '../user/user.selectors';
import { clearUser, setUser } from '../user/user.actions';
import { VerifiedCard } from './verified-card/verified-card';
import { Bets } from './bets/bets';
import { BetFilter } from './bet-filter/bet-filter';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, VerifiedCard, Bets],
  templateUrl: './profile.html',
})
export class Profile {
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.store.select(selectUser);
  userData: UserProfile | null = null;

  ngOnInit() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    } else {
      this.authService.getProfile().subscribe({
        next: (user) => {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(user));
          this.store.dispatch(setUser({ user }));
        },
        error: (err) => {
          console.error('Profile load failed:', err);
          if (err.status === 401) {
            localStorage.removeItem('user');
            this.store.dispatch(clearUser());
            this.router.navigate(['/auth/login']);
          }
        },
      });
    }
  }
}
