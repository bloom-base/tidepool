module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/__tests__/**'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
};
