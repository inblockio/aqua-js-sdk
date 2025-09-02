import { createContentRevisionUtil, getFileByHashUtil } from "./core/content";
import { createFormRevisionUtil, hideFormElementsUtil, unHideFormElementsUtil } from "./core/forms";
import { linkAquaTreesToMultipleAquaTreesUtil, linkAquaTreeUtil, linkMultipleAquaTreesUtil } from "./core/link";
import { checkIfFileAlreadyNotarizedUtil, createGenesisRevision, fetchFilesToBeReadUtil, getLastRevisionUtil, getRevisionByHashUtil, removeLastRevisionUtil } from "./core/revision";
import { signAquaTreeUtil, signMultipleAquaTreesUtil } from "./core/signature";
import { verifyAndGetGraphDataRevisionUtil, verifyAndGetGraphDataUtil, verifyAquaTreeRevisionUtil, verifyAquaTreeUtil } from "./core/verify";
import { witnessAquaTreeUtil, witnessMultipleAquaTreesUtil } from "./core/witness";
import { default as packageJson } from "./../package.json";
import { logAquaTree } from "./aquatreevisualization";
import { getHashSum } from "./utils";
import { Aqua, createAqua, WitnessConfigs, SignConfigs } from "./aqua-v2";
export * from "./utils";
export * from "./types";
export * from "./type_guards";
export { recoverWalletAddress } from "./core/signature";
export * from "./core/formatter";
export { Aqua, createAqua, WitnessConfigs, SignConfigs };
// Letes writesome docs here
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
    constructor() {
        // Revision
        /**
         * @method removeLastRevision
         * @description This method removes the last revision from the aqua tree
         * @param aquaTree - The aqua tree to remove the last revision from
         * @returns Result<AquaOperationData, LogData[]>
         */
        this.at = (aquaTree, index) => {
            const hashes = Object.keys(aquaTree.revisions);
            let hashAtIndex = hashes[index];
            if (hashAtIndex == undefined) {
                return null;
            }
            let revision = aquaTree.revisions[hashAtIndex];
            if (revision == undefined) {
                return null;
            }
            return revision;
        };
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
        this.verifyAquaTree = async (aquaTree, fileObject, credentials) => {
            return verifyAquaTreeUtil(aquaTree, fileObject, "", credentials);
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
        this.verifyAquaTreeRevision = async (aquaTree, revision, revisionItemHash, fileObject, credentials) => {
            return verifyAquaTreeRevisionUtil(aquaTree, revision, revisionItemHash, fileObject, credentials);
        };
        this.verifyAndGetGraphData = async (aquaTree, fileObject, credentials) => {
            return verifyAndGetGraphDataUtil(aquaTree, fileObject, "", credentials);
        };
        // we need aqua tree because of the file index and the previous verification hash
        this.verifyAndGetGraphDataRevision = async (aquaTree, revision, revisionItemHash, fileObject, credentials) => {
            return verifyAndGetGraphDataRevisionUtil(aquaTree, revision, revisionItemHash, fileObject, credentials);
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
        this.signAquaTree = async (aquaTree, signType, credentials, enableScalar = true, reactNativeOptions) => {
            return signAquaTreeUtil(aquaTree, signType, credentials, enableScalar, "", reactNativeOptions);
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
         * @param aquaTreeView - The aqua tree to link
         * @param linkAquaTreeView - The aqua tree to link to
         * @param enableScalar - A boolean value to enable scalar
         * @returns Result<AquaOperationData, LogData[]>
         */
        this.linkAquaTree = async (aquaTreeView, linkAquaTreeView, enableScalar = true) => {
            return linkAquaTreeUtil(aquaTreeView, linkAquaTreeView, enableScalar);
        };
        /**
         * @method linkMultipleAquaTrees
         * @description This method links multiple aqua trees to another aqua tree
         * @param aquaTreeViews - The aqua trees to link
         * @param linkAquaTreeView - The aqua tree to link to
         * @param enableScalar - A boolean value to enable scalar
         * @returns Result<AquaOperationData, LogData[]>
         */
        this.linkMultipleAquaTrees = async (aquaTreeViews, linkAquaTreeView, enableScalar = true) => {
            return linkMultipleAquaTreesUtil(aquaTreeViews, linkAquaTreeView, enableScalar);
        };
        /**
         * @method linkAquaTreesToMultipleAquaTrees
         * @description This method links multiple aqua trees to multiple aqua trees
         * @param aquaTreeViews - The aqua trees to link
         * @param linkAquaTreeView - The aqua trees to link to
         * @param enableScalar - A boolean value to enable scalar
         * @returns Result<AquaOperationData, LogData[]>
         */
        this.linkAquaTreesToMultipleAquaTrees = async (aquaTreeViews, linkAquaTreeView, enableScalar = true) => {
            return linkAquaTreesToMultipleAquaTreesUtil(aquaTreeViews, linkAquaTreeView, enableScalar);
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
            console.log(packageJson.version);
            return packageJson.version ? packageJson.version : version;
        };
        this.renderTree = (aquaTree) => {
            if (aquaTree.tree) {
                logAquaTree(aquaTree?.tree);
            }
        };
    }
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
export class AquafierChainable {
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
        }
        else {
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
        }
        else {
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
        }
        else {
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
            fileObject: undefined,
            revision: ""
        }, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
        // this.value = this.unwrap(data);
        if (data.isOk()) {
            this.value = this.unwrap(data);
            this.logs.push(...data.data.logData);
        }
        else {
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
        }
        else {
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
}
//# sourceMappingURL=index.js.map