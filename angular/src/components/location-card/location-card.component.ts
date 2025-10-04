import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import type { Location } from '../../../../shared/interfaces';

@Component({
  selector: 'app-location-card',
  imports: [MatButtonModule, MatIconModule, MatRippleModule],
  templateUrl: './location-card.component.html',
  styleUrl: './location-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationCardComponent {
  location = input.required<Location>();
  height = input.required<number>();
  cardClick = output<Location>();
  delete = output<number>();

  onCardClick(): void {
    this.cardClick.emit(this.location());
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.location().id);
  }
}

