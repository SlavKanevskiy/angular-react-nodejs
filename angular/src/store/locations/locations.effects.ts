import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { WebsocketService } from '../../services/websocket.service';
import * as LocationsActions from './locations.actions';
import type { Location } from '../../../../shared/interfaces';
import { WS_EVENTS } from '../../../../shared/actions';
import { wsUrl } from '../../../../shared/config';

export class LocationsEffects {
  private actions$ = inject(Actions);
  private apiService = inject(ApiService);
  private wsService = inject(WebsocketService);

  // Initial load via HTTP
  loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.loadLocations),
      switchMap(() =>
        this.apiService.getAll().pipe(
          map(locations => LocationsActions.loadLocationsSuccess({ locations })),
          catchError(error => of(LocationsActions.loadLocationsFailure({ error: error.message })))
        )
      )
    )
  );

  // Connect WebSocket after successful load
  connectWebSocket$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.loadLocationsSuccess),
      map(() => LocationsActions.connectWebSocket())
    )
  );

  // WebSocket connection
  wsConnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationsActions.connectWebSocket),
      switchMap(() =>
        this.wsService.connect(wsUrl).pipe(
          map(message => {
            switch (message.type) {
              case WS_EVENTS.LOCATIONS_CREATED:
                return LocationsActions.wsLocationsCreated({
                  locations: message.data as Location[]
                });
              case WS_EVENTS.LOCATION_DELETED:
                return LocationsActions.wsLocationDeleted({
                  id: (message.data as { id?: number }).id
                });
              default:
                return { type: 'UNKNOWN_WS_EVENT' };
            }
          }),
          catchError(error => {
            console.error('WebSocket error:', error);
            return of({ type: 'WS_ERROR' });
          })
        )
      )
    )
  );

  // API operations (just trigger, result comes via WebSocket)
  deleteLocation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LocationsActions.deleteLocation),
        switchMap(({ id }) =>
          this.apiService.delete(id).pipe(
            catchError(error => {
              console.error('Delete error:', error);
              return of(null);
            })
          )
        )
      ),
    { dispatch: false }
  );

  generateLocations$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LocationsActions.generateLocations),
        switchMap(({ count }) =>
          this.apiService.generate(count).pipe(
            catchError(error => {
              console.error('Generate error:', error);
              return of(null);
            })
          )
        )
      ),
    { dispatch: false }
  );

  clearAllLocations$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LocationsActions.clearAllLocations),
        switchMap(() =>
          this.apiService.deleteAll().pipe(
            catchError(error => {
              console.error('Clear error:', error);
              return of(null);
            })
          )
        )
      ),
    { dispatch: false }
  );
}
