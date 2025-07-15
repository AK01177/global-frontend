import React from 'react'

function NewsModal({ isOpen, onClose, newsData, loading, error, onRetry }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header">
          {newsData?.location ? `News for ${newsData.location}` : 'News Summary'}
        </div>
        <div className="modal-body">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 120 }}>
              <span className="spinner" style={{ marginBottom: 12 }} />
              <span style={{ color: '#4a5568' }}>Loading news summary...</span>
            </div>
          ) : error ? (
            <div className="alert error">
              <span style={{ fontWeight: 700, marginRight: '0.5em' }}>❌</span>
              <span>{error}</span>
            </div>
          ) : newsData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
              <span style={{ fontSize: '0.95em', color: '#4a5568' }}>
                {newsData.articles_count} articles • {newsData.timestamp && (new Date(newsData.timestamp)).toLocaleString()}
              </span>
              <div style={{ background: '#f7fafc', padding: '1em', borderRadius: 8, maxHeight: 300, overflowY: 'auto' }}>
                <span style={{ whiteSpace: 'pre-line', fontSize: '1em' }}>{newsData.summary}</span>
              </div>
            </div>
          ) : (
            <span style={{ color: '#4a5568' }}>No news data available.</span>
          )}
        </div>
        <div className="modal-footer">
          {error && (
            <button className="button" style={{ background: '#c53030', marginRight: 8 }} onClick={onRetry} disabled={loading}>
              Retry
            </button>
          )}
          <button className="button outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default NewsModal
