import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/auth/login-service';

export const authGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (!loginService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
