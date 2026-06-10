import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},
    {path: 'login', component:LoginComponent},
    {path: 'register',component:RegisterComponent}
];
