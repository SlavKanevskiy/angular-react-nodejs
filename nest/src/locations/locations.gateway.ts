import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WS_EVENTS } from '../../../shared/actions';
import type { Location } from '../../../shared/interfaces';

@WebSocketGateway({ cors: { origin: '*' } })
export class LocationsGateway {
  @WebSocketServer()
  server: Server;

  emitLocationsCreated(locations: Location[]) {
    this.server.emit(WS_EVENTS.LOCATIONS_CREATED, locations);
  }

  emitLocationDeleted(payload: object | { id: number }) {
    this.server.emit(WS_EVENTS.LOCATION_DELETED, payload);
  }
}
