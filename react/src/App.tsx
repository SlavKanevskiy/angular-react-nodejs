import { useEffect, useState, useCallback } from 'react'
import { MapContainer, Marker, Tooltip, TileLayer, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import type { Location } from '../../shared/interfaces'
import { useWebSocket } from './hooks/useWebSocket'
import { apiService } from './services/api.service'
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

function MapClickHandler() {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      apiService.createLocation({
        name: `Click location ${lat.toFixed(0)}, ${lng.toFixed(0)}`,
        lat: lat,
        lon: lng
      });
    }
  });
  return null;
}

function App() {
  const [locations, setLocations] = useState<Location[]>([]);

  const handleLocationDeleted = useCallback((id: number) => {
    setLocations(prev => id ? prev.filter(loc => loc.id !== id) : []);
  }, []);

  const handleLocationsCreated = useCallback((newLocations: Location[]) => {
    setLocations(prev => [...prev, ...newLocations]);
  }, []);

  useWebSocket({
    onLocationDeleted: handleLocationDeleted,
    onLocationsCreated: handleLocationsCreated
  });

  useEffect(() => {
    apiService.fetchLocations().then(setLocations);
  }, []);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      className="map"
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

export default App
