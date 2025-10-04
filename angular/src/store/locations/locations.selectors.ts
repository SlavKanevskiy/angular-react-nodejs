import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { LocationsState } from './locations.reducer';

export const selectLocationsState = createFeatureSelector<LocationsState>('locations');

export const selectLocations = createSelector(
  selectLocationsState,
  (state) => state.locations
);

export const selectLoading = createSelector(
  selectLocationsState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectLocationsState,
  (state) => state.error
);

export const selectShowContent = createSelector(
  selectLoading,
  selectError,
  (loading, error) => !loading && !error
);

export const selectFilterText = createSelector(
  selectLocationsState,
  (state) => state.filterText
);

export const selectFilteredLocations = createSelector(
  selectLocations,
  selectFilterText,
  (locations, filterText) => {
    if (!filterText) return locations;
    const filter = filterText.toLowerCase();
    return locations.filter(loc =>
      loc.name.toLowerCase().includes(filter) ||
      loc.lat.toString().includes(filter) ||
      loc.lon.toString().includes(filter)
    );
  }
);

export const selectIsEmpty = createSelector(
  selectShowContent,
  selectFilteredLocations,
  (showContent, locations) => showContent && locations.length === 0
);

export const selectHasLocations = createSelector(
  selectShowContent,
  selectFilteredLocations,
  (showContent, locations) => showContent && locations.length > 0
);

