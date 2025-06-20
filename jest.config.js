/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest/presets/default-esm", // Use ESM preset
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\.{1,2}/.*)\.js$": "$1", // Fix Jest resolving ESM imports
  },
  extensionsToTreatAsEsm: [".ts"], // Tell Jest to treat .ts files as ESM
  transform: {
    "^.+\.(ts|tsx)$": ["ts-jest", {
      useESM: true,
    }]
  },
  transformIgnorePatterns: [
    // Transform all ESM modules in node_modules
    "node_modules/.+\.js$"
  ],
  testTimeout: 30000,
  verbose: true, // Show test names during execution
};
