// src/app/features/products/models/product.model.ts
export interface Product {
  id: number;
  name: string;
  brand: string;
  description?: string;
  price: number; // por si viene string del backend
  stock: number;
  categoryId?: number | null;
  imageUrl?: string | null;
}

export interface ProductPayload {
  name: string;
  brand: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number | null;
  imageUrl?: string | null;
}
export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
