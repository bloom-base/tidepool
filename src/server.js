/**
 * Tidepool Marine Data Dashboard Server
 * Aggregates data from multiple marine data sources
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fishbaseAPI = require('./apis/fishbase');
const obisAPI = require('./apis/obis');
const oceanWeatherAPI = require('./apis/ocean-weather');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Tidepool Marine Data Dashboard is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Fish species endpoint
 */
app.get('/api/fish-species', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await fishbaseAPI.getFishSpecies(limit);
    res.json({
      success: true,
      data,
      source: 'FishBase API',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Fish by family endpoint
 */
app.get('/api/fish-species/:family', async (req, res) => {
  try {
    const family = req.params.family;
    const data = await fishbaseAPI.getFishByFamily(family);
    res.json({
      success: true,
      family,
      data,
      source: 'FishBase API',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Biodiversity observations endpoint
 */
app.get('/api/biodiversity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const data = await obisAPI.getBiodiversityObservations({ limit });
    res.json({
      success: true,
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Species statistics endpoint
 */
app.get('/api/species-stats', async (req, res) => {
  try {
    const data = await obisAPI.getSpeciesStats();
    res.json({
      success: true,
      data,
      source: 'OBIS API',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Ocean weather endpoint
 */
app.get('/api/ocean-weather', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 37.5;
    const lon = parseFloat(req.query.lon) || -122.4;
    const data = await oceanWeatherAPI.getOceanWeather(lat, lon);
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Water temperature endpoint
 */
app.get('/api/water-temperature', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 37.5;
    const lon = parseFloat(req.query.lon) || -122.4;
    const data = await oceanWeatherAPI.getWaterTemperature(lat, lon);
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Multi-location ocean data endpoint
 */
app.get('/api/ocean-data-locations', async (req, res) => {
  try {
    const data = await oceanWeatherAPI.getOceanDataMultipleLocations();
    res.json({
      success: true,
      data,
      source: 'Open-Meteo Marine API',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Dashboard data endpoint - combines all data sources
 */
app.get('/api/dashboard', async (req, res) => {
  try {
    const [fishSpecies, biodiversity, oceanWeather, stats] = await Promise.all([
      fishbaseAPI.getFishSpecies(5),
      obisAPI.getBiodiversityObservations({ limit: 5 }),
      oceanWeatherAPI.getOceanDataMultipleLocations(),
      obisAPI.getSpeciesStats(),
    ]);

    res.json({
      success: true,
      data: {
        fishSpecies,
        biodiversity,
        oceanWeather,
        stats,
      },
      sources: ['FishBase API', 'OBIS API', 'Open-Meteo Marine API'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    path: req.path,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌊 Tidepool Marine Data Dashboard`);
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET /api/health - Health check`);
  console.log(`  GET /api/fish-species - Get fish species`);
  console.log(`  GET /api/biodiversity - Get biodiversity observations`);
  console.log(`  GET /api/species-stats - Get species statistics`);
  console.log(`  GET /api/ocean-weather - Get ocean weather`);
  console.log(`  GET /api/water-temperature - Get water temperature`);
  console.log(`  GET /api/ocean-data-locations - Get multi-location ocean data`);
  console.log(`  GET /api/dashboard - Get combined dashboard data\n`);
});

module.exports = app;
