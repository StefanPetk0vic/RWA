import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  getDataErrorMessage(form: FormGroup, controlName: string, submitted = false): string {
    const control = form.get(controlName);
    if (!control) return '';

    if (control.touched || control.dirty || submitted) {
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

  getEmailErrorMessage(form: FormGroup, controlName: string, submitted = false): string {
    const control = form.get(controlName);
    if (!control) return '';

    if (control.touched || control.dirty || submitted) {
      if (control.hasError('required')) {
        return 'Email is required.';
      }
      if (control.hasError('email')) {
        return 'Please enter a valid email address.';
      }
    }

    return '';
  }

  getPasswordErrorMessage(form: FormGroup, controlName: string, submitted = false): string {
    const control = form.get(controlName);
    if (!control) return '';

    if (control.touched || control.dirty || submitted) {
      if (control.hasError('required')) {
        return 'Password is required.';
      }
      if (control.hasError('minlength')) {
        return 'Password is too short.';
      }
    }

    return '';
  }

  private formatLabel(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
