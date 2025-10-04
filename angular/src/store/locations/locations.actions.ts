import { createAction, props } from '@ngrx/store';
import type { Location } from '../../../../shared/interfaces';

export const loadLocations = createAction('[Locations] Load Locations');
export const loadLocationsSuccess = createAction(
  '[Locations] Load Locations Success',
  props<{ locations: Location[] }>()
);
export const loadLocationsFailure = createAction(
  '[Locations] Load Locations Failure',
  props<{ error: string }>()
);

export const deleteLocation = createAction(
  '[Locations] Delete Location',
  props<{ id: number }>()
);
export const deleteLocationSuccess = createAction(
  '[Locations] Delete Location Success',
  props<{ id: number }>()
);
export const deleteLocationFailure = createAction(
  '[Locations] Delete Location Failure',
  props<{ error: string }>()
);

export const generateLocations = createAction(
  '[Locations] Generate Locations',
  props<{ count: number }>()
);
export const generateLocationsSuccess = createAction(
  '[Locations] Generate Locations Success'
);
export const generateLocationsFailure = createAction(
  '[Locations] Generate Locations Failure',
  props<{ error: string }>()
);

export const clearAllLocations = createAction('[Locations] Clear All Locations');
export const clearAllLocationsSuccess = createAction(
  '[Locations] Clear All Locations Success'
);
export const clearAllLocationsFailure = createAction(
  '[Locations] Clear All Locations Failure',
  props<{ error: string }>()
);

export const setFilterText = createAction(
  '[Locations] Set Filter Text',
  props<{ filterText: string }>()
);

