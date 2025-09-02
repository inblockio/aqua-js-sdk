import { Result } from "./type_guards";
import { AquaTree, AquaTreeView, AquaOperationData, CredentialsData, FileObject, LogData, Revision, SignType, WitnessNetwork, WitnessPlatformType, WitnessType, VerificationGraphData, ReactNativeMetaMaskOptions } from "./types";
import { Aqua, createAqua, WitnessConfig, WitnessConfigs, SignConfigs } from "./aqua-v2";
export * from "./utils";
export * from "./types";
export * from "./type_guards";
export { recoverWalletAddress } from "./core/signature";
export * from "./core/formatter";
export { Aqua, createAqua, WitnessConfig, WitnessConfigs, SignConfigs };
/**
 * @class Aquafier
 * @description This class is the main class that contains all the methods that can be used to interact with the aqua tree data structure
 * @method removeLastRevision
 * @method createContentRevision
 * @method createGenesisRevision
 * @method verifyAquaTree
 * @method verifyAquaTreeRevision
 * @method witnessAquaTree
 * @method witnessMultipleAquaTrees
 * @method signAquaTree
 * @method signMultipleAquaTrees
 * @method linkAquaTree
 * @method linkMultipleAquaTrees
 * @method linkAquaTreesToMultipleAquaTrees
 * @method createFormRevision
 * @method hideFormElements
 * @method unHideFormElements
 * @method fetchFilesToBeRead
 * @method checkIfFileAlreadyNotarized
 * @method getRevisionByHash
 * @method getLastRevision
 * @method getFileByHash
 * @method getFileHash
 */
export default class Aquafier {
    /**
     * @method removeLastRevision
     * @description This method removes the last revision from the aqua tree
     * @param aquaTree - The aqua tree to remove the last revision from
     * @returns Result<AquaOperationData, LogData[]>
     */
    at: (aquaTree: AquaTree, index: number) => Revision | null;
    removeLastRevision: (aquaTree: AquaTree) => Result<AquaOperationData, LogData[]>;
    /**
     * @method createContentRevision
     * @description This method creates a content revision for the aqua tree
     * @param aquaTree - The aqua tree to create the content revision for
     * @param fileObject - The file object to create the content revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    createContentRevision: (aquaTree: AquaTreeView, fileObject: FileObject, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method createGenesisRevision
     * @description This method creates a genesis revision for the aqua tree
     * @param fileObject - The file object to create the genesis revision for
     * @param isForm - A boolean value to check if the file object is a form
     * @param enableContent - A boolean value to enable content
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    createGenesisRevision: (fileObject: FileObject, isForm?: boolean, enableContent?: boolean, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method verifyAquaTree
     * @description This method verifies the aqua tree
     * @param aquaTree - The aqua tree to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    verifyAquaTree: (aquaTree: AquaTree, fileObject: Array<FileObject>, credentials?: CredentialsData) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method verifyAquaTreeRevision
     * @description This method verifies the aqua tree revision
     * @param aquaTree - The aqua tree to verify
     * @param revision - The revision to verify
     * @param revisionItemHash - The revision item hash to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    verifyAquaTreeRevision: (aquaTree: AquaTree, revision: Revision, revisionItemHash: string, fileObject: Array<FileObject>, credentials?: CredentialsData) => Promise<Result<AquaOperationData, LogData[]>>;
    verifyAndGetGraphData: (aquaTree: AquaTree, fileObject: Array<FileObject>, credentials?: CredentialsData) => Promise<Result<VerificationGraphData, LogData[]>>;
    verifyAndGetGraphDataRevision: (aquaTree: AquaTree, revision: Revision, revisionItemHash: string, fileObject: Array<FileObject>, credentials?: CredentialsData) => Promise<Result<VerificationGraphData, LogData[]>>;
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
    witnessAquaTree: (aquaTree: AquaTreeView, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
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
    witnessMultipleAquaTrees: (aquaTrees: AquaTreeView[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method signAquaTree
     * @description This method signs the aqua tree
     * @param aquaTree - The aqua tree to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    signAquaTree: (aquaTree: AquaTreeView, signType: SignType, credentials: CredentialsData, enableScalar?: boolean, reactNativeOptions?: ReactNativeMetaMaskOptions) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method signMultipleAquaTrees
     * @description This method signs multiple aqua trees
     * @param aquaTrees - The aqua trees to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @returns Result<AquaOperationData, LogData[]>
     */
    signMultipleAquaTrees: (aquaTrees: AquaTreeView[], signType: SignType, credentials: CredentialsData) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method linkAquaTree
     * @description This method links an aqua tree to another aqua tree
     * @param aquaTreeView - The aqua tree to link
     * @param linkAquaTreeView - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkAquaTree: (aquaTreeView: AquaTreeView, linkAquaTreeView: AquaTreeView, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method linkMultipleAquaTrees
     * @description This method links multiple aqua trees to another aqua tree
     * @param aquaTreeViews - The aqua trees to link
     * @param linkAquaTreeView - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkMultipleAquaTrees: (aquaTreeViews: AquaTreeView[], linkAquaTreeView: AquaTreeView, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method linkAquaTreesToMultipleAquaTrees
     * @description This method links multiple aqua trees to multiple aqua trees
     * @param aquaTreeViews - The aqua trees to link
     * @param linkAquaTreeView - The aqua trees to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkAquaTreesToMultipleAquaTrees: (aquaTreeViews: AquaTreeView, linkAquaTreeView: AquaTreeView[], enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method createFormRevision
     * @description This method creates a form revision for the aqua tree
     * @param aquaTree - The aqua tree to create the form revision for
     * @param fileObject - The file object to create the form revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, Log[]>
     */
    createFormRevision: (aquaTree: AquaTreeView, fileObject: FileObject, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method hideFormElements
     * @description This method hides form elements
     * @param aquaTree - The aqua tree to hide form elements
     * @param keyToHide - The key to hide
     * @returns Result<AquaOperationData, LogData[]>
     */
    hideFormElements: (aquaTree: AquaTreeView, keyToHide: string) => Promise<Result<AquaOperationData, LogData[]>>;
    /**
     * @method unHideFormElements
     * @description This method unhides form elements
     * @param aquaTree - The aqua tree to unhide form elements
     * @param keyToUnHide - The key to unhide
     * @param content - The content to unhide
     * @returns Result<AquaOperationData, Log[]>
     */
    unHideFormElements: (aquaTree: AquaTreeView, keyToUnHide: string, content: string) => Promise<Result<AquaOperationData, LogData[]>>;
    fetchFilesToBeRead: (aquaTree: AquaTree) => string[];
    checkIfFileAlreadyNotarized: (aquaTree: AquaTree, fileObject: FileObject) => boolean;
    getRevisionByHash: (aquaTree: AquaTree, hash: string) => Result<Revision, LogData[]>;
    getLastRevision: (aquaTree: AquaTree) => Result<Revision, LogData[]>;
    getFileByHash: (aquaTree: AquaTree, hash: string) => Promise<Result<string, LogData[]>>;
    getFileHash: (fileContent: string | Uint8Array) => string;
    getVersionFromPackageJson: () => string;
    renderTree: (aquaTree: AquaTree) => void;
}
/**
 * Chainable API for Aqua operations
 *
 * This class provides a fluent interface for performing operations on Aqua Trees.
 * It allows chaining multiple operations like notarization, signing, witnessing,
 * and verification while maintaining state and collecting logs.
 *
 * @example
 * ```typescript
 * const aqua = new AquafierChainable(tree)
 *   .notarize(file)
 *   .sign("metamask", credentials)
 *   .witness("eth", "sepolia")
 *   .verify();
 * ```
 */
export declare class AquafierChainable {
    /** Current Aqua Tree state */
    private value;
    /** Result of last verification operation */
    private verificationResult;
    /** Collected operation logs */
    private logs;
    /**
 * Creates a new chainable Aqua operation sequence
 *
 * @param initialValue - Optional initial Aqua Tree
 */
    constructor(initialValue: AquaTree | null);
    /**
 * Extracts Aqua Tree from operation result
 *
 * @param result - Result to unwrap
 * @returns Aqua Tree from result
 * @throws If result is Err
 */
    unwrap(result: Result<AquaOperationData, LogData[]>): AquaTree;
    /**
 * Creates a genesis revision for file notarization
 *
 * @param fileObject - File to notarize
 * @param isForm - Whether file is a form
 * @param enableContent - Whether to include content
 * @param enableScalar - Whether to enable scalar values
 * @returns This instance for chaining
 */
    notarize(fileObject: FileObject, isForm?: boolean, enableContent?: boolean, enableScalar?: boolean): Promise<this>;
    /**
 * Signs the current Aqua Tree state
 *
 * @param signType - Type of signature (cli, metamask, did)
 * @param credentials - Signing credentials
 * @param enableScalar - Whether to enable scalar values
 * @returns This instance for chaining
 */
    sign(signType?: SignType, credentials?: CredentialsData, enableScalar?: boolean): Promise<this>;
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
    witness(witnessType?: WitnessType, witnessNetwork?: WitnessNetwork, witnessPlatform?: WitnessPlatformType, credentials?: CredentialsData, enableScalar?: boolean): Promise<this>;
    /**
 * Verifies the current Aqua Tree state
 *
 * @param linkedFileObject - Linked files for verification
 * @returns This instance for chaining
 */
    verify(linkedFileObject?: Array<FileObject>): Promise<this>;
    /**
 * Gets the current Aqua Tree state
 *
 * @returns Current Aqua Tree
 */
    getValue(): AquaTree;
    /**
 * Gets the result of last verification
 *
 * @returns Verification result
 */
    getVerificationValue(): Result<AquaOperationData, LogData[]>;
    /**
 * Gets all collected operation logs
 *
 * @returns Array of log entries
 */
    getLogs(): LogData[];
}
//# sourceMappingURL=index.d.ts.map