import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SuccessComponent } from './success.component';

describe('SuccessComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SuccessComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display success message', () => {
    const fixture = TestBed.createComponent(SuccessComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Paiement confirmé');
  });
});
