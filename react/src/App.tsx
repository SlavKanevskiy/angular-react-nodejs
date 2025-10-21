import { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, Marker, Tooltip, TileLayer, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { Location } from '../../shared/interfaces';
import { useWebSocket } from './hooks/useWebSocket';
import { apiService } from './services/api.service';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapClickHandler() {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      apiService.createLocation({
        name: `Created location ${lat.toFixed(0)}, ${lng.toFixed(0)}`,
        lat: lat,
        lon: lng
      });
    }
  });
  return null;
}

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  const handleLocationDeleted = useCallback((id: number) => {
    setLocations(prev => id ? prev.filter(loc => loc.id !== id) : []);
  }, []);

  const handleLocationsCreated = useCallback((newLocations: Location[]) => {
    setLocations(prev => [...prev, ...newLocations]);
  }, []);

  const handleLocationSelected = useCallback((id: number) => {
    const location = locations.find(loc => loc.id === id);
    if (location && mapRef.current) {
      mapRef.current.setView([location.lat, location.lon], 10);
    }
  }, [locations]);

  useWebSocket({
    onLocationDeleted: handleLocationDeleted,
    onLocationsCreated: handleLocationsCreated,
    onLocationSelected: handleLocationSelected
  });

  useEffect(() => {
    apiService.fetchLocations().then(setLocations);
  }, []);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      className="map"
      ref={mapRef}
    >
      <MapClickHandler />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />
      <MarkerClusterGroup>
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lon]}
            eventHandlers={{
              click: () => apiService.deleteLocation(location.id)
            }}
          >
            <Tooltip>
              <div>{location.name}</div>
              <div>Click to delete</div>
            </Tooltip>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default App;
