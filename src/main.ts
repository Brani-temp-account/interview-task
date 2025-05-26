import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const start = () =>
  bootstrapApplication(AppComponent, appConfig);


import('./mocks/browser').then(({ worker }) => {
  worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
    start();
  });
});