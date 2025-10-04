import { Component, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { LocationCardComponent } from '../location-card/location-card.component';
import { ApiService } from '../../services/api.service';
import type { Location } from '../../../../shared/interfaces';

@Component({
  selector: 'app-locations-table',
  imports: [MatProgressSpinnerModule, MatListModule, MatButtonModule, LocationCardComponent],
  templateUrl: './locations-table.component.html',
  styleUrl: './locations-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsTableComponent implements OnInit {
  locations = signal<Location[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  showContent = computed(() => !this.loading() && !this.error());
  isEmpty = computed(() => this.showContent() && this.locations().length === 0);
  hasLocations = computed(() => this.showContent() && this.locations().length > 0);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService.getAll().subscribe({
      next: (data) => {
        this.locations.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load locations');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  onCardClick(location: Location): void {
    console.log('Location clicked:', location);
  }

  onDeleteLocation(id: number): void {
    this.apiService.delete(id).subscribe({
      next: () => {
        this.locations.update(locs => locs.filter(loc => loc.id !== id));
      },
      error: (err) => {
        console.error('Delete failed:', err);
      }
    });
  }

  generateLocations(count: number): void {
    this.apiService.generate(count).subscribe({
      next: () => {
        this.loadLocations();
      },
      error: (err) => {
        console.error('Generate failed:', err);
      }
    });
  }

  clearAll(): void {
    this.apiService.deleteAll().subscribe({
      next: () => {
        this.locations.set([]);
      },
      error: (err) => {
        console.error('Clear all failed:', err);
      }
    });
  }
}

