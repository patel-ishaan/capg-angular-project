import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { CatalogPageComponent } from './pages/catalog-page/catalog-page';
import { PaymentsPageComponent } from './pages/payments/payments';
import { ClaimsPageComponent } from './pages/claims/claims';
import { AddClaimComponent } from './pages/claims/add-claim/add-claim';
import { SearchPageComponent } from './pages/search-page/search-page';
import { Hero } from './components/hero/hero';
import { ErrorPage } from './pages/error-page/error-page';
import { authRedircetGuard } from './guards/auth-redirect.guard';
import { authGuard } from './guards/auth.guard';
import { ComparePoliciesComponent } from './components/compare-policies/compare-policies';
import { AdminLayout } from './pages/admin-layout/admin-layout';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { AdminGuard } from './guards/auth-isAdmin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      {
        path: '',
        component: Hero,
        canActivate: [authRedircetGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'error',
        component: ErrorPage,
      },
    ],
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },

  {
    path: 'catalog',
    component: CatalogPageComponent,
  },

  {
    path: 'payments',
    component: PaymentsPageComponent,
  },

  {
    path: 'claims/add',          
    component: AddClaimComponent,
    canActivate: [authGuard],
  },

  {
    path: 'claims',
    component: ClaimsPageComponent,
  },

  {
    path: 'search',
    component: SearchPageComponent,
  },

  {
    path: 'policies/compare',
    component: ComparePoliciesComponent,
  },

  {
    path: 'policies',
    component: CatalogPageComponent,
  },

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard, AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboard,
      },
      {
        path: '**',
        component: ErrorPage,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'error',
  },
];
