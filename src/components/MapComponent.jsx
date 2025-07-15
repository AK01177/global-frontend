import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Example city data (can be expanded or loaded from a file/API)
const cities = [
  { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'United States' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China' },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, country: 'India' },
  { name: 'Tokyo', lat: 35.6895, lng: 139.6917, country: 'Japan' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173, country: 'Russia' },
  { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, country: 'Brazil' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' }
];

// Fix default icon issue in leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

function MapAutoCenter({ selectedLocation }) {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 4, { animate: true });
    }
  }, [selectedLocation, map]);
  return null;
}

function MapComponent({ onLocationSelect, selectedLocation, loading }) {
  // Default center: somewhere in Eurasia
  const defaultCenter = [30, 20];
  const defaultZoom = 2;

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedLocation && <MapAutoCenter selectedLocation={selectedLocation} />}
        {cities.map(city => (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            eventHandlers={{
              click: () => onLocationSelect(city.lat, city.lng)
            }}
          >
            <Popup>
              <b>{city.name}</b><br/>{city.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Optionally, show selected city info */}
      {selectedLocation && (
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          padding: '1em 1.5em',
          zIndex: 10,
          minWidth: 220
        }}>
          <div style={{ fontWeight: 700, fontSize: '1.2em', color: '#3182ce' }}>
            {cities.find(c => c.lat === selectedLocation.lat && c.lng === selectedLocation.lng)?.name || 'Selected Location'}
          </div>
          <div style={{ color: '#4a5568', fontSize: '1em', marginTop: 4 }}>
            {cities.find(c => c.lat === selectedLocation.lat && c.lng === selectedLocation.lng)?.country || ''}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapComponent;
