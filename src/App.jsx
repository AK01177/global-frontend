import React, { useState, useEffect } from 'react'
import MapComponent from './components/MapComponent'
import NewsModal from './components/NewsModal'
import { newsAPI, apiUtils } from './api'

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiHealth, setApiHealth] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      const health = await newsAPI.healthCheck()
      setApiHealth(health)
    } catch (error) {
      setApiHealth({ status: 'unhealthy', message: 'Backend unavailable' })
    }
  }

  const handleLocationSelect = async (lat, lng) => {
    if (!apiUtils.isValidCoordinates(lat, lng)) {
      setError('Please select a valid location on the map.')
      return
    }
    setSelectedLocation({ lat, lng })
    setLoading(true)
    setError(null)
    try {
      const data = await newsAPI.getNews(lat, lng)
      setNewsData(data)
      setIsModalOpen(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation.lat, selectedLocation.lng)
    }
  }

  const resetSelection = () => {
    setSelectedLocation(null)
    setNewsData(null)
    setError(null)
    setIsModalOpen(false)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="flex-col" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="flex-col">
              <span style={{ fontSize: '2rem', fontWeight: 700, color: '#3182ce' }}>🌍 GlobeScope AI</span>
              <span style={{ fontSize: '1rem', color: '#4a5568', marginTop: '0.2em' }}>
                Drop a pin anywhere to get AI-powered news summaries
              </span>
            </div>
            <div className="flex-row">
              <span className={
                'badge' + (apiHealth?.status === 'healthy' ? '' : ' red')
              }>
                {apiHealth?.status === 'healthy' ? '🟢 Online' : '🔴 Offline'}
              </span>
              {loading && (
                <span style={{ marginLeft: '1em' }}>
                  <span className="spinner" />
                  <span style={{ fontSize: '1em', color: '#4a5568', marginLeft: '0.5em' }}>
                    Loading news...
                  </span>
                </span>
              )}
            </div>
          </div>
          {/* Instructions */}
          <div className="alert" style={{ marginTop: '1em' }}>
            <span style={{ fontWeight: 700, marginRight: '0.5em' }}>ℹ️</span>
            <span>
              <span style={{ fontWeight: 600 }}>How to use: </span>
              Click anywhere on the map to drop a pin and get real-time news for that location
            </span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ position: 'relative', height: 'calc(100vh - 120px)' }}>
        <MapComponent
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          loading={loading}
        />
        {/* Floating Action Panel */}
        {selectedLocation && (
          <div className="floating-panel">
            <div className="flex-col">
              <span className="selected-location" style={{ fontWeight: 600 }}>Selected Location</span>
              <span className="selected-location">
                {apiUtils.formatCoordinates(selectedLocation.lat, selectedLocation.lng)}
              </span>
              <div style={{ margin: '0.5em 0' }}>
                <button
                  className="button"
                  onClick={() => handleLocationSelect(selectedLocation.lat, selectedLocation.lng)}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" style={{ verticalAlign: 'middle' }} /> : 'Get News'}
                </button>
                <button
                  className="button outline"
                  onClick={resetSelection}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
              {error && (
                <div className="alert error">
                  <span style={{ fontWeight: 700, marginRight: '0.5em' }}>❌</span>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* News Modal */}
      <NewsModal
        isOpen={isModalOpen}
        onClose={resetSelection}
        newsData={newsData}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  )
}

export default App