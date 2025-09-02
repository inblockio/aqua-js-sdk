import {
  Aqua,
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
  SignConfigs,
  Some,
  SomeOption,
  WitnessConfigs,
  checkFileHashAlreadyNotarized,
  checkInternetConnection,
  cliGreenify,
  cliRedify,
  cliYellowfy,
  createAqua,
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
} from "./chunk-4WVGB4X3.js";
import {
  init_node_modules,
  registerNodeModuleShims
} from "./chunk-PX4VARQD.js";
import "./chunk-RSUMAFLK.js";
import "./chunk-72Y2DYY5.js";
import "./chunk-BZOC2F5B.js";
import {
  __require
} from "./chunk-OQJUWTZV.js";

// src/web.ts
init_node_modules();
registerNodeModuleShims();
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
if (!isBrowser) {
  console.warn(
    'You are importing from "aqua-js-sdk/web" but this does not appear to be a browser environment. This may cause unexpected behavior. Consider importing from "aqua-js-sdk" instead.'
  );
}
if (typeof window !== "undefined") {
  if (!window.Buffer) {
    try {
      const bufferModule = __require("buffer");
      window.Buffer = bufferModule.Buffer;
    } catch (e) {
      try {
        const bufferModule = __require("buffer/");
        window.Buffer = bufferModule.Buffer;
      } catch (e2) {
        console.warn("Failed to load Buffer polyfill:", e2);
        window.Buffer = class MinimalBuffer {
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
}
var web_default = Aquafier;
export {
  Aqua,
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
  SignConfigs,
  Some,
  SomeOption,
  WitnessConfigs,
  checkFileHashAlreadyNotarized,
  checkInternetConnection,
  cliGreenify,
  cliRedify,
  cliYellowfy,
  createAqua,
  createCredentials,
  createNewAquaTree,
  web_default as default,
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
