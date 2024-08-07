import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { AboutComponent } from './shared/about/about.component';
import { ContactComponent } from './shared/contact/contact.component';



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
    path:'about',
    component: AboutComponent
  },
  {
    path:'contact',
    component: ContactComponent
  }
];
