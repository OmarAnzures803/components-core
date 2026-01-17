// src/app/features/orders/services/orders.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  createOrder(
    items: { productId: number; quantity: number }[],
  ): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, { items });
  }

   getAdminOrders() {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // Actualizar estado de pedido
  updateOrderStatus(id: number, status: OrderStatus) {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }
}
