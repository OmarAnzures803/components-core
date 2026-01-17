import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  Category,
  CategoryPayload,
} from '../../../categories/models/category.model';
import { CategoriesService } from '../../../categories/services/categories';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];

  loading = false;
  loadingSave = false;
  error: string | null = null;
  errorSave: string | null = null;

  isEditing = false;
  editingId: number | null = null;

  form: CategoryPayload = {
    name: '',
    description: '',
  };

  constructor(private categoriesService: CategoriesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoriesService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.error = 'No se pudieron cargar las categorías.';
        this.loading = false;
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
      description: '',
    };
  }

  startCreate(): void {
    this.resetForm();
  }

  startEdit(category: Category): void {
    this.isEditing = true;
    this.editingId = category.id;
    this.errorSave = null;

    this.form = {
      name: category.name,
      description: category.description ?? '',
    };
  }

  saveCategory(): void {
    this.loadingSave = true;
    this.errorSave = null;

    const payload: CategoryPayload = {
      name: this.form.name.trim(),
      description: this.form.description?.trim() || '',
    };

    if (!payload.name) {
      this.errorSave = 'El nombre es obligatorio.';
      this.loadingSave = false;
      return;
    }

    // CREAR
    if (!this.isEditing) {
      this.categoriesService.createCategory(payload).subscribe({
        next: () => {
          this.loadingSave = false;
          this.resetForm();
          this.loadCategories();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al crear categoría', err);
          this.errorSave = 'Error al crear la categoría.';
          this.loadingSave = false;
          this.cdr.detectChanges();
        },
      });
      return;
    }

    // EDITAR
    if (this.isEditing && this.editingId !== null) {
      this.categoriesService
        .updateCategory(this.editingId, payload)
        .subscribe({
          next: () => {
            this.loadingSave = false;
            this.resetForm();
            this.loadCategories();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al actualizar categoría', err);
            this.errorSave = 'Error al actualizar la categoría.';
            this.loadingSave = false;
            this.cdr.detectChanges();
          },
        });
    }
  }

  deleteCategory(category: Category): void {
    const confirmed = confirm(
      `¿Seguro que quieres eliminar la categoría "${category.name}"?`,
    );
    if (!confirmed) return;

    this.categoriesService.deleteCategory(category.id).subscribe({
      next: () => {
        this.loadCategories();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar categoría', err);
        alert('No se pudo eliminar la categoría.');
        this.cdr.detectChanges();
      },
    });
  }
}
