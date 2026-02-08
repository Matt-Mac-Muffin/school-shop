import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ShopComponent } from './shop.component';

describe('ShopComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ShopComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('formatPrice converts cents to EUR string', () => {
    const fixture = TestBed.createComponent(ShopComponent);
    expect(fixture.componentInstance.formatPrice(1500)).toBe('15,00 €');
    expect(fixture.componentInstance.formatPrice(99)).toBe('0,99 €');
  });

  it('starts in loading state', () => {
    const fixture = TestBed.createComponent(ShopComponent);
    expect(fixture.componentInstance.loading()).toBe(true);
  });
});
