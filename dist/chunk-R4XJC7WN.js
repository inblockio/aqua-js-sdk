var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/platform/node-modules.ts
var fs = {
  promises: {
    readFile: async () => "",
    writeFile: async () => {
    },
    mkdir: async () => {
    },
    readdir: async () => [],
    stat: async () => ({
      isFile: () => false,
      isDirectory: () => false
    }),
    access: async () => {
    }
  },
  readFileSync: () => "",
  writeFileSync: () => {
  },
  existsSync: () => false,
  mkdirSync: () => {
  },
  readdirSync: () => [],
  statSync: () => ({
    isFile: () => false,
    isDirectory: () => false
  })
};
var path = {
  join: (...args) => args.join("/"),
  resolve: (...args) => args.join("/"),
  dirname: (p) => p.split("/").slice(0, -1).join("/"),
  basename: (p) => p.split("/").pop() || "",
  extname: (p) => {
    const base = p.split("/").pop() || "";
    return base.includes(".") ? "." + base.split(".").pop() : "";
  }
};
var http = {
  createServer: () => ({
    listen: () => {
    },
    close: () => {
    }
  })
};
var https = {
  request: () => ({
    on: () => {
    },
    end: () => {
    }
  })
};
var crypto = {
  createHash: () => ({
    update: () => ({
      digest: () => ""
    })
  }),
  randomBytes: () => Buffer.from([])
};
var stream = {
  Readable: class {
  },
  Writable: class {
  },
  Duplex: class {
  },
  Transform: class {
  }
};
var util = {
  promisify: (fn) => fn,
  inspect: (obj) => JSON.stringify(obj)
};
var zlib = {
  gzip: (_, cb) => cb(null, Buffer.from([])),
  gunzip: (_, cb) => cb(null, Buffer.from([]))
};
var nodeModules = {
  fs,
  path,
  http,
  https,
  crypto,
  stream,
  util,
  zlib
};
function registerNodeModuleShims() {
  if (typeof global !== "undefined") {
    Object.entries(nodeModules).forEach(([name, implementation]) => {
      try {
        if (!global[name]) {
          global[name] = implementation;
        }
      } catch (e) {
        console.error(`Failed to register Node.js module shim for ${name}:`, e);
      }
    });
  }
}

// src/platform/fs.ts
async function getFileSystem() {
  if (isNode) {
    try {
      let fs2;
      try {
        fs2 = __require("fs").promises;
      } catch (e) {
        console.warn("Failed to load fs module via require, trying alternative methods");
        try {
          const dynamicImport = new Function("modulePath", "return import(modulePath)");
          fs2 = await dynamicImport("node:fs/promises");
        } catch (e2) {
          console.error("All attempts to load Node.js fs module failed:", e2);
          return getBrowserFileSystem();
        }
      }
      return {
        readFile: async (path2, options) => {
          const fsOptions = options?.encoding ? { encoding: options.encoding } : void 0;
          return await fs2.readFile(path2, fsOptions);
        },
        writeFile: async (path2, data, options) => {
          const fsOptions = options?.encoding ? { encoding: options.encoding } : void 0;
          await fs2.writeFile(path2, data, fsOptions);
        },
        exists: async (path2) => {
          try {
            await fs2.access(path2);
            return true;
          } catch {
            return false;
          }
        }
      };
    } catch (error) {
      console.error("Failed to import Node.js fs module:", error);
      return getBrowserFileSystem();
    }
  } else if (isReactNative) {
    try {
      try {
        const RNFS = __require("react-native-fs");
        return {
          readFile: async (path2, options) => {
            const encoding = options?.encoding || "utf8";
            return await RNFS.readFile(path2, encoding);
          },
          writeFile: async (path2, data, options) => {
            const encoding = options?.encoding || "utf8";
            const stringData = typeof data === "string" ? data : data.toString(encoding);
            await RNFS.writeFile(path2, stringData, encoding);
          },
          exists: async (path2) => {
            return await RNFS.exists(path2);
          }
        };
      } catch (rnfsError) {
        console.warn("react-native-fs not available, falling back to AsyncStorage for limited storage");
        const AsyncStorage = __require("@react-native-async-storage/async-storage");
        return {
          readFile: async (path2, _options) => {
            const data = await AsyncStorage.getItem(path2);
            if (data === null) throw new Error(`File not found: ${path2}`);
            return data;
          },
          writeFile: async (path2, data, _options) => {
            const stringData = typeof data === "string" ? data : data.toString("utf8");
            await AsyncStorage.setItem(path2, stringData);
          },
          exists: async (path2) => {
            const data = await AsyncStorage.getItem(path2);
            return data !== null;
          }
        };
      }
    } catch (error) {
      console.error("Failed to import React Native file system modules:", error);
      throw new Error("File system functionality not available in this React Native environment");
    }
  } else if (isBrowser) {
    return getBrowserFileSystem();
  } else {
    console.warn("Unknown environment detected, using browser file system implementation");
    return getBrowserFileSystem();
  }
}
function getBrowserFileSystem() {
  return {
    readFile: async (path2, _options) => {
      console.warn(`Browser environment: Cannot read file from ${path2}`);
      if (typeof localStorage !== "undefined") {
        const data = localStorage.getItem(`fs:${path2}`);
        if (data !== null) return data;
      }
      return fs.promises.readFile();
    },
    writeFile: async (path2, data, _options) => {
      console.warn(`Browser environment: Cannot write file to ${path2}`);
      if (typeof localStorage !== "undefined") {
        const stringData = typeof data === "string" ? data : data.toString("utf8");
        try {
          localStorage.setItem(`fs:${path2}`, stringData);
        } catch (e) {
          console.error("Failed to write to localStorage:", e);
        }
      }
      return fs.promises.writeFile();
    },
    exists: async (path2) => {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(`fs:${path2}`) !== null;
      }
      return false;
    }
  };
}

// src/platform/browser.ts
import * as forge from "node-forge";
var BufferPolyfill;
try {
  if (typeof global !== "undefined" && global.Buffer) {
    BufferPolyfill = global.Buffer;
  } else if (typeof window !== "undefined" && window.Buffer) {
    BufferPolyfill = window.Buffer;
  } else {
    const bufferModule = __require("buffer");
    BufferPolyfill = bufferModule.Buffer;
  }
} catch (e) {
  console.warn("Buffer not available, using fallback implementation");
  BufferPolyfill = class MinimalBuffer {
    static from(data) {
      return data;
    }
    static isBuffer() {
      return false;
    }
  };
}
var Buffer2 = BufferPolyfill;
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
          return await import("crypto");
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
  registerNodeModuleShims,
  getFileSystem,
  getCrypto,
  getForge,
  isReactNative,
  isNode,
  isBrowser,
  createHttpServer,
  checkInternetConnectivity
};
