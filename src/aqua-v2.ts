import { createGenesisRevision } from "./core/revision";
import { signAquaTreeUtil } from "./core/signature";
import { witnessAquaTreeUtil } from "./core/witness";
import { verifyAquaTreeUtil } from "./core/verify";
import { Result } from "./type_guards";
import { 
  AquaTree, 
  AquaTreeWrapper, 
  AquaOperationData, 
  CredentialsData, 
  FileObject, 
  LogData, 
  SignType, 
  WitnessNetwork, 
  WitnessPlatformType, 
  WitnessType,
  ReactNativeMetaMaskOptions 
} from "./types";
import * as fs from "fs";
import * as path from "path";

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
export class AquaV2 {
  private config: AquaConfig;
  private tree: AquaTree | null = null;
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
   * Create genesis revision for file notarization
   * 
   * @param fileObject - File to notarize
   * @param options - Optional parameters
   */
  async notarize(
    fileObject: FileObject, 
    options: { 
      isForm?: boolean; 
      enableContent?: boolean; 
      enableScalar?: boolean 
    } = {}
  ): Promise<Result<AquaOperationData, LogData[]>> {
    const { isForm = false, enableContent = false, enableScalar = this.config.enableScalar } = options;
    
    const result = await createGenesisRevision(fileObject, isForm, enableContent, enableScalar);
    
    if (result.isOk()) {
      this.tree = result.data.aquaTree;
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
        type: "error",
        message: "No tree to sign. Call notarize() first.",
        timestamp: new Date().toISOString(),
        data: {}
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const config = signConfig || this.config.signing;
    if (!config) {
      const error: LogData = {
        type: "error", 
        message: "No signing configuration provided",
        timestamp: new Date().toISOString(),
        data: {}
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const wrapper: AquaTreeWrapper = {
      aquaTree: this.tree,
      fileObject: {
        fileName: "placeholder",
        fileContent: "",
        path: "/placeholder"
      },
      revision: ""
    };

    const result = await signAquaTreeUtil(
      wrapper, 
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
        type: "error",
        message: "No tree to witness. Call notarize() first.",
        timestamp: new Date().toISOString(),
        data: {}
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const config = witnessConfig || this.config.witness;
    if (!config) {
      const error: LogData = {
        type: "error",
        message: "No witness configuration provided",
        timestamp: new Date().toISOString(),
        data: {}
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<AquaOperationData, LogData[]>;
    }

    const wrapper: AquaTreeWrapper = {
      aquaTree: this.tree,
      fileObject: undefined,
      revision: ""
    };

    const result = await witnessAquaTreeUtil(
      wrapper,
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

  /**
   * Verify the current tree
   * 
   * @param linkedFiles - Files needed for verification
   */
  async verify(linkedFiles: FileObject[] = []): Promise<Result<AquaOperationData, LogData[]>> {
    if (!this.tree) {
      const error: LogData = {
        type: "error",
        message: "No tree to verify. Call notarize() first.",
        timestamp: new Date().toISOString(),
        data: {}
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
    try {
      const fileContent = fs.readFileSync(aquaFilePath, { encoding: "utf-8" });
      const aquaTree: AquaTree = JSON.parse(fileContent);
      this.tree = aquaTree;
      
      const log: LogData = {
        type: "info",
        message: `Loaded aqua file from ${aquaFilePath}`,
        timestamp: new Date().toISOString(),
        data: { filePath: aquaFilePath }
      };
      this.logs.push(log);
      
      return { isOk: () => true, isErr: () => false, data: aquaTree } as Result<AquaTree, LogData[]>;
    } catch (error) {
      const errorLog: LogData = {
        type: "error",
        message: `Failed to load aqua file: ${error}`,
        timestamp: new Date().toISOString(),
        data: { filePath: aquaFilePath, error }
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
  saveAquaFile(aquaFilePath: string): Result<string, LogData[]> {
    if (!this.tree) {
      const error: LogData = {
        type: "error",
        message: "No tree to save. Call notarize() first.",
        timestamp: new Date().toISOString(),
        data: {}
      };
      this.logs.push(error);
      return { isOk: () => false, isErr: () => true, data: [error] } as Result<string, LogData[]>;
    }

    try {
      const fileContent = JSON.stringify(this.tree, null, 4);
      fs.writeFileSync(aquaFilePath, fileContent, { encoding: "utf-8" });
      
      const log: LogData = {
        type: "info",
        message: `Saved aqua file to ${aquaFilePath}`,
        timestamp: new Date().toISOString(),
        data: { filePath: aquaFilePath }
      };
      this.logs.push(log);
      
      return { isOk: () => true, isErr: () => false, data: aquaFilePath } as Result<string, LogData[]>;
    } catch (error) {
      const errorLog: LogData = {
        type: "error",
        message: `Failed to save aqua file: ${error}`,
        timestamp: new Date().toISOString(),
        data: { filePath: aquaFilePath, error }
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
        type: "error",
        message: `Failed to load file: ${error}`,
        timestamp: new Date().toISOString(),
        data: { filePath, error }
      };
      return { isOk: () => false, isErr: () => true, data: [errorLog] } as Result<FileObject, LogData[]>;
    }
  }

  /**
   * Convenience method: Load file and notarize in one step
   * 
   * @param filePath - Path to file to notarize
   * @param options - Notarization options
   */
  async notarizeFile(
    filePath: string,
    options: { 
      isForm?: boolean; 
      enableContent?: boolean; 
      enableScalar?: boolean 
    } = {}
  ): Promise<Result<AquaOperationData, LogData[]>> {
    const fileResult = AquaV2.loadFile(filePath);
    if (fileResult.isErr()) {
      this.logs.push(...fileResult.data);
      return fileResult as unknown as Result<AquaOperationData, LogData[]>;
    }
    
    return this.notarize(fileResult.data, options);
  }

  /**
   * Complete workflow: Load file, notarize, sign, witness
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
    // Load and notarize
    const notarizeResult = await this.notarizeFile(filePath);
    if (notarizeResult.isErr()) {
      return notarizeResult as unknown as Result<AquaTree, LogData[]>;
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
      const fileResult = AquaV2.loadFile(filePath);
      const files = fileResult.isOk() ? [fileResult.data] : [];
      const verifyResult = await this.verify(files);
      if (verifyResult.isErr()) {
        return verifyResult as unknown as Result<AquaTree, LogData[]>;
      }
    }

    // Save if requested
    if (operations.save) {
      const saveResult = this.saveAquaFile(operations.save);
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
): AquaV2 {
  return new AquaV2({
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