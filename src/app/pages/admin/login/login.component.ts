import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit(): Promise<void> {
    this.loading.set(true);
    this.errorMsg.set('');

    const error = await this.auth.login(this.email, this.password);

    if (error) {
      this.errorMsg.set('Email ou mot de passe incorrect.');
      this.loading.set(false);
      return;
    }

    this.router.navigate(['/admin']);
  }
}
