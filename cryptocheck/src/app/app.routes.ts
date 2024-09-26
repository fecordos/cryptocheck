import { Routes } from '@angular/router';
 import { CoinDetailsComponent } from './components/coin-details/coin-details.component';
import { CoinsListComponent } from './components/coin-list/coins-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'coins-list',
    pathMatch: 'full',
  },
  {
    path: 'coins-list',
    component: CoinsListComponent,
  },
  {
    path: 'coin-details/:id',
    component: CoinDetailsComponent,
  },
];
