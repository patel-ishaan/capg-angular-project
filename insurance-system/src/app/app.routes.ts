import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { CatalogPageComponent } from './pages/catalog-page/catalog-page';
import { PaymentsPageComponent } from './pages/payments/payments';
import { ClaimsPageComponent } from './pages/claims/claims';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'catalog', component: CatalogPageComponent },
    { path: 'payments', component: PaymentsPageComponent },
    { path: 'claims', component: ClaimsPageComponent }
];