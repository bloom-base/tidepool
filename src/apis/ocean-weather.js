/**
 * Ocean Weather Data Integration
 * Fetches marine weather data (temperature, waves, currents)
 * Using Open-Meteo Marine Weather API: https://open-meteo.com/
 */

const axios = require('axios');

const OPEN_METEO_API = 'https://api.open-meteo.com/v1';

/**
 * Get ocean weather data for a specific location
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<object>} Ocean weather data
 */
async function getOceanWeather(latitude = 37.5, longitude = -122.4) {
  try {
    const response = await axios.get(`${OPEN_METEO_API}/marine`, {
      params: {
        latitude,
        longitude,
        hourly: 'wave_height,wave_period,wind_wave_height,wind_wave_direction',
        daily: 'wave_height_max,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        forecast_days: 7,
      },
      timeout: 10000,
    });

    if (!response.data) {
      return getDefaultOceanWeather(latitude, longitude);
    }

    const data = response.data;
    const hourly = data.hourly || {};
    const daily = data.daily || {};

    // Get the latest hourly data
    const latestWaveHeight =
      hourly.wave_height?.[0] || 0;
    const latestWavePeriod =
      hourly.wave_period?.[0] || 0;
    const latestWindWaveHeight =
      hourly.wind_wave_height?.[0] || 0;

    // Get today's max/min temperature
    const maxTemp = daily.temperature_2m_max?.[0] || 'N/A';
    const minTemp = daily.temperature_2m_min?.[0] || 'N/A';

    return {
      location: {
        latitude,
        longitude,
        name: getLocationName(latitude, longitude),
      },
      current: {
        waveHeight: parseFloat(latestWaveHeight).toFixed(2),
        waveHeightUnit: 'meters',
        wavePeriod: parseFloat(latestWavePeriod).toFixed(2),
        wavePeriodUnit: 'seconds',
        windWaveHeight: parseFloat(latestWindWaveHeight).toFixed(2),
        condition: getWaveCondition(latestWaveHeight),
      },
      daily: {
        maxTemp: typeof maxTemp === 'number' ? maxTemp.toFixed(1) : maxTemp,
        minTemp: typeof minTemp === 'number' ? minTemp.toFixed(1) : minTemp,
        tempUnit: '°C',
      },
      forecast: daily.wave_height_max
        ? daily.wave_height_max.slice(0, 7).map((height, idx) => ({
            day: idx,
            waveHeight: parseFloat(height).toFixed(2),
          }))
        : [],
      source: 'Open-Meteo Marine API',
      icon: '🌊',
    };
  } catch (error) {
    console.error('Error fetching ocean weather data:', error.message);
    return getDefaultOceanWeather(latitude, longitude);
  }
}

/**
 * Get water temperature data
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<object>} Water temperature data
 */
async function getWaterTemperature(latitude = 37.5, longitude = -122.4) {
  try {
    // Open-Meteo doesn't directly provide water temperature,
    // but we can use surface temperature as a proxy
    const response = await axios.get(`${OPEN_METEO_API}/weather`, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'auto',
      },
      timeout: 10000,
    });

    if (!response.data) {
      return getDefaultTemperatureData(latitude, longitude);
    }

    const data = response.data;
    const current = data.current || {};
    const daily = data.daily || {};

    return {
      location: {
        latitude,
        longitude,
        name: getLocationName(latitude, longitude),
      },
      current: {
        temperature: current.temperature_2m || 'N/A',
        unit: '°C',
        humidity: current.relative_humidity_2m || 'N/A',
        condition: getTemperatureCondition(current.temperature_2m),
      },
      daily: {
        maxTemp: daily.temperature_2m_max?.[0] || 'N/A',
        minTemp: daily.temperature_2m_min?.[0] || 'N/A',
        precipitation: daily.precipitation_sum?.[0] || 0,
      },
      source: 'Open-Meteo Weather API',
      icon: '🌡️',
    };
  } catch (error) {
    console.error('Error fetching temperature data:', error.message);
    return getDefaultTemperatureData(latitude, longitude);
  }
}

/**
 * Get multiple ocean locations' data
 * @returns {Promise<Array>} Array of ocean data from different locations
 */
async function getOceanDataMultipleLocations() {
  const locations = [
    { name: 'San Francisco Bay', lat: 37.5, lon: -122.4 },
    { name: 'Great Barrier Reef', lat: -16.2, lon: 145.8 },
    { name: 'Atlantic Mid-Atlantic Ridge', lat: 42.0, lon: -30.0 },
  ];

  try {
    const results = await Promise.all(
      locations.map(async (loc) => {
        const weather = await getOceanWeather(loc.lat, loc.lon);
        return {
          name: loc.name,
          ...weather,
        };
      })
    );

    return results;
  } catch (error) {
    console.error('Error fetching multi-location data:', error.message);
    return getDefaultMultiLocationData();
  }
}

/**
 * Get wave condition description
 */
function getWaveCondition(height) {
  if (height < 1) return 'Calm';
  if (height < 2) return 'Slight';
  if (height < 3) return 'Light';
  if (height < 4) return 'Moderate';
  if (height < 6) return 'Rough';
  if (height < 10) return 'Very Rough';
  return 'Phenomenal';
}

/**
 * Get temperature condition description
 */
function getTemperatureCondition(temp) {
  if (temp < 5) return 'Very Cold';
  if (temp < 10) return 'Cold';
  if (temp < 15) return 'Cool';
  if (temp < 20) return 'Mild';
  if (temp < 25) return 'Warm';
  return 'Very Warm';
}

/**
 * Get location name from coordinates
 */
function getLocationName(lat, lon) {
  // Simple mapping for demo purposes
  const regions = [
    { name: 'North Pacific', minLat: 30, maxLat: 60, minLon: 120, maxLon: -100 },
    { name: 'South Pacific', minLat: -60, maxLat: -10, minLon: 100, maxLon: 180 },
    { name: 'Atlantic Ocean', minLat: -60, maxLat: 60, minLon: -100, maxLon: 0 },
    { name: 'Indian Ocean', minLat: -60, maxLat: 30, minLon: 20, maxLon: 120 },
    { name: 'Arctic Ocean', minLat: 60, maxLat: 90, minLon: -180, maxLon: 180 },
  ];

  for (const region of regions) {
    if (lat >= region.minLat && lat <= region.maxLat && lon >= region.minLon && lon <= region.maxLon) {
      return region.name;
    }
  }

  return `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;
}

/**
 * Default ocean weather data fallback
 */
function getDefaultOceanWeather(latitude = 37.5, longitude = -122.4) {
  return {
    location: {
      latitude,
      longitude,
      name: getLocationName(latitude, longitude),
    },
    current: {
      waveHeight: '1.5',
      waveHeightUnit: 'meters',
      wavePeriod: '8.2',
      wavePeriodUnit: 'seconds',
      windWaveHeight: '0.9',
      condition: 'Light',
    },
    daily: {
      maxTemp: '15.2',
      minTemp: '12.8',
      tempUnit: '°C',
    },
    forecast: [
      { day: 0, waveHeight: '1.5' },
      { day: 1, waveHeight: '1.8' },
      { day: 2, waveHeight: '2.1' },
      { day: 3, waveHeight: '1.9' },
      { day: 4, waveHeight: '1.6' },
      { day: 5, waveHeight: '1.4' },
      { day: 6, waveHeight: '1.7' },
    ],
    source: 'Open-Meteo Marine API (Fallback)',
    icon: '🌊',
  };
}

/**
 * Default temperature data fallback
 */
function getDefaultTemperatureData(latitude = 37.5, longitude = -122.4) {
  return {
    location: {
      latitude,
      longitude,
      name: getLocationName(latitude, longitude),
    },
    current: {
      temperature: '13.5',
      unit: '°C',
      humidity: '72',
      condition: 'Cool',
    },
    daily: {
      maxTemp: '15.2',
      minTemp: '12.8',
      precipitation: 0,
    },
    source: 'Open-Meteo Weather API (Fallback)',
    icon: '🌡️',
  };
}

/**
 * Default multi-location data fallback
 */
function getDefaultMultiLocationData() {
  return [
    {
      name: 'San Francisco Bay',
      location: { latitude: 37.5, longitude: -122.4, name: 'San Francisco Bay' },
      current: {
        waveHeight: '1.5',
        waveHeightUnit: 'meters',
        wavePeriod: '8.2',
        wavePeriodUnit: 'seconds',
        windWaveHeight: '0.9',
        condition: 'Light',
      },
      icon: '🌊',
    },
    {
      name: 'Great Barrier Reef',
      location: { latitude: -16.2, longitude: 145.8, name: 'Great Barrier Reef' },
      current: {
        waveHeight: '1.2',
        waveHeightUnit: 'meters',
        wavePeriod: '7.5',
        wavePeriodUnit: 'seconds',
        windWaveHeight: '0.6',
        condition: 'Calm',
      },
      icon: '🌊',
    },
    {
      name: 'Atlantic Mid-Atlantic Ridge',
      location: { latitude: 42.0, longitude: -30.0, name: 'Atlantic Mid-Atlantic Ridge' },
      current: {
        waveHeight: '2.3',
        waveHeightUnit: 'meters',
        wavePeriod: '9.8',
        wavePeriodUnit: 'seconds',
        windWaveHeight: '1.4',
        condition: 'Moderate',
      },
      icon: '🌊',
    },
  ];
}

module.exports = {
  getOceanWeather,
  getWaterTemperature,
  getOceanDataMultipleLocations,
};
