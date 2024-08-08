import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { CollectionListComponent } from './features/collections/collection-list/collection-list.component';



export const routes: Routes = [
  {
    path:'',
    redirectTo: 'home',
    pathMatch:'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path:'collection-list',
    component: CollectionListComponent
  },
];
