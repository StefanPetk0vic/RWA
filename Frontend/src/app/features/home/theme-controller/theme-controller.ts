import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-controller',
  standalone: true,
  templateUrl: './theme-controller.html',
})
export class ThemeController {
  theme: 'autumn-modified' | 'dracula-modified';

  constructor() {
    const saved = localStorage.getItem('theme') as 'autumn-modified' | 'dracula-modified' | null;
    if (saved) {
      this.theme = saved;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefersDark ? 'dracula-modified' : 'autumn-modified';
      localStorage.setItem('theme', this.theme);
    }

    this.applyTheme();
  }

  toggleTheme() {
    this.theme = this.theme === 'autumn-modified' ? 'dracula-modified' : 'autumn-modified';
    this.applyTheme();
    localStorage.setItem('theme', this.theme);
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }
}
