import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/home/home';
import { Carousel } from './features/home/carousel/carousel';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },

  {
    path: 'home',
    component: Home,
    children: [
      { path: '', component: Carousel },
      { path: 'profile', component: Profile },
    ],
  },
  { path: '**', redirectTo: '/home' },
];
