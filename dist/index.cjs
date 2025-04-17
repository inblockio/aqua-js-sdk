"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AquafierChainable: () => AquafierChainable,
  Err: () => Err,
  ErrResult: () => ErrResult,
  LogType: () => LogType,
  LogTypeEmojis: () => LogTypeEmojis,
  None: () => None,
  NoneOption: () => NoneOption,
  Ok: () => Ok,
  OkResult: () => OkResult,
  OrderRevisionInAquaTree: () => OrderRevisionInAquaTree,
  Some: () => Some,
  SomeOption: () => SomeOption,
  checkFileHashAlreadyNotarized: () => checkFileHashAlreadyNotarized,
  checkInternetConnection: () => checkInternetConnection,
  cliGreenify: () => cliGreenify,
  cliRedify: () => cliRedify,
  cliYellowfy: () => cliYellowfy,
  createCredentials: () => createCredentials,
  createNewAquaTree: () => createNewAquaTree,
  default: () => Aquafier,
  dict2Leaves: () => dict2Leaves,
  estimateWitnessGas: () => estimateWitnessGas,
  findFormKey: () => findFormKey,
  findNextRevisionHashByArrayofRevisions: () => findNextRevisionHashByArrayofRevisions,
  formatMwTimestamp: () => formatMwTimestamp,
  getEntropy: () => getEntropy,
  getFileHashSum: () => getFileHashSum,
  getFileNameCheckingPaths: () => getFileNameCheckingPaths,
  getGenesisHash: () => getGenesisHash,
  getHashSum: () => getHashSum,
  getLatestVH: () => getLatestVH,
  getMerkleRoot: () => getMerkleRoot,
  getPreviousVerificationHash: () => getPreviousVerificationHash,
  getTimestamp: () => getTimestamp,
  getWallet: () => getWallet,
  isErr: () => isErr,
  isNone: () => isNone,
  isOk: () => isOk,
  isSome: () => isSome,
  log_dim: () => log_dim,
  log_red: () => log_red,
  log_success: () => log_success,
  log_yellow: () => log_yellow,
  maybeUpdateFileIndex: () => maybeUpdateFileIndex,
  prepareNonce: () => prepareNonce,
  printGraphData: () => printGraphData,
  printLogs: () => printLogs,
  printlinkedGraphData: () => printlinkedGraphData,
  recoverWalletAddress: () => recoverWalletAddress,
  reorderAquaTreeRevisionsProperties: () => reorderAquaTreeRevisionsProperties,
  reorderRevisionsProperties: () => reorderRevisionsProperties,
  verifyMerkleIntegrity: () => verifyMerkleIntegrity
});
module.exports = __toCommonJS(index_exports);

// src/types.ts
var LogType = /* @__PURE__ */ ((LogType2) => {
  LogType2["SUCCESS"] = "success";
  LogType2["INFO"] = "info";
  LogType2["ERROR"] = "error";
  LogType2["FINAL_ERROR"] = "final_error";
  LogType2["WARNING"] = "warning";
  LogType2["HINT"] = "hint";
  LogType2["DEBUGDATA"] = "debug_data";
  LogType2["ARROW"] = "arrow";
  LogType2["FILE"] = "file";
  LogType2["LINK"] = "link";
  LogType2["SIGNATURE"] = "signature";
  LogType2["WITNESS"] = "witness";
  LogType2["FORM"] = "form";
  LogType2["SCALAR"] = "scalar";
  LogType2["EMPTY"] = "empty";
  LogType2["TREE"] = "tree";
  return LogType2;
})(LogType || {});
var LogTypeEmojis = {
  ["success" /* SUCCESS */]: "\u2705",
  ["info" /* INFO */]: "\u2728",
  ["error" /* ERROR */]: "\u274C",
  ["final_error" /* FINAL_ERROR */]: "\u274C",
  ["warning" /* WARNING */]: "\u{1F6A8}",
  ["hint" /* HINT */]: "\u{1F4A1}",
  ["debug_data" /* DEBUGDATA */]: "\u{1F41E}",
  ["arrow" /* ARROW */]: "\u27A1\uFE0F",
  ["file" /* FILE */]: "\u{1F4C4}",
  ["link" /* LINK */]: "\u{1F517}",
  ["signature" /* SIGNATURE */]: "\u{1F50F}",
  ["witness" /* WITNESS */]: "\u{1F440}",
  ["form" /* FORM */]: "\u{1F4DD}",
  ["scalar" /* SCALAR */]: "\u23FA\uFE0F ",
  ["tree" /* TREE */]: "\u{1F33F}",
  ["empty" /* EMPTY */]: ""
};

// src/utils.ts
var import_ethers = require("ethers");
var import_sha = __toESM(require("sha.js"), 1);
var import_merkletreejs = require("merkletreejs");

// src/type_guards.ts
var OkResult = class {
  constructor(data) {
    this.data = data;
    this.tag = "ok";
  }
  isOk() {
    return true;
  }
  isErr() {
    return false;
  }
  // Utility methods
  map(fn) {
    return Ok(fn(this.data));
  }
  unwrap() {
    return this.data;
  }
  unwrapOr(_default) {
    return this.data;
  }
};
var ErrResult = class {
  constructor(data) {
    this.data = data;
    this.tag = "err";
  }
  isOk() {
    return false;
  }
  isErr() {
    return true;
  }
  // Utility methods
  map(_fn) {
    return Err(this.data);
  }
  unwrap() {
    throw new Error(`Attempted to unwrap an Err value: ${JSON.stringify(this.data)}`);
  }
  unwrapOr(defaultValue) {
    return defaultValue;
  }
};
function Ok(value) {
  return new OkResult(value);
}
function Err(error) {
  return new ErrResult(error);
}
function isOk(result) {
  return result.isOk();
}
function isErr(result) {
  return result.isErr();
}
var SomeOption = class {
  constructor(value) {
    this.value = value;
    this.tag = "some";
  }
  isSome() {
    return true;
  }
  isNone() {
    return false;
  }
  // Utility methods
  map(fn) {
    return Some(fn(this.value));
  }
  unwrap() {
    return this.value;
  }
  unwrapOr(_default) {
    return this.value;
  }
};
var NoneOption = class {
  constructor() {
    this.tag = "none";
  }
  isSome() {
    return false;
  }
  isNone() {
    return true;
  }
  // Utility methods
  map(_fn) {
    return None();
  }
  unwrap() {
    throw new Error("Attempted to unwrap a None value");
  }
  unwrapOr(defaultValue) {
    return defaultValue;
  }
};
function Some(value) {
  return new SomeOption(value);
}
function None() {
  return new NoneOption();
}
function isSome(option) {
  return option.isSome();
}
function isNone(option) {
  return option.isNone();
}

// src/utils.ts
function reorderRevisionsProperties(revision) {
  const reordered = {};
  const sortedKeys = Object.keys(revision).sort();
  for (const key of sortedKeys) {
    reordered[key] = revision[key];
  }
  return reordered;
}
function reorderAquaTreeRevisionsProperties(aquaTree) {
  const reorderedRevisions = {};
  for (const [hash, revision] of Object.entries(aquaTree.revisions)) {
    reorderedRevisions[hash] = reorderRevisionsProperties(revision);
  }
  return {
    ...aquaTree,
    revisions: reorderedRevisions
  };
}
function getPreviousVerificationHash(aquaTree, currentHash) {
  let previousHash = "";
  let hashes = Object.keys(aquaTree.revisions);
  let index = hashes.indexOf(currentHash);
  if (index > 0) {
    previousHash = hashes[index - 1];
  }
  return previousHash;
}
function findFormKey(revision, key) {
  const keys = Object.keys(revision);
  return keys.find(
    (k) => k === key || k === `forms_${key}` || k.startsWith(`forms_${key}`)
  );
}
function maybeUpdateFileIndex(aquaTree, verificationHash, revisionType, aquaFileName, formFileName, linkVerificationHash, linkFileName) {
  let logs = [];
  const validRevisionTypes = ["file", "form", "link"];
  if (!validRevisionTypes.includes(revisionType)) {
    logs.push({
      logType: "error" /* ERROR */,
      log: `\u274C Invalid revision type for file index: ${revisionType}`
    });
    return Err(logs);
  }
  switch (revisionType) {
    case "form":
      aquaTree.file_index[verificationHash] = formFileName;
      break;
    case "file":
      aquaTree.file_index[verificationHash] = aquaFileName;
      break;
    case "link":
      aquaTree.file_index[linkVerificationHash] = linkFileName;
  }
  logs.push({
    logType: "success" /* SUCCESS */,
    log: `\u2705 File index of aqua tree updated successfully.`
  });
  return Ok(aquaTree);
}
function dict2Leaves(obj) {
  return Object.keys(obj).sort().map((key) => getHashSum(`${key}:${obj[key]}`));
}
function getFileHashSum(fileContent) {
  return getHashSum(fileContent);
}
function getHashSum(data) {
  let hash = (0, import_sha.default)("sha256").update(data).digest("hex");
  return hash;
}
function createNewAquaTree() {
  return {
    revisions: {},
    file_index: {},
    tree: {},
    treeMapping: {}
  };
}
function checkFileHashAlreadyNotarized(fileHash, aquaTree) {
  const existingRevision = Object.values(aquaTree.revisions).find(
    (revision) => revision.file_hash && revision.file_hash === fileHash
  );
  if (existingRevision) {
    return true;
  } else {
    return false;
  }
}
function prepareNonce() {
  return getHashSum(Date.now().toString());
}
async function getWallet(mnemonic) {
  const wallet = import_ethers.Wallet.fromPhrase(mnemonic.trim());
  const { ethers: ethers5 } = await import("ethers");
  const walletAddress = ethers5.getAddress(wallet.address);
  return [wallet, walletAddress, wallet.publicKey, wallet.privateKey];
}
function getEntropy() {
  if (typeof window !== "undefined" && window.crypto) {
    return crypto.getRandomValues(new Uint8Array(16));
  } else {
    const nodeCrypto = require("crypto");
    return new Uint8Array(nodeCrypto.randomBytes(16));
  }
}
var getFileNameCheckingPaths = (fileObjects, fileName) => {
  let fileObjectItem = fileObjects.find((e) => {
    if (e.fileName.includes("/") || fileName.includes("/")) {
      let eFileName = e.fileName;
      let parentFileName = fileName;
      if (e.fileName.includes("/")) {
        eFileName = e.fileName.split("/").pop();
      }
      if (fileName.includes("/")) {
        parentFileName = fileName.split("/").pop();
      }
      return eFileName == parentFileName;
    } else {
      return e.fileName == fileName;
    }
  });
  return fileObjectItem;
};
function createCredentials() {
  console.log("Credential file  does not exist.Creating wallet");
  const entropy = getEntropy();
  const mnemonic = import_ethers.Mnemonic.fromEntropy(entropy);
  let credentialsObject = {
    mnemonic: mnemonic.phrase,
    nostr_sk: "",
    did_key: "",
    alchemy_key: "ZaQtnup49WhU7fxrujVpkFdRz4JaFRtZ",
    // project defualt key
    witness_eth_network: "sepolia",
    witness_method: "metamask"
  };
  try {
    return credentialsObject;
  } catch (error) {
    console.error("\u274C Failed to write mnemonic:", error);
    throw Err(error);
  }
}
function formatMwTimestamp(ts) {
  return ts.replace(/-/g, "").replace(/:/g, "").replace("T", "").replace("Z", "");
}
var estimateWitnessGas = async (wallet_address, witness_event_verification_hash, ethNetwork, smart_contract_address, _providerUrl) => {
  let logData = [];
  try {
    const provider = import_ethers.ethers.getDefaultProvider(ethNetwork);
    const tx = {
      from: import_ethers.ethers.getAddress(wallet_address),
      to: import_ethers.ethers.getAddress(smart_contract_address),
      // Replace with actual contract address
      data: "0x9cef4ea1" + witness_event_verification_hash.replace("0x", "")
      // Function selector + hash
    };
    const balance = await provider.getBalance(wallet_address);
    const balanceInEth = import_ethers.ethers.formatEther(balance);
    logData.push({
      log: `Sender Balance: ${balanceInEth} ETH`,
      logType: "debug_data" /* DEBUGDATA */
    });
    const estimatedGas = await provider.estimateGas(tx);
    logData.push({
      log: `Estimated Gas: ${estimatedGas.toString()} units`,
      logType: "debug_data" /* DEBUGDATA */
    });
    const feeData = await provider.getFeeData();
    logData.push({
      log: `Fee data: ", ${feeData}`,
      logType: "debug_data" /* DEBUGDATA */
    });
    const gasPrice = feeData.gasPrice ? feeData.gasPrice : BigInt(0);
    logData.push({
      log: `Gas Price: ${import_ethers.ethers.formatUnits(gasPrice, "gwei")} Gwei`,
      logType: "debug_data" /* DEBUGDATA */
    });
    const gasCost = estimatedGas * gasPrice;
    const gasCostInEth = import_ethers.ethers.formatEther(gasCost);
    logData.push({
      log: `Estimated Gas Fee: ${gasCostInEth} ETH`,
      logType: "debug_data" /* DEBUGDATA */
    });
    const hasEnoughBalance = balance >= gasCost;
    return [
      {
        error: null,
        gasEstimate: estimatedGas.toString(),
        gasFee: gasCostInEth,
        balance: balanceInEth,
        hasEnoughBalance
      },
      logData
    ];
  } catch (error) {
    logData.push({
      log: `Error estimating gas: ", ${error}`,
      logType: "debug_data" /* DEBUGDATA */
    });
    return [{ error: error.message, hasEnoughBalance: false }, logData];
  }
};
function verifyMerkleIntegrity(merkleBranch, merkleRoot) {
  if (merkleBranch.length === 0) {
    return false;
  }
  let witnessMerkleProofLeaves = merkleBranch;
  let hexRoot = getMerkleRoot(witnessMerkleProofLeaves);
  let merkleRootOk = hexRoot === merkleRoot;
  return merkleRootOk;
}
var getMerkleRoot = (leaves) => {
  const tree = new import_merkletreejs.MerkleTree(leaves, getHashSum, {
    duplicateOdd: false
  });
  const hexRoot = tree.getHexRoot();
  return hexRoot;
};
var getLatestVH = (aquaTree) => {
  const verificationHashes = Object.keys(aquaTree.revisions);
  return verificationHashes[verificationHashes.length - 1];
};
var getTimestamp = () => {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")));
  return timestamp;
};
async function checkInternetConnection() {
  if (typeof window !== "undefined" && window.navigator) {
    return new Promise((resolve) => {
      const isOnline = window.navigator.onLine;
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
  } else {
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
}
function printLogs(logs, enableVerbose = true) {
  if (enableVerbose) {
    logs.forEach((element) => {
      console.log(
        `${element.ident ? element.ident : ""} ${LogTypeEmojis[element.logType]} ${element.log}`
      );
    });
  } else {
    let containsError = logs.filter((element) => element.logType == "error");
    if (containsError.length > 0) {
      logs.forEach((element) => {
        if (element.logType == "error") {
          console.log(
            `${element.ident ? element.ident : ""} ${LogTypeEmojis[element.logType]} ${element.log}`
          );
        }
      });
    } else {
      if (logs.length > 0) {
        let lastLog = logs[logs.length - 1];
        console.log(`${LogTypeEmojis[lastLog.logType]} ${lastLog.log}`);
      }
    }
  }
}
function printlinkedGraphData(node, prefix = "", _isLast = true) {
  let revisionTypeEmoji = LogTypeEmojis[node.revisionType];
  let isSuccessorFailureEmoji = node.isValidationSucessful ? LogTypeEmojis["success"] : LogTypeEmojis["error"];
  console.log(
    `${prefix}\u2514${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`
  );
  if (node.revisionType === "link") {
    console.log(`${prefix}	Tree ${node.hash.slice(-4)}`);
    for (let i = 0; i < node.linkVerificationGraphData.length; i++) {
      const el = node.linkVerificationGraphData[i];
      printlinkedGraphData(el, `${prefix}	`, false);
    }
  }
  const newPrefix = prefix;
  node.verificationGraphData.forEach((child, index) => {
    const isChildLast = index === node.verificationGraphData.length - 1;
    printlinkedGraphData(child, newPrefix, !isChildLast);
  });
}
function printGraphData(node, prefix = "", _isLast = true) {
  let revisionTypeEmoji = LogTypeEmojis[node.revisionType];
  let isSuccessorFailureEmoji = node.isValidationSucessful ? LogTypeEmojis["success"] : LogTypeEmojis["error"];
  console.log(
    `\u2514${isSuccessorFailureEmoji.trim()} ${revisionTypeEmoji.trim()} ${node.hash}`
  );
  if (node.revisionType === "link") {
    console.log(`${prefix}	Tree ${node.hash.slice(-4)}`);
    for (let i = 0; i < node.linkVerificationGraphData.length; i++) {
      const el = node.linkVerificationGraphData[i];
      printlinkedGraphData(el, `${prefix}	`, false);
    }
  }
  const newPrefix = prefix;
  node.verificationGraphData.forEach((child, _index) => {
    printGraphData(child, newPrefix, false);
  });
}
function OrderRevisionInAquaTree(params) {
  let allHashes = Object.keys(params.revisions);
  let orderdHashes = [];
  if (allHashes.length == 1) {
    return params;
  }
  for (let hash of allHashes) {
    let revision = params.revisions[hash];
    if (revision.previous_verification_hash == "") {
      orderdHashes.push(hash);
      break;
    }
  }
  while (true) {
    let nextRevisionHash = findNextRevisionHash(
      orderdHashes[orderdHashes.length - 1],
      params
    );
    if (nextRevisionHash == "") {
      break;
    } else {
      orderdHashes.push(nextRevisionHash);
    }
  }
  let newAquaTree = {
    ...params,
    revisions: {}
  };
  for (let hash of orderdHashes) {
    let revision = params.revisions[hash];
    newAquaTree.revisions[hash] = revision;
  }
  return newAquaTree;
}
function getGenesisHash(aquaTree) {
  let aquaTreeGenesisHash = null;
  let allAquuaTreeHashes = Object.keys(aquaTree.revisions);
  for (let hash of allAquuaTreeHashes) {
    let revisionItem = aquaTree.revisions[hash];
    if (revisionItem.previous_verification_hash == "" || revisionItem.previous_verification_hash == null || revisionItem.previous_verification_hash == void 0) {
      aquaTreeGenesisHash = hash;
      break;
    }
  }
  return aquaTreeGenesisHash;
}
function findNextRevisionHash(previousVerificationHash, aquaTree) {
  let hashOfRevision = "";
  let allHashes = Object.keys(aquaTree.revisions);
  for (let hash of allHashes) {
    let revision = aquaTree.revisions[hash];
    if (revision.previous_verification_hash == previousVerificationHash) {
      hashOfRevision = hash;
      break;
    }
  }
  return hashOfRevision;
}
function findNextRevisionHashByArrayofRevisions(previousVerificationHash, revisions) {
  let revisionItem = null;
  for (let revision of revisions) {
    if (revision.previous_verification_hash == previousVerificationHash) {
      revisionItem = revision;
      break;
    }
  }
  return revisionItem;
}

// src/aquavhtree.ts
function findNode(tree, hash) {
  if (tree.hash === hash) {
    return tree;
  }
  for (let i = 0; i < tree.children.length; i++) {
    const child = tree.children[i];
    const result = findNode(child, hash);
    if (result) {
      return result;
    }
  }
  return null;
}
function findPaths(tree, path) {
  let paths = {};
  path.push(tree.hash);
  if (tree.children.length === 0) {
    paths[tree.hash] = path;
  } else {
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];
      const childPaths = findPaths(child, [...path]);
      paths = { ...paths, ...childPaths };
    }
  }
  return paths;
}
function findHashWithLongestPath(tree) {
  let paths = findPaths(tree, []);
  let hash = "";
  let longestPathLength = 0;
  for (let key in paths) {
    if (paths[key].length > longestPathLength) {
      hash = key;
      longestPathLength = paths[key].length;
    }
  }
  return {
    paths,
    latestHash: hash
  };
}
function createAquaTreeTree(aquaTree) {
  let obj = aquaTree;
  let revisionTree = {};
  for (let revisionHash in obj.revisions) {
    const revision = obj.revisions[revisionHash];
    const parentHash = revision.previous_verification_hash;
    if (parentHash === "") {
      revisionTree.hash = revisionHash;
      revisionTree.children = [];
    } else {
      const parentNode = findNode(revisionTree, parentHash);
      if (parentNode) {
        parentNode.children.push({
          hash: revisionHash,
          children: []
        });
      }
    }
  }
  return revisionTree;
}
function createAquaTree(aquaTree) {
  if (!aquaTree.revisions || aquaTree.revisions === null || Object.keys(aquaTree.revisions).length === 0) {
    return null;
  }
  let aquaTreeWithReorderdRevisionPrperties = reorderAquaTreeRevisionsProperties(aquaTree);
  let tree = createAquaTreeTree(aquaTreeWithReorderdRevisionPrperties);
  let pathResult = findHashWithLongestPath(tree);
  return {
    ...aquaTreeWithReorderdRevisionPrperties,
    tree,
    treeMapping: pathResult
  };
}
function logAquaTree(node, prefix = "", isLast = true) {
  console.log(prefix + (isLast ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ") + node.hash);
  const newPrefix = prefix + (isLast ? "    " : "\u2502   ");
  node.children.forEach((child, index) => {
    const isChildLast = index === node.children.length - 1;
    logAquaTree(child, newPrefix, isChildLast);
  });
}

// src/core/content.ts
async function createContentRevisionUtil(aquaTreeWrapper, fileObject, enableScalar) {
  let logs = [];
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")));
  let revisionType = "file";
  const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions);
  let lastRevisionHash = verificationHashes[verificationHashes.length - 1];
  let verificationData = {
    previous_verification_hash: lastRevisionHash,
    local_timestamp: timestamp,
    revision_type: revisionType
  };
  let fileHash = getHashSum(fileObject.fileContent);
  let alreadyNotarized = checkFileHashAlreadyNotarized(
    fileHash,
    aquaTreeWrapper.aquaTree
  );
  if (alreadyNotarized) {
    logs.push({
      log: `File ${fileObject.fileName} has already been notarized.`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  verificationData["content"] = fileObject.fileContent;
  verificationData["file_hash"] = fileHash;
  verificationData["file_nonce"] = prepareNonce();
  verificationData["version"] = `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`;
  const leaves = dict2Leaves(verificationData);
  let verification_hash = "";
  if (!enableScalar) {
    verification_hash = "0x" + getHashSum(JSON.stringify(verificationData));
    verificationData.leaves = leaves;
  } else {
    verification_hash = getMerkleRoot(leaves);
  }
  const revisions = aquaTreeWrapper.aquaTree.revisions;
  revisions[verification_hash] = verificationData;
  maybeUpdateFileIndex(
    aquaTreeWrapper.aquaTree,
    verificationData,
    revisionType,
    fileObject.fileName,
    "",
    "",
    ""
  );
  let aquaTreeWithOrderdRevision = reorderAquaTreeRevisionsProperties(
    aquaTreeWrapper.aquaTree
  );
  let aquaTreeWithTree = createAquaTree(aquaTreeWithOrderdRevision);
  logs.push({
    log: `content revision created succesfully`,
    logType: "success" /* SUCCESS */
  });
  let result = {
    aquaTree: aquaTreeWithTree,
    aquaTrees: null,
    logData: logs
  };
  return Ok(result);
}
function getFileByHashUtil(aquaTree, hash) {
  let logs = [];
  let res = aquaTree.file_index[hash];
  if (res) {
    logs.push({
      log: `File with hash  found`,
      logType: "success" /* SUCCESS */
    });
    return Ok(res);
  } else {
    logs.push({
      log: `File with hash ot found`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
}

// src/core/forms.ts
async function createFormRevisionUtil(aquaTreeWrapper, fileObject, enableScalar = false) {
  let logs = [];
  let targetHash = "";
  let revisionType = "form";
  if (aquaTreeWrapper.revision == null || aquaTreeWrapper.revision == void 0 || aquaTreeWrapper.revision.length == 0) {
    logs.push({
      log: `using the last revision `,
      logType: "info" /* INFO */
    });
    const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions);
    targetHash = verificationHashes[verificationHashes.length - 1];
  }
  let verificationData = {
    previous_verification_hash: targetHash,
    //previousVerificationHash,
    local_timestamp: getTimestamp(),
    revision_type: revisionType
  };
  let fileHash = getHashSum(fileObject.fileContent);
  let alreadyFormified = checkFileHashAlreadyNotarized(fileHash, aquaTreeWrapper.aquaTree);
  if (alreadyFormified) {
    logs.push({
      log: "Error: The form is already part of the aqua tree.",
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  verificationData["file_hash"] = fileHash;
  verificationData["file_nonce"] = prepareNonce();
  verificationData["version"] = `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`;
  let formDataJson = {};
  try {
    formDataJson = JSON.parse(fileObject.fileContent);
  } catch (parseError) {
    logs.push({
      log: "Error: The file does not contain valid JSON data.",
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  let form_data_sorted_keys = Object.keys(formDataJson);
  let form_data_sorted_with_prefix = {};
  for (let key of form_data_sorted_keys) {
    form_data_sorted_with_prefix[`forms_${key}`] = formDataJson[key];
  }
  verificationData = {
    ...verificationData,
    ...form_data_sorted_with_prefix
  };
  const leaves = dict2Leaves(verificationData);
  let verificationHash = "";
  if (enableScalar) {
    logs.push({
      log: `Scalar enabled`,
      logType: "scalar" /* SCALAR */
    });
    let stringifiedData = JSON.stringify(verificationData);
    verificationHash = "0x" + getHashSum(stringifiedData);
  } else {
    verificationData.leaves = leaves;
    verificationHash = getMerkleRoot(leaves);
  }
  const aquaTree = aquaTreeWrapper.aquaTree;
  aquaTree.revisions[verificationHash] = verificationData;
  let aquaTreeUpdatedResult = maybeUpdateFileIndex(aquaTree, verificationHash, revisionType, fileObject.fileName, fileObject.fileName, "", "");
  if (isErr(aquaTreeUpdatedResult)) {
    logs.push(...aquaTreeUpdatedResult.data);
    return Err(logs);
  }
  let aquaTreeUpdated = aquaTreeUpdatedResult.data;
  let aquaTreeWithTree = createAquaTree(aquaTreeUpdated);
  logs.push({
    log: `Form  revision created succesfully`,
    logType: "success" /* SUCCESS */
  });
  let result = {
    aquaTree: aquaTreeWithTree,
    //aquaTreeWithTree,
    aquaTrees: [],
    logData: logs
  };
  return Ok(result);
}
function hideFormElementsUtil(aquaTreeWrapper, keyToHide) {
  let logs = [];
  let targetRevisionHash = "";
  if (aquaTreeWrapper.revision.length > 1) {
    targetRevisionHash = aquaTreeWrapper.revision;
  } else {
    targetRevisionHash = getLatestVH(aquaTreeWrapper.aquaTree);
  }
  const targetRevision = aquaTreeWrapper.aquaTree.revisions[targetRevisionHash];
  if (targetRevisionHash == "" || targetRevision == void 0) {
    logs.push({
      log: `Error: Revision hash not found in file`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  const formKey = findFormKey(targetRevision, keyToHide);
  if (!formKey) {
    logs.push({
      log: `Error: Form key '${formKey}' not found`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  const revisions = aquaTreeWrapper.aquaTree.revisions;
  const deletedKey = `${formKey}.deleted`;
  let newRevision = {};
  for (let key in targetRevision) {
    if (formKey == key) {
      newRevision[deletedKey] = null;
    } else {
      newRevision[key] = targetRevision[key];
    }
  }
  revisions[targetRevisionHash] = newRevision;
  let data = {
    aquaTree: aquaTreeWrapper.aquaTree,
    aquaTrees: [],
    logData: logs
  };
  return Ok(data);
}
function unHideFormElementsUtil(aquaTreeWrapper, keyToUnHide, content) {
  let logs = [];
  let targetRevisionHash = "";
  if (aquaTreeWrapper.revision.length > 1) {
    targetRevisionHash = aquaTreeWrapper.revision;
  } else {
    targetRevisionHash = getLatestVH(aquaTreeWrapper.aquaTree);
  }
  const targetRevision = aquaTreeWrapper.aquaTree.revisions[targetRevisionHash];
  if (targetRevisionHash == "" || targetRevision == void 0) {
    logs.push({
      log: `Error: Revision hash not found in file`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  const formKey = findFormKey(targetRevision, keyToUnHide);
  if (!formKey) {
    logs.push({
      log: `Error: Form key '${formKey}' not found`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  const revisions = aquaTreeWrapper.aquaTree.revisions;
  if (formKey.endsWith(".deleted")) {
    const originalKey = formKey.replace(".deleted", "");
    let newRevision = {};
    for (let key in targetRevision) {
      if (formKey == key) {
        newRevision[originalKey] = content;
      } else {
        newRevision[key] = targetRevision[key];
      }
    }
    revisions[targetRevisionHash] = newRevision;
  } else {
    targetRevision[formKey] = content;
  }
  let data = {
    aquaTree: aquaTreeWrapper.aquaTree,
    aquaTrees: [],
    logData: logs
  };
  return Ok(data);
}

// src/core/link.ts
async function linkAquaTreeUtil(aquaTreeWrapper, linkAquaTreeWrapper, enableScalar) {
  let logs = [];
  const timestamp = getTimestamp();
  let previous_verification_hash = aquaTreeWrapper.revision;
  if (!aquaTreeWrapper.revision || aquaTreeWrapper.revision === "") {
    previous_verification_hash = getLatestVH(aquaTreeWrapper.aquaTree);
  }
  let newRevision = {
    previous_verification_hash,
    local_timestamp: timestamp,
    revision_type: "link",
    version: `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`
  };
  const linkVHs = [getLatestVH(linkAquaTreeWrapper.aquaTree)];
  const linkFileHashes = [getHashSum(linkAquaTreeWrapper.fileObject.fileContent)];
  linkFileHashes.forEach((fh) => {
    if (!(fh in linkAquaTreeWrapper.aquaTree.file_index)) {
      return Err(logs);
    }
    console.error(
      `${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`
    );
    process.exit(1);
  });
  const linkData = {
    link_type: "aqua",
    //link_require_indepth_verification: true,
    link_verification_hashes: linkVHs,
    link_file_hashes: linkFileHashes
  };
  newRevision = {
    ...newRevision,
    ...linkData
  };
  let revisionData = reorderRevisionsProperties(newRevision);
  const leaves = dict2Leaves(revisionData);
  let verificationHash = "";
  if (enableScalar) {
    logs.push({
      log: `Scalar enabled`,
      logType: "scalar" /* SCALAR */
    });
    let stringifiedData = JSON.stringify(revisionData);
    verificationHash = "0x" + getHashSum(stringifiedData);
  } else {
    revisionData.leaves = leaves;
    verificationHash = getMerkleRoot(leaves);
  }
  let updatedAquaTree = {
    revisions: {
      ...aquaTreeWrapper.aquaTree.revisions,
      [verificationHash]: revisionData
    },
    file_index: {
      ...aquaTreeWrapper.aquaTree.file_index,
      [linkVHs[0]]: linkAquaTreeWrapper.fileObject.fileName
    }
  };
  let aquaTreeWithTree = createAquaTree(updatedAquaTree);
  let orderedAquaTreeWithTree = reorderAquaTreeRevisionsProperties(aquaTreeWithTree);
  logs.push({
    log: "Linking successful",
    logType: "link" /* LINK */
  });
  let resutData = {
    aquaTree: orderedAquaTreeWithTree,
    logData: logs,
    aquaTrees: []
  };
  return Ok(resutData);
}
async function linkAquaTreesToMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar) {
  let logs = [];
  let aquaTree = aquaTreeWrappers;
  for (const linkAquaTree of linkAquaTreeWrapper) {
    const result = await linkAquaTreeUtil(aquaTree, linkAquaTree, enableScalar);
    if (isOk(result)) {
      const resData = result.data;
      aquaTree = {
        aquaTree: resData.aquaTree,
        fileObject: aquaTreeWrappers.fileObject,
        revision: ""
      };
      logs.push(...resData.logData);
    } else {
      logs.push(...result.data);
    }
  }
  let resutData = {
    aquaTree: aquaTree.aquaTree,
    logData: logs,
    aquaTrees: []
  };
  return Ok(resutData);
}
async function linkMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar) {
  let logs = [];
  let aquaTrees = [];
  for (const aquaTree of aquaTreeWrappers) {
    const result = await linkAquaTreeUtil(aquaTree, linkAquaTreeWrapper, enableScalar);
    if (isOk(result)) {
      const resData = result.data;
      aquaTrees.push(resData.aquaTree);
      logs.push(...resData.logData);
    } else {
      logs.push(...result.data);
    }
  }
  let resutData = {
    aquaTree: null,
    logData: logs,
    aquaTrees
  };
  return Ok(resutData);
}

// src/core/revision.ts
function checkIfFileAlreadyNotarizedUtil(aquaTree, fileObject) {
  let keys = Object.keys(aquaTree.revisions);
  let firstRevision = aquaTree.revisions[keys[0]];
  let fileHash = getHashSum(fileObject.fileContent);
  return firstRevision.file_hash == fileHash;
}
function fetchFilesToBeReadUtil(aquaTree) {
  let hashAndfiles = /* @__PURE__ */ new Map();
  let keys = Object.keys(aquaTree.file_index);
  keys.forEach((item) => {
    hashAndfiles.set(item, aquaTree.file_index[item]);
  });
  let filesWithoutContentInRevisions = [];
  hashAndfiles.forEach((value, key) => {
    const revision = aquaTree.revisions[key];
    let fileName = value;
    if (revision != void 0 && revision.content != void 0) {
      console.warn(
        `\u2713 File ${fileName} skipped: content already exists in revision ${key}`
      );
    } else {
      filesWithoutContentInRevisions.push(fileName);
    }
  });
  return filesWithoutContentInRevisions;
}
function removeLastRevisionUtil(aquaTree) {
  let logs = [];
  const revisions = aquaTree.revisions;
  const verificationHashes = Object.keys(revisions);
  const lastRevisionHash = verificationHashes[verificationHashes.length - 1];
  const lastRevision = aquaTree.revisions[lastRevisionHash];
  switch (lastRevision.revision_type) {
    case "file":
      delete aquaTree.file_index[lastRevision.file_hash];
      break;
    case "link":
      for (const vh of lastRevision.link_verification_hashes) {
        delete aquaTree.file_index[vh];
      }
  }
  delete aquaTree.revisions[lastRevisionHash];
  logs.push({
    log: `Most recent revision ${lastRevisionHash} has been removed`,
    logType: "info" /* INFO */
  });
  let newAquaTree = createAquaTree(aquaTree);
  let result = {
    aquaTree: newAquaTree,
    aquaTrees: null,
    logData: logs
  };
  if (Object.keys(aquaTree.revisions).length === 0) {
    logs.push({
      log: `The last  revision has been deleted  there are no revisions left.`,
      logType: "hint" /* HINT */
    });
    result.aquaTree = null;
    return Ok(result);
  } else {
    logs.push({
      log: `A revision  has been removed.`,
      logType: "success" /* SUCCESS */
    });
    return Ok(result);
  }
}
async function createGenesisRevision(fileObject, isForm, enableContent, enableScalar) {
  let logs = [];
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")));
  let revisionType = "file";
  if (isForm) {
    revisionType = "form";
  }
  let verificationData = {
    previous_verification_hash: "",
    local_timestamp: timestamp,
    revision_type: revisionType
  };
  verificationData["version"] = `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`;
  verificationData["file_hash"] = getHashSum(fileObject.fileContent);
  verificationData["file_nonce"] = prepareNonce();
  switch (revisionType) {
    case "file":
      if (enableContent) {
        verificationData["content"] = fileObject.fileContent;
        logs.push({
          log: `Content flag detected.`,
          logType: "file" /* FILE */
        });
      }
      break;
    case "form":
      let formDataJson = {};
      try {
        formDataJson = JSON.parse(fileObject.fileContent);
      } catch (parseError) {
        logs.push({
          log: `Error: The file ${fileObject.fileName} does not contain valid JSON data.`,
          logType: "error" /* ERROR */
        });
        return Err(logs);
      }
      let formDataSortedKeys = Object.keys(formDataJson);
      let formDataSortedWithPrefix = {};
      for (let key of formDataSortedKeys) {
        formDataSortedWithPrefix[`forms_${key}`] = formDataJson[key];
      }
      verificationData = {
        ...verificationData,
        ...formDataSortedWithPrefix
      };
      break;
    default:
      logs.push({
        log: `Genesis revision can either be form  or file.`,
        logType: "error" /* ERROR */
      });
      return Err(logs);
  }
  let sortedVerificationData = reorderRevisionsProperties(verificationData);
  const leaves = dict2Leaves(sortedVerificationData);
  let verificationHash = "";
  if (enableScalar) {
    logs.push({
      log: `Scalar enabled`,
      logType: "scalar" /* SCALAR */
    });
    let stringifiedData = JSON.stringify(sortedVerificationData);
    let hashSumData = getHashSum(stringifiedData);
    verificationHash = "0x" + hashSumData;
  } else {
    sortedVerificationData.leaves = leaves;
    verificationHash = getMerkleRoot(leaves);
  }
  const aquaTree = createNewAquaTree();
  aquaTree.revisions[verificationHash] = sortedVerificationData;
  let aquaTreeUpdatedResult;
  if (revisionType == "file") {
    aquaTreeUpdatedResult = maybeUpdateFileIndex(
      aquaTree,
      verificationHash,
      revisionType,
      fileObject.fileName,
      "",
      "",
      ""
    );
  } else {
    aquaTreeUpdatedResult = maybeUpdateFileIndex(
      aquaTree,
      verificationHash,
      revisionType,
      "",
      fileObject.fileName,
      "",
      ""
    );
  }
  if (isErr(aquaTreeUpdatedResult)) {
    logs.push(...aquaTreeUpdatedResult.data);
    return Err(logs);
  }
  let aquaTreeUpdated = aquaTreeUpdatedResult.data;
  let aquaTreeWithTree = createAquaTree(aquaTreeUpdated);
  logs.push({
    log: `Genesis revision created succesfully`,
    logType: "success" /* SUCCESS */
  });
  let result = {
    aquaTree: aquaTreeWithTree,
    //aquaTreeWithTree,
    aquaTrees: null,
    logData: logs
  };
  return Ok(result);
}
function getRevisionByHashUtil(aquaTree, revisionHash) {
  let logs = [];
  const verificationHashes = Object.keys(aquaTree.revisions);
  if (verificationHashes.includes(revisionHash)) {
    return Ok(aquaTree.revisions[revisionHash]);
  } else {
    logs.push({
      log: `\u274C Revision with hash : ${revisionHash} not found`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
}
function getLastRevisionUtil(aquaTree) {
  let logs = [];
  const verificationHashes = Object.keys(aquaTree.revisions);
  if (verificationHashes.length == 0) {
    logs.push({
      log: `\u274C aqua object has no revisions`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  const lastRevisionHash = verificationHashes[verificationHashes.length - 1];
  return Ok(aquaTree.revisions[lastRevisionHash]);
}

// src/signature/sign_metamask.ts
var import_ethers2 = require("ethers");
var MetaMaskSigner = class {
  constructor(options = {}) {
    this.port = options.port || 3001;
    this.host = options.host || "localhost";
    this.serverUrl = `http://${this.host}:${this.port}`;
    this.maxAttempts = options.maxAttempts || 24;
    this.pollInterval = options.pollInterval || 5e3;
    this.server = null;
    this.lastResult = null;
  }
  /**
  * Creates a standardized message for signing
  * 
  * @param verificationHash - Hash of the revision to sign
  * @returns Formatted message string
  */
  createMessage(verificationHash) {
    return `I sign this revision: [${verificationHash}]`;
  }
  /**
  * Creates HTML page for MetaMask interaction
  * 
  * @param message - Message to be signed
  * @returns HTML string with embedded MetaMask integration
  * 
  * This method creates a self-contained HTML page that:
  * - Detects MetaMask presence
  * - Requests account access
  * - Signs message using personal_sign
  * - Posts signature back to local server
  */
  createHtml(message) {
    return `
        <html>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.6.3/ethers.umd.min.js" type="text/javascript"></script>
          <script>
          const message = "${message}";
          const localServerUrl = window.location.href;
          
          const doSignProcess = async () => {
            const wallet_address = window.ethereum.selectedAddress;
            const correctedWalletAddress = ethers.utils.getAddress(wallet_address)
            console.log("correctedWalletAddress  (case sensetive )=="+correctedWalletAddress)
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [message, window.ethereum.selectedAddress],
            });
            document.getElementById("signature").innerHTML = \`Signature of your file: \${signature} (you may close this tab)\`;
            await fetch(localServerUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({signature, wallet_address: correctedWalletAddress})
            });
          }
          
          if (window.ethereum && window.ethereum.isMetaMask) {
            if (window.ethereum.isConnected() && window.ethereum.selectedAddress) {
              doSignProcess();
            } else {
              window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(doSignProcess)
                .catch((error) => {
                  console.error(error);
                  alert(error.message);
                });
            }
          } else {
            alert("Metamask not detected");
          }
          </script>
          <body>
            <div id="signature"></div>
          </body>
        </html>
      `;
  }
  /**
  * Handles signing process in browser environment
  * 
  * @param verificationHash - Hash of the revision to sign
  * @returns Promise resolving to [signature, wallet address, public key]
  * 
  * This method:
  * - Checks for MetaMask presence
  * - Requests account access
  * - Signs message using MetaMask
  * - Recovers public key from signature
  */
  async signInBrowser(verificationHash) {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      throw new Error("MetaMask not detected");
    }
    const message = this.createMessage(verificationHash);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const rawWalletAddress = window.ethereum.selectedAddress;
      if (!rawWalletAddress) {
        throw new Error("No wallet address selected");
      }
      const { ethers: ethers5 } = await import("ethers");
      const walletAddress = ethers5.getAddress(rawWalletAddress);
      if (!walletAddress) {
        throw new Error("No wallet address selected");
      }
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletAddress]
      });
      const publicKey = await this.recoverPublicKey(message, signature);
      return [signature, walletAddress, publicKey];
    } catch (error) {
      throw error;
    }
  }
  /**
  * Handles signing process in Node.js environment
  * 
  * @param verificationHash - Hash of the revision to sign
  * @returns Promise resolving to [signature, wallet address, public key]
  * 
  * This method:
  * - Creates local HTTP server
  * - Serves HTML page for MetaMask interaction
  * - Polls for signature completion
  * - Cleans up server after signing
  */
  async signInNode(verificationHash) {
    const { createServer } = await import("http");
    const message = this.createMessage(verificationHash);
    const html = this.createHtml(message);
    const requestListener = this.createRequestListener(html);
    this.server = createServer(requestListener);
    return new Promise((resolve, reject) => {
      try {
        this.server.listen(this.port, this.host, () => {
          console.log(`Server is running on ${this.serverUrl}`);
        });
        this.pollForSignature(message).then(resolve).catch(reject).finally(() => {
          this.server.close();
        });
      } catch (error) {
        this.server.close();
        reject(error);
      }
    });
  }
  /**
  * Creates HTTP request listener for local server
  * 
  * @param html - HTML content to serve
  * @returns Request listener function
  * 
  * This method handles:
  * - GET / - Serves signing page
  * - GET /result - Returns current signature status
  * - POST / - Receives signature from browser
  */
  createRequestListener(html) {
    return (req, res) => {
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } else if (req.method === "GET" && req.url === "/result") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(this.lastResult || {}));
      } else if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => body += chunk);
        req.on("end", () => {
          this.lastResult = JSON.parse(body);
          res.writeHead(200);
          res.end("OK");
        });
      }
    };
  }
  /**
  * Polls for signature completion
  * 
  * @param message - Original message being signed
  * @returns Promise resolving to [signature, wallet address, public key]
  * 
  * This method:
  * - Checks for signature at regular intervals
  * - Times out after maxAttempts
  * - Recovers public key when signature is received
  */
  async pollForSignature(message) {
    let attempts = 0;
    while (attempts < this.maxAttempts) {
      if (this.lastResult && this.lastResult.signature) {
        const { signature, wallet_address } = this.lastResult;
        const cleanedAddress = import_ethers2.ethers.getAddress(wallet_address);
        const publicKey = await this.recoverPublicKey(message, signature);
        return [signature, cleanedAddress, publicKey];
      }
      console.log("Waiting for the signature...");
      attempts++;
      await this.sleep(this.pollInterval);
    }
    throw new Error("Signature timeout: No response from MetaMask");
  }
  /**
  * Recovers public key from signature
  * 
  * @param message - Original signed message
  * @param signature - Ethereum signature
  * @returns Promise resolving to public key
  * 
  * Uses ethers.js to recover the public key from
  * the signature and message hash.
  */
  async recoverPublicKey(message, signature) {
    const { ethers: ethers5 } = await import("ethers");
    return ethers5.SigningKey.recoverPublicKey(
      ethers5.hashMessage(message),
      signature
    );
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
  * Signs a verification hash using MetaMask
  * 
  * @param verificationHash - Hash of the revision to sign
  * @returns Promise resolving to [signature, wallet address, public key]
  * 
  * This method:
  * - Detects environment (Node.js or browser)
  * - Routes to appropriate signing method
  * - Returns complete signature information
  */
  async sign(verificationHash) {
    const isNode = typeof window === "undefined";
    return isNode ? this.signInNode(verificationHash) : this.signInBrowser(verificationHash);
  }
};

// src/signature/sign_cli.ts
var CLISigner = class {
  /**
  * Signs a verification hash using the provided wallet
  * 
  * @param wallet - HDNodeWallet instance for signing
  * @param verificationHash - Hash of the revision to sign
  * @returns Promise resolving to the signature string
  * 
  * This method:
  * - Creates a standardized message with the verification hash
  * - Signs the message using the wallet's private key
  * - Returns the resulting signature
  */
  async doSign(wallet, verificationHash) {
    const message = "I sign this revision: [" + verificationHash + "]";
    const signature = await wallet.signMessage(message);
    return signature;
  }
};

// src/signature/sign_did.ts
var import_dids = require("dids");
var import_key_did_provider_ed25519 = require("key-did-provider-ed25519");
var KeyResolver = __toESM(require("key-did-resolver"), 1);
var DIDSigner = class {
  /**
  * Verifies a DID-signed JWS against a verification hash
  * 
  * @param jws - JSON Web Signature to verify
  * @param key - DID key used for signing
  * @param hash - Verification hash that was signed
  * @returns Promise resolving to boolean indicating signature validity
  * 
  * This method:
  * - Constructs the expected signature payload
  * - Verifies the JWS using DID resolver
  * - Validates payload message and key match
  */
  async verify(jws, key, hash) {
    const expected = { message: `I sign this revision: [${hash}]` };
    try {
      const resolver = KeyResolver.getResolver();
      const result = await new import_dids.DID({ resolver }).verifyJWS(jws);
      if (!result.payload || expected.message !== result.payload.message) return false;
      if (key !== result.kid.split("#")[0]) return false;
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }
  /**
  * Signs a verification hash using DID with Ed25519 provider
  * 
  * @param verificationHash - Hash of the revision to sign
  * @param privateKey - Ed25519 private key as Uint8Array
  * @returns Promise resolving to SignatureResult containing JWS and DID
  * 
  * This method:
  * - Creates a standardized signature payload
  * - Initializes Ed25519 DID provider with private key
  * - Authenticates the DID
  * - Creates and returns a JSON Web Signature
  */
  async sign(verificationHash, privateKey) {
    const payload = {
      message: `I sign this revision: [${verificationHash}]`
    };
    const provider = new import_key_did_provider_ed25519.Ed25519Provider(privateKey);
    const resolver = KeyResolver.getResolver();
    const did = new import_dids.DID({ provider, resolver });
    await did.authenticate();
    const jws = await did.createJWS(payload);
    return { jws, key: did.id };
  }
};

// src/core/signature.ts
var import_ethers3 = require("ethers");
async function signAquaTreeUtil(aquaTreeWrapper, signType, credentials, enableScalar = false, identCharacter = "") {
  let aquaTree = aquaTreeWrapper.aquaTree;
  let logs = [];
  let targetRevisionHash = "";
  if (aquaTreeWrapper.revision == void 0 || aquaTreeWrapper.revision == null || aquaTreeWrapper.revision.length == 0) {
    const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions);
    const lastRevisionHash = verificationHashes[verificationHashes.length - 1];
    targetRevisionHash = lastRevisionHash;
  } else {
    targetRevisionHash = aquaTreeWrapper.revision;
  }
  let signature, walletAddress, publicKey, signature_type;
  switch (signType) {
    case "metamask":
      let sign = new MetaMaskSigner();
      [signature, walletAddress, publicKey] = await sign.sign(targetRevisionHash);
      signature_type = "ethereum:eip-191";
      break;
    case "cli":
      try {
        if (credentials == null || credentials == void 0) {
          logs.push({
            log: "Credentials not found ",
            logType: "error" /* ERROR */,
            ident: identCharacter
          });
          return Err(logs);
        }
        let [wallet, _walletAddress, _publicKey] = await getWallet(
          credentials.mnemonic
        );
        let sign2 = new CLISigner();
        signature = await sign2.doSign(wallet, targetRevisionHash);
        walletAddress = _walletAddress;
        publicKey = _publicKey;
      } catch (error) {
        logs.push({
          log: "Failed to read mnemonic:" + error,
          logType: "error" /* ERROR */,
          ident: identCharacter
        });
        return Err(logs);
      }
      signature_type = "ethereum:eip-191";
      break;
    case "did":
      if (credentials == null || credentials == void 0 || credentials["did_key"].length === 0 || !credentials["did_key"]) {
        logs.push({
          log: "DID key is required.  Please get a key from https://hub.ebsi.eu/tools/did-generator",
          logType: "error" /* ERROR */,
          ident: identCharacter
        });
        return Err(logs);
      }
      let did = new DIDSigner();
      const { jws, key } = await did.sign(
        targetRevisionHash,
        Buffer.from(credentials["did_key"], "hex")
      );
      signature = jws;
      walletAddress = key;
      publicKey = key;
      signature_type = "did_key";
      break;
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")));
  let verificationDataRaw = {
    previous_verification_hash: targetRevisionHash,
    //previousVerificationHash,
    local_timestamp: timestamp,
    version: `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`,
    revision_type: "signature",
    signature,
    signature_public_key: publicKey,
    signature_wallet_address: walletAddress,
    signature_type
  };
  let verificationData = reorderRevisionsProperties(verificationDataRaw);
  const leaves = dict2Leaves(verificationData);
  let verification_hash = "";
  if (enableScalar) {
    verification_hash = "0x" + getHashSum(JSON.stringify(verificationData));
  } else {
    verification_hash = getMerkleRoot(leaves);
    verificationData.leaves = leaves;
  }
  const revisions = aquaTree.revisions;
  revisions[verification_hash] = verificationData;
  let aquaTreeWithTree = createAquaTree(aquaTree);
  if (!aquaTreeWithTree) {
    logs.push({
      log: "Failed to create AquaTree",
      logType: "error" /* ERROR */,
      ident: identCharacter
    });
    return Err(logs);
  }
  logs.push({
    log: `AquaTree signed succesfully`,
    logType: "success" /* SUCCESS */,
    ident: identCharacter
  });
  let result = {
    aquaTree: aquaTreeWithTree,
    aquaTrees: [],
    logData: logs
  };
  return Ok(result);
}
async function signMultipleAquaTreesUtil(_aquaTrees, _signType, _credentials, _enableScalar = false, identCharacter = "") {
  let logs = [];
  logs.push({
    log: "unimplmented need to be fixes",
    logType: "error" /* ERROR */,
    ident: identCharacter
  });
  return Err(logs);
}
function recoverWalletAddress(verificationHash, signature) {
  try {
    const message = `I sign this revision: [${verificationHash}]`;
    const messageHash = import_ethers3.ethers.hashMessage(message);
    const recoveredAddress = import_ethers3.ethers.recoverAddress(messageHash, signature);
    return recoveredAddress;
  } catch (error) {
    console.error("Error recovering wallet address:", error);
    throw new Error("Invalid signature or message");
  }
}
async function verifySignature(data, verificationHash, identCharacter = "") {
  let logs = [];
  let signatureOk = false;
  if (verificationHash === "") {
    logs.push({
      log: `The verificationHash MUST NOT be empty`,
      logType: "error" /* ERROR */
    });
    return [signatureOk, logs];
  }
  logs.push({
    log: `Wallet address:  ${data.signature_wallet_address}`,
    logType: "signature" /* SIGNATURE */,
    ident: identCharacter
  });
  let signerDID = new DIDSigner();
  switch (data.signature_type) {
    case "did_key":
      signatureOk = await signerDID.verify(
        data.signature,
        data.signature_public_key,
        verificationHash
      );
      break;
    case "ethereum:eip-191":
      const paddedMessage = `I sign this revision: [${verificationHash}]`;
      try {
        const recoveredAddress = import_ethers3.ethers.recoverAddress(
          import_ethers3.ethers.hashMessage(paddedMessage),
          data.signature
        );
        signatureOk = recoveredAddress.toLowerCase() === data.signature_wallet_address.toLowerCase();
      } catch (e) {
        logs.push({
          log: `A critical error : ${e}`,
          logType: "error" /* ERROR */
        });
      }
      break;
  }
  return [signatureOk, logs];
}

// src/witness/wintess_eth.ts
var import_ethers4 = require("ethers");
var import_http = __toESM(require("http"), 1);
var WitnessEth = class {
  // Utility Methods
  /**
  * Utility method to pause execution
  * 
  * @param ms - Number of milliseconds to sleep
  * @returns Promise that resolves after the specified delay
  */
  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // Environment detection
  /**
  * Detects the current runtime environment
  * 
  * @returns WitnessEnvironment indicating 'browser' or 'node'
  * 
  * Checks for presence of window.ethereum to determine if running
  * in a browser environment with MetaMask available
  */
  static detectEnvironment() {
    return typeof window !== "undefined" && window.ethereum ? "browser" : "node";
  }
  /**
  * Main entry point for MetaMask-based witnessing
  * 
  * @param config - Configuration for witness operation
  * @returns Promise resolving to witness transaction data
  * 
  * This method:
  * - Detects environment (browser/node)
  * - Routes to appropriate witness implementation
  * - Handles error cases
  */
  static async witnessMetamask(config) {
    const environment = this.detectEnvironment();
    try {
      switch (environment) {
        case "browser":
          return await this.browserWitness(config);
        case "node":
          return await this.nodeWitnessMetamask(config);
        default:
          throw new Error("Unsupported environment");
      }
    } catch (error) {
      console.error("Witness error:", error);
      throw error;
    }
  }
  /**
  * Creates common HTTP request listener for witness server
  * 
  * @param htmlContent - HTML content to serve for witness page
  * @returns Request listener function
  * 
  * This method handles:
  * - GET / - Serves witness page
  * - GET /result - Returns current transaction status
  * - POST / - Receives transaction data from browser
  */
  static async commonPrepareListener(htmlContent) {
    let output = "{}";
    const requestListener = async (req, res) => {
      if (req.method == "POST") {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        await new Promise((resolve) => {
          req.on("end", resolve);
        });
        output = data;
        res.writeHead(200);
        res.end();
      } else {
        if (req.url === "/result") {
          res.writeHead(200);
          res.end(output);
          return;
        }
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(htmlContent);
      }
    };
    return requestListener;
  }
  // Metamask Witness Method
  /**
  * Handles witnessing in Node.js environment
  * 
  * @param config - Witness configuration
  * @param port - Port for local server (default: 8420)
  * @param host - Host for local server (default: 'localhost')
  * @returns Promise resolving to witness transaction data
  * 
  * This method:
  * - Creates local HTTP server
  * - Serves witness page for MetaMask interaction
  * - Polls for transaction completion
  * - Returns transaction hash and wallet address
  */
  static async nodeWitnessMetamask(config, port = 8420, host = "localhost") {
    const serverUrl = `http://${host}:${port}`;
    const html = this.generateWitnessHtml(config);
    const requestListener = await this.commonPrepareListener(html);
    const server = import_http.default.createServer(requestListener);
    server.listen(port, host, () => {
      console.log(`\u2728 Server is running on ${serverUrl}`);
    });
    let response, content;
    while (true) {
      response = await fetch(serverUrl + "/result");
      content = await response.json();
      if (content.transaction_hash) {
        const transactionHash = content.transaction_hash;
        const walletAddress = content.wallet_address;
        console.log(`The witness tx hash has been retrieved: ${transactionHash}`);
        server.close();
        let data = {
          transaction_hash: transactionHash,
          wallet_address: walletAddress
        };
        return Promise.resolve(data);
      }
      console.log("Waiting for the witness...");
      await this.sleep(1e4);
    }
  }
  // Browser-specific implementation
  /**
  * Handles witnessing in browser environment
  * 
  * @param config - Witness configuration
  * @returns Promise resolving to witness transaction data
  * 
  * This method:
  * - Verifies MetaMask presence
  * - Requests account access
  * - Ensures correct network chain
  * - Sends witness transaction
  * - Returns transaction details
  */
  static async browserWitness(config) {
    const ethChainIdMap = {
      "mainnet": "0x1",
      "sepolia": "0xaa36a7",
      "holesky": "0x4268"
    };
    if (!window.ethereum.isMetaMask) {
      throw new Error("MetaMask not detected");
    }
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const wallet = accounts[0];
    const { ethers: ethers5 } = await import("ethers");
    const walletAddress = ethers5.getAddress(wallet);
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const requestedChainId = ethChainIdMap[config.witnessNetwork];
    if (requestedChainId !== chainId) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: requestedChainId }]
      });
    }
    const params = [{
      from: walletAddress,
      to: config.smartContractAddress,
      data: "0x9cef4ea1" + config.witnessEventVerificationHash.replace(/^0x/, "")
    }];
    const transactionHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params
    });
    return {
      transaction_hash: transactionHash,
      wallet_address: walletAddress
    };
  }
  // Generate Witness HTML for Metamask
  static generateWitnessHtml(config) {
    return `
    <html>
      <script type="module">
       import { getAddress } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js';
    
        const witnessNetwork = "${config.witnessNetwork}"
        const smart_contract_address = "${config.smartContractAddress}"
        const witness_event_verification_hash = "${config.witnessEventVerificationHash}"
        const localServerUrl = window.location.href;

        const doWitness = async (wallet_address) => {
        // Apply ethers.js checksumming to the address
        wallet_address = getAddress(wallet_address);

          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          const requestedChainId = ${JSON.stringify(this.ethChainIdMap)}[witnessNetwork]
          
          if (requestedChainId !== chainId) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: requestedChainId }],
            })
          }

          const params = [{
            from: wallet_address,
            to: smart_contract_address,
            data: '0x9cef4ea1' + witness_event_verification_hash.replace(/^0x/, ''),
          }]

          const transaction_hash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: params,
          })

          document.getElementById("transaction_hash").innerHTML = 
            \`Transaction hash of the witness network: \${transaction_hash} (you may close this tab)\`
          
          await fetch(localServerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transaction_hash, wallet_address })
          })
        }

        if (window.ethereum && window.ethereum.isMetaMask) {
          window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts) => {
            await doWitness(accounts[0])
          })
        } else {
          alert("Metamask not detected")
        }
      </script>
      <body>
        <div id="transaction_hash"></div>
      </body>
    </html>
    `;
  }
  // CLI Witness Method
  static async witnessCli(walletPrivateKey, witnessEventVerificationHash, smartContractAddress, WitnessNetwork3, providerUrl) {
    const logData = [];
    try {
      const provider = providerUrl ? new import_ethers4.ethers.JsonRpcProvider(providerUrl) : import_ethers4.ethers.getDefaultProvider(WitnessNetwork3);
      const wallet = new import_ethers4.ethers.Wallet(walletPrivateKey, provider);
      const sender = wallet.address;
      console.log(`Using wallet: ${sender}`);
      if (!witnessEventVerificationHash.startsWith("0x")) {
        throw new Error("Invalid witness verification hash: must start with '0x'");
      }
      const tx = {
        from: sender,
        to: smartContractAddress,
        data: `0x9cef4ea1${witnessEventVerificationHash.slice(2)}`
      };
      const balance = await provider.getBalance(sender);
      const balanceInEth = import_ethers4.ethers.formatEther(balance);
      logData.push({
        log: `Sender Balance: ${balanceInEth} ETH`,
        logType: "debug_data" /* DEBUGDATA */
      });
      const estimatedGas = await provider.estimateGas(tx);
      logData.push({
        log: `Estimated Gas: ${estimatedGas.toString()} units`,
        logType: "debug_data" /* DEBUGDATA */
      });
      const feeData = await provider.getFeeData();
      logData.push({
        log: `Fee data: ", ${feeData}`,
        logType: "debug_data" /* DEBUGDATA */
      });
      const gasPrice = feeData.gasPrice ? feeData.gasPrice : BigInt(0);
      logData.push({
        log: `Gas Price: ${import_ethers4.ethers.formatUnits(gasPrice, "gwei")} Gwei`,
        logType: "debug_data" /* DEBUGDATA */
      });
      const gasCost = estimatedGas * gasPrice;
      const gasCostInEth = import_ethers4.ethers.formatEther(gasCost);
      logData.push({
        log: `Estimated Gas Fee: ${gasCostInEth} ETH`,
        logType: "debug_data" /* DEBUGDATA */
      });
      if (balance < gasCost) {
        logData.push({
          log: `Estimated Gas Fee: ${gasCostInEth} ETH`,
          logType: "debug_data" /* DEBUGDATA */
        });
        throw new Error("Insufficient balance for gas fee.");
      }
      const signedTx = await wallet.sendTransaction({
        ...tx,
        gasLimit: estimatedGas,
        gasPrice
      });
      logData.push({
        log: `Transaction sent! Hash: ${signedTx.hash}`,
        logType: "debug_data" /* DEBUGDATA */
      });
      return [{ error: null, transactionHash: signedTx.hash }, logData];
    } catch (error) {
      logData.push({
        log: `Error sending transaction:', ${error}`,
        logType: "error" /* ERROR */
      });
      return [{ error: error.message }, logData];
    }
  }
  // Verify Transaction Method
  static async verify(WitnessNetwork3, transactionHash, expectedMR, _expectedTimestamp) {
    const provider = import_ethers4.ethers.getDefaultProvider(WitnessNetwork3);
    const tx = await provider.getTransaction(transactionHash);
    if (!tx) {
      return [false, "Transaction not found"];
    }
    ;
    let actual = tx.data.split("0x9cef4ea1")[1];
    actual = actual.slice(0, 128);
    await this.sleep(200);
    const actualMrSans0x = actual.startsWith("0x") ? actual.slice(2) : actual;
    const mrSans0x = expectedMR.startsWith("0x") ? expectedMR.slice(2) : expectedMR;
    return [actualMrSans0x === mrSans0x, `${actualMrSans0x === mrSans0x ? "On-Chain Witness hash verified" : "On-Chain Witness verification failed"}`];
  }
};
// Internal Configuration Maps
/**
* Maps witness networks to their corresponding Ethereum chain IDs
* 
* @private
* @readonly
*/
WitnessEth.ethChainIdMap = {
  mainnet: "0x1",
  sepolia: "0xaa36a7",
  holesky: "0x4268"
};

// src/witness/witness_tsa.ts
var asn1js = __toESM(require("asn1js"), 1);
var pkijs = __toESM(require("pkijs"), 1);
var WitnessTSA = class {
  constructor() {
    /**
    * Converts ISO date to Unix timestamp
    * 
    * @param t - Date object or ISO date string
    * @returns Unix timestamp (seconds since epoch)
    * 
    * This method normalizes dates to Unix timestamps for
    * consistent timestamp handling across the system.
    */
    this.isoDate2unix = (t) => {
      const date = t instanceof Date ? t : new Date(t);
      return Math.floor(date.getTime() / 1e3);
    };
    /**
    * Extracts generation time from TSA response
    * 
    * @param resp - TSA response object
    * @returns Unix timestamp of when TSA generated the timestamp
    * 
    * This method:
    * - Extracts signed data from TSA response
    * - Parses TSTInfo structure
    * - Converts TSA generation time to Unix timestamp
    */
    this.extractGenTimeFromResp = (resp) => {
      const signedData = new pkijs.SignedData({
        schema: resp?.timeStampToken?.content
      });
      const tstInfoAsn1 = asn1js.fromBER(
        signedData.encapContentInfo.eContent.valueBlock.valueHexView
      );
      const tstInfo = new pkijs.TSTInfo({ schema: tstInfoAsn1.result });
      return this.isoDate2unix(tstInfo.genTime);
    };
    /**
    * Creates a timestamp request and submits to TSA
    * 
    * @param hash - Hash to be timestamped
    * @param tsaUrl - URL of the Time Stamp Authority service
    * @returns Promise resolving to [base64 response, provider name, timestamp]
    * 
    * This method:
    * - Creates SHA-256 hash of input
    * - Constructs TSP request according to RFC 3161
    * - Submits request to TSA service
    * - Validates TSA response
    * - Returns encoded response and timestamp
    */
    this.witness = async (hash, tsaUrl) => {
      const hashHex = getHashSum(hash);
      const hashBuffer = Uint8Array.from(Buffer.from(hashHex, "hex"));
      const tspReq = new pkijs.TimeStampReq({
        version: 1,
        messageImprint: new pkijs.MessageImprint({
          hashAlgorithm: new pkijs.AlgorithmIdentifier({
            algorithmId: "2.16.840.1.101.3.4.2.1"
            // OID for SHA2-256
          }),
          hashedMessage: new asn1js.OctetString({ valueHex: hashBuffer.buffer })
        }),
        nonce: new asn1js.Integer({ value: Date.now() }),
        certReq: true
      });
      const tspReqSchema = tspReq.toSchema();
      const tspReqBuffer = tspReqSchema.toBER(false);
      const response = await fetch(tsaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/timestamp-query"
        },
        body: tspReqBuffer
      });
      const tspResponseBuffer = await response.arrayBuffer();
      const tspResponseAsn1 = asn1js.fromBER(tspResponseBuffer);
      const tspResponse = new pkijs.TimeStampResp({
        schema: tspResponseAsn1.result
      });
      if (tspResponse.status.status !== 0) {
        throw new Error("TSA response is invalid. Failed to witness");
      }
      const base64EncodedResp = Buffer.from(tspResponseBuffer).toString("base64");
      const witnessTimestamp = this.extractGenTimeFromResp(tspResponse);
      return [base64EncodedResp, "DigiCert", witnessTimestamp];
    };
    /**
    * Verifies a TSA timestamp response
    * 
    * @param transactionHash - Base64 encoded TSA response
    * @param expectedMR - Expected Merkle root hash
    * @param expectedTimestamp - Expected timestamp
    * @returns Promise resolving to boolean indicating verification success
    * 
    * This method:
    * - Decodes TSA response
    * - Verifies timestamp matches expected time
    * - Verifies hashed content matches expected Merkle root
    * - Uses SHA-256 for hash verification
    */
    this.verify = async (transactionHash, expectedMR, expectedTimestamp) => {
      const tspResponseBuffer = Buffer.from(transactionHash, "base64");
      const tspResponseAsn1 = asn1js.fromBER(tspResponseBuffer);
      const tspResponse = new pkijs.TimeStampResp({
        schema: tspResponseAsn1.result
      });
      const signedData = new pkijs.SignedData({
        schema: tspResponse.timeStampToken.content
      });
      const tstInfoAsn1 = asn1js.fromBER(
        signedData.encapContentInfo.eContent.valueBlock.valueHexView
      );
      const tstInfo = new pkijs.TSTInfo({ schema: tstInfoAsn1.result });
      if (this.isoDate2unix(tstInfo.genTime) !== expectedTimestamp) {
        return false;
      }
      const hashHex = getHashSum(expectedMR);
      const messageImprintHash = Buffer.from(
        tstInfo.messageImprint.hashedMessage.valueBlock.valueHexView
      ).toString("hex");
      return messageImprintHash === hashHex;
    };
  }
};

// src/witness/witness_nostr.ts
var import_pure = require("nostr-tools/pure");
var import_relay = require("nostr-tools/relay");

// node_modules/@noble/hashes/esm/utils.js
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}

// src/witness/witness_nostr.ts
var nip19 = __toESM(require("nostr-tools/nip19"), 1);
var import_ws = __toESM(require("ws"), 1);
var WitnessNostr = class {
  constructor() {
    /**
    * Waits for an event from a specific author on a Nostr relay
    * 
    * @param relay - Connected Nostr relay instance
    * @param pk - Public key of the author to watch
    * @returns Promise resolving to the received Nostr event
    * 
    * This method:
    * - Subscribes to kind 1 events from specific author
    * - Returns first matching event received
    */
    this.waitForEventAuthor = async (relay, pk) => {
      return new Promise((resolve) => {
        relay.subscribe([
          {
            kinds: [1],
            authors: [pk]
          }
        ], {
          onevent(event) {
            resolve(event);
          }
        });
      });
    };
    /**
    * Waits for a specific event by ID on a Nostr relay
    * 
    * @param relay - Connected Nostr relay instance
    * @param id - Event ID to watch for
    * @returns Promise resolving to the received Nostr event
    * 
    * This method:
    * - Subscribes to events with specific ID
    * - Returns first matching event received
    */
    this.waitForEventId = async (relay, id) => {
      return new Promise((resolve) => {
        relay.subscribe([
          {
            ids: [id]
          }
        ], {
          onevent(event) {
            resolve(event);
          }
        });
      });
    };
    /**
    * Creates a witness event on Nostr network
    * 
    * @param witnessEventVerificationHash - Hash to be witnessed
    * @param credentials - Credentials containing Nostr secret key
    * @returns Promise resolving to [nevent, npub, timestamp]
    * 
    * This method:
    * - Validates Nostr credentials
    * - Creates and signs Nostr event
    * - Publishes event to relay
    * - Returns event details and timestamp
    * 
    * Uses damus.io relay and supports both browser and Node.js
    * environments with appropriate WebSocket handling.
    */
    this.witness = async (witnessEventVerificationHash, credentials) => {
      const skHex = credentials.nostr_sk;
      const relayUrl = "wss://relay.damus.io";
      if (!skHex) {
        throw new Error("Nostr SK key is required. Please get an API key from https://snort.social/login/sign-up");
      }
      const sk = hexToBytes(skHex);
      const pk = (0, import_pure.getPublicKey)(sk);
      const npub = nip19.npubEncode(pk);
      console.log("npub: ", npub);
      console.log("Witness event verification hash: ", witnessEventVerificationHash);
      console.log(`https://snort.social/${npub}`);
      const eventTemplate = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1e3),
        tags: [],
        content: witnessEventVerificationHash
      };
      const event = (0, import_pure.finalizeEvent)(eventTemplate, sk);
      const isNode = typeof window === "undefined";
      let websocket;
      if (isNode) {
        websocket = import_ws.default;
        global.WebSocket = websocket;
      }
      console.log("Is node: ", isNode);
      const relay = await import_relay.Relay.connect(relayUrl);
      console.log(`connected to ${relay.url}`);
      await relay.publish(event);
      const publishEvent = await this.waitForEventAuthor(relay, pk);
      relay.close();
      const nevent = nip19.neventEncode({
        id: publishEvent.id,
        relays: [relay.url],
        author: publishEvent.pubkey
      });
      const witnessTimestamp = publishEvent.created_at;
      console.log(`got event https://snort.social/${nevent}`);
      return [nevent, npub, witnessTimestamp];
    };
    /**
    * Verifies a Nostr witness event
    * 
    * @param transactionHash - Nostr event identifier (nevent)
    * @param expectedMR - Expected Merkle root
    * @param expectedTimestamp - Expected event timestamp
    * @returns Promise resolving to boolean indicating verification success
    * 
    * This method:
    * - Decodes Nostr event identifier
    * - Retrieves event from relay
    * - Verifies timestamp and content match
    * - Supports both browser and Node.js environments
    */
    this.verify = async (transactionHash, expectedMR, expectedTimestamp) => {
      const decoded = nip19.decode(transactionHash);
      const relayUrl = "wss://relay.damus.io";
      if (decoded.type !== "nevent") {
        return false;
      }
      const isNode = typeof window === "undefined";
      let websocket;
      if (isNode) {
        websocket = import_ws.default;
        global.WebSocket = websocket;
      }
      console.log("Is node: ", isNode);
      const relay = await import_relay.Relay.connect(relayUrl);
      const publishEvent = await this.waitForEventId(relay, decoded.data.id);
      relay.close();
      if (expectedTimestamp !== publishEvent.created_at) {
        return false;
      }
      const merkleRoot = publishEvent.content;
      return merkleRoot === expectedMR;
    };
  }
};

// src/core/witness.ts
async function witnessAquaTreeUtil(aquaTreeWrapper, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar = false) {
  let logs = [];
  let lastRevisionHash = "";
  if (aquaTreeWrapper.revision == void 0 || aquaTreeWrapper.revision == null || aquaTreeWrapper.revision.length == 0) {
    const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions);
    lastRevisionHash = verificationHashes[verificationHashes.length - 1];
  } else {
    lastRevisionHash = aquaTreeWrapper.revision;
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")));
  const revisionType = "witness";
  let verificationDataBasic = {
    previous_verification_hash: lastRevisionHash,
    local_timestamp: timestamp,
    revision_type: revisionType
  };
  verificationDataBasic["version"] = `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? "scalar" : "tree"}`;
  const revisionResultData = await prepareWitness(lastRevisionHash, witnessType, witnessPlatform, credentials, witnessNetwork);
  if (isErr(revisionResultData)) {
    revisionResultData.data.forEach((e) => logs.push(e));
    return Err(logs);
  }
  let witness = revisionResultData.data;
  let verificationDataRaw = { ...verificationDataBasic, ...witness };
  let verificationData = reorderRevisionsProperties(verificationDataRaw);
  const leaves = dict2Leaves(verificationData);
  let verification_hash = "";
  if (enableScalar) {
    verification_hash = "0x" + getHashSum(JSON.stringify(verificationData));
  } else {
    verification_hash = getMerkleRoot(leaves);
    verificationData.leaves = leaves;
  }
  const revisions = aquaTreeWrapper.aquaTree.revisions;
  revisions[verification_hash] = verificationData;
  let aquaTreeWithTree = createAquaTree(aquaTreeWrapper.aquaTree);
  if (!aquaTreeWithTree) {
    logs.push({
      log: `Failed to create AquaTree`,
      logType: "error" /* ERROR */
    });
    return Err(logs);
  }
  logs.push({
    log: `AquaTree witnessed succesfully`,
    logType: "success" /* SUCCESS */
  });
  let result = {
    aquaTree: aquaTreeWithTree,
    aquaTrees: [],
    logData: logs
  };
  return Ok(result);
}
async function witnessMultipleAquaTreesUtil(aquaTrees, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar = false) {
  let logs = [];
  let lastRevisionOrSpecifiedHashes = [];
  for (let item of aquaTrees) {
    if (item.revision != null && item.revision != void 0 && item.revision.length > 0) {
      lastRevisionOrSpecifiedHashes.push(item.revision);
    } else {
      const verificationHashes = Object.keys(item.aquaTree.revisions);
      lastRevisionOrSpecifiedHashes.push(verificationHashes[verificationHashes.length - 1]);
    }
  }
  let merkleRoot = getMerkleRoot(lastRevisionOrSpecifiedHashes);
  let revisionResultData = await prepareWitness(merkleRoot, witnessType, witnessPlatform, credentials, witnessNetwork);
  if (isErr(revisionResultData)) {
    revisionResultData.data.forEach((e) => logs.push(e));
    return Err(logs);
  }
  let revisionResult = revisionResultData.data;
  revisionResult.witness_merkle_proof = lastRevisionOrSpecifiedHashes;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")));
  const revisionType = "witness";
  let aquaTreesResult = [];
  let hasError = false;
  for (let item of aquaTrees) {
    let latestOrSpecifiedRevisionKey = "";
    if (item.revision != null && item.revision != void 0 && item.revision.length > 0) {
      latestOrSpecifiedRevisionKey = item.revision;
    } else {
      const verificationHashes = Object.keys(item.aquaTree.revisions);
      latestOrSpecifiedRevisionKey = verificationHashes[verificationHashes.length - 1];
    }
    let verificationData = {
      previous_verification_hash: latestOrSpecifiedRevisionKey,
      local_timestamp: timestamp,
      revision_type: revisionType,
      ...revisionResult
    };
    const revisions = item.aquaTree.revisions;
    const leaves = dict2Leaves(verificationData);
    if (!enableScalar) {
      verificationData.leaves = leaves;
    }
    const verificationHash = getMerkleRoot(leaves);
    revisions[verificationHash] = verificationData;
    item.aquaTree.revisions = revisions;
    let aquaTreeUpdatedData = createAquaTree(item.aquaTree);
    let aquaTreeUpdated = reorderAquaTreeRevisionsProperties(aquaTreeUpdatedData);
    if (aquaTreeUpdated) {
      aquaTreesResult.push(aquaTreeUpdated);
    }
  }
  if (hasError) {
    return Err(logs);
  }
  logs.push({
    log: `All aquaTrees witnessed succesfully`,
    logType: "success" /* SUCCESS */
  });
  let resutData = {
    aquaTree: null,
    logData: logs,
    aquaTrees: aquaTreesResult
  };
  return Ok(resutData);
}
function getWitnessNetwork(witnessType, witnessNetwork) {
  let witness_network = witnessNetwork;
  switch (witnessType) {
    case "nostr": {
      witness_network = "nostr";
      break;
    }
    case "tsa": {
      witness_network = "TSA_RFC3161";
      break;
    }
  }
  return witness_network;
}
var prepareWitness = async (verificationHash, witnessType, WitnessPlatformType2, credentials, witness_network = "sepolia") => {
  let logs = [];
  const merkle_root = verificationHash;
  let smart_contract_address, transactionHash, publisher, witnessTimestamp;
  switch (witnessType) {
    case "nostr": {
      let witnessNostr = new WitnessNostr();
      [transactionHash, publisher, witnessTimestamp] = await witnessNostr.witness(merkle_root, credentials);
      smart_contract_address = "N/A";
      break;
    }
    case "tsa": {
      const tsaUrl = "http://timestamp.digicert.com";
      let witnessTsa = new WitnessTSA();
      [transactionHash, publisher, witnessTimestamp] = await witnessTsa.witness(merkle_root, tsaUrl);
      smart_contract_address = tsaUrl;
      break;
    }
    case "eth": {
      smart_contract_address = "0x45f59310ADD88E6d23ca58A0Fa7A55BEE6d2a611";
      let network = "sepolia";
      if (witness_network == "holesky") {
        network = "holesky";
      } else if (witness_network == "mainnet") {
        network = "mainnet";
      }
      if (WitnessPlatformType2 === "cli") {
        if (credentials == null || credentials == void 0) {
          logs.push({
            log: `credentials not found`,
            logType: "error" /* ERROR */
          });
          return Err(logs);
        }
        let [_wallet, walletAddress, _publicKey] = await getWallet(credentials.mnemonic);
        logs.push({
          log: `Wallet address: ${_wallet}`,
          logType: "signature" /* SIGNATURE */
        });
        const [gasEstimateResult, logData] = await estimateWitnessGas(
          walletAddress,
          merkle_root,
          witness_network,
          smart_contract_address,
          ""
        );
        logs.push(...logData);
        logs.push({
          log: `Gas estimate result: : ${gasEstimateResult}`,
          logType: "debug_data" /* DEBUGDATA */
        });
        if (gasEstimateResult.error !== null) {
          logs.push({
            log: `Unable to Estimate gas fee: ${gasEstimateResult.error}`,
            logType: "debug_data" /* DEBUGDATA */
          });
          process.exit(1);
        }
        if (!gasEstimateResult.hasEnoughBalance) {
          logs.push({
            log: `\u{1F537} You do not have enough balance to cater for gas fees : ${gasEstimateResult}`,
            logType: "debug_data" /* DEBUGDATA */
          });
          logs.push({
            log: `Add some faucets to this wallet address: ${walletAddress}
`,
            logType: "debug_data" /* DEBUGDATA */
          });
          process.exit(1);
        }
        let transactionResult = null;
        try {
          let [transactionResultData, resultLogData] = await WitnessEth.witnessCli(
            _wallet.privateKey,
            verificationHash,
            smart_contract_address,
            network,
            ""
          );
          transactionResult = transactionResultData;
          logs.push(...resultLogData);
          logs.push({
            logType: "witness" /* WITNESS */,
            log: "cli witness result: \n" + JSON.stringify(transactionResult)
          });
        } catch (e) {
          logs.push({
            logType: "error" /* ERROR */,
            log: "An error witnessing using etherium "
          });
        }
        if (transactionResult == null || transactionResult.error != null || !transactionResult.transactionHash) {
          logs.push({
            logType: "error" /* ERROR */,
            log: "An error witnessing using etherium (empty object or missing transaction hash)"
          });
          return Err(logs);
        }
        transactionHash = transactionResult.transactionHash;
        publisher = walletAddress;
      } else {
        let config = {
          smartContractAddress: smart_contract_address,
          witnessEventVerificationHash: merkle_root,
          witnessNetwork: network
        };
        let witnessResult = await WitnessEth.witnessMetamask(
          config
        );
        transactionHash = witnessResult.transaction_hash;
        publisher = witnessResult.wallet_address;
      }
      witnessTimestamp = Math.floor(Date.now() / 1e3);
      break;
    }
    default: {
      console.error(`Unknown witness method: ${witnessType}`);
      process.exit(1);
    }
  }
  const witness = {
    witness_merkle_root: merkle_root,
    witness_timestamp: witnessTimestamp,
    witness_network: getWitnessNetwork(witnessType, witness_network),
    witness_smart_contract_address: smart_contract_address,
    witness_transaction_hash: transactionHash,
    witness_sender_account_address: publisher,
    witness_merkle_proof: [verificationHash]
  };
  return Ok(witness);
};
async function verifyWitness(witnessData, verificationHash, doVerifyMerkleProof, indentCharacter) {
  let logs = [];
  let isValid = false;
  const hasInternet = await checkInternetConnection();
  if (!hasInternet) {
    logs.push({
      log: `No internet connection available. Witness verification requires internet access.`,
      logType: "error" /* ERROR */,
      ident: indentCharacter
    });
    return [false, logs];
  }
  if (verificationHash === "") {
    logs.push({
      log: `The verification Hash MUST NOT be empty`,
      logType: "error" /* ERROR */,
      ident: indentCharacter
    });
    return [isValid, logs];
  }
  if (witnessData.witness_network === "nostr") {
    let witnessNostr = new WitnessNostr();
    isValid = await witnessNostr.verify(
      witnessData.witness_transaction_hash,
      witnessData.witness_merkle_root,
      witnessData.witness_timestamp
    );
  } else if (witnessData.witness_network === "TSA_RFC3161") {
    let witnessTsa = new WitnessTSA();
    isValid = await witnessTsa.verify(
      witnessData.witness_transaction_hash,
      witnessData.witness_merkle_root,
      witnessData.witness_timestamp
    );
  } else {
    let logMessage = "";
    [isValid, logMessage] = await WitnessEth.verify(
      witnessData.witness_network,
      witnessData.witness_transaction_hash,
      witnessData.witness_merkle_root,
      witnessData.witness_timestamp
    );
    logs.push({
      log: logMessage,
      logType: isValid ? "success" /* SUCCESS */ : "error" /* ERROR */,
      ident: indentCharacter
    });
  }
  if (doVerifyMerkleProof) {
    logs.push({
      log: `verifying merkle integrity`,
      logType: "info" /* INFO */,
      ident: indentCharacter
    });
    isValid = verifyMerkleIntegrity(
      // JSON.parse(witnessData.witness_merkle_proof),
      // verification_hash,
      witnessData.witness_merkle_proof ? witnessData.witness_merkle_proof : [],
      witnessData.witness_merkle_root
    );
    logs.push({
      log: `Merkle integrity is ${isValid ? "" : "NOT"} valid `,
      logType: isValid ? "success" /* SUCCESS */ : "error" /* ERROR */,
      ident: indentCharacter
    });
  }
  return [isValid, logs];
}

// src/core/verify.ts
async function verifyAquaTreeRevisionUtil(aquaTree, revision, revisionItemHash, fileObject) {
  let logs = [];
  const isScalar = !revision.hasOwnProperty("leaves");
  let result = await verifyRevision(
    aquaTree,
    revision,
    revisionItemHash,
    fileObject,
    isScalar
  );
  result[1].forEach((e) => logs.push(e));
  if (result[0] == false) {
    return Err(logs);
  }
  let data = {
    aquaTree,
    aquaTrees: [],
    logData: logs
  };
  return Ok(data);
}
async function verifyAquaTreeUtil(aquaTree, fileObject, identCharacter = "") {
  let logs = [];
  let verificationHashes = Object.keys(aquaTree.revisions);
  let isSuccess = true;
  for (let revisionItemHash of verificationHashes) {
    let revision = aquaTree.revisions[revisionItemHash];
    let revisionIndex = verificationHashes.indexOf(revisionItemHash);
    logs.push({
      logType: "arrow" /* ARROW */,
      log: ` ${revisionIndex + 1}.Verifying Revision: ${revisionItemHash}`,
      ident: identCharacter
    });
    switch (revision.revision_type) {
      case "form":
        logs.push({
          logType: "form" /* FORM */,
          log: "Type: Form.",
          ident: `${identCharacter}	`
        });
        break;
      case "file":
        logs.push({
          logType: "file" /* FILE */,
          log: "Type: File.",
          ident: `${identCharacter}	`
        });
        break;
      case "signature":
        if (revision.signature_type)
          logs.push({
            logType: "signature" /* SIGNATURE */,
            log: `Type: Signature ${revision.signature_type}`,
            ident: `${identCharacter}	`
          });
        break;
      case "witness":
        logs.push({
          logType: "witness" /* WITNESS */,
          log: `Type: Witness ${revision.witness_network}`,
          ident: `${identCharacter}	`
        });
        break;
      case "link":
        logs.push({
          logType: "link" /* LINK */,
          log: "Type: Link.",
          ident: `${identCharacter}	`
        });
        break;
      default:
        logs.push({
          logType: "warning" /* WARNING */,
          log: `Type: Unknown ${revision.revision_type}.
`,
          ident: `${identCharacter}	`
        });
    }
    const isScalar = !revision.hasOwnProperty("leaves");
    let result = await verifyRevision(
      aquaTree,
      revision,
      revisionItemHash,
      fileObject,
      isScalar,
      identCharacter
    );
    if (result[1].length > 0) {
      logs.push(...result[1]);
    }
    if (!result[0]) {
      isSuccess = false;
    }
  }
  if (!isSuccess) {
    return Err(logs);
  }
  let data = {
    aquaTree,
    aquaTrees: [],
    logData: logs
  };
  return Ok(data);
}
function findNode2(tree, hash) {
  if (tree.hash === hash) {
    return tree;
  }
  for (let i = 0; i < tree.verificationGraphData.length; i++) {
    const child = tree.verificationGraphData[i];
    const result = findNode2(child, hash);
    if (result) {
      return result;
    }
  }
  return null;
}
async function verifyAndGetGraphDataRevisionUtil(aquaTree, revision, revisionItemHash, fileObject) {
  const logs = [];
  const isScalar = !revision.hasOwnProperty("leaves");
  let [isGenesisOkay, genesisLogData] = await verifyRevision(
    aquaTree,
    revision,
    revisionItemHash,
    fileObject,
    isScalar
  );
  genesisLogData.forEach((e) => logs.push(e));
  if (!isGenesisOkay) {
    Err(logs);
  }
  const genesisRevisionType = revision.revision_type;
  const fileGraphData = {
    isValidationSucessful: isGenesisOkay
  };
  const verificationResults = {
    hash: revisionItemHash,
    previous_verification_hash: getPreviousVerificationHash(
      aquaTree,
      revisionItemHash
    ),
    timestamp: revision.local_timestamp,
    isValidationSucessful: isGenesisOkay,
    revisionType: genesisRevisionType,
    verificationGraphData: [],
    linkVerificationGraphData: [],
    info: fileGraphData
  };
  return Ok(verificationResults);
}
async function verifyAndGetGraphDataUtil(aquaTree, fileObject, identCharacter = "") {
  let verificationHashes = Object.keys(aquaTree.revisions);
  const logs = [];
  if (verificationHashes.length === 0) {
    logs.push({
      logType: "error" /* ERROR */,
      log: "Revisions should be greater than 0"
    });
    return Err(logs);
  }
  let genesisRevisionData = aquaTree.revisions[verificationHashes[0]];
  let infoGraphData = null;
  const isScalar = !genesisRevisionData.hasOwnProperty("leaves");
  let [isGenesisOkay, _genesisVerificationLogs] = await verifyRevision(
    aquaTree,
    genesisRevisionData,
    verificationHashes[0],
    fileObject,
    isScalar,
    identCharacter
  );
  const genesisRevisionType = aquaTree.revisions[verificationHashes[0]].revision_type;
  if (genesisRevisionData.revision_type === "form") {
    let { formKeysGraphData } = verifyFormRevision(
      genesisRevisionData,
      genesisRevisionData.leaves
    );
    let formData = {
      formKeys: formKeysGraphData
    };
    infoGraphData = formData;
  } else {
    const fileGraphData = {
      isValidationSucessful: isGenesisOkay
    };
    infoGraphData = fileGraphData;
  }
  const verificationResults = {
    hash: verificationHashes[0],
    previous_verification_hash: genesisRevisionData.previous_verification_hash,
    timestamp: genesisRevisionData.local_timestamp,
    isValidationSucessful: isGenesisOkay,
    revisionType: genesisRevisionType,
    verificationGraphData: [],
    linkVerificationGraphData: [],
    info: infoGraphData
  };
  if (verificationHashes.length === 1) {
    return Ok(verificationResults);
  }
  let isSuccess = true;
  for (let revisionItemHash of verificationHashes.slice(1)) {
    let revision = aquaTree.revisions[revisionItemHash];
    let revisionIndex = verificationHashes.indexOf(revisionItemHash);
    logs.push({
      logType: "arrow" /* ARROW */,
      log: ` ${revisionIndex + 1}.Verifying Revision: ${revisionItemHash}`,
      ident: identCharacter
    });
    switch (revision.revision_type) {
      case "form":
        logs.push({
          logType: "form" /* FORM */,
          log: "Type:Form.",
          ident: `${identCharacter}	`
        });
        break;
      case "file":
        logs.push({
          logType: "file" /* FILE */,
          log: "Type: File.",
          ident: `${identCharacter}	`
        });
        break;
      case "signature":
        if (revision.signature_type)
          logs.push({
            logType: "signature" /* SIGNATURE */,
            log: `Type:Signature ${revision.signature_type}`,
            ident: `${identCharacter}	`
          });
        break;
      case "witness":
        logs.push({
          logType: "witness" /* WITNESS */,
          log: "Type:Witness.",
          ident: `${identCharacter}	`
        });
        break;
      case "link":
        logs.push({
          logType: "link" /* LINK */,
          log: "Type:Link.",
          ident: `${identCharacter}	`
        });
        break;
      default:
        logs.push({
          logType: "warning" /* WARNING */,
          log: `Type:Unknown ${revision.revision_type}.
`,
          ident: `${identCharacter}	`
        });
    }
    const isScalar2 = !revision.hasOwnProperty("leaves");
    let result = await verifyRevision(
      aquaTree,
      revision,
      revisionItemHash,
      fileObject,
      isScalar2,
      identCharacter
    );
    let verificationResultsNode = findNode2(
      verificationResults,
      revision.previous_verification_hash
    );
    if (verificationResultsNode === null) {
      logs.push({
        logType: "error" /* ERROR */,
        log: `A detached chain detected. Cannot find previous verification hash: ${revision.previous_verification_hash}`
      });
      isSuccess = false;
      break;
    }
    let linkedVerificationGraphData = [];
    if (revision.revision_type === "link") {
      let aqtreeFilename = aquaTree.file_index[revision.link_verification_hashes[0]];
      let name = `${aqtreeFilename}.aqua.json`;
      let linkedAquaTree = getFileNameCheckingPaths(fileObject, name);
      if (!linkedAquaTree) {
        logs.push({
          logType: "error" /* ERROR */,
          log: "Linked aqua tree not found"
        });
        break;
      }
      let result2 = await verifyAndGetGraphDataUtil(
        linkedAquaTree.fileContent,
        fileObject,
        `${identCharacter}	`
      );
      if (result2.isOk()) {
        linkedVerificationGraphData = [result2.data];
      } else {
        isSuccess = false;
        logs.push({
          logType: "error" /* ERROR */,
          log: "Linked aqua tree failed to create graph data"
        });
        break;
      }
    }
    let data = void 0;
    if (revision.revision_type === "form") {
      let { formKeysGraphData } = verifyFormRevision(revision, revision.leaves);
      let formData = {
        formKeys: formKeysGraphData
      };
      data = formData;
    } else if (revision.revision_type === "file") {
      let formData = {
        isValidationSucessful: result[0]
      };
      data = formData;
    } else if (revision.revision_type === "link") {
      let formData = {
        isValidationSucessful: result[0]
      };
      data = formData;
    } else if (revision.revision_type === "signature") {
      let formData = {
        isValidationSucessful: result[0],
        walletAddress: revision.signature_wallet_address,
        chainHashIsValid: result[0],
        signature: revision.signature,
        signatureType: revision.signature_type
      };
      data = formData;
    } else if (revision.revision_type === "witness") {
      let formData = {
        isValidationSucessful: result[0],
        txHash: revision.witness_transaction_hash,
        merkleRoot: revision.witness_merkle_root
      };
      data = formData;
    }
    verificationResultsNode.verificationGraphData.push({
      hash: revisionItemHash,
      previous_verification_hash: revision.previous_verification_hash,
      timestamp: revision.local_timestamp,
      isValidationSucessful: result[0],
      revisionType: revision.revision_type,
      verificationGraphData: [],
      linkVerificationGraphData: linkedVerificationGraphData,
      info: data
    });
    if (result[1].length > 0) {
      logs.push(...result[1]);
    }
    if (!result[0]) {
      isSuccess = false;
    }
  }
  if (!isSuccess) {
    return Err(logs);
  }
  return Ok(verificationResults);
}
async function verifyRevision(aquaTree, revisionPar, verificationHash, fileObjects, isScalar, identCharacter = "") {
  let logs = [];
  let doVerifyMerkleProof = false;
  let isSuccess = true;
  let isScalarSuccess = true;
  let verifyWitnessMerkleProof = false;
  let revision = reorderRevisionsProperties(revisionPar);
  if (revision.revision_type === "witness" && revision.witness_merkle_proof.length > 1) {
    verifyWitnessMerkleProof = true;
  }
  if (isScalar && !verifyWitnessMerkleProof) {
    let revData = JSON.stringify(revision);
    const actualVH = "0x" + getHashSum(revData);
    isScalarSuccess = actualVH === verificationHash;
    if (!isScalarSuccess) {
      logs.push({
        logType: "debug_data" /* DEBUGDATA */,
        log: `calculated  hash ${actualVH} expected hash ${verificationHash} `,
        ident: `${identCharacter}	`
      });
      logs.push({
        logType: "debug_data" /* DEBUGDATA */,
        log: ` expected hash ${verificationHash} `,
        ident: `${identCharacter}	`
      });
      logs.push({
        logType: "error" /* ERROR */,
        log: `Scalar revision verification failed`,
        ident: `${identCharacter}	`
      });
    } else {
    }
  } else {
    if (doVerifyMerkleProof) {
      logs.push({
        logType: "info" /* INFO */,
        log: "Verifying revision merkle tree .",
        ident: `${identCharacter}	`
      });
      let [ok, result] = verifyRevisionMerkleTreeStructure(
        revision,
        verificationHash
      );
      if (!ok) {
        return [ok, result];
      }
    }
  }
  let linkIdentChar = `${identCharacter}	`;
  let logsResult = [];
  switch (revision.revision_type) {
    case "form":
      let res = verifyFormRevision(revision, revision.leaves, identCharacter);
      isSuccess = res.isOk;
      logsResult = logs;
      logs.push(...res.logs);
      break;
    case "file":
      let fileContent;
      if (!!revision.content) {
        fileContent = Buffer.from(revision.content, "utf8");
      } else {
        let fileName = aquaTree.file_index[verificationHash];
        let fileObjectItem = getFileNameCheckingPaths(fileObjects, fileName);
        if (fileObjectItem == void 0) {
          logs.push({
            log: `file not found in file objects`,
            logType: "error" /* ERROR */,
            ident: `${identCharacter}	`
          });
          return [false, logs];
        }
        if (fileObjectItem.fileContent instanceof Uint8Array) {
          fileContent = Buffer.from(fileObjectItem.fileContent);
        } else {
          if (typeof fileObjectItem.fileContent === "string") {
            fileContent = Buffer.from(fileObjectItem.fileContent);
          } else {
            fileContent = Buffer.from(
              JSON.stringify(fileObjectItem.fileContent)
            );
          }
        }
      }
      const fileHash = getHashSum(fileContent);
      isSuccess = fileHash === revision.file_hash;
      break;
    case "signature":
      ;
      [isSuccess, logsResult] = await verifySignature(
        revision,
        revision.previous_verification_hash,
        `${identCharacter}	`
      );
      break;
    case "witness":
      let hash_ = revision.previous_verification_hash;
      if (revision.previous_verification_hash !== revision.witness_merkle_root) {
        hash_ = revision.witness_merkle_root;
      }
      let [isSuccessResult, logsResultData] = await verifyWitness(
        revision,
        hash_,
        doVerifyMerkleProof,
        `${identCharacter}	`
      );
      logsResult = logsResultData;
      isSuccess = isSuccessResult;
      break;
    case "link":
      let linkOk = true;
      for (const [_idx, vh] of revision.link_verification_hashes.entries()) {
        const fileUriFromAquaTree = aquaTree.file_index[vh];
        let fileUri = fileUriFromAquaTree;
        if (fileUriFromAquaTree.includes("/")) {
          fileUri = fileUriFromAquaTree.split("/").pop();
        }
        const aquaFileUri = `${fileUri}.aqua.json`;
        let fileObj = getFileNameCheckingPaths(fileObjects, aquaFileUri);
        if (!fileObj) {
          let throwError = true;
          for (let fileObjectItem of fileObjects) {
            if (fileObjectItem.fileName.endsWith(".aqua.json")) {
              let aquaTree2 = fileObjectItem.fileContent;
              let revisionHashes = Object.keys(aquaTree2.revisions);
              if (revisionHashes.includes(vh)) {
                let genesisHash = getGenesisHash(aquaTree2);
                let fileName = aquaTree2.file_index[genesisHash];
                let fileUriObj = getFileNameCheckingPaths(fileObjects, fileName);
                if (fileUriObj == void 0) {
                  break;
                }
                let fileUri2 = fileUriObj.fileName;
                const aquaFileUri2 = `${fileUri2}.aqua.json`;
                logs.push({
                  log: `Deep Linking Verifying linked File ${aquaFileUri2}.`,
                  logType: "info" /* INFO */,
                  ident: `${identCharacter}	`
                });
                try {
                  let fileObj2 = getFileNameCheckingPaths(fileObjects, aquaFileUri2);
                  if (fileObj2 == void 0 || fileObj2 === null) {
                    logs.push({
                      log: `Aqua tree ${aquaFileUri2}  not found`,
                      logType: "error" /* ERROR */,
                      ident: `${identCharacter}	`
                    });
                    break;
                  }
                  const linkAquaTree = fileObj2.fileContent;
                  let linkVerificationResult = await verifyAquaTreeUtil(
                    linkAquaTree,
                    fileObjects,
                    `${linkIdentChar}	`
                  );
                  if (isErr(linkVerificationResult)) {
                    linkOk = false;
                    logs.push(...linkVerificationResult.data);
                    logs.push({
                      log: `verification of ${fileUri2}.aqua.json failed `,
                      logType: "error" /* ERROR */,
                      ident: linkIdentChar
                      //`${identCharacter}\t`
                    });
                  } else {
                    logs.push(...linkVerificationResult.data.logData);
                    logs.push({
                      log: `successfully verified ${fileUri2}.aqua.json `,
                      logType: "success" /* SUCCESS */,
                      ident: linkIdentChar
                      //`${identCharacter}\t`
                    });
                  }
                } catch (error) {
                  linkOk = false;
                  logs.push({
                    log: `Error verifying linked file ${aquaFileUri2}: ${error}`,
                    logType: "error" /* ERROR */,
                    ident: `${identCharacter}	`
                  });
                }
                throwError = false;
                break;
              }
            }
          }
          if (throwError) {
            linkOk = false;
            logs.push({
              log: `File ${fileUri} not found in file objects`,
              logType: "error" /* ERROR */,
              ident: `${identCharacter}	`
            });
          }
        } else {
          logs.push({
            log: `Verifying linked File ${aquaFileUri}.`,
            logType: "info" /* INFO */,
            ident: `${identCharacter}	`
          });
          try {
            const linkAquaTree = fileObj.fileContent;
            let linkVerificationResult = await verifyAquaTreeUtil(
              linkAquaTree,
              fileObjects,
              `${linkIdentChar}	`
            );
            if (isErr(linkVerificationResult)) {
              linkOk = false;
              logs.push(...linkVerificationResult.data);
              logs.push({
                log: `verification of ${fileUri}.aqua.json failed `,
                logType: "error" /* ERROR */,
                ident: linkIdentChar
                //`${identCharacter}\t`
              });
            } else {
              logs.push(...linkVerificationResult.data.logData);
              logs.push({
                log: `successfully verified ${fileUri}.aqua.json `,
                logType: "success" /* SUCCESS */,
                ident: linkIdentChar
                //`${identCharacter}\t`
              });
            }
          } catch (error) {
            linkOk = false;
            logs.push({
              log: `Error verifying linked file ${aquaFileUri}: ${error}`,
              logType: "error" /* ERROR */,
              ident: `${identCharacter}	`
            });
          }
        }
      }
      isSuccess = linkOk;
      break;
  }
  logs.push(...logsResult);
  if (isSuccess && isScalarSuccess) {
    if (isScalar) {
      logs.push({
        log: `\u23FA\uFE0F  Scalar revision verified`,
        logType: "success" /* SUCCESS */,
        ident: identCharacter.length == 0 ? "	" : `${linkIdentChar}`
      });
    } else {
      logs.push({
        log: `\u{1F33F} Tree  revision verified`,
        logType: "success" /* SUCCESS */,
        ident: identCharacter.length == 0 ? "	" : `${linkIdentChar}`
      });
    }
    logs.push({
      log: `
`,
      logType: "empty" /* EMPTY */
    });
    return [true, logs];
  } else {
    logs.push({
      log: `Error verifying revision type:${revision.revision_type} with hash ${verificationHash}`,
      logType: "error" /* ERROR */,
      ident: `${identCharacter}	`
    });
    logs.push({
      log: `
`,
      logType: "empty" /* EMPTY */
    });
    return [false, logs];
  }
}
function verifyFormRevision(input, leaves, identCharacter = "") {
  let logs = [];
  let contains_deleted_fields = false;
  let fieldsWithVerification = [];
  let fieldsWithPartialVerification = [];
  let ok = true;
  let formKeysGraphData = [];
  Object.keys(input).sort().forEach((field, i) => {
    let new_hash = getHashSum(`${field}:${input[field]}`);
    if (!field.endsWith(".deleted")) {
      if (field.startsWith("forms_")) {
        if (new_hash !== leaves[i]) {
          ok = false;
          fieldsWithVerification.push(`\u{1F6AB} ${field}: ${input[field]}`);
          formKeysGraphData.push({
            formKey: field,
            content: input[field],
            isValidationSucessful: false
          });
        } else {
          fieldsWithVerification.push(`\u2705 ${field}: ${input[field]}`);
          formKeysGraphData.push({
            formKey: field,
            content: input[field],
            isValidationSucessful: true
          });
        }
      }
    } else {
      contains_deleted_fields = true;
      fieldsWithPartialVerification.push(field);
    }
  });
  if (contains_deleted_fields) {
    logs.push({
      log: `Warning: The following fields cannot be verified:`,
      logType: "warning" /* WARNING */,
      ident: identCharacter
    });
    fieldsWithPartialVerification.forEach((field, i) => {
      logs.push({
        log: `${i + 1}. ${field.replace(".deleted", "")}
`,
        logType: "warning" /* WARNING */
      });
    });
  }
  logs.push({
    log: `The following fields were verified:`,
    logType: "success" /* SUCCESS */,
    ident: identCharacter
  });
  fieldsWithVerification.forEach((field) => {
    logs.push({
      log: `${field}
`,
      logType: "success" /* SUCCESS */,
      ident: identCharacter
    });
  });
  return {
    isOk: ok,
    logs,
    formKeysGraphData
  };
}
function verifyRevisionMerkleTreeStructure(input, verificationHash) {
  let logs = [];
  let ok = true;
  let vhOk = true;
  const mandatory = {
    file: ["file_hash", "file_nonce"],
    link: ["link_verification_hashes"],
    signature: ["signature"],
    witness: ["witness_merkle_root"],
    form: []
  }[input.revision_type];
  const mandatoryClaims = [
    "previous_verification_hash",
    "local_timestamp",
    ...mandatory
  ];
  for (const claim of mandatoryClaims) {
    if (!(claim in input)) {
      logs.push({
        log: `mandatory field ${claim} is not present`,
        logType: "error" /* ERROR */
      });
      return [false, logs];
    }
  }
  const leaves = input.leaves;
  delete input.leaves;
  if (input.revision_type === "form") {
    let formVerificationResult = verifyFormRevision(input, leaves);
    logs.push(...formVerificationResult.logs);
    vhOk = formVerificationResult.isOk;
  } else if (input.revision_type === "witness" && input.witness_merkle_proof && input.witness_merkle_proof.length > 1) {
    let witnessMerkleProofLeaves = input.witness_merkle_proof;
    const hexRoot = getMerkleRoot(witnessMerkleProofLeaves);
    vhOk = hexRoot === input.witness_merkle_root;
  } else {
    for (const [i, claim] of Object.keys(input).sort().entries()) {
      const actual = getHashSum(`${claim}:${input[claim]}`);
      const claimOk = leaves[i] === actual;
      ok = ok && claimOk;
    }
    const leaves2 = dict2Leaves(input);
    const hexRoot = getMerkleRoot(leaves2);
    vhOk = hexRoot === verificationHash;
  }
  ok = ok && vhOk;
  return [ok, logs];
}

// package.json
var package_default = {
  name: "aqua-js-sdk",
  version: "3.2.1-8",
  description: "A TypeScript library for managing revision trees",
  type: "module",
  repository: {
    type: "git",
    url: "https://github.com/inblockio/aqua-verifier-js-lib.git"
  },
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    build: "tsup src/index.ts --dts --format esm,cjs --out-dir dist --tsconfig tsconfig.json",
    prepare: "npm run build",
    dev: "tsc",
    test: "NODE_OPTIONS='--experimental-vm-modules' npx jest",
    lint: "eslint src --ext .ts",
    format: "prettier --write src/**/*.ts",
    docs: "typedoc --out docs src"
  },
  exports: {
    ".": {
      types: {
        require: "./dist/index.d.cts",
        default: "./dist/index.d.ts"
      },
      browser: {
        require: "./dist/index.cjs",
        default: "./dist/index.js"
      },
      default: {
        require: "./dist/index.cjs",
        default: "./dist/index.js"
      }
    }
  },
  dependencies: {
    asn1js: "^3.0.5",
    buffer: "^6.0.3",
    "crypto-browserify": "^3.12.1",
    "did-resolver": "^4.1.0",
    dids: "^5.0.3",
    ethers: "^6.13.5",
    "http-status-codes": "^2.2.0",
    "js-sha3": "^0.9.3",
    "key-did-provider-ed25519": "^4.0.2",
    "key-did-resolver": "^4.0.0",
    merkletreejs: "^0.4.0",
    "nostr-tools": "^2.10.4",
    open: "^10.1.0",
    "openid-client": "^5.7.0",
    pkijs: "^3.2.4",
    "sha.js": "^2.4.11",
    sigstore: "^3.0.0",
    ws: "^8.18.0"
  },
  devDependencies: {
    "@types/asn1js": "^3.0.11",
    "@types/jest": "^29.5.14",
    "@types/node": "^20.11.24",
    "@types/pkijs": "^3.0.1",
    "@types/sha.js": "^2.4.4",
    "@types/ws": "^8.5.14",
    "@typescript-eslint/eslint-plugin": "^7.1.1",
    "@typescript-eslint/parser": "^7.1.1",
    eslint: "^8.57.0",
    jest: "^29.7.0",
    "jsdoc-to-markdown": "^9.1.1",
    prettier: "^3.2.5",
    "ts-jest": "^29.2.5",
    tsup: "^8.3.6",
    typedoc: "^0.27.7",
    "typedoc-plugin-markdown": "^4.4.2",
    typescript: "^5.3.3",
    vitest: "^1.3.1"
  }
};

// src/core/formatter.ts
var Reset = "\x1B[0m";
var Dim = "\x1B[2m";
var FgRed = "\x1B[31m";
var FgYellow = "\x1B[33m";
var FgGreen = "\x1B[32m";
function cliRedify(content) {
  return FgRed + content + Reset;
}
function cliYellowfy(content) {
  return FgYellow + content + Reset;
}
function cliGreenify(content) {
  return FgGreen + content + Reset;
}
function log_red(content) {
  console.log(cliRedify(content));
}
function log_yellow(content) {
  console.log(cliYellowfy(content));
}
function log_dim(content) {
  console.log(Dim + content + Reset);
}
function log_success(content) {
  console.log(cliGreenify(content));
}

// src/index.ts
var Aquafier = class {
  constructor() {
    // Revision
    /**
     * @method removeLastRevision
     * @description This method removes the last revision from the aqua tree
     * @param aquaTree - The aqua tree to remove the last revision from
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.removeLastRevision = (aquaTree) => {
      return removeLastRevisionUtil(aquaTree);
    };
    /**
     * @method createContentRevision
     * @description This method creates a content revision for the aqua tree
     * @param aquaTree - The aqua tree to create the content revision for
     * @param fileObject - The file object to create the content revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.createContentRevision = async (aquaTree, fileObject, enableScalar = true) => {
      return createContentRevisionUtil(aquaTree, fileObject, enableScalar);
    };
    /**
     * @method createGenesisRevision
     * @description This method creates a genesis revision for the aqua tree
     * @param fileObject - The file object to create the genesis revision for
     * @param isForm - A boolean value to check if the file object is a form
     * @param enableContent - A boolean value to enable content
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.createGenesisRevision = async (fileObject, isForm = false, enableContent = false, enableScalar = true) => {
      return createGenesisRevision(fileObject, isForm, enableContent, enableScalar);
    };
    /**
     * @method verifyAquaTree
     * @description This method verifies the aqua tree
     * @param aquaTree - The aqua tree to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.verifyAquaTree = async (aquaTree, fileObject) => {
      return verifyAquaTreeUtil(aquaTree, fileObject);
    };
    /**
     * @method verifyAquaTreeRevision
     * @description This method verifies the aqua tree revision
     * @param aquaTree - The aqua tree to verify
     * @param revision - The revision to verify
     * @param revisionItemHash - The revision item hash to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.verifyAquaTreeRevision = async (aquaTree, revision, revisionItemHash, fileObject) => {
      return verifyAquaTreeRevisionUtil(aquaTree, revision, revisionItemHash, fileObject);
    };
    this.verifyAndGetGraphData = async (aquaTree, fileObject) => {
      return verifyAndGetGraphDataUtil(aquaTree, fileObject);
    };
    // we need aqua tree because of the file index and the previous verification hash
    this.verifyAndGetGraphDataRevision = async (aquaTree, revision, revisionItemHash, fileObject) => {
      return verifyAndGetGraphDataRevisionUtil(aquaTree, revision, revisionItemHash, fileObject);
    };
    /**
     * @method witnessAquaTree
     * @description This method witnesses the aqua tree
     * @param aquaTree - The aqua tree to witness
     * @param witnessType - The witness type to use
     * @param witnessNetwork - The witness network to use
     * @param witnessPlatform - The witness platform to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.witnessAquaTree = async (aquaTree, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar = true) => {
      return witnessAquaTreeUtil(aquaTree, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
    };
    /**
     * @method witnessMultipleAquaTrees
     * @description This method witnesses multiple aqua trees
     * @param aquaTrees - The aqua trees to witness
     * @param witnessType - The witness type to use
     * @param witnessNetwork - The witness network to use
     * @param witnessPlatform - The witness platform to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.witnessMultipleAquaTrees = async (aquaTrees, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar = true) => {
      return witnessMultipleAquaTreesUtil(aquaTrees, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
    };
    /**
     * @method signAquaTree
     * @description This method signs the aqua tree
     * @param aquaTree - The aqua tree to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.signAquaTree = async (aquaTree, signType, credentials, enableScalar = true) => {
      return signAquaTreeUtil(aquaTree, signType, credentials, enableScalar);
    };
    /**
     * @method signMultipleAquaTrees
     * @description This method signs multiple aqua trees
     * @param aquaTrees - The aqua trees to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.signMultipleAquaTrees = async (aquaTrees, signType, credentials) => {
      return signMultipleAquaTreesUtil(aquaTrees, signType, credentials);
    };
    /**
     * @method linkAquaTree
     * @description This method links an aqua tree to another aqua tree
     * @param aquaTreeWrapper - The aqua tree to link
     * @param linkAquaTreeWrapper - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.linkAquaTree = async (aquaTreeWrapper, linkAquaTreeWrapper, enableScalar = true) => {
      return linkAquaTreeUtil(aquaTreeWrapper, linkAquaTreeWrapper, enableScalar);
    };
    /**
     * @method linkMultipleAquaTrees
     * @description This method links multiple aqua trees to another aqua tree
     * @param aquaTreeWrappers - The aqua trees to link
     * @param linkAquaTreeWrapper - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.linkMultipleAquaTrees = async (aquaTreeWrappers, linkAquaTreeWrapper, enableScalar = true) => {
      return linkMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar);
    };
    /**
     * @method linkAquaTreesToMultipleAquaTrees
     * @description This method links multiple aqua trees to multiple aqua trees
     * @param aquaTreeWrappers - The aqua trees to link
     * @param linkAquaTreeWrapper - The aqua trees to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.linkAquaTreesToMultipleAquaTrees = async (aquaTreeWrappers, linkAquaTreeWrapper, enableScalar = true) => {
      return linkAquaTreesToMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar);
    };
    /**
     * @method createFormRevision
     * @description This method creates a form revision for the aqua tree
     * @param aquaTree - The aqua tree to create the form revision for
     * @param fileObject - The file object to create the form revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, Log[]>
     */
    this.createFormRevision = async (aquaTree, fileObject, enableScalar = true) => {
      return createFormRevisionUtil(aquaTree, fileObject, enableScalar);
    };
    /**
     * @method hideFormElements
     * @description This method hides form elements
     * @param aquaTree - The aqua tree to hide form elements
     * @param keyToHide - The key to hide
     * @returns Result<AquaOperationData, LogData[]>
     */
    this.hideFormElements = async (aquaTree, keyToHide) => {
      return hideFormElementsUtil(aquaTree, keyToHide);
    };
    /**
     * @method unHideFormElements
     * @description This method unhides form elements
     * @param aquaTree - The aqua tree to unhide form elements
     * @param keyToUnHide - The key to unhide
     * @param content - The content to unhide
     * @returns Result<AquaOperationData, Log[]>
     */
    this.unHideFormElements = async (aquaTree, keyToUnHide, content) => {
      return unHideFormElementsUtil(aquaTree, keyToUnHide, content);
    };
    //get files to be read to file objects 
    this.fetchFilesToBeRead = (aquaTree) => {
      return fetchFilesToBeReadUtil(aquaTree);
    };
    this.checkIfFileAlreadyNotarized = (aquaTree, fileObject) => {
      return checkIfFileAlreadyNotarizedUtil(aquaTree, fileObject);
    };
    // Revisions
    this.getRevisionByHash = (aquaTree, hash) => {
      return getRevisionByHashUtil(aquaTree, hash);
    };
    // Revisions
    this.getLastRevision = (aquaTree) => {
      return getLastRevisionUtil(aquaTree);
    };
    // get file
    this.getFileByHash = async (aquaTree, hash) => {
      return getFileByHashUtil(aquaTree, hash);
    };
    this.getFileHash = (fileContent) => {
      return getHashSum(fileContent);
    };
    this.getVersionFromPackageJson = () => {
      let version = "1.3.2.0";
      console.log(package_default.version);
      return package_default.version ? package_default.version : version;
    };
    this.renderTree = (aquaTree) => {
      if (aquaTree.tree) {
        logAquaTree(aquaTree?.tree);
      }
    };
  }
};
var AquafierChainable = class {
  /**
  * Creates a new chainable Aqua operation sequence
  * 
  * @param initialValue - Optional initial Aqua Tree
  */
  constructor(initialValue) {
    /** Collected operation logs */
    this.logs = [];
    if (initialValue) {
      this.value = initialValue;
    }
  }
  /**
  * Extracts Aqua Tree from operation result
  * 
  * @param result - Result to unwrap
  * @returns Aqua Tree from result
  * @throws If result is Err
  */
  unwrap(result) {
    if (result.isErr()) {
      this.logs.push(...result.data);
      throw Error("an error occured");
    } else {
      this.logs.push(...result.data.logData);
    }
    return result.data.aquaTree;
  }
  /**
  * Creates a genesis revision for file notarization
  * 
  * @param fileObject - File to notarize
  * @param isForm - Whether file is a form
  * @param enableContent - Whether to include content
  * @param enableScalar - Whether to enable scalar values
  * @returns This instance for chaining
  */
  async notarize(fileObject, isForm = false, enableContent = false, enableScalar = true) {
    let data = await createGenesisRevision(fileObject, isForm, enableContent, enableScalar);
    if (data.isOk()) {
      this.value = this.unwrap(data);
      this.logs.push(...data.data.logData);
    } else {
      this.logs.push(...data.data);
    }
    return this;
  }
  /**
  * Signs the current Aqua Tree state
  * 
  * @param signType - Type of signature (cli, metamask, did)
  * @param credentials - Signing credentials
  * @param enableScalar - Whether to enable scalar values
  * @returns This instance for chaining
  */
  async sign(signType = "metamask", credentials = {
    mnemonic: "",
    nostr_sk: "",
    "did_key": "",
    alchemy_key: "",
    witness_eth_network: "",
    witness_method: ""
  }, enableScalar = true) {
    let data = await signAquaTreeUtil({
      aquaTree: this.value,
      fileObject: {
        fileName: "test.txt",
        fileContent: "",
        path: "/fake/path/test.txt"
      },
      revision: ""
    }, signType, credentials, enableScalar);
    if (data.isOk()) {
      this.value = this.unwrap(data);
      this.logs.push(...data.data.logData);
    } else {
      this.logs.push(...data.data);
    }
    return this;
  }
  /**
  * Witnesses the current Aqua Tree state
  * 
  * @param witnessType - Type of witness (eth, tsa, nostr)
  * @param witnessNetwork - Network for witnessing
  * @param witnessPlatform - Platform for witnessing
  * @param credentials - Witness credentials
  * @param enableScalar - Whether to enable scalar values
  * @returns This instance for chaining
  */
  async witness(witnessType = "eth", witnessNetwork = "sepolia", witnessPlatform = "metamask", credentials = {
    mnemonic: "",
    nostr_sk: "",
    "did_key": "",
    alchemy_key: "",
    witness_eth_network: "",
    witness_method: ""
  }, enableScalar = true) {
    let data = await witnessAquaTreeUtil({
      aquaTree: this.value,
      fileObject: void 0,
      revision: ""
    }, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
    if (data.isOk()) {
      this.value = this.unwrap(data);
      this.logs.push(...data.data.logData);
    } else {
      this.logs.push(...data.data);
    }
    return this;
  }
  /**
  * Verifies the current Aqua Tree state
  * 
  * @param linkedFileObject - Linked files for verification
  * @returns This instance for chaining
  */
  async verify(linkedFileObject = []) {
    let data = await verifyAquaTreeUtil(this.value, linkedFileObject);
    if (data.isOk()) {
      this.logs.push(...data.data.logData);
    } else {
      this.logs.push(...data.data);
    }
    this.verificationResult = data;
    return this;
  }
  /**
  * Gets the current Aqua Tree state
  * 
  * @returns Current Aqua Tree
  */
  getValue() {
    return this.value;
  }
  /**
  * Gets the result of last verification
  * 
  * @returns Verification result
  */
  getVerificationValue() {
    return this.verificationResult;
  }
  /**
  * Gets all collected operation logs
  * 
  * @returns Array of log entries
  */
  getLogs() {
    return this.logs;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
