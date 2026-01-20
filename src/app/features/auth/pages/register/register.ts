import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    // Todos los usuarios se registran como 'customer' por defecto
    this.authService.register(this.name, this.email, this.password, 'customer').subscribe({
      next: () => {
        this.loading = false;
        // Redirigir después de registro exitoso
        this.router.navigateByUrl('/products');
      },
      error: (err) => {
        console.error('Error de registro', err);
        this.error = err.error?.message || 'Error al crear la cuenta. Intenta nuevamente.';
        this.loading = false;
      },
    });
  }
}
