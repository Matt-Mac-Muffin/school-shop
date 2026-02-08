import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CancelComponent } from './cancel.component';

describe('CancelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CancelComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display cancellation message', () => {
    const fixture = TestBed.createComponent(CancelComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Paiement annulé');
  });
});
