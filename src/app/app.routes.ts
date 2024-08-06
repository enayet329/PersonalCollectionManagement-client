import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { CollectionListComponent } from './features/collections/collection-list/collection-list.component';
import { ItemListComponent } from './features/items/item-list/item-list.component';
import { ProfileViewComponent } from './features/user-profile/profile-view/profile-view.component';


export const routes: Routes = [
  {
    path:'',
    redirectTo: 'home',
    pathMatch:'full'
  }
];
