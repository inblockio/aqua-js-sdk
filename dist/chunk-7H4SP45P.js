// src/platform/node-modules.ts
var fs = {
  promises: {},
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
      }
    });
  }
}

export {
  registerNodeModuleShims
};
