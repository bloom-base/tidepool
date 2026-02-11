/**
 * Tests for OBIS API integration
 */

const obisAPI = require('../apis/obis');

describe('OBIS API', () => {
  describe('getBiodiversityObservations', () => {
    it('should return biodiversity data with observations', async () => {
      const data = await obisAPI.getBiodiversityObservations({ limit: 5 });

      expect(data).toHaveProperty('observations');
      expect(data).toHaveProperty('total');
      expect(Array.isArray(data.observations)).toBe(true);
    });

    it('observations should have required properties', async () => {
      const data = await obisAPI.getBiodiversityObservations({ limit: 3 });

      data.observations.forEach((obs) => {
        expect(obs).toHaveProperty('species');
        expect(obs).toHaveProperty('icon');
      });
    });

    it('should handle query options', async () => {
      const data = await obisAPI.getBiodiversityObservations({ limit: 10, offset: 0 });

      expect(Array.isArray(data.observations)).toBe(true);
    });
  });

  describe('getSpeciesStats', () => {
    it('should return species statistics', async () => {
      const stats = await obisAPI.getSpeciesStats();

      expect(stats).toHaveProperty('totalSpecies');
      expect(stats).toHaveProperty('totalObservations');
      expect(stats).toHaveProperty('totalDatasets');
    });

    it('should have numeric values for statistics', async () => {
      const stats = await obisAPI.getSpeciesStats();

      expect(typeof stats.totalSpecies).toBe('number');
      expect(typeof stats.totalObservations).toBe('number');
      expect(typeof stats.totalDatasets).toBe('number');
    });
  });

  describe('getObservationsByArea', () => {
    it('should accept area parameters', async () => {
      const obs = await obisAPI.getObservationsByArea(-30, -10, -180, -150);

      expect(Array.isArray(obs)).toBe(true);
    });

    it('should return array even when API fails', async () => {
      const obs = await obisAPI.getObservationsByArea(0, 0, 0, 0);

      expect(Array.isArray(obs)).toBe(true);
    });
  });
});
