import { Component, OnInit, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, CheckoutRequest } from '../../services/api.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  errorMsg = signal('');
  serviceDown = signal(false);

  selectedProduct = signal<Product | null>(null);
  formData = { customer_name: '', customer_email: '', quantity: 1, child_class: '' };
  submitting = signal(false);

  private api = inject(ApiService);

  ngOnInit(): void {
    this.api.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.serviceDown.set(true);
        this.loading.set(false);
      },
    });
  }

  formatPrice(cents: number): string {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €';
  }

  openOrder(product: Product): void {
    this.selectedProduct.set(product);
    this.formData = { customer_name: '', customer_email: '', quantity: 1, child_class: '' };
  }

  closeOrder(): void {
    this.selectedProduct.set(null);
  }

  submitOrder(): void {
    const product = this.selectedProduct();
    if (!product) return;

    this.submitting.set(true);
    this.errorMsg.set('');

    const request: CheckoutRequest = {
      product_id: product.id,
      quantity: this.formData.quantity,
      customer_name: this.formData.customer_name,
      customer_email: this.formData.customer_email,
      child_class: this.formData.child_class,
    };

    this.api.createCheckout(request).subscribe({
      next: (res) => {
        window.location.href = res.url;
      },
      error: () => {
        this.errorMsg.set('Erreur lors de la création du paiement.');
        this.submitting.set(false);
      },
    });
  }
}
