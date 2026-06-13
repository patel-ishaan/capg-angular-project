import { inject } from '@angular/core';
import { LoginService } from '../services/auth/login-service';
import { Router } from '@angular/router';

export const authRedircetGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    if (loginService.currentUser?.()?.role === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};
