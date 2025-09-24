import { createGenesisRevision } from "./core/revision";
import { signAquaTreeUtil } from "./core/signature";
import { witnessAquaTreeUtil } from "./core/witness";
import { verifyAquaTreeUtil } from "./core/verify";
import { Result } from "./type_guards";
import {
  AquaTree,
  AquaTreeView,
  AquaOperationData,
  CredentialsData,
  FileObject,
  LogData,
  SignType,
  WitnessNetwork,
  WitnessPlatformType,
  WitnessType,
  ReactNativeMetaMaskOptions,
  LogType
} from "./types";
import * as fs from "fs";
import * as path from "path";
import { linkAquaTreeUtil, linkMultipleAquaTreesUtil } from "./core/link";

/**
 * Configuration for witness operations
 */
export interface WitnessConfig {
  type: WitnessType;
  network: WitnessNetwork;
  platform: WitnessPlatformType;
}

/**
 * Configuration for signing operations
 */
export interface SignConfig {
  type: SignType;
  reactNativeOptions?: ReactNativeMetaMaskOptions;
}

/**
 * Complete configuration for Aqua operations
 */
export interface AquaConfig {
  credentials: CredentialsData;
  witness?: WitnessConfig;
  signing?: SignConfig;
  enableScalar?: boolean;
}

/**
 * Improved Aqua SDK with cleaner API design
 * 
 * Features:
 * - Configuration-first approach to reduce parameter repetition
 * - Cleaner method signatures
 * - Better error handling
 * - Rust-compatible design patterns
 * 
 * @example
 * ```typescript
 * const config = {
 *   credentials,
 *   witness: { type: 'eth', network: 'sepolia', platform: 'metamask' },
 *   signing: { type: 'cli' }
 * };
 * 
 * const aqua = new AquaV2(config);
 * await aqua.notarize(file);
 * await aqua.sign();
 * await aqua.witness();
 * const tree = aqua.getTree();
 * ```
 */
export class Aqua {
  private config: AquaConfig;
  private tree: AquaTree | null = null;
  private fileObject: FileObject | null = null;
  private logs: LogData[] = [];

  /**
   * Create a new Aqua instance with configuration
   * 
   * @param config - Configuration for operations
   */
  constructor(config: AquaConfig) {
    this.config = {
      enableScalar: true,
      ...config
    };
  }

  /**
   * Update configuration
   * 
   * @param updates - Partial configuration updates
   */
  configure(updates: Partial<AquaConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Check if running in Node.js environment
   * 
   * @returns LogData array with error if in browser, empty array if Node.js
   */
  requiresNode<T>(): Result<T, LogData[]> {
    if (typeof window !== 'undefined') {
      const error: LogData = {
        logType: LogType.ERROR,
        log: 'This operation requires Node.js environment'
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<T, LogData[]>;
    }
    return { isOk: () => true, isErr: () => false, data: undefined } as Result<T, LogData[]>;
  }

  /**
   * Static version of Node.js environment check
   * 
   * @returns Result with error if in browser, success if Node.js
   */
  static requiresNode<T>(): Result<T, LogData[]> {
    if (typeof window !== 'undefined') {
      const error: LogData = {
        logType: LogType.ERROR,
        log: 'This operation requires Node.js environment'
      };
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<T, LogData[]>;
    }
    return { isOk: () => true, isErr: () => false, data: undefined } as Result<T, LogData[]>;
  }

  /**
   * Create genesis revision for file notarization
   * 
   * @param fileObject - File to notarize
   * @param options - Optional parameters
   */
  private async createFromFileObject(
    fileObject: FileObject,
    options: {
      isTOR?: boolean;
      embedContent?: boolean;
      enableScalar?: boolean
    } = {}
  ): Promise<Result<AquaOperationData, LogData[]>> {
    const { isTOR = false, embedContent = false, enableScalar = this.config.enableScalar } = options;

    const result = await createGenesisRevision(fileObject, isTOR, embedContent, enableScalar);
    // console.log("Result here: ", result)
    if (result.isOk()) {
      this.tree = result.data.aquaTree;
      this.fileObject = fileObject;
      this.logs.push(...result.data.logData);
    } else {
      this.logs.push(...result.data);
    }

    return result;
  }

  /**
   * Sign the current tree
   * 
   * @param signConfig - Optional signing configuration override
   */
  async sign(signConfig?: SignConfig): Promise<Result<AquaOperationData, LogData[]>> {
    if (!this.tree) {
      const error: LogData = {
        logType: LogType.ERROR,
        log: "No tree to sign. Call notarize() first.",
        ident: ""
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const config = signConfig || this.config.signing;
    if (!config) {
      const error: LogData = {
        logType: LogType.ERROR,
        log: "No signing configuration provided"
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const result = await signAquaTreeUtil(
      this.getView(),
      config.type,
      this.config.credentials,
      this.config.enableScalar,
      "",
      config.reactNativeOptions
    );

    if (result.isOk()) {
      this.tree = result.data.aquaTree;
      this.logs.push(...result.data.logData);
    } else {
      this.logs.push(...result.data);
    }

    return result;
  }

  /**
   * Witness the current tree
   * 
   * @param witnessConfig - Optional witness configuration override
   */
  async witness(witnessConfig?: WitnessConfig): Promise<Result<AquaOperationData, LogData[]>> {
    if (!this.tree) {
      const error: LogData = {
        logType: LogType.ERROR,
        log: "No tree to witness. Call notarize() first."
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const config = witnessConfig || this.config.witness;
    if (!config) {
      const error: LogData = {
        logType: LogType.ERROR,
        log: "No witness configuration provided"
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const result = await witnessAquaTreeUtil(
      this.getView(),
      config.type,
      config.network,
      config.platform,
      this.config.credentials,
      this.config.enableScalar
    );

    if (result.isOk()) {
      this.tree = result.data.aquaTree;
      this.logs.push(...result.data.logData);
    } else {
      this.logs.push(...result.data);
    }

    return result;
  }

  async link(aquaToLink: Aqua, targetRevision?: string): Promise<Result<AquaOperationData, LogData[]>> {
    let result = await linkAquaTreeUtil(this.getView(), aquaToLink.getView(targetRevision), this.config.enableScalar)
    if (result.isOk()) {
      this.tree = result.data.aquaTree;
      this.logs.push(...result.data.logData);
    } else {
      this.logs.push(...result.data);
    }
    return result;
  }

  async linkMultiple(aquasToLink: { aqua: Aqua, targetRevision?: string }[]): Promise<Result<AquaOperationData, LogData[]>> {
    return linkMultipleAquaTreesUtil(aquasToLink.map(aquaToLink => aquaToLink.aqua.getView(aquaToLink.targetRevision)), this.getView(), this.config.enableScalar)
  }

  /**
   * Verify the current tree
   * 
   * @param linkedFiles - Files needed for verification
   */
  async verify(linkedFiles: FileObject[] = []): Promise<Result<AquaOperationData, LogData[]>> {
    if (!this.tree) {
      const error: LogData = {
        logType: LogType.ERROR,
        log: "No tree to verify. Call notarize() first."
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const result = await verifyAquaTreeUtil(this.tree, linkedFiles, "", this.config.credentials);

    if (result.isOk()) {
      this.logs.push(...result.data.logData);
    } else {
      this.logs.push(...result.data);
    }

    return result;
  }

  /**
   * Get the current tree
   */
  getTree(): AquaTree | null {
    return this.tree;
  }

  /**
   * Get view
   */
  private getView(targetRevisionHash: string = ""): AquaTreeView | null {
    return {
      aquaTree: this.tree,
      fileObject: this.fileObject,
      revision: targetRevisionHash
    };
  }


  /**
   * Get all operation logs
   */
  getLogs(): LogData[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Reset the instance (clear tree and logs)
   */
  reset(): void {
    this.tree = null;
    this.logs = [];
  }

  /**
   * Load an existing aqua file from disk
   * 
   * @param aquaFilePath - Path to the .aqua.json file
   */
  loadAquaFile(aquaFilePath: string): Result<AquaTree, LogData[]> {
    const nodeCheck = this.requiresNode<AquaTree>();
    if (nodeCheck.isErr()) {
      return nodeCheck as Result<AquaTree, LogData[]>;
    }

    try {
      const fileContent = fs.readFileSync(aquaFilePath, { encoding: "utf-8" });
      const aquaTree: AquaTree = JSON.parse(fileContent);
      this.tree = aquaTree;

      const log: LogData = {
        logType: LogType.INFO,
        log: `Loaded aqua file from ${aquaFilePath}`
      };
      this.logs.push(log);

      return { isOk: () => true, isErr: () => false, data: aquaTree } as Result<AquaTree, LogData[]>;
    } catch (error) {
      const errorLog: LogData = {
        logType: LogType.ERROR,
        log: `Failed to load aqua file: ${error}`
      };
      this.logs.push(errorLog);
      return { isOk: () => false, isErr: () => true, data: [errorLog] } as Result<AquaTree, LogData[]>;
    }
  }

  /**
 * Load an existing AquaTree object directly
 * 
 * @param aquaTree - The AquaTree object to load
 */
  loadAquaTree(aquaTree: AquaTree): Result<AquaTree, LogData[]> {
    try {
      this.tree = aquaTree;

      const log: LogData = {
        logType: LogType.INFO,
        log: `Loaded AquaTree object with ${Object.keys(aquaTree.revisions).length} revisions`
      };
      this.logs.push(log);

      return { isOk: () => true, isErr: () => false, data: aquaTree } as Result<AquaTree, LogData[]>;
    } catch (error) {
      const errorLog: LogData = {
        logType: LogType.ERROR,
        log: `Failed to load AquaTree: ${error}`
      };
      this.logs.push(errorLog);
      return { isOk: () => false, isErr: () => true, data: [errorLog] } as Result<AquaTree, LogData[]>;
    }
  }

  /**
   * Save the current tree to an aqua file
   * 
   * @param aquaFilePath - Path where to save the .aqua.json file
   */
  save(aquaFilePath: string): Result<string, LogData[]> {
    const nodeCheck = this.requiresNode<string>();
    if (nodeCheck.isErr()) {
      return nodeCheck as Result<string, LogData[]>;
    }

    if (!this.tree) {
      const error: LogData = {
        logType: LogType.ERROR,
        log: "No tree to save. Call notarize() first."
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<string, LogData[]>;
    }

    try {
      const fileContent = JSON.stringify(this.tree, null, 4);
      fs.writeFileSync(aquaFilePath, fileContent, { encoding: "utf-8" });

      const log: LogData = {
        logType: LogType.INFO,
        log: `Saved aqua file to ${aquaFilePath}`
      };
      this.logs.push(log);

      return { isOk: () => true, isErr: () => false, data: aquaFilePath } as Result<string, LogData[]>;
    } catch (error) {
      const errorLog: LogData = {
        logType: LogType.ERROR,
        log: `Failed to save aqua file: ${error}`
      };
      this.logs.push(errorLog);
      return { isOk: () => false, isErr: () => true, data: [errorLog] } as Result<string, LogData[]>;
    }
  }

  /**
   * Load a regular file and create FileObject
   * 
   * @param filePath - Path to the file
   * @returns FileObject for use with operations
   */
  static loadFile(filePath: string): Result<FileObject, LogData[]> {

    // console.log("File path inload file is: ", filePath)

    const nodeCheck = this.requiresNode<FileObject>();
    if (nodeCheck.isErr()) {
      return nodeCheck as Result<FileObject, LogData[]>;
    }

    try {
      const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
      const fileName = path.basename(filePath);

      const fileObject: FileObject = {
        fileName,
        fileContent,
        path: filePath
      };

      return { isOk: () => true, isErr: () => false, data: fileObject } as Result<FileObject, LogData[]>;
    } catch (error) {
      const errorLog: LogData = {
        logType: LogType.ERROR,
        log: `Failed to load file: ${error}`
      };
      return { isOk: () => false, isErr: () => true, data: [errorLog] } as Result<FileObject, LogData[]>;
    }
  }

  /**
   * Create AquaTree from file (overloaded for browser/Node.js compatibility)
   * 
   * @param fileObject - FileObject for browser environments
   * @param options - Creation options
   */
  async create(
    fileObject: FileObject,
    options?: {
      isTOR?: boolean;
      embedContent?: boolean;
      enableScalar?: boolean
    }
  ): Promise<Result<AquaOperationData, LogData[]>>;

  /**
   * Create AquaTree from file path (Node.js only)
   * 
   * @param filePath - Path to file for Node.js environments
   * @param options - Creation options
   */
  async create(
    filePath: string,
    options?: {
      isTOR?: boolean;
      embedContent?: boolean;
      enableScalar?: boolean
    }
  ): Promise<Result<AquaOperationData, LogData[]>>;

  /**
   * Implementation of createFile with method overloading
   */
  async create(
    fileOrPath: FileObject | string,
    options: {
      isTOR?: boolean;
      embedContent?: boolean;
      enableScalar?: boolean
    } = {}
  ): Promise<Result<AquaOperationData, LogData[]>> {
    if (typeof fileOrPath === 'string') {
      // Node.js path - check environment and load file
      const nodeCheck = this.requiresNode<AquaOperationData>();
      if (nodeCheck.isErr()) return nodeCheck;

      const fileResult = Aqua.loadFile(fileOrPath);

      // console.log("File result here: ", fileResult)

      if (fileResult.isErr()) {
        this.logs.push(...fileResult.data);
        return fileResult as unknown as Result<AquaOperationData, LogData[]>;
      }
      if(options.isTOR){
        return this.createFromFileObject({
          ...fileResult.data,
          fileContent: JSON.parse(fileResult.data.fileContent as string)
        }, options);
      }
      return this.createFromFileObject(fileResult.data, options);
    } else {
      // Browser - FileObject provided directly
      return this.createFromFileObject(fileOrPath, options);
    }
  }

  /**
   * Complete workflow: Load file, create, sign, witness
   * 
   * @param filePath - Path to file
   * @param operations - Which operations to perform
   */
  async processFile(
    filePath: string,
    operations: {
      sign?: boolean | SignConfig;
      witness?: boolean | WitnessConfig;
      verify?: boolean;
      save?: string; // Path to save aqua file
    } = {}
  ): Promise<Result<AquaTree, LogData[]>> {
    // Load and create
    const createResult = await this.create(filePath);
    if (createResult.isErr()) {
      return createResult as unknown as Result<AquaTree, LogData[]>;
    }

    // Sign if requested
    if (operations.sign) {
      const signConfig = typeof operations.sign === 'boolean' ? undefined : operations.sign;
      const signResult = await this.sign(signConfig);
      if (signResult.isErr()) {
        return signResult as unknown as Result<AquaTree, LogData[]>;
      }
    }

    // Witness if requested
    if (operations.witness) {
      const witnessConfig = typeof operations.witness === 'boolean' ? undefined : operations.witness;
      const witnessResult = await this.witness(witnessConfig);
      if (witnessResult.isErr()) {
        return witnessResult as unknown as Result<AquaTree, LogData[]>;
      }
    }

    // Verify if requested
    if (operations.verify) {
      const fileResult = Aqua.loadFile(filePath);
      const files = fileResult.isOk() ? [fileResult.data] : [];
      const verifyResult = await this.verify(files);
      if (verifyResult.isErr()) {
        return verifyResult as unknown as Result<AquaTree, LogData[]>;
      }
    }

    // Save if requested
    if (operations.save) {
      const saveResult = this.save(operations.save);
      if (saveResult.isErr()) {
        return saveResult as unknown as Result<AquaTree, LogData[]>;
      }
    }

    return { isOk: () => true, isErr: () => false, data: this.tree! } as Result<AquaTree, LogData[]>;
  }
}

/**
 * Convenience function to create a configured Aqua instance
 * 
 * @param credentials - User credentials
 * @param witness - Witness configuration
 * @param signing - Signing configuration
 * @param enableScalar - Enable scalar operations
 * @returns Configured Aqua instance
 */
export function createAqua(
  credentials: CredentialsData,
  witness?: WitnessConfig,
  signing?: SignConfig,
  enableScalar: boolean = true
): Aqua {
  return new Aqua({
    credentials,
    witness,
    signing,
    enableScalar
  });
}

/**
 * Common witness configurations for convenience
 */
export const WitnessConfigs = {
  ethereumSepolia: { type: 'eth' as const, network: 'sepolia' as const, platform: 'metamask' as const },
  ethereumMainnet: { type: 'eth' as const, network: 'mainnet' as const, platform: 'metamask' as const },
  tsa: { type: 'tsa' as const, network: 'sepolia' as const, platform: 'cli' as const },
  nostr: { type: 'nostr' as const, network: 'sepolia' as const, platform: 'cli' as const }
} as const;

/**
 * Common signing configurations for convenience
 */
export const SignConfigs = {
  metamask: { type: 'metamask' as const },
  cli: { type: 'cli' as const },
  did: { type: 'did' as const },
  p12: { type: 'p12' as const }
} as const;