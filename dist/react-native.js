import {
  Aquafier,
  AquafierChainable,
  Err,
  ErrResult,
  LogType,
  LogTypeEmojis,
  None,
  NoneOption,
  Ok,
  OkResult,
  OrderRevisionInAquaTree,
  Some,
  SomeOption,
  checkFileHashAlreadyNotarized,
  checkInternetConnection,
  cliGreenify,
  cliRedify,
  cliYellowfy,
  createCredentials,
  createNewAquaTree,
  dict2Leaves,
  estimateWitnessGas,
  findFormKey,
  findNextRevisionHashByArrayofRevisions,
  formatMwTimestamp,
  getAquaTreeFileName,
  getAquaTreeFileObject,
  getChainIdFromNetwork,
  getEntropy,
  getFileHashSum,
  getFileNameCheckingPaths,
  getGenesisHash,
  getHashSum,
  getLatestVH,
  getMerkleRoot,
  getPreviousVerificationHash,
  getTimestamp,
  getWallet,
  isAquaTree,
  isErr,
  isNone,
  isOk,
  isSome,
  log_dim,
  log_red,
  log_success,
  log_yellow,
  maybeUpdateFileIndex,
  prepareNonce,
  printGraphData,
  printLogs,
  printlinkedGraphData,
  recoverWalletAddress,
  reorderAquaTreeRevisionsProperties,
  reorderRevisionsProperties,
  verifyMerkleIntegrity
} from "./chunk-ADRI5DRP.js";
import {
  __require,
  registerNodeModuleShims
} from "./chunk-R4XJC7WN.js";

// src/react-native.ts
var isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";
var isReactOrBrowser = typeof window !== "undefined" && typeof document !== "undefined";
if (!isReactNative && !isReactOrBrowser) {
  console.warn(
    'You are importing from "aqua-js-sdk/react-native" but this does not appear to be a React Native or browser environment. This may cause unexpected behavior. Consider importing from "aqua-js-sdk" instead.'
  );
}
if (isReactNative || isReactOrBrowser) {
  registerNodeModuleShims();
}
if (typeof global !== "undefined") {
  if (!global.stream) {
    global.stream = {};
  }
  if (!global.process) {
    global.process = {
      env: { NODE_ENV: "production" },
      version: "",
      versions: { node: "16.0.0" },
      nextTick: (callback, ...args) => setTimeout(() => callback(...args), 0),
      // Add minimal stdout/stderr implementations
      stdout: { write: console.log },
      stderr: { write: console.error },
      // Add empty argv array
      argv: [],
      // Add platform info
      platform: "react-native"
    };
  }
  if (typeof global.Buffer === "undefined") {
    try {
      const bufferModule = __require("buffer");
      global.Buffer = bufferModule.Buffer;
    } catch (e) {
      try {
        const bufferModule = __require("buffer/");
        global.Buffer = bufferModule.Buffer;
      } catch (e2) {
        console.warn("Failed to load Buffer polyfill:", e2);
        global.Buffer = class MinimalBuffer {
          static from(data) {
            return data;
          }
          static isBuffer() {
            return false;
          }
        };
      }
    }
  }
  if (!global.crypto) {
    global.crypto = {};
  }
  global.WebSocket = global.WebSocket || {};
}
var react_native_default = Aquafier;
export {
  AquafierChainable,
  Err,
  ErrResult,
  LogType,
  LogTypeEmojis,
  None,
  NoneOption,
  Ok,
  OkResult,
  OrderRevisionInAquaTree,
  Some,
  SomeOption,
  checkFileHashAlreadyNotarized,
  checkInternetConnection,
  cliGreenify,
  cliRedify,
  cliYellowfy,
  createCredentials,
  createNewAquaTree,
  react_native_default as default,
  dict2Leaves,
  estimateWitnessGas,
  findFormKey,
  findNextRevisionHashByArrayofRevisions,
  formatMwTimestamp,
  getAquaTreeFileName,
  getAquaTreeFileObject,
  getChainIdFromNetwork,
  getEntropy,
  getFileHashSum,
  getFileNameCheckingPaths,
  getGenesisHash,
  getHashSum,
  getLatestVH,
  getMerkleRoot,
  getPreviousVerificationHash,
  getTimestamp,
  getWallet,
  isAquaTree,
  isErr,
  isNone,
  isOk,
  isSome,
  log_dim,
  log_red,
  log_success,
  log_yellow,
  maybeUpdateFileIndex,
  prepareNonce,
  printGraphData,
  printLogs,
  printlinkedGraphData,
  recoverWalletAddress,
  reorderAquaTreeRevisionsProperties,
  reorderRevisionsProperties,
  verifyMerkleIntegrity
};
