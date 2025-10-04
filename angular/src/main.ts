import { bootstrapApplication } from '@angular/platform-browser';
import { LocationsTableComponent } from './components/locations-table/locations-table.component';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const mainAppConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient()
  ]
};

bootstrapApplication(LocationsTableComponent, mainAppConfig)
  .catch((err) => console.error(err));
