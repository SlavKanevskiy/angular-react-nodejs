import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { apiUrl, wsUrl } from '../../shared/config'
import type { Location } from '../../shared/interfaces'
import { WS_EVENTS } from '../../shared/actions'
import { io } from 'socket.io-client'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const fetchLocations = async () => {
  const response = await fetch(apiUrl.locations);
  return response.json();
};

const deleteLocation = async (id: number) => {
  const response = await fetch(`${apiUrl.locations}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const initialized = useRef(false);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetchLocations().then(setLocations);

    socketRef.current = io(wsUrl);

    socketRef.current.on('connect', () => {
      console.log('React WebSocket connected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('React WebSocket connection error:', error);
    });

    socketRef.current.on('disconnect', () => {
      console.log('React WebSocket disconnected');
    });

    socketRef.current.on(WS_EVENTS.LOCATION_DELETED, (data: { id: number }) => {
      console.log('React', WS_EVENTS.LOCATION_DELETED);
      setLocations(prev => prev.filter(loc => loc.id !== data.id));
    });

    socketRef.current.on(WS_EVENTS.LOCATIONS_CREATED, (data: Location[]) => {
      console.log('React', WS_EVENTS.LOCATIONS_CREATED);
      setLocations(prev => [...prev, ...data]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[0, 0]}
        zoom={1}
        className="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {locations.map((location, index) => (
            <Marker key={index} position={[location.lat, location.lon]}>
              <Popup>
                <div>{location.name}</div>
                <button onClick={() => deleteLocation(location.id)}>delete</button>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default App
