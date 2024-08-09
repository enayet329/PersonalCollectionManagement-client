import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { CollectionListComponent } from './features/collections/collection-list/collection-list.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { SearchResultsComponent } from './features/search/search-results/search-results.component';
import { CollectionDetailComponent } from './features/collections/collection-detail/collection-detail.component';
import { ItemDetailComponent } from './features/items/item-detail/item-detail.component'; // Import ItemDetailComponent

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'collection-list', component: CollectionListComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'collection-detail/:id', component: CollectionDetailComponent },
  { path: 'item-detail/:id', component: ItemDetailComponent },
];
