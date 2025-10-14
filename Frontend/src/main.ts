import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  console.log('AAAAAAAAAAAAAAAAAAAAAA');
  document.documentElement.setAttribute('data-theme', savedTheme);
}

bootstrapApplication(App, {
  ...appConfig,
  providers: [...(appConfig.providers || []), provideHttpClient(), provideRouter(routes)],
}).catch((err) => console.error(err));
