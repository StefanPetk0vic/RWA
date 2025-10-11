import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from "../user/user.selectors";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // 👈 this line fixes the async pipe error
  template: `
    <div *ngIf="user$ | async as user">
      Welcome, {{ user.Credit }}
    </div>
  `,
})
export class Home {
  private store = inject(Store);
  user$ = this.store.select(selectUser);
}
