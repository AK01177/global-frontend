import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`Server error ${status}:`, data);
      
      switch (status) {
        case 404:
          throw new Error('No news found for this location');
        case 500:
          throw new Error('Server error. Please try again later.');
        case 429:
          throw new Error('Too many requests. Please wait a moment.');
        default:
          throw new Error(data?.error || 'An unexpected error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.request);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// API functions
export const newsAPI = {
  /**
   * Get news for a specific location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} News data
   */
  async getNews(lat, lng) {
    try {
      const response = await api.post('/news', {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  /**
   * Get request logs
   * @returns {Promise<Array>} Array of log entries
   */
  async getLogs() {
    try {
      const response = await api.get('/logs');
      return response.data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },

  /**
   * Health check
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  },
};

// Utility functions
export const apiUtils = {
  /**
   * Check if coordinates are valid
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} Whether coordinates are valid
   */
  isValidCoordinates(lat, lng) {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  },

  /**
   * Format coordinates for display
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} Formatted coordinates
   */
  formatCoordinates(lat, lng) {
    const formatDegree = (degree, isLatitude) => {
      const abs = Math.abs(degree);
      const direction = isLatitude
        ? (degree >= 0 ? 'N' : 'S')
        : (degree >= 0 ? 'E' : 'W');
      return `${abs.toFixed(4)}°${direction}`;
    };

    return `${formatDegree(lat, true)}, ${formatDegree(lng, false)}`;
  },

  /**
   * Create a debounced function
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Format timestamp for display
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Formatted timestamp
   */
  formatTimestamp(timestamp) {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  },

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  truncateText(text, length = 100) {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
  },
};

export default api;