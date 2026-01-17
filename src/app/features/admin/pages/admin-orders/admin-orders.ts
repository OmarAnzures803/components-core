import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import {
  Order,
  OrderStatus,
} from '../../../orders/models/order.model';
import { OrdersService } from '../../../orders/services/orders.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  // para mostrar loading solo en la fila que se está actualizando
  updatingOrderId: number | null = null;

  readonly statusOptions: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'paid', label: 'Pagado' },
    { value: 'shipped', label: 'Enviado' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  constructor(private ordersService: OrdersService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.ordersService.getAdminOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pedidos', err);
        this.error = 'No se pudieron cargar los pedidos.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onStatusChange(order: Order, newStatus: OrderStatus): void {
    if (order.status === newStatus) return;

    this.updatingOrderId = order.id;

    this.ordersService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updated) => {
        order.status = updated.status;
        this.updatingOrderId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar estado', err);
        alert('No se pudo actualizar el estado del pedido.');
        this.updatingOrderId = null;
        this.cdr.detectChanges();
      },
    });
  }
}

