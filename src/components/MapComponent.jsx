import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { apiUtils } from '../api'

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom pin icon
const pinIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Loading pin icon
const loadingIcon = new L.DivIcon({
  html: '<div class="spinner"></div>',
  className: 'loading-pin',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function MapClickHandler({ onLocationSelect, loading }) {
  useMapEvents({
    click(e) {
      if (!loading) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

function MapComponent({ onLocationSelect, selectedLocation, loading }) {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)

  // Default map center and zoom
  const defaultCenter = [
    parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LAT) || 20.0,
    parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LNG) || 0.0
  ]
  const defaultZoom = parseInt(import.meta.env.VITE_DEFAULT_MAP_ZOOM) || 2

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
        },
        (error) => {
          setLocationError(error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        }
      )
    }
  }, [])

  const handleUseMyLocation = () => {
    if (userLocation) {
      onLocationSelect(userLocation[0], userLocation[1])
    }
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={userLocation || defaultCenter}
        zoom={userLocation ? 10 : defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} loading={loading} />
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={new L.Icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              shadowSize: [41, 41],
            })}
          >
            <Popup>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                <span style={{ fontWeight: 600, fontSize: '1em' }}>📍 Your Location</span>
                <span style={{ fontSize: '0.9em', color: '#4a5568' }}>
                  {apiUtils.formatCoordinates(userLocation[0], userLocation[1])}
                </span>
                <button
                  className="button"
                  style={{ fontSize: '0.9em', padding: '0.3em 0.7em' }}
                  onClick={handleUseMyLocation}
                  disabled={loading}
                >
                  Get News Here
                </button>
              </div>
            </Popup>
          </Marker>
        )}
        {/* Selected location marker */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={loading ? loadingIcon : pinIcon}
          >
            <Popup>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                <span style={{ fontWeight: 600, fontSize: '1em' }}>
                  {loading ? '🔄 Loading news...' : '📍 Selected Location'}
                </span>
                <span style={{ fontSize: '0.9em', color: '#4a5568' }}>
                  {apiUtils.formatCoordinates(selectedLocation.lat, selectedLocation.lng)}
                </span>
                {loading && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    <span className="spinner" style={{ width: 16, height: 16 }} />
                    <span style={{ fontSize: '0.85em', color: '#718096' }}>Fetching news...</span>
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {/* Floating controls */}
      <div style={{ position: 'absolute', top: 16, right: 16, background: '#fff', padding: '0.7em', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 1000, minWidth: 160 }}>
        <button
          className="button"
          style={{ width: '100%', marginBottom: '0.5em' }}
          onClick={handleUseMyLocation}
          disabled={!userLocation || loading}
        >
          Use My Location
        </button>
        {locationError && (
          <div className="alert error" style={{ fontSize: '0.9em', margin: 0 }}>
            <span style={{ fontWeight: 700, marginRight: '0.5em' }}>❌</span>
            <span>{locationError}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapComponent