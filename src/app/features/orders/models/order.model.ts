// src/app/features/orders/models/order.model.ts
import { Product } from '../../products/models/product.model';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItemResponse {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
  // opcional, si tu API manda el usuario:
  user?: { id: number; name: string; email: string };
}

