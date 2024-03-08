module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t)s$': [
      'ts-jest',
      {
        tsconfig: {
          emitDecoratorMetadata: true,
        },
      },
    ],
  },
  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    './**/*.ts',
    '!./**/index.ts',
    '!main.ts',
    '!./**/*.module.ts',
    '!./**/*.dto.ts',
    '!./**/*.provider.ts',
    '!./**/*.entity.ts',
  ],
  testPathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: 'node',
};
