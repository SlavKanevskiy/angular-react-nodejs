import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import * as LocationsActions from './locations.actions';

@Injectable()
export class LocationsEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);

  loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.loadLocations),
      switchMap(() =>
        this.apiService.getAll().pipe(
          map(locations => LocationsActions.loadLocationsSuccess({ locations })),
          catchError(error =>
            of(LocationsActions.loadLocationsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.deleteLocation),
      switchMap(({ id }) =>
        this.apiService.delete(id).pipe(
          map(() => LocationsActions.deleteLocationSuccess({ id })),
          catchError(error =>
            of(LocationsActions.deleteLocationFailure({ error: error.message }))
          )
        )
      )
    )
  );

  generateLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.generateLocations),
      switchMap(({ count }) =>
        this.apiService.generate(count).pipe(
          map(() => LocationsActions.generateLocationsSuccess()),
          catchError(error =>
            of(LocationsActions.generateLocationsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  generateLocationsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.generateLocationsSuccess),
      map(() => LocationsActions.loadLocations())
    )
  );

  clearAllLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.clearAllLocations),
      switchMap(() =>
        this.apiService.deleteAll().pipe(
          map(() => LocationsActions.clearAllLocationsSuccess()),
          catchError(error =>
            of(LocationsActions.clearAllLocationsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}

