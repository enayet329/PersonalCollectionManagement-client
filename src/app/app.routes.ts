import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { CollectionListComponent } from './features/collections/collection-list/collection-list.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { SearchResultsComponent } from './features/search/search-results/search-results.component';


export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'collection-list', component: CollectionListComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'search-results', component: SearchResultsComponent }
];