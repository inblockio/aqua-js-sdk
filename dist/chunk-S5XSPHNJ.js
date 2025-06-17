var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/platform/fs.ts
async function getFileSystem() {
  if (isNode) {
    try {
      const fs = await import("fs/promises");
      return {
        readFile: async (path, options) => {
          const fsOptions = options?.encoding ? { encoding: options.encoding } : void 0;
          return await fs.readFile(path, fsOptions);
        },
        writeFile: async (path, data, options) => {
          const fsOptions = options?.encoding ? { encoding: options.encoding } : void 0;
          await fs.writeFile(path, data, fsOptions);
        },
        exists: async (path) => {
          try {
            await fs.access(path);
            return true;
          } catch {
            return false;
          }
        }
      };
    } catch (error) {
      console.error("Failed to import Node.js fs module:", error);
      throw new Error("File system functionality not available");
    }
  } else if (isReactNative) {
    try {
      try {
        const RNFS = __require("react-native-fs");
        return {
          readFile: async (path, options) => {
            const encoding = options?.encoding || "utf8";
            return await RNFS.readFile(path, encoding);
          },
          writeFile: async (path, data, options) => {
            const encoding = options?.encoding || "utf8";
            const stringData = typeof data === "string" ? data : data.toString(encoding);
            await RNFS.writeFile(path, stringData, encoding);
          },
          exists: async (path) => {
            return await RNFS.exists(path);
          }
        };
      } catch (rnfsError) {
        console.warn("react-native-fs not available, falling back to AsyncStorage for limited storage");
        const AsyncStorage = __require("@react-native-async-storage/async-storage");
        return {
          readFile: async (path, _options) => {
            const data = await AsyncStorage.getItem(path);
            if (data === null) throw new Error(`File not found: ${path}`);
            return data;
          },
          writeFile: async (path, data, _options) => {
            const stringData = typeof data === "string" ? data : data.toString("utf8");
            await AsyncStorage.setItem(path, stringData);
          },
          exists: async (path) => {
            const data = await AsyncStorage.getItem(path);
            return data !== null;
          }
        };
      }
    } catch (error) {
      console.error("Failed to import React Native file system modules:", error);
      throw new Error("File system functionality not available in this React Native environment");
    }
  } else {
    return {
      readFile: async (_path, _options) => {
        throw new Error("File system operations are not supported in browser environment");
      },
      writeFile: async (_path, _data, _options) => {
        throw new Error("File system operations are not supported in browser environment");
      },
      exists: async (_path) => {
        return false;
      }
    };
  }
}

// src/platform/crypto.ts
async function getCrypto() {
  if (isNode) {
    try {
      const nodeCrypto = await import("crypto");
      return {
        verify: nodeCrypto.verify,
        createSign: nodeCrypto.createSign,
        createVerify: nodeCrypto.createVerify
      };
    } catch (error) {
      console.error("Failed to import Node.js crypto module:", error);
      throw new Error("Crypto functionality not available");
    }
  } else if (isReactNative) {
    try {
      const cryptoBrowserify = __require("crypto-browserify");
      return {
        verify: cryptoBrowserify.verify,
        createSign: cryptoBrowserify.createSign,
        createVerify: cryptoBrowserify.createVerify
      };
    } catch (error) {
      console.error("Failed to import React Native compatible crypto module:", error);
      throw new Error("Crypto functionality not available in this React Native environment");
    }
  } else {
    try {
      const cryptoBrowserify = __require("crypto-browserify");
      return {
        verify: cryptoBrowserify.verify,
        createSign: cryptoBrowserify.createSign,
        createVerify: cryptoBrowserify.createVerify
      };
    } catch (error) {
      console.error("Failed to import browser compatible crypto module:", error);
      throw new Error("Crypto functionality not available in this browser environment");
    }
  }
}
async function getForge() {
  try {
    return __require("node-forge");
  } catch (error) {
    console.error("Failed to import node-forge:", error);
    throw new Error("Forge functionality not available");
  }
}

// src/platform/index.ts
var isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";
var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
var isBrowser = typeof window !== "undefined" && !isReactNative;
async function createHttpServer(requestListener) {
  if (isNode) {
    try {
      const { createServer } = await import("http");
      return createServer(requestListener);
    } catch (error) {
      console.error("Failed to create HTTP server:", error);
      return null;
    }
  } else if (isReactNative) {
    console.warn("HTTP server is not supported in React Native. Consider using a different approach.");
    return {
      listen: (port, host, callback) => {
        console.warn(`[Mock] HTTP server would listen on ${host}:${port}`);
        if (callback) callback();
      },
      close: () => {
        console.warn("[Mock] HTTP server would close");
      }
    };
  } else {
    console.warn("HTTP server is only supported in Node.js environment");
    return null;
  }
}
async function checkInternetConnectivity() {
  if (isBrowser || isReactNative) {
    return new Promise((resolve) => {
      const isOnline = typeof navigator !== "undefined" && navigator.onLine;
      if (!isOnline) {
        resolve(false);
        return;
      }
      fetch("https://www.google.com/favicon.ico", {
        mode: "no-cors",
        cache: "no-store"
      }).then(() => resolve(true)).catch(() => resolve(false));
      setTimeout(() => resolve(false), 5e3);
    });
  } else if (isNode) {
    try {
      const { request } = await import("https");
      return new Promise((resolve) => {
        const req = request(
          "https://www.google.com",
          { method: "HEAD", timeout: 5e3 },
          (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 300);
            res.resume();
          }
        );
        req.on("error", () => resolve(false));
        req.on("timeout", () => {
          req.destroy();
          resolve(false);
        });
        req.end();
      });
    } catch (error) {
      return false;
    }
  }
  return false;
}

export {
  __require,
  getFileSystem,
  getCrypto,
  getForge,
  isReactNative,
  isNode,
  isBrowser,
  createHttpServer,
  checkInternetConnectivity
};
