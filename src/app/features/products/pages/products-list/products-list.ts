import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products';

import { Category } from '../../../categories/models/category.model';
import { CategoriesService } from '../../../categories/services/categories';

import { CartService } from '../../../../core/services/cart.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,   // 👈 solo el módulo
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];   // aquí guardamos todo lo que viene del backend
  loading = true;

  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  error: string | null = null;
  searchTerm: string = '';

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Cargamos categorías y productos al arrancar
    this.loadCategories();
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product, 1);
    console.log(`Producto "${product.name}" agregado al carrito`);
  }

  onSearchChange(terminoBusqueda: string): void {
    this.searchTerm = terminoBusqueda;
    this.applyFilters();
  }

  // Handler cuando el usuario cambia la categoría en el select
  onCategoryChange(value: string | number): void {
    if (value === 'all') {
      this.selectedCategoryId = null;
    } else {
      const id = Number(value);
      this.selectedCategoryId = isNaN(id) ? null : id;
    }

    // NO llamamos directamente a loadProducts con filtro si
    // queremos filtrar en memoria. Usamos applyFilters:
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.products = this.allProducts.filter((producto) => {
      const coincideCategoria =
        this.selectedCategoryId === null ||
        producto.categoryId === this.selectedCategoryId;

      const coincideBusqueda =
        term === '' ||
        producto.name.toLowerCase().includes(term) ||
        producto.brand.toLowerCase().includes(term);

      return coincideCategoria && coincideBusqueda;
    });
  }

  // Cargar categorías desde el backend
  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      },
    });
  }

  // Cargar productos desde el backend
  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productsService
      .getProducts()
      .pipe(
        catchError((err) => {
          console.error('Error al cargar productos', err);
          this.error = 'No se pudieron cargar los productos.';
          this.allProducts = [];
          this.applyFilters();
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((products) => {
        this.allProducts = products;  // 👈 guardamos todo
        this.applyFilters();          // 👈 aplicamos búsqueda/categoría actuales
        this.cdr.detectChanges();
      });
  }
}
