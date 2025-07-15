import React, { useState, useEffect, useRef } from 'react';
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef();

  useEffect(() => {
    checkApiHealth();
  }, []);

  useEffect(() => {
    if (search.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&limit=5`)
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSearch(suggestion.display_name);
    if (suggestion.lat && suggestion.lon) {
      handleLocationSelect(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f7fafc 100%)' }}>
      {/* Modern Sticky Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.75)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        padding: '1em 0',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2em',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#3182ce',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              🗺️ MapScope AI
            </span>
            <span style={{ fontSize: '1rem', color: '#4a5568' }}>
              Explore world news on an interactive map
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }} ref={searchRef}>
            <input
              type="text"
              placeholder="Search city or country..."
              value={search}
              onChange={handleSearch}
              onFocus={() => setShowSuggestions(true)}
              style={{
                padding: '0.55em 1.1em',
                borderRadius: '999px',
                border: '1px solid #d1d5db',
                fontSize: '1em',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                outline: 'none',
                minWidth: 220,
                transition: 'all 0.3s ease',
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '100%',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                boxShadow: '0 2px 12px rgba(49,130,206,0.07)',
                zIndex: 1000,
                maxHeight: 220,
                overflowY: 'auto',
              }}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    style={{
                      padding: '0.7em 1.1em',
                      cursor: 'pointer',
                      borderBottom: i !== suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                      color: '#222',
                      background: '#fff',
                      fontSize: '1em',
                    }}
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
            <span className={
              'badge' + (apiHealth?.status === 'healthy' ? '' : ' red')
            } style={{
              fontSize: '0.95em',
              fontWeight: 600,
              transition: 'color 0.3s ease'
            }}>
              {apiHealth?.status === 'healthy' ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Two-column layout: Map left, News right */}
      <main style={{
        maxWidth: 1600,
        margin: '0 auto',
        padding: '2em 1em',
        display: 'flex',
        gap: '2em',
        height: 'calc(100vh - 100px)',
      }}>
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
          justifyContent: 'center'
        }}>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            loading={loading}
          />
        </div>

        <div style={{
          flex: 2,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '1.5rem',
          boxShadow: '0 12px 48px rgba(0,0,0,0.08)',
          padding: '2rem 1.5rem',
          overflowY: 'auto',
          height: '100%',
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
