/** @type {import('ts-jest').JestConfigWithTsJest} **/
// export default {
//   testEnvironment: "node",
//   transform: {
//     "^.+.tsx?$": ["ts-jest",{}],
//   },
//   preset: "ts-jest"
// };
export default {
  preset: "ts-jest/presets/default-esm", // Use ESM preset
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Fix Jest resolving ESM imports
  },
  extensionsToTreatAsEsm: [".ts"], // Tell Jest to treat .ts files as ESM
  transform: {},
  testTimeout: 10000,
};
