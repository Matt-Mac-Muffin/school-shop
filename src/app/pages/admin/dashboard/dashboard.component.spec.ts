import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../../services/auth.service';

describe('DashboardComponent', () => {
  const mockAuth = {
    isLoggedIn: () => true,
    getToken: () => 'test-token',
    logout: () => Promise.resolve(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuth },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('starts on the products tab', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance.activeTab()).toBe('products');
  });

  it('formatPrice converts cents', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance.formatPrice(2000)).toBe('20,00 €');
  });
});
