import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'login', component:LoginComponent},
    {path: 'register',component:RegisterComponent},
    {path: 'dashboard',component:DashboardComponent},
    {path: 'profile',component: ProfileComponent}
];
