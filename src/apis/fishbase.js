/**
 * FishBase API Integration
 * Fetches fish species data from the FishBase API
 * https://ropensci.github.io/fishbaseapidocs/
 */

const axios = require('axios');

const FISHBASE_API = 'https://fishbase.ropensci.org/api';

/**
 * Get a sample of fish species from FishBase
 * @param {number} limit - Number of species to fetch (default 10)
 * @returns {Promise<Array>} Array of fish species
 */
async function getFishSpecies(limit = 10) {
  try {
    // Fetch fish species - we'll get a sample using the ecosystem endpoint
    const response = await axios.get(`${FISHBASE_API}/species`, {
      params: {
        limit: limit,
      },
      timeout: 10000,
    });

    if (!response.data || response.data.length === 0) {
      return getDefaultFishData();
    }

    // Format the response
    return response.data.map(fish => ({
      id: fish.SpecCode || fish.id,
      name: fish.Species || fish.name || 'Unknown Species',
      genus: fish.Genus || 'Unknown',
      family: fish.Family || 'Unknown',
      freshwater: fish.Freshwater || 0,
      marine: fish.Marine || 1,
      brackish: fish.Brackish || 0,
      icon: '🐟',
    }));
  } catch (error) {
    console.error('Error fetching FishBase data:', error.message);
    return getDefaultFishData();
  }
}

/**
 * Get fish species by family
 * @param {string} family - Fish family name
 * @returns {Promise<Array>} Array of fish species in that family
 */
async function getFishByFamily(family = 'Salmonidae') {
  try {
    const response = await axios.get(`${FISHBASE_API}/species`, {
      params: {
        Family: family,
        limit: 5,
      },
      timeout: 10000,
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(fish => ({
      id: fish.SpecCode || fish.id,
      name: fish.Species || fish.name,
      family: family,
      icon: '🐟',
    }));
  } catch (error) {
    console.error(`Error fetching ${family} data:`, error.message);
    return [];
  }
}

/**
 * Default fish data fallback
 */
function getDefaultFishData() {
  return [
    {
      id: 1,
      name: 'Tuna',
      genus: 'Thunnus',
      family: 'Scombridae',
      marine: 1,
      freshwater: 0,
      brackish: 0,
      icon: '🐟',
    },
    {
      id: 2,
      name: 'Salmon',
      genus: 'Salmo',
      family: 'Salmonidae',
      marine: 1,
      freshwater: 1,
      brackish: 1,
      icon: '🐟',
    },
    {
      id: 3,
      name: 'Cod',
      genus: 'Gadus',
      family: 'Gadidae',
      marine: 1,
      freshwater: 0,
      brackish: 0,
      icon: '🐟',
    },
    {
      id: 4,
      name: 'Anchovy',
      genus: 'Engraulis',
      family: 'Engraulidae',
      marine: 1,
      freshwater: 0,
      brackish: 0,
      icon: '🐟',
    },
    {
      id: 5,
      name: 'Herring',
      genus: 'Clupea',
      family: 'Clupeidae',
      marine: 1,
      freshwater: 0,
      brackish: 0,
      icon: '🐟',
    },
  ];
}

module.exports = {
  getFishSpecies,
  getFishByFamily,
};
