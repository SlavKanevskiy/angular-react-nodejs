import { createAction, props } from '@ngrx/store';
import type { Location } from '../../../../shared/interfaces';

// Initial load via HTTP
export const loadLocations = createAction('[Locations] Load Locations');
export const loadLocationsSuccess = createAction(
  '[Locations] Load Locations Success',
  props<{ locations: Location[] }>()
);
export const loadLocationsFailure = createAction(
  '[Locations] Load Locations Failure',
  props<{ error: string }>()
);

// WebSocket connection
export const connectWebSocket = createAction('[WebSocket] Connect');
export const webSocketConnected = createAction('[WebSocket] Connected');

// WebSocket events (from server)
export const wsLocationsCreated = createAction(
  '[WebSocket] Locations Created',
  props<{ locations: Location[] }>()
);
export const wsLocationDeleted = createAction(
  '[WebSocket] Location Deleted',
  props<{ id?: number }>()
);

// API operations (just trigger HTTP call, result comes via WebSocket)
export const deleteLocation = createAction(
  '[Locations] Delete Location',
  props<{ id: number }>()
);

export const generateLocations = createAction(
  '[Locations] Generate Locations',
  props<{ count: number }>()
);

export const clearAllLocations = createAction('[Locations] Clear All Locations');

// Filter
export const setFilterText = createAction(
  '[Locations] Set Filter Text',
  props<{ filterText: string }>()
);
