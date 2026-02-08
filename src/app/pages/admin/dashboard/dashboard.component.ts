import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { Product } from '../../../models/product';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  activeTab = signal<'products' | 'orders'>('products');

  products = signal<Product[]>([]);
  orders = signal<Order[]>([]);
  loading = signal(true);
  errorMsg = signal('');

  showProductForm = signal(false);
  editingProduct = signal<Product | null>(null);
  productForm = { name: '', description: '', price_cents: 0, image_url: '', is_active: true };
  savingProduct = signal(false);
  uploadingImage = signal(false);

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private storage: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private get token(): string {
    return this.auth.getToken()!;
  }

  formatPrice(cents: number): string {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €';
  }

  switchTab(tab: 'products' | 'orders'): void {
    this.activeTab.set(tab);
    if (tab === 'orders' && this.orders().length === 0) {
      this.loadOrders();
    }
  }

  // Products

  loadProducts(): void {
    this.loading.set(true);
    this.api.getAdminProducts(this.token).subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Erreur lors du chargement des produits.');
        this.loading.set(false);
      },
    });
  }

  openNewProduct(): void {
    this.editingProduct.set(null);
    this.productForm = { name: '', description: '', price_cents: 0, image_url: '', is_active: true };
    this.showProductForm.set(true);
  }

  openEditProduct(product: Product): void {
    this.editingProduct.set(product);
    this.productForm = {
      name: product.name,
      description: product.description,
      price_cents: product.price_cents,
      image_url: product.image_url,
      is_active: product.is_active,
    };
    this.showProductForm.set(true);
  }

  closeProductForm(): void {
    this.showProductForm.set(false);
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingImage.set(true);
    try {
      const url = await this.storage.uploadImage(file);
      this.productForm.image_url = url;
    } catch {
      this.errorMsg.set("Erreur lors de l'upload de l'image.");
    }
    this.uploadingImage.set(false);
  }

  saveProduct(): void {
    this.savingProduct.set(true);
    this.errorMsg.set('');

    const editing = this.editingProduct();

    if (editing) {
      this.api.updateProduct(this.token, { id: editing.id, ...this.productForm }).subscribe({
        next: () => {
          this.loadProducts();
          this.showProductForm.set(false);
          this.savingProduct.set(false);
        },
        error: () => {
          this.errorMsg.set('Erreur lors de la mise à jour.');
          this.savingProduct.set(false);
        },
      });
    } else {
      this.api.createProduct(this.token, this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.showProductForm.set(false);
          this.savingProduct.set(false);
        },
        error: () => {
          this.errorMsg.set('Erreur lors de la création.');
          this.savingProduct.set(false);
        },
      });
    }
  }

  toggleActive(product: Product): void {
    this.api.updateProduct(this.token, { id: product.id, is_active: !product.is_active }).subscribe({
      next: () => this.loadProducts(),
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Supprimer "${product.name}" ?`)) return;

    this.api.deleteProduct(this.token, product.id).subscribe({
      next: () => this.loadProducts(),
      error: () => this.errorMsg.set('Erreur lors de la suppression.'),
    });
  }

  // Orders

  loadOrders(): void {
    this.loading.set(true);
    this.api.getAdminOrders(this.token).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Erreur lors du chargement des commandes.');
        this.loading.set(false);
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
