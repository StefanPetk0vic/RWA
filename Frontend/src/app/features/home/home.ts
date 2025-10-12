import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { selectUser } from '../user/user.selectors';
import { Store } from '@ngrx/store';
import { Info } from './info/info';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, Navbar, Footer, Info],
  templateUrl: './home.html',
})
export class Home {
  private store = inject(Store);
  user$ = this.store.select(selectUser);
  visible = true;
}
