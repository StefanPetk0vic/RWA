import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Home } from './features/home/home';
import { Carousel } from './features/home/carousel/carousel';
import { Profile } from './features/profile/profile';
import { CoinFlip } from './features/games/coin-flip/coin-flip';
import { HorseRace } from './features/games/horse-race/horse-race';
import { SlotMachine } from './features/games/slot-machine/slot-machine';
import { NotFound } from './shared/components/not-found/not-found';

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
      { path: 'coinflip', component: CoinFlip },
      { path: 'horserace', component: HorseRace },
      { path: 'slotmachine', component: SlotMachine },
      {
        path: '404',
        component: NotFound,
      },
    ],
  },
  { path: '**', redirectTo: '/home' },
];
