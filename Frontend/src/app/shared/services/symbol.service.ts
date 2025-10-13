import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SymbolService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.updateDarkMode();

    const observer = new MutationObserver(() => this.updateDarkMode());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  private updateDarkMode() {
    const theme = document.documentElement.getAttribute('data-theme');
    this.darkModeSubject.next(theme === 'dracula-modified');
  }

  toggleDarkMode() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dracula-modified') {
      document.documentElement.setAttribute('data-theme', 'autumn-modified');
    } else {
      document.documentElement.setAttribute('data-theme', 'dracula-modified');
    }
  }
}
