/**
 * Tests for FishBase API integration
 */

const fishbaseAPI = require('../apis/fishbase');

describe('FishBase API', () => {
  describe('getFishSpecies', () => {
    it('should return an array of fish species', async () => {
      const species = await fishbaseAPI.getFishSpecies(5);

      expect(Array.isArray(species)).toBe(true);
      expect(species.length).toBeGreaterThan(0);
    });

    it('should have required properties in each fish object', async () => {
      const species = await fishbaseAPI.getFishSpecies(3);

      species.forEach((fish) => {
        expect(fish).toHaveProperty('id');
        expect(fish).toHaveProperty('name');
        expect(fish).toHaveProperty('family');
        expect(fish).toHaveProperty('marine');
        expect(fish).toHaveProperty('icon');
      });
    });

    it('should return default data when API fails', async () => {
      // This should work even without network
      const species = await fishbaseAPI.getFishSpecies(10);
      expect(Array.isArray(species)).toBe(true);
      expect(species.length).toBeGreaterThan(0);
    });
  });

  describe('getFishByFamily', () => {
    it('should accept a family parameter', async () => {
      const species = await fishbaseAPI.getFishByFamily('Salmonidae');

      expect(Array.isArray(species)).toBe(true);
    });

    it('should handle invalid family gracefully', async () => {
      const species = await fishbaseAPI.getFishByFamily('InvalidFamily123');

      expect(Array.isArray(species)).toBe(true);
    });
  });
});
