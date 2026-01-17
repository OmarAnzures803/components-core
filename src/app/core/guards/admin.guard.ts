// src/app/core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth';

/**
 * Guard que solo permite acceso a usuarios con rol 'admin' o 'employee'.
 * Si no cumple, redirige a /login.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si el usuario tiene rol admin o employee, se permite el acceso
  if (auth.hasRole('admin', 'employee')) {
    return true;
  }

  // Si no está logueado o no tiene rol adecuado, lo mandamos a login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
