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
  node_modules_exports
} from "./chunk-PX4VARQD.js";
import "./chunk-RSUMAFLK.js";
import "./chunk-72Y2DYY5.js";
import "./chunk-BZOC2F5B.js";
import {
  __require,
  __toCommonJS
} from "./chunk-OQJUWTZV.js";

// src/react-native.ts
import "crypto-browserify";
try {
  __require("react-native-get-random-values");
} catch (e) {
  console.warn("react-native-get-random-values not available, using fallback");
}
if (typeof global !== "undefined" && typeof global.Buffer === "undefined") {
  try {
    const { Buffer } = __require("buffer");
    global.Buffer = Buffer;
  } catch (e) {
    console.warn("Buffer polyfill failed, providing minimal implementation");
    global.Buffer = class MinimalBuffer {
      static from(data) {
        return data;
      }
      static isBuffer(_obj) {
        return false;
      }
      static alloc(size) {
        return new Uint8Array(size);
      }
    };
  }
}
if (typeof global !== "undefined" && typeof global.process === "undefined") {
  global.process = {
    env: { NODE_ENV: process?.env?.NODE_ENV || "production" },
    version: "16.0.0",
    versions: { node: "16.0.0" },
    nextTick: (callback, ...args) => {
      setTimeout(() => {
        try {
          callback(...args);
        } catch (error) {
          console.error("Process.nextTick callback error:", error);
        }
      }, 0);
    },
    stdout: {
      write: (data) => console.log(data),
      on: () => {
      },
      once: () => {
      },
      emit: () => {
      }
    },
    stderr: {
      write: (data) => console.error(data),
      on: () => {
      },
      once: () => {
      },
      emit: () => {
      }
    },
    argv: [],
    platform: "react-native",
    browser: true,
    cwd: () => "/",
    chdir: () => {
    },
    exit: () => {
    },
    kill: () => {
    },
    pid: 1,
    ppid: 0,
    title: "react-native",
    arch: "arm64",
    uptime: () => Date.now() / 1e3,
    hrtime: () => [Math.floor(Date.now() / 1e3), Date.now() % 1e3 * 1e6],
    memoryUsage: () => ({ rss: 0, heapTotal: 0, heapUsed: 0, external: 0 })
  };
}
if (typeof global !== "undefined" && typeof global.crypto === "undefined") {
  let cryptoImpl = {};
  try {
    const expoCrypto = __require("expo-crypto");
    cryptoImpl = {
      getRandomValues: (array) => {
        try {
          const randomBytes = expoCrypto.getRandomBytes(array.length);
          for (let i = 0; i < array.length; i++) {
            array[i] = randomBytes[i];
          }
          return array;
        } catch (e) {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        }
      },
      randomUUID: () => {
        try {
          return expoCrypto.randomUUID();
        } catch (e) {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : r & 3 | 8;
            return v.toString(16);
          });
        }
      },
      subtle: {
        digest: async (_algorithm, data) => {
          try {
            return await expoCrypto.digest(expoCrypto.CryptoDigestAlgorithm.SHA256, data);
          } catch (e) {
            throw new Error("Crypto.subtle.digest not available");
          }
        }
      }
    };
  } catch (e) {
    cryptoImpl = {
      getRandomValues: (array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
      randomUUID: () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
      },
      subtle: {
        digest: async () => {
          throw new Error("Crypto.subtle.digest not available in fallback mode");
        }
      }
    };
  }
  global.crypto = cryptoImpl;
}
try {
  const { registerNodeModuleShims } = (init_node_modules(), __toCommonJS(node_modules_exports));
  registerNodeModuleShims();
} catch (e) {
  console.warn("Failed to register Node.js module shims:", e);
}
export {
  Aqua,
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
  Aquafier as default,
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
