import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { Product, ProductPayload } from '../models/product.model';
import { PaginatedProducts } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // LISTAR con filtro opcional
  getProducts(categoryId?: number): Observable<Product[]> {
    let params: HttpParams | undefined;

    if (categoryId !== undefined) {
      params = new HttpParams().set('categoryId', categoryId.toString());
    }

    return this.http.get<Product[]>(this.apiUrl, { params }).pipe(timeout(8000));
  }

  getAdminProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | null;
}): Observable<PaginatedProducts> {
  let httpParams = new HttpParams();

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  httpParams = httpParams
    .set('page', page.toString())
    .set('limit', limit.toString());

  if (params?.search && params.search.trim() !== '') {
    httpParams = httpParams.set('search', params.search.trim());
  }

  if (params?.categoryId !== null && params?.categoryId !== undefined) {
    httpParams = httpParams.set('categoryId', String(params.categoryId));
  }

  return this.http.get<PaginatedProducts>(`${this.apiUrl}/admin`, {
    params: httpParams,
  });
}

  // OBTENER UNO
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // CREAR
  createProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, payload);
  }

  // ACTUALIZAR
  updateProduct(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, payload);
  }

  // BORRAR
  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

