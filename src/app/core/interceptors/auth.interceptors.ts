import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Omitir Authorization en endpoints públicos GET /products y /categories
  if (req.method === 'GET') {
    let pathname = req.url;
    try {
      const u = new URL(req.url);
      pathname = u.pathname; // '/products' o '/categories'
    } catch {
      // URL relativa, ej: '/products?x=1' o 'products'
      pathname = req.url.split('?')[0];
      if (!pathname.startsWith('/')) pathname = `/${pathname}`;
    }

    if (pathname === '/products' || pathname === '/categories') {
      return next(req);
    }
  }

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
