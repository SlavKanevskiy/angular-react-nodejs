import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { apiUrl } from '../../shared/config'
import type { Location } from '../../shared/interfaces'
import { useWebSocket } from './hooks/useWebSocket'
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

  const handleLocationDeleted = (id: number) => {
    setLocations(prev => id ? prev.filter(loc => loc.id !== id) : []);
  };

  const handleLocationsCreated = (newLocations: Location[]) => {
    setLocations(prev => [...prev, ...newLocations]);
  };

  useWebSocket({
    onLocationDeleted: handleLocationDeleted,
    onLocationsCreated: handleLocationsCreated
  });

  useEffect(() => {
    console.log('useEffect');
    if (initialized.current) return;
    initialized.current = true;

    fetchLocations().then(setLocations);
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
