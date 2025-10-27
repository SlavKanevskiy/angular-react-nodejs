import { Injectable } from '@angular/core';
import { BROADCAST_EVENTS } from '../../../shared/actions';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(BROADCAST_EVENTS.LOCATION_SELECTED);
  }

  sendLocationSelected(id: number): void {
    console.log('Angular sending location selection:', id);
    this.channel.postMessage({ id });
  }
}
