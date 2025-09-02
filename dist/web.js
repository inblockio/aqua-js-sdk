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
} from "./chunk-WDQWI3F7.js";
import {
  registerNodeModuleShims
} from "./chunk-FE6H7ACM.js";
import "./chunk-ZTGEYJIV.js";
import "./chunk-D5ETXTMD.js";
import "./chunk-BZOC2F5B.js";
import {
  __require
} from "./chunk-ARVO53NY.js";

// src/web.ts
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
