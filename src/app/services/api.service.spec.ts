import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getProducts calls GET /api/get-products', () => {
    const mockProducts = [{ id: '1', name: 'Miel', price_cents: 1500 }];
    service.getProducts().subscribe(result => {
      expect(result).toEqual(mockProducts as any);
    });
    const req = http.expectOne('/api/get-products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('createCheckout posts to /api/create-checkout', () => {
    const body = { product_id: '1', quantity: 2, customer_name: 'Jean', customer_email: 'j@e.com', child_class: 'CM1' };
    service.createCheckout(body).subscribe(result => {
      expect(result.url).toBe('https://stripe.com/pay');
    });
    const req = http.expectOne('/api/create-checkout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ url: 'https://stripe.com/pay' });
  });

  it('getAdminProducts sends auth header', () => {
    service.getAdminProducts('tok123').subscribe();
    const req = http.expectOne('/api/admin-products');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok123');
    req.flush([]);
  });

  it('deleteProduct sends DELETE with body', () => {
    service.deleteProduct('tok123', 'abc').subscribe();
    const req = http.expectOne('/api/admin-products');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ id: 'abc' });
    req.flush(null);
  });

  it('getAdminOrders sends auth header', () => {
    service.getAdminOrders('tok456').subscribe();
    const req = http.expectOne('/api/admin-orders');
    expect(req.request.headers.get('Authorization')).toBe('Bearer tok456');
    req.flush([]);
  });
});
