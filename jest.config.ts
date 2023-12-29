import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  roots: ['<rootDir>'],
  setupFiles: ['dotenv/config'],
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;
