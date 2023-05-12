module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: {
          types: ['node', 'jest'],
        },
      },
    ],
  },

  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: ['index.ts'],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};
