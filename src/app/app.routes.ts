import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { CollectionListComponent } from './features/collections/collection-list/collection-list.component';
import { ItemListComponent } from './features/items/item-list/item-list.component';
import { ProfileViewComponent } from './features/user-profile/profile-view/profile-view.component';
import { HomeModule } from './features/home/home.module';
export const routes: Routes = [
  { path: '', component: HomeModule },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'collections', component: CollectionListComponent, canActivate: [AuthGuard] },
  { path: 'items', component: ItemListComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileViewComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  // Add more routes as needed
];
