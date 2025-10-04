import { bootstrapApplication } from '@angular/platform-browser';
import { LocationsTableComponent } from './components/locations-table/locations-table.component';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { locationsReducer } from './store/locations/locations.reducer';
import { LocationsEffects } from './store/locations/locations.effects';

export const mainAppConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideStore({ locations: locationsReducer }),
    provideEffects([LocationsEffects])
  ]
};

bootstrapApplication(LocationsTableComponent, mainAppConfig)
  .catch((err) => console.error(err));
