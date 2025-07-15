import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import NewsPanel from './components/NewsPanel';
import { newsAPI, apiUtils } from './api';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [search, setSearch] = useState('');

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
    } catch (error) {
      setError(error.message);
      setNewsData(null);
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
  };

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
          maxWidth: 1400,
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

      {/* Two-column layout: Globe left, News right */}
      <main style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '2em 0 0 0',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 32
      }}>
        {/* Globe Section */}
        <div style={{
          flex: 3,
          minWidth: 0,
          minHeight: 600,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(49,130,206,0.10)',
          background: '#fff',
          position: 'relative',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '40px' //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        }}>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            loading={loading}
          />
        </div>
        {/* News Panel Section */}
        <div style={{
          flex: 2,
          minWidth: 380,
          maxWidth: 520,
          minHeight: 600,
          borderRadius: 24,
          boxShadow: '0 4px 32px rgba(49,130,206,0.10)',
          background: 'rgba(255,255,255,0.98)',
          padding: '2em 1.5em',
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          position: 'relative',
          height: '70vh',
          overflowY: 'auto'
        }}>
          <NewsPanel
            newsData={newsData}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            onClose={resetSelection}
            selectedLocation={selectedLocation}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
