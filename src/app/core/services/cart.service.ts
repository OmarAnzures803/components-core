// src/app/core/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../features/products/models/product.model';

const CART_STORAGE_KEY = 'components_core_cart';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  readonly items$ = this.itemsSubject.asObservable();

  constructor() {}

  // Obtener snapshot actual (sin observable)
  getItemsSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  // Total de productos (suma de cantidades)
  getTotalQuantity(): number {
    return this.itemsSubject.value.reduce((acc, item) => acc + item.quantity, 0);
  }

  // Total en dinero
  getTotalAmount(): number {
    return this.itemsSubject.value.reduce((acc, item) => {
      const price =
        typeof item.product.price === 'string'
          ? parseFloat(item.product.price)
          : item.product.price;

      return acc + price * item.quantity;
    }, 0);
  }

  addItem(product: Product, quantity: number = 1): void {
    const items = [...this.itemsSubject.value];
    const index = items.findIndex((i) => i.product.id === product.id);

    if (index >= 0) {
      items[index] = {
        ...items[index],
        quantity: items[index].quantity + quantity,
      };
    } else {
      items.push({ product, quantity });
    }

    this.updateItems(items);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const items = this.itemsSubject.value.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item,
    );

    this.updateItems(items);
  }

  removeItem(productId: number): void {
    const items = this.itemsSubject.value.filter((i) => i.product.id !== productId);
    this.updateItems(items);
  }

  clear(): void {
    this.updateItems([]);
  }

  // ----------------- privados -----------------

  private updateItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.saveToStorage(items);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignoramos errores de storage
    }
  }
  countItems(): number {
    return this.itemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }
}
