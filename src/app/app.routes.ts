import { Routes } from '@angular/router';
import { ProductsListComponent } from './features/products/pages/products-list/products-list';
import { LoginComponent } from './features/auth/pages/login/login/login';
import { AdminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { AdminCategoriesComponent } from './features/admin/pages/admin-categories/admin-categories';
import { adminGuard } from './core/guards/admin.guard';
import { CartComponent } from './features/cart/pages/cart/cart';
import { AdminOrdersComponent } from './features/admin/pages/admin-orders/admin-orders';


export const routes: Routes = [
    {path: '', redirectTo: 'products', pathMatch: 'full' },
    {path: 'products', component : ProductsListComponent},
    {path: 'login', component: LoginComponent},
    {path:'cart',component:CartComponent},
    {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard], // 👈 aquí se usa el guard
  },
  {
    path: 'admin/categories',
    component: AdminCategoriesComponent,
    canActivate: [adminGuard],
  },
  {
  path: 'admin/orders',
  component: AdminOrdersComponent,
  canActivate: [adminGuard],
  },

];
