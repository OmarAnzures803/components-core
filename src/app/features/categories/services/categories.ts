import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryPayload } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  // LISTAR
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // OBTENER UNA
  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // CREAR
  createCategory(payload: CategoryPayload): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, payload);
  }

  // ACTUALIZAR
  updateCategory(
    id: number,
    payload: Partial<CategoryPayload>,
  ): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, payload);
  }

  // BORRAR
  deleteCategory(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}

