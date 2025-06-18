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

// src/platform/browser.ts
import * as forge from "node-forge";
import { Buffer as Buffer2 } from "buffer/";
var browserCrypto = {
  // Minimal implementation of crypto.verify
  verify: (_algorithm, data, publicKey, signature) => {
    try {
      const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
      const md2 = forge.md.sha256.create();
      md2.update(data.toString("binary"));
      return publicKeyObj.verify(md2.digest().bytes(), signature.toString("binary"));
    } catch (e) {
      console.error("Verification error:", e);
      return false;
    }
  },
  // Minimal implementation of crypto.createSign
  createSign: (_algorithm) => {
    let data = Buffer2.from("");
    const signer = {
      update: function(chunk) {
        const chunkBuffer = typeof chunk === "string" ? Buffer2.from(chunk) : chunk instanceof Buffer2 ? chunk : Buffer2.from(chunk.toString(), "binary");
        data = Buffer2.concat([data, chunkBuffer]);
        return signer;
      },
      sign: function(key) {
        try {
          const privateKey = forge.pki.privateKeyFromPem(key);
          const md2 = forge.md.sha256.create();
          md2.update(data.toString("binary"));
          const signature = privateKey.sign(md2);
          return Buffer2.from(signature, "binary");
        } catch (e) {
          console.error("Signing error:", e);
          throw new Error("Failed to sign data");
        }
      }
    };
    return signer;
  },
  // Minimal implementation of crypto.createVerify
  createVerify: (_algorithm) => {
    let data = Buffer2.from("");
    const verifier = {
      update: function(chunk) {
        const chunkBuffer = typeof chunk === "string" ? Buffer2.from(chunk) : chunk instanceof Buffer2 ? chunk : Buffer2.from(chunk.toString(), "binary");
        data = Buffer2.concat([data, chunkBuffer]);
        return verifier;
      },
      verify: function(key, signature) {
        try {
          const publicKey = forge.pki.publicKeyFromPem(key);
          const md2 = forge.md.sha256.create();
          md2.update(data.toString("binary"));
          const sig = typeof signature === "string" ? Buffer2.from(signature, "base64") : signature instanceof Buffer2 ? signature : Buffer2.from(signature.toString(), "binary");
          return publicKey.verify(md2.digest().bytes(), sig.toString("binary"));
        } catch (e) {
          console.error("Verification error:", e);
          return false;
        }
      }
    };
    return verifier;
  }
};

// src/platform/crypto.ts
async function getCrypto() {
  if (isNode) {
    try {
      const nodeCrypto = await (async () => {
        try {
          return await import("node:crypto");
        } catch (e) {
          return await import("crypto");
        }
      })();
      return {
        verify: nodeCrypto.verify,
        createSign: nodeCrypto.createSign,
        createVerify: nodeCrypto.createVerify
      };
    } catch (error) {
      console.error("Failed to import Node.js crypto module:", error);
      return await getBrowserCrypto();
    }
  } else if (isReactNative) {
    try {
      const forge2 = __require("node-forge");
      return {
        verify: (_algorithm, data, publicKey, signature) => {
          try {
            const publicKeyObj = forge2.pki.publicKeyFromPem(publicKey);
            const md2 = forge2.md.sha256.create();
            md2.update(data.toString("binary"));
            return publicKeyObj.verify(md2.digest().bytes(), signature.toString("binary"));
          } catch (e) {
            console.error("Verification error:", e);
            return false;
          }
        },
        createSign: (_algorithm) => {
          let data = Buffer.from("");
          return {
            update: (chunk) => {
              const chunkBuffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
              data = Buffer.concat([data, chunkBuffer]);
              return this;
            },
            sign: (key) => {
              try {
                const privateKey = forge2.pki.privateKeyFromPem(key);
                const md2 = forge2.md.sha256.create();
                md2.update(data.toString("binary"));
                const signature = privateKey.sign(md2);
                return Buffer.from(signature, "binary");
              } catch (e) {
                console.error("Signing error:", e);
                throw new Error("Failed to sign data");
              }
            }
          };
        },
        createVerify: (_algorithm) => {
          let data = Buffer.from("");
          return {
            update: (chunk) => {
              const chunkBuffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
              data = Buffer.concat([data, chunkBuffer]);
              return this;
            },
            verify: (key, signature) => {
              try {
                const publicKey = forge2.pki.publicKeyFromPem(key);
                const md2 = forge2.md.sha256.create();
                md2.update(data.toString("binary"));
                const sig = typeof signature === "string" ? Buffer.from(signature, "base64") : signature;
                return publicKey.verify(md2.digest().bytes(), sig.toString("binary"));
              } catch (e) {
                console.error("Verification error:", e);
                return false;
              }
            }
          };
        }
      };
    } catch (error) {
      console.error("Failed to create React Native compatible crypto implementation:", error);
      throw new Error("Crypto functionality not available in this React Native environment");
    }
  } else if (isBrowser) {
    return await getBrowserCrypto();
  } else {
    console.warn("Unknown environment detected, using browser crypto implementation");
    return await getBrowserCrypto();
  }
}
async function getBrowserCrypto() {
  try {
    return browserCrypto;
  } catch (error) {
    console.error("Failed to create browser compatible crypto implementation:", error);
    throw new Error("Crypto functionality not available in this browser environment");
  }
}
async function getForge() {
  try {
    return await import("node-forge");
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
