import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

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

function MapComponent({ onLocationSelect, selectedLocation, loading }) {
  const globeEl = useRef();
  const [hoverD, setHoverD] = useState();

  // Auto-focus on selected location
  useEffect(() => {
    if (selectedLocation && globeEl.current) {
      globeEl.current.pointOfView({ lat: selectedLocation.lat, lng: selectedLocation.lng, altitude: 1.5 }, 1000);
    }
  }, [selectedLocation]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Globe
        ref={globeEl}
        width={window.innerWidth}
        height={window.innerHeight - 120}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="#101020"
        pointsData={cities}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointAltitude={d => 0.02}
        pointRadius={d => (hoverD && hoverD.name === d.name ? 0.25 : 0.18)}
        pointColor={d => (hoverD && hoverD.name === d.name ? 'orange' : '#3182ce')}
        pointsTransitionDuration={400}
        onPointClick={d => onLocationSelect(d.lat, d.lng)}
        onPointHover={setHoverD}
        pointLabel={d => `<b>${d.name}</b><br/>${d.country}`}
        atmosphereColor="#3182ce"
        atmosphereAltitude={0.18}
      />
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
