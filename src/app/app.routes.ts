import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Gw2 } from './gw2/gw2';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'gw2', component: Gw2 }
];
