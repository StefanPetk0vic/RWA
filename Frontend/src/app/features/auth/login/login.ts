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
import { Captcha } from '../../../shared/components/captcha/captcha';
import { ValidationService } from '../../../shared/validations/validation.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    Text,
    Password,
    Captcha,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  submitted = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder
    , private validationService: ValidationService, private router: Router, private authService:AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],

    });
  }

  @ViewChild(Captcha) captchaComponent!: Captcha;

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  getEmailErrorMessage(controlName: string): string {
    return this.validationService.getEmailErrorMessage(this.loginForm, controlName, this.submitted);
  }

  getPassErrorMessage(controlName: string): string {
    return this.validationService.getPasswordErrorMessage(this.loginForm, controlName, this.submitted);
  }

  handleCaptchaVerification(isVerified: boolean) {
    if (isVerified) {
      console.log('CAPTCHA is verified!');
      // Proceed with your form submission or other logic
    } else {
      console.log('CAPTCHA verification failed.');
      // Show an error message or take appropriate action
    }
  }

  onSubmit() {
    this.submitted = true;
    this.captchaComponent.verifyCaptcha();

    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: () => {
        this.router.navigate(['/home']); // redirect
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }


}