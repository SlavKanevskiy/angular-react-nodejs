import { LocationsGateway } from './locations.gateway';
import { WS_EVENTS } from '../../../shared/actions';

const mockLocation = { id: 1, name: 'Test', lat: 48.85, lon: 2.29 };

describe('LocationsGateway', () => {
  let gateway: LocationsGateway;
  const mockEmit = jest.fn();

  beforeEach(() => {
    gateway = new LocationsGateway();
    gateway.server = { emit: mockEmit } as unknown as typeof gateway.server;
    jest.clearAllMocks();
  });

  it('emitLocationsCreated emits correct event with locations array', () => {
    gateway.emitLocationsCreated([mockLocation]);
    expect(mockEmit).toHaveBeenCalledWith(WS_EVENTS.LOCATIONS_CREATED, [
      mockLocation,
    ]);
  });

  it('emitLocationDeleted emits correct event with empty object for deleteAll', () => {
    gateway.emitLocationDeleted({});
    expect(mockEmit).toHaveBeenCalledWith(WS_EVENTS.LOCATION_DELETED, {});
  });

  it('emitLocationDeleted emits correct event with id for deleteOne', () => {
    gateway.emitLocationDeleted({ id: 1 });
    expect(mockEmit).toHaveBeenCalledWith(WS_EVENTS.LOCATION_DELETED, {
      id: 1,
    });
  });
});
