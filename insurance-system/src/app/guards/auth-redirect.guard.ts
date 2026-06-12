import { inject } from '@angular/core';
import { LoginService } from '../services/auth/login-service';
import { Router } from '@angular/router';

export const authRedircetGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    const role = loginService.currentUser()?.role;

    if (role === 'admin') {
      return router.createUrlTree(['/admin']);
    }

    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
