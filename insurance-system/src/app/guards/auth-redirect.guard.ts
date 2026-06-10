import { inject } from '@angular/core';
import { LoginService } from '../services/auth/login-service';
import { Router } from '@angular/router';

export const authRedircetGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
