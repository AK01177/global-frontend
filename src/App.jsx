import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import NewsModal from './components/NewsModal';
import { newsAPI, apiUtils } from './api';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await newsAPI.healthCheck();
      setApiHealth(health);
    } catch (error) {
      setApiHealth({ status: 'unhealthy', message: 'Backend unavailable' });
    }
  };

  const handleLocationSelect = async (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPI.getNews(lat, lng);
      setNewsData(data);
      setIsModalOpen(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation.lat, selectedLocation.lng);
    }
  };

  const resetSelection = () => {
    setSelectedLocation(null);
    setNewsData(null);
    setError(null);
    setIsModalOpen(false);
  };

  // Search bar handler (for future globe search integration)
  const handleSearch = (e) => {
    setSearch(e.target.value);
    // TODO: Integrate with globe search/zoom
  };

  return (
    <div style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f7fafc 100%)' }}>
      {/* Modern Sticky Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        padding: '1.2em 0 1em 0',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2em'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#3182ce', letterSpacing: '-1px' }}>🌐 GlobeScope AI</span>
            <span style={{ fontSize: '1.1rem', color: '#4a5568', marginLeft: 16, fontWeight: 500 }}>
              Explore world news on a 3D globe
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <input
              type="text"
              placeholder="Search city or country..."
              value={search}
              onChange={handleSearch}
              style={{
                padding: '0.6em 1.2em',
                borderRadius: 24,
                border: '1.5px solid #cbd5e1',
                fontSize: '1.05em',
                outline: 'none',
                background: '#f7fafc',
                minWidth: 220,
                boxShadow: '0 1px 4px rgba(49,130,206,0.04)'
              }}
            />
            <span className={
              'badge' + (apiHealth?.status === 'healthy' ? '' : ' red')
            } style={{ fontSize: '1em', fontWeight: 600 }}>
              {apiHealth?.status === 'healthy' ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '2em 0 0 0',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          minHeight: 600,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(49,130,206,0.10)',
          background: '#fff',
          marginBottom: 32,
          position: 'relative'
        }}>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            loading={loading}
          />
        </div>
      </main>

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
  );
}

export default App;
