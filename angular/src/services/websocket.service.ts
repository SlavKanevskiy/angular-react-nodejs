import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import type { Location } from '../../../shared/interfaces';
import { WS_EVENTS } from '../../../shared/actions';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private socket?: Socket;

  connect(url: string): Observable<{ type: string; data: unknown }> {
    return new Observable((observer) => {
      this.socket = io(url);

      this.socket.on('connect', () => {
        console.log('Angular WebSocket connected:', this.socket?.id);
      });

      this.socket.on(WS_EVENTS.LOCATIONS_CREATED, (locations: Location[]) => {
        console.log('Angular', WS_EVENTS.LOCATIONS_CREATED);
        observer.next({ type: WS_EVENTS.LOCATIONS_CREATED, data: locations });
      });

      this.socket.on(WS_EVENTS.LOCATION_DELETED, (data: { id?: number }) => {
        console.log('Angular', WS_EVENTS.LOCATION_DELETED);
        observer.next({ type: WS_EVENTS.LOCATION_DELETED, data });
      });

      this.socket.on('disconnect', () => {
        console.log('Angular WebSocket disconnected');
      });

      return () => {
        this.socket?.disconnect();
      };
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}

