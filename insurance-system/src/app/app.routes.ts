import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './dashboard/dashboard';
import { CatalogPageComponent } from './pages/catalog-page/catalog-page';
import { PaymentsPageComponent } from './pages/payments/payments';
import { ClaimsPageComponent } from './pages/claims/claims';
import { SearchPageComponent } from './pages/search-page/search-page';
import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { ErrorPage } from './pages/error-page/error-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      {
        path: '',
        component: Hero,
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
  { path: 'dashboard', component: DashboardComponent },
  { path: 'catalog', component: CatalogPageComponent },
  { path: 'payments', component: PaymentsPageComponent },
  { path: 'claims', component: ClaimsPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'policies', component: CatalogPageComponent },
  { path: '**', redirectTo: 'error' },
];
