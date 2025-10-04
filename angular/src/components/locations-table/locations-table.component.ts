import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import type { Location } from '../../../../shared/interfaces';

@Component({
  selector: 'app-locations-table',
  imports: [],
  templateUrl: './locations-table.component.html',
  styleUrl: './locations-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsTableComponent implements OnInit {
  locations = signal<Location[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

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
}

