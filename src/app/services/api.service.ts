import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Order } from '../models/order';

export interface CheckoutRequest {
  product_id: string;
  quantity: number;
  customer_name: string;
  customer_email: string;
  child_class: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/get-products');
  }

  createCheckout(data: CheckoutRequest): Observable<{ url: string }> {
    return this.http.post<{ url: string }>('/api/create-checkout', data);
  }

  // Admin endpoints

  getAdminProducts(token: string): Observable<Product[]> {
    return this.http.get<Product[]>('/api/admin-products', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createProduct(token: string, product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>('/api/admin-products', product, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateProduct(token: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>('/api/admin-products', product, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteProduct(token: string, id: string): Observable<void> {
    return this.http.delete<void>('/api/admin-products', {
      headers: { Authorization: `Bearer ${token}` },
      body: { id },
    });
  }

  getAdminOrders(token: string): Observable<Order[]> {
    return this.http.get<Order[]>('/api/admin-orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
