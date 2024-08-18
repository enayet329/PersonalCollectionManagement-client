import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { CollectionListComponent } from './features/collections/collection-list/collection-list.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { SearchResultsComponent } from './features/search/search-results/search-results.component';
import { CollectionDetailComponent } from './features/collections/collection-detail/collection-detail.component';
import { ItemDetailComponent } from './features/items/item-detail/item-detail.component';
import { ProfileViewComponent } from './features/user-profile/profile-view/profile-view.component';
import { AddCollectionComponent } from './features/collections/add-collection/add-collection.component';
import { AddItemComponent } from './features/items/add-item/add-item.component';
import { ItemListComponent } from './features/items/item-list/item-list.component';
import { EditCollectionComponent } from './features/collections/edit-collection/edit-collection.component';
import { EditItemComponent } from './features/items/edit-item/edit-item.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'collection-list', component: CollectionListComponent },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'collection-detail/:id', component: CollectionDetailComponent },
  { path: 'add-collection/:id', component: AddCollectionComponent },
  { path: 'edit-collection/:id', component: EditCollectionComponent },
  { path: 'item-detail/:id', component: ItemDetailComponent },
  { path: 'item-list', component: ItemListComponent},
  { path: 'add-item/:id', component: AddItemComponent },
  { path: 'edit-item/:id', component: EditItemComponent },
  { path: 'profile-view/:id', component: ProfileViewComponent },
];
