import { Component, inject, ViewChild } from '@angular/core';
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
import { AuthService, UserProfile } from '../auth.service';
import { setUser } from '../../user/user.actions';
import { Store } from '@ngrx/store';
import { switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, Text, Password, Captcha],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  submitted = false;
  loginForm: FormGroup;
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);

  @ViewChild(Captcha) captchaComponent!: Captcha;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getEmailErrorMessage(controlName: string): string {
    return this.validationService.getEmailErrorMessage(this.loginForm, controlName, this.submitted);
  }

  getPassErrorMessage(controlName: string): string {
    return this.validationService.getPasswordErrorMessage(
      this.loginForm,
      controlName,
      this.submitted
    );
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  handleCaptchaVerification(isVerified: boolean) {
    if (isVerified) {
      console.log('CAPTCHA is verified!');
    } else {
      console.log('CAPTCHA verification failed.');
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
  
  onSubmit() {
    this.submitted = true;
    this.captchaComponent.verifyCaptcha();

    if (!this.captchaComponent.verifyCaptcha()) return;
    if (this.loginForm.invalid) return;

    const loginData = this.loginForm.value;

    this.authService
      .login(loginData)
      .pipe(
        switchMap(() => this.authService.getProfile()),
        catchError((err) => {
          console.error('Login or fetching profile failed', err);
          return of(null);
        })
      )
      .subscribe((user: UserProfile | null) => {
        if (user) {
          this.store.dispatch(setUser({ user }));
          this.router.navigate(['/home']);
        }
      });
  }
}
