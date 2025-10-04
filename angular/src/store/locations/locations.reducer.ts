import { createReducer, on } from '@ngrx/store';
import type { Location } from '../../../../shared/interfaces';
import * as LocationsActions from './locations.actions';

export interface LocationsState {
  locations: Location[];
  loading: boolean;
  error: string | null;
  filterText: string;
}

export const initialState: LocationsState = {
  locations: [],
  loading: false,
  error: null,
  filterText: ''
};

export const locationsReducer = createReducer(
  initialState,

  on(LocationsActions.loadLocations, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(LocationsActions.loadLocationsSuccess, (state, { locations }) => ({
    ...state,
    locations,
    loading: false
  })),

  on(LocationsActions.loadLocationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(LocationsActions.deleteLocationSuccess, (state, { id }) => ({
    ...state,
    locations: state.locations.filter(loc => loc.id !== id)
  })),

  on(LocationsActions.clearAllLocationsSuccess, (state) => ({
    ...state,
    locations: []
  })),

  on(LocationsActions.setFilterText, (state, { filterText }) => ({
    ...state,
    filterText
  }))
);

