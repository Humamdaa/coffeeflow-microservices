module.exports = {
  roots: ['<rootDir>/apps'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: { '^.+[.]ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
  clearMocks: true,
};
