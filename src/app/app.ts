import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './features/auth/services/auth';
import { CartService } from './core/services/cart.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    RouterLink, 
    MatToolbarModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Inyectamos el servicio de autenticación para usarlo en el template
  constructor(public auth: AuthService) {}
  CartService = inject(CartService);
}

