import {
  registerNodeModuleShims
} from "./chunk-7H4SP45P.js";
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
} from "./chunk-V6EOJAZK.js";
import {
  __require
} from "./chunk-7QR3R5IB.js";

// src/web.ts
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
if (!isBrowser) {
  console.warn(
    'You are importing from "aqua-js-sdk/web" but this does not appear to be a browser environment. This may cause unexpected behavior. Consider importing from "aqua-js-sdk" instead.'
  );
}
if (isBrowser) {
  registerNodeModuleShims();
  if (typeof window !== "undefined") {
    if (!window.Buffer) {
      try {
        const bufferModule = __require("buffer/");
        window.Buffer = bufferModule.Buffer;
      } catch (e) {
        console.warn("Failed to load Buffer polyfill:", e);
      }
    }
  }
}
var web_default = Aquafier;
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
