import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../../user/user.selectors';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-info',
  imports: [CommonModule],
  templateUrl: './info.html',
  styleUrl: './info.scss',
})
export class Info {
  private store = inject(Store);
  user$: Observable<UserProfile | null> = this.store.select(selectUser);
  visible = true;
  private storageKey = 'hideInfoBanner';
  private duration = 24 * 60 * 60 * 1000;

  ngOnInit() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const { hiddenAt } = JSON.parse(stored);
        const elapsed = Date.now() - hiddenAt;
        if (elapsed < this.duration) {
          this.visible = false;
        } else {
          localStorage.removeItem(this.storageKey);
        }
      } catch {
        localStorage.removeItem(this.storageKey);
      }
    }
  }
  closeInfo() {
    this.visible = false;
    localStorage.setItem(this.storageKey, JSON.stringify({ hiddenAt: Date.now() }));
  }
}
