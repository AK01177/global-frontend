import React from 'react';

function NewsPanel({ newsData, loading, error, onRetry, onClose, selectedLocation }) {
  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Header */}
      <div style={{
        fontWeight: 700,
        fontSize: '1.5em',
        color: '#22223b',
        marginBottom: 12,
        letterSpacing: '-1px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {newsData?.location || (selectedLocation ? 'Selected Location' : 'No Location Selected')}
        {onClose && (
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5em',
            color: '#a0aec0',
            cursor: 'pointer',
            marginLeft: 8
          }} title="Clear Selection">×</button>
        )}
      </div>
      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 48 }}>
          <span className="spinner" style={{ marginBottom: 18 }} />
          <span style={{ color: '#4a5568', fontSize: '1.1em' }}>Loading news...</span>
        </div>
      )}
      {/* Error State */}
      {error && !loading && (
        <div style={{ background: '#fff5f5', color: '#c53030', borderRadius: 10, padding: '1em', margin: '1em 0', fontWeight: 500 }}>
          <span style={{ fontWeight: 700, marginRight: 8 }}>❌</span>
          {error}
          {onRetry && (
            <button onClick={onRetry} style={{ marginLeft: 16, background: '#3182ce', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4em 1em', fontWeight: 600, cursor: 'pointer' }}>Retry</button>
          )}
        </div>
      )}
      {/* No News State */}
      {!loading && !error && (!newsData || !newsData.summary) && (
        <div style={{ color: '#4a5568', fontSize: '1.1em', marginTop: 32, textAlign: 'center' }}>
          {selectedLocation ? 'No news found for this location.' : 'Select a city on the map to see news.'}
        </div>
      )}
      {/* News Card */}
      {!loading && !error && newsData && newsData.summary && (
        <div style={{
          background: '#f7fafc',
          borderRadius: 18,
          boxShadow: '0 2px 12px rgba(49,130,206,0.07)',
          padding: '2em 1.5em',
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          {/* Headline */}
          <div style={{ fontWeight: 800, fontSize: '1.3em', color: '#22223b', marginBottom: 6 }}>
            News for {newsData.location}
          </div>
          {/* Meta info */}
          <div style={{ color: '#6b7280', fontSize: '0.98em', marginBottom: 10 }}>
            {newsData.articles_count} articles • {newsData.timestamp && formatDate(newsData.timestamp)}
          </div>
          {/* Summary */}
          <div style={{ color: '#22223b', fontSize: '1.08em', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: 10 }}>
            {newsData.summary}
          </div>
          {/* Read More Button */}
          {newsData.articles_count > 0 && (
            <a href="#" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block',
              background: '#3182ce',
              color: '#fff',
              borderRadius: 8,
              padding: '0.7em 1.5em',
              fontWeight: 600,
              fontSize: '1.05em',
              textDecoration: 'none',
              boxShadow: '0 1px 4px rgba(49,130,206,0.08)',
              marginTop: 8,
              transition: 'background 0.2s',
            }}>
              Read Full Article
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default NewsPanel; 
