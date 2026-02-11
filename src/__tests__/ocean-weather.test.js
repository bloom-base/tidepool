/**
 * Tests for Ocean Weather API integration
 */

const oceanWeatherAPI = require('../apis/ocean-weather');

describe('Ocean Weather API', () => {
  describe('getOceanWeather', () => {
    it('should return ocean weather data', async () => {
      const data = await oceanWeatherAPI.getOceanWeather(37.5, -122.4);

      expect(data).toHaveProperty('location');
      expect(data).toHaveProperty('current');
      expect(data).toHaveProperty('daily');
      expect(data).toHaveProperty('source');
    });

    it('current weather should have required properties', async () => {
      const data = await oceanWeatherAPI.getOceanWeather(37.5, -122.4);

      expect(data.current).toHaveProperty('waveHeight');
      expect(data.current).toHaveProperty('waveHeightUnit');
      expect(data.current).toHaveProperty('condition');
    });

    it('location should contain coordinates', async () => {
      const data = await oceanWeatherAPI.getOceanWeather(40.7, -74.0);

      expect(data.location.latitude).toBe(40.7);
      expect(data.location.longitude).toBe(-74.0);
    });

    it('should return default data when API fails', async () => {
      const data = await oceanWeatherAPI.getOceanWeather(0, 0);

      expect(data).toHaveProperty('current');
      expect(data.current).toHaveProperty('waveHeight');
    });
  });

  describe('getWaterTemperature', () => {
    it('should return temperature data', async () => {
      const data = await oceanWeatherAPI.getWaterTemperature(37.5, -122.4);

      expect(data).toHaveProperty('location');
      expect(data).toHaveProperty('current');
      expect(data).toHaveProperty('daily');
    });

    it('current temperature should have required properties', async () => {
      const data = await oceanWeatherAPI.getWaterTemperature(37.5, -122.4);

      expect(data.current).toHaveProperty('temperature');
      expect(data.current).toHaveProperty('unit');
      expect(data.current).toHaveProperty('condition');
    });
  });

  describe('getOceanDataMultipleLocations', () => {
    it('should return data for multiple locations', async () => {
      const data = await oceanWeatherAPI.getOceanDataMultipleLocations();

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it('each location should have required data', async () => {
      const data = await oceanWeatherAPI.getOceanDataMultipleLocations();

      data.forEach((location) => {
        expect(location).toHaveProperty('name');
        expect(location).toHaveProperty('current');
        expect(location.current).toHaveProperty('waveHeight');
      });
    });
  });
});
