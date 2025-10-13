import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBalanceColor, selectUser } from '../../user/user.selectors';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { clearUser } from '../../user/user.actions';

@Component({
  selector: 'app-avatar',
  imports: [CommonModule, RouterModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  private store = inject(Store);
  user$ = this.store.select(selectUser);
  balanceColor$ = this.store.select(selectBalanceColor);
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.store.dispatch(clearUser());

        localStorage.removeItem('theme');

        this.router.navigate(['/login']);
      },
      error: (err: Error) => {
        console.error('Logout failed', err);
      },
    });
  }
  GoToProfile() {
    this.router.navigate(['/home/profile']);
  }
}
