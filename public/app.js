/**
 * Tidepool Dashboard App
 * Fetches and displays marine data from various sources
 */

const API_BASE = 'http://localhost:3000/api';

// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const dashboardEl = document.getElementById('dashboard');
const fishContainerEl = document.getElementById('fish-container');
const statsContainerEl = document.getElementById('stats-container');
const biodiversityContainerEl = document.getElementById('biodiversity-container');
const weatherContainerEl = document.getElementById('weather-container');
const lastUpdateEl = document.getElementById('last-update');

/**
 * Initialize the dashboard
 */
async function initializeDashboard() {
  showLoading();
  clearError();

  try {
    // Fetch all dashboard data in parallel
    const response = await fetch(`${API_BASE}/dashboard`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch data');
    }

    // Render all sections
    const { data } = result;
    renderFishSpecies(data.fishSpecies);
    renderBiodiversityStats(data.stats);
    renderBiodiversityObservations(data.biodiversity);
    renderOceanWeather(data.oceanWeather);

    // Update last update time
    updateTimestamp();

    hideLoading();
    showDashboard();
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    showError(error.message);
    hideLoading();

    // Try to show fallback data
    showFallbackData();
  }
}

/**
 * Render fish species cards
 */
function renderFishSpecies(species) {
  if (!species || species.length === 0) {
    fishContainerEl.innerHTML = '<p class="text-muted">No fish species data available</p>';
    return;
  }

  fishContainerEl.innerHTML = species
    .map(
      (fish) => `
    <div class="card">
      <div class="card-icon">${fish.icon || '🐟'}</div>
      <h3 class="card-title">${fish.name || 'Unknown'}</h3>
      <p class="card-subtitle">${fish.genus || ''} - ${fish.family || ''}</p>
      <div class="card-content">
        <div class="card-tag">${fish.marine ? 'Marine' : ''}</div>
        <div class="card-tag">${fish.freshwater ? 'Freshwater' : ''}</div>
        <div class="card-tag">${fish.brackish ? 'Brackish' : ''}</div>
      </div>
    </div>
  `
    )
    .join('');
}

/**
 * Render biodiversity statistics
 */
function renderBiodiversityStats(stats) {
  if (!stats) {
    statsContainerEl.innerHTML = '';
    return;
  }

  const formatted = {
    totalSpecies: formatNumber(stats.totalSpecies),
    totalObservations: formatNumber(stats.totalObservations),
    totalDatasets: formatNumber(stats.totalDatasets),
  };

  statsContainerEl.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">🐙</div>
      <div class="stat-label">Total Marine Species</div>
      <div class="stat-value">${formatted.totalSpecies}</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📍</div>
      <div class="stat-label">Observations</div>
      <div class="stat-value">${formatted.totalObservations}</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-label">Datasets</div>
      <div class="stat-value">${formatted.totalDatasets}</div>
    </div>
  `;
}

/**
 * Render biodiversity observations
 */
function renderBiodiversityObservations(biodiversity) {
  if (!biodiversity || !biodiversity.observations || biodiversity.observations.length === 0) {
    biodiversityContainerEl.innerHTML = '<p class="text-muted">No biodiversity observations available</p>';
    return;
  }

  biodiversityContainerEl.innerHTML = biodiversity.observations
    .map(
      (obs) => `
    <div class="observation-item">
      <div class="observation-species">${obs.icon || '🌊'} ${obs.species}</div>
      ${obs.commonName ? `<div class="observation-meta"><strong>Common name:</strong> ${obs.commonName}</div>` : ''}
      ${obs.date ? `<div class="observation-meta"><strong>Date:</strong> ${formatDate(obs.date)}</div>` : ''}
      ${obs.latitude && obs.longitude ? `<div class="observation-location">📍 ${obs.latitude.toFixed(2)}, ${obs.longitude.toFixed(2)}</div>` : ''}
    </div>
  `
    )
    .join('');
}

/**
 * Render ocean weather data
 */
function renderOceanWeather(weatherData) {
  if (!weatherData || weatherData.length === 0) {
    weatherContainerEl.innerHTML = '<p class="text-muted">No weather data available</p>';
    return;
  }

  weatherContainerEl.innerHTML = weatherData
    .map(
      (weather) => `
    <div class="weather-card">
      <div class="weather-location">
        ${weather.icon || '🌊'} ${weather.name || weather.location?.name || 'Unknown Location'}
      </div>
      <div class="weather-metric">
        <span class="metric-label">Wave Height</span>
        <span class="metric-value">
          ${weather.current?.waveHeight || 'N/A'}
          <span class="metric-unit">${weather.current?.waveHeightUnit || 'm'}</span>
        </span>
      </div>
      <div class="weather-metric">
        <span class="metric-label">Wave Period</span>
        <span class="metric-value">
          ${weather.current?.wavePeriod || 'N/A'}
          <span class="metric-unit">${weather.current?.wavePeriodUnit || 's'}</span>
        </span>
      </div>
      <div class="weather-metric">
        <span class="metric-label">Wind Wave Height</span>
        <span class="metric-value">
          ${weather.current?.windWaveHeight || 'N/A'}
          <span class="metric-unit">m</span>
        </span>
      </div>
      ${weather.current?.condition ? `<div class="condition-badge">${weather.current.condition}</div>` : ''}
    </div>
  `
    )
    .join('');
}

/**
 * Show loading state
 */
function showLoading() {
  loadingEl.style.display = 'block';
  dashboardEl.classList.remove('visible');
}

/**
 * Hide loading state
 */
function hideLoading() {
  loadingEl.style.display = 'none';
}

/**
 * Show dashboard
 */
function showDashboard() {
  dashboardEl.classList.add('visible');
}

/**
 * Show error message
 */
function showError(message) {
  errorEl.textContent = `Error: ${message}`;
  errorEl.classList.add('visible');
}

/**
 * Clear error message
 */
function clearError() {
  errorEl.textContent = '';
  errorEl.classList.remove('visible');
}

/**
 * Show fallback data when API fails
 */
function showFallbackData() {
  // Create default data for demo purposes
  const defaultFish = [
    { name: 'Blue Whale', genus: 'Balaenoptera', family: 'Balaenopteridae', icon: '🐋', marine: 1 },
    { name: 'Clownfish', genus: 'Amphiprion', family: 'Pomacentridae', icon: '🐟', marine: 1 },
    { name: 'Sea Turtle', genus: 'Chelonia', family: 'Cheloniidae', icon: '🐢', marine: 1 },
  ];

  const defaultStats = {
    totalSpecies: 234567,
    totalObservations: 123456789,
    totalDatasets: 3251,
  };

  const defaultWeather = [
    {
      name: 'San Francisco Bay',
      icon: '🌊',
      current: {
        waveHeight: '1.5',
        waveHeightUnit: 'm',
        wavePeriod: '8.2',
        wavePeriodUnit: 's',
        windWaveHeight: '0.9',
        condition: 'Light',
      },
    },
    {
      name: 'Great Barrier Reef',
      icon: '🐠',
      current: {
        waveHeight: '1.2',
        waveHeightUnit: 'm',
        wavePeriod: '7.5',
        wavePeriodUnit: 's',
        windWaveHeight: '0.6',
        condition: 'Calm',
      },
    },
  ];

  renderFishSpecies(defaultFish);
  renderBiodiversityStats(defaultStats);
  renderOceanWeather(defaultWeather);
  showDashboard();
}

/**
 * Update last update timestamp
 */
function updateTimestamp() {
  const now = new Date();
  lastUpdateEl.textContent = now.toLocaleTimeString();
}

/**
 * Format large numbers with commas
 */
function formatNumber(num) {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format date string
 */
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Retry initialization with exponential backoff
 */
async function retryWithBackoff(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  // Add a small delay to ensure server is ready
  setTimeout(() => {
    initializeDashboard();
  }, 500);

  // Refresh data every 5 minutes
  setInterval(() => {
    console.log('Refreshing dashboard data...');
    initializeDashboard();
  }, 5 * 60 * 1000);
});

// Expose refresh function to global scope for manual refresh
window.refreshDashboard = initializeDashboard;
