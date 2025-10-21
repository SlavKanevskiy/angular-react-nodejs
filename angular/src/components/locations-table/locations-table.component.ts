import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { I18nPluralPipe } from '@angular/common';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { LocationCardComponent } from '../location-card/location-card.component';
import type { Location } from '../../../../shared/interfaces';
import * as LocationsActions from '../../store/locations/locations.actions';
import * as LocationsSelectors from '../../store/locations/locations.selectors';

@Component({
  selector: 'app-locations-table',
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    I18nPluralPipe,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    LocationCardComponent
  ],
  templateUrl: './locations-table.component.html',
  styleUrl: './locations-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsTableComponent implements OnInit {
  private store = inject(Store);

  filteredLocations = this.store.selectSignal(LocationsSelectors.selectFilteredLocations);
  loading = this.store.selectSignal(LocationsSelectors.selectLoading);
  error = this.store.selectSignal(LocationsSelectors.selectError);
  filterText = this.store.selectSignal(LocationsSelectors.selectFilterText);
  isEmpty = this.store.selectSignal(LocationsSelectors.selectIsEmpty);
  hasLocations = this.store.selectSignal(LocationsSelectors.selectHasLocations);

  ngOnInit(): void {
    this.store.dispatch(LocationsActions.loadLocations());
  }

  onFilterChange(filterText: string): void {
    this.store.dispatch(LocationsActions.setFilterText({ filterText }));
  }

  onCardClick(location: Location): void {
    this.store.dispatch(LocationsActions.selectLocation({ id: location.id }));
  }

  onDeleteLocation(id: number): void {
    this.store.dispatch(LocationsActions.deleteLocation({ id }));
  }

  generateLocations(count: number): void {
    this.store.dispatch(LocationsActions.generateLocations({ count }));
  }

  clearAll(): void {
    this.store.dispatch(LocationsActions.clearAllLocations());
  }
}
