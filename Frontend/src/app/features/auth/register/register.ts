import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Text } from '../../../shared/components/input/text/text';
import { Password } from '../../../shared/components/input/password/password';
import { ValidationService } from '../../../shared/validations/validation.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-register',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Text,
    Password],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})


export class Register {
  submitted = false;
  registerForm: FormGroup;
  constructor(private fb: FormBuilder, private validationService: ValidationService, private router: Router, private authService:AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  getDataErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);

    if (!control) return '';

    if (control.touched || control.dirty || this.submitted) {
      if (control.hasError('required')) {
        return `${this.formatLabel(controlName)} is required.`;
      }
      if (control.hasError('minlength')) {
        return `${this.formatLabel(controlName)} is too short.`;
      }
      if (control.hasError('maxlength')) {
        return `${this.formatLabel(controlName)} is too long.`;
      }
    }

    return '';
  }

  getEmailErrorMessage(controlName: string): string {
    return this.validationService.getEmailErrorMessage(this.registerForm, controlName, this.submitted);
  }

  getPassErrorMessage(controlName: string): string {
    return this.validationService.getPasswordErrorMessage(this.registerForm, controlName, this.submitted);
  }

  private formatLabel(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  }

  goHome()
  {
    this.router.navigate(['/home']);
  }
  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    const loginData = this.registerForm.value;

    this.authService.register(loginData).subscribe({
      next: () => {
        this.router.navigate(['/home']); // redirect
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
