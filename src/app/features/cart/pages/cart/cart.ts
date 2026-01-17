// src/app/features/cart/pages/cart/cart.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { CartService, CartItem } from '../../../../core/services/cart.service';
import { OrdersService } from '../../../orders/services/orders.service';
import { AuthService } from '../../../auth/services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  totalAmount = 0;
  loadingCheckout = false;
  errorCheckout: string | null = null;

  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.sub = this.cartService.items$.subscribe((items) => {
      this.items = items;
      this.totalAmount = this.cartService.getTotalAmount();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onQuantityChange(item: CartItem, value: string | number): void {
    const quantity = Number(value);
    if (isNaN(quantity)) return;
    this.cartService.updateQuantity(item.product.id, quantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  clearCart(): void {
    this.cartService.clear();
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  checkout(): void {
    this.errorCheckout = null;

    if (!this.authService.isLoggedIn()) {
      // si no está logueado, lo mandamos a login
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    if (this.items.length === 0) {
      this.errorCheckout = 'El carrito está vacío.';
      return;
    }

    const payloadItems = this.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    this.loadingCheckout = true;

    this.ordersService.createOrder(payloadItems).subscribe({
      next: (order) => {
        this.loadingCheckout = false;
        this.cartService.clear();
        alert(`Pedido creado con éxito. ID: ${order.id}`);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al crear pedido', err);
        this.errorCheckout = 'No se pudo completar el pedido.';
        this.loadingCheckout = false;
      },
    });
  }

  

}
