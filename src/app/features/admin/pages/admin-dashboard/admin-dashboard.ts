import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Product, ProductPayload } from '../../../products/models/product.model';
import { ProductsService } from '../../../products/services/products';
import { Category } from '../../../categories/models/category.model';
import { CategoriesService } from '../../../categories/services/categories';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  // nuevo:
  totalProducts = 0;
  page = 1;
  pageSize = 10;
  searchTerm = '';
  filterCategoryId: number | null = null;

  loadingProducts = false;
  loadingSave = false;
  errorProducts: string | null = null;
  errorSave: string | null = null;

  // Estado del formulario
  isEditing = false;
  editingId: number | null = null;

  form: ProductPayload = {
    name: '',
    brand: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: null,
    imageUrl: '',
  };

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

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

  loadProducts(): void {
    this.loadingProducts = true;
    this.errorProducts = null;

    this.productsService
      .getAdminProducts({
        page: this.page,
        limit: this.pageSize,
        search: this.searchTerm,
        categoryId: this.filterCategoryId,
      })
      .subscribe({
        next: (res) => {
          this.products = res.items;
          this.totalProducts = res.total;
          this.page = res.page;
          this.pageSize = res.limit;
          this.loadingProducts = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar productos', err);
          this.errorProducts = 'No se pudieron cargar los productos.';
          this.loadingProducts = false;
          this.cdr.detectChanges();
        },
      });
  }


  resetForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.errorSave = null;
    this.form = {
      name: '',
      brand: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: null,
      imageUrl: '',
    };
  }

  startCreate(): void {
    this.resetForm();
  }

  startEdit(product: Product): void {
    this.isEditing = true;
    this.editingId = product.id;
    this.errorSave = null;

    this.form = {
      name: product.name,
      brand: product.brand,
      description: product.description ?? '',
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      stock: product.stock,
      categoryId: product.categoryId ?? null,
      imageUrl: product.imageUrl ?? '',
    };
  }

  saveProduct(): void {
    this.loadingSave = true;
    this.errorSave = null;

    const payload: ProductPayload = {
      ...this.form,
      price: Number(this.form.price),
      stock: Number(this.form.stock),
      categoryId:
        this.form.categoryId === null || this.form.categoryId === undefined
          ? null
          : Number(this.form.categoryId),
    };

    if (!payload.name || !payload.brand) {
      this.errorSave = 'Nombre y marca son obligatorios.';
      this.loadingSave = false;
      return;
    }

    // CREAR
    if (!this.isEditing) {
      this.productsService.createProduct(payload).subscribe({
        next: () => {
          this.loadingSave = false;
          this.resetForm();
          this.loadProducts();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al crear producto', err);
          this.errorSave = 'Error al crear el producto.';
          this.loadingSave = false;
          this.cdr.detectChanges();
        },
      });
      return;
    }

    // EDITAR
    if (this.isEditing && this.editingId !== null) {
      this.productsService.updateProduct(this.editingId, payload).subscribe({
        next: () => {
          this.loadingSave = false;
          this.resetForm();
          this.loadProducts();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al actualizar producto', err);
          this.errorSave = 'Error al actualizar el producto.';
          this.loadingSave = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  deleteProduct(product: Product): void {
    const confirmed = confirm(
      `¿Seguro que quieres eliminar el producto "${product.name}"?`,
    );
    if (!confirmed) return;

    this.productsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadProducts();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
        alert('No se pudo eliminar el producto.');
        this.cdr.detectChanges();
      },
    });
  }

  getCategoryName(categoryId?: number | null): string {
    if (!categoryId) return '-';
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : `#${categoryId}`;
  }

    onSearchChange(value: string): void {
    this.searchTerm = value;
    this.page = 1;           // reset al inicio
    this.loadProducts();
  }

  onFilterCategoryChange(value: string | number | null): void {
    if (value === null || value === 'all') {
      this.filterCategoryId = null;
    } else {
      this.filterCategoryId = Number(value);
    }
    this.page = 1;
    this.loadProducts();
  }

  goToPage(delta: number): void {
    const newPage = this.page + delta;
    const maxPage = Math.max(1, Math.ceil(this.totalProducts / this.pageSize));

    if (newPage < 1 || newPage > maxPage) return;

    this.page = newPage;
    this.loadProducts();
  }

  get maxPage(): number {
    return Math.max(1, Math.ceil(this.totalProducts / this.pageSize));
  }

}
