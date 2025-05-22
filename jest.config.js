module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'backend/**/*.js',
    '!**/node_modules/**'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  testTimeout: 30000
};
