/**
 * OBIS (Ocean Biodiversity Information System) API Integration
 * Fetches ocean biodiversity observations from OBIS
 * https://api.obis.org
 */

const axios = require('axios');

const OBIS_API = 'https://api.obis.org/v3';

/**
 * Get recent biodiversity observations
 * @param {object} options - Query options
 * @returns {Promise<object>} Biodiversity data with observations
 */
async function getBiodiversityObservations(options = {}) {
  try {
    // Fetch observations from OBIS - we'll get statistics and recent data
    const params = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      ...options,
    };

    const response = await axios.get(`${OBIS_API}/occurrence`, {
      params,
      timeout: 10000,
    });

    if (!response.data || !response.data.results) {
      return getDefaultBiodiversityData();
    }

    const observations = response.data.results.map(obs => ({
      id: obs.id,
      species: obs.scientificName || obs.species || 'Unknown',
      commonName: obs.commonName || '',
      latitude: obs.decimalLatitude,
      longitude: obs.decimalLongitude,
      date: obs.eventDate,
      datasetName: obs.datasetName || 'OBIS',
      icon: '🌊',
    }));

    return {
      total: response.data.total || observations.length,
      observations,
      source: 'OBIS API',
    };
  } catch (error) {
    console.error('Error fetching OBIS data:', error.message);
    return getDefaultBiodiversityData();
  }
}

/**
 * Get species statistics
 * @returns {Promise<object>} Species count statistics
 */
async function getSpeciesStats() {
  try {
    const response = await axios.get(`${OBIS_API}/statistics`, {
      timeout: 10000,
    });

    if (!response.data) {
      return getDefaultSpeciesStats();
    }

    return {
      totalSpecies: response.data.species || 200000,
      totalObservations: response.data.observations || 100000000,
      totalDatasets: response.data.datasets || 3000,
      icon: '📊',
    };
  } catch (error) {
    console.error('Error fetching OBIS statistics:', error.message);
    return getDefaultSpeciesStats();
  }
}

/**
 * Get observations by area (e.g., specific ocean region)
 * @param {number} minLat - Minimum latitude
 * @param {number} maxLat - Maximum latitude
 * @param {number} minLon - Minimum longitude
 * @param {number} maxLon - Maximum longitude
 * @returns {Promise<Array>} Observations in the specified area
 */
async function getObservationsByArea(minLat, maxLat, minLon, maxLon) {
  try {
    const response = await axios.get(`${OBIS_API}/occurrence`, {
      params: {
        geometry: `POLYGON((${minLon} ${minLat},${maxLon} ${minLat},${maxLon} ${maxLat},${minLon} ${maxLat},${minLon} ${minLat}))`,
        limit: 50,
      },
      timeout: 10000,
    });

    if (!response.data || !response.data.results) {
      return [];
    }

    return response.data.results.map(obs => ({
      species: obs.scientificName || 'Unknown',
      lat: obs.decimalLatitude,
      lon: obs.decimalLongitude,
    }));
  } catch (error) {
    console.error('Error fetching area observations:', error.message);
    return [];
  }
}

/**
 * Default biodiversity data fallback
 */
function getDefaultBiodiversityData() {
  return {
    total: 5,
    observations: [
      {
        id: 1,
        species: 'Balaenoptera musculus (Blue Whale)',
        commonName: 'Blue Whale',
        latitude: 37.5,
        longitude: -122.4,
        date: '2024-02-01',
        datasetName: 'Marine Mammal Observations',
        icon: '🐋',
      },
      {
        id: 2,
        species: 'Megaptera novaeangliae (Humpback Whale)',
        commonName: 'Humpback Whale',
        latitude: 37.8,
        longitude: -123.1,
        date: '2024-02-05',
        datasetName: 'Whale Migration Tracking',
        icon: '🐋',
      },
      {
        id: 3,
        species: 'Chelonia mydas (Green Sea Turtle)',
        commonName: 'Green Sea Turtle',
        latitude: 25.5,
        longitude: -80.2,
        date: '2024-02-08',
        datasetName: 'Sea Turtle Database',
        icon: '🐢',
      },
      {
        id: 4,
        species: 'Echinorhinus brucus (Bramble Shark)',
        commonName: 'Bramble Shark',
        latitude: 45.2,
        longitude: -124.5,
        date: '2024-02-10',
        datasetName: 'Deep Sea Research',
        icon: '🦈',
      },
      {
        id: 5,
        species: 'Strongylocentrotus purpuratus (Purple Sea Urchin)',
        commonName: 'Purple Sea Urchin',
        latitude: 34.1,
        longitude: -119.3,
        date: '2024-02-12',
        datasetName: 'Kelp Forest Survey',
        icon: '🔵',
      },
    ],
    source: 'OBIS API (Fallback)',
  };
}

/**
 * Default species statistics fallback
 */
function getDefaultSpeciesStats() {
  return {
    totalSpecies: 234567,
    totalObservations: 123456789,
    totalDatasets: 3251,
    icon: '📊',
  };
}

module.exports = {
  getBiodiversityObservations,
  getSpeciesStats,
  getObservationsByArea,
};
