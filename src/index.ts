import { createContentRevisionUtil, getFileByHashUtil } from "./core/content";
import { createFormRevisionUtil, hideFormElementsUtil, unHideFormElementsUtil } from "./core/forms";
import { linkAquaTreesToMultipleAquaTreesUtil, linkAquaTreeUtil, linkMultipleAquaTreesUtil } from "./core/link";
import { checkIfFileAlreadyNotarizedUtil, createGenesisRevision, fetchFilesToBeReadUtil, getLastRevisionUtil, getRevisionByHashUtil, removeLastRevisionUtil } from "./core/revision";
import { signAquaTreeUtil, signMultipleAquaTreesUtil } from "./core/signature";
import { verifyAndGetGraphDataUtil, verifyAquaTreeRevisionUtil, verifyAquaTreeUtil } from "./core/verify";
import { witnessAquaTreeUtil, witnessMultipleAquaTreesUtil } from "./core/witness";
import { Result } from "./type_guards";
import { AquaTree, AquaTreeWrapper, AquaOperationData, CredentialsData, FileObject, LogData, Revision, SignType, WitnessNetwork, WitnessPlatformType, WitnessType, VerificationGraphData } from "./types"
import { default as packageJson } from "./../package.json";
import { logAquaTree } from "./aquavhtree";

export * from "./utils";
export * from "./types";
export * from "./type_guards";


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
 */
export default class Aquafier {

    // Revision
    /**
     * @method removeLastRevision
     * @description This method removes the last revision from the aqua tree
     * @param aquaTree - The aqua tree to remove the last revision from
     * @returns Result<AquaOperationData, LogData[]>
     */

    removeLastRevision = (aquaTree: AquaTree): Result<AquaOperationData, LogData[]> => {
        return removeLastRevisionUtil(aquaTree)
    }

    /**
     * @method createContentRevision
     * @description This method creates a content revision for the aqua tree
     * @param aquaTree - The aqua tree to create the content revision for
     * @param fileObject - The file object to create the content revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    createContentRevision = async (aquaTree: AquaTreeWrapper, fileObject: FileObject, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return createContentRevisionUtil(aquaTree, fileObject, enableScalar)
    }


    /**
     * @method createGenesisRevision
     * @description This method creates a genesis revision for the aqua tree
     * @param fileObject - The file object to create the genesis revision for
     * @param isForm - A boolean value to check if the file object is a form
     * @param enableContent - A boolean value to enable content
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    createGenesisRevision = async (fileObject: FileObject, isForm: boolean = false, enableContent: boolean = false, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return createGenesisRevision(fileObject, isForm, enableContent, enableScalar)
    }

    /**
     * @method verifyAquaTree
     * @description This method verifies the aqua tree
     * @param aquaTree - The aqua tree to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    verifyAquaTree = async (aquaTree: AquaTree, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyAquaTreeUtil(aquaTree, fileObject)
    }

    /**
     * @method verifyAquaTreeRevision
     * @description This method verifies the aqua tree revision
     * @param aquaTree - The aqua tree to verify
     * @param revision - The revision to verify
     * @param revisionItemHash - The revision item hash to verify
     * @param fileObject[] - The file objects of the aqua tree that will be useful for verification
     * @returns Result<AquaOperationData, LogData[]>
     */
    verifyAquaTreeRevision = async (aquaTree: AquaTree, revision: Revision, revisionItemHash: string, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyAquaTreeRevisionUtil(aquaTree, revision, revisionItemHash, fileObject)
    }

    verifyAndGetGraphData = async (aquaTree: AquaTree, fileObject: Array<FileObject>): Promise<Result<VerificationGraphData, LogData[]>> => {
        return verifyAndGetGraphDataUtil(aquaTree, fileObject)
    }

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
    witnessAquaTree = async (aquaTree: AquaTreeWrapper, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return witnessAquaTreeUtil(aquaTree, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar)
    }

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
    witnessMultipleAquaTrees = async (aquaTrees: AquaTreeWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return witnessMultipleAquaTreesUtil(aquaTrees, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar)
    }

    /**
     * @method signAquaTree
     * @description This method signs the aqua tree
     * @param aquaTree - The aqua tree to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    signAquaTree = async (aquaTree: AquaTreeWrapper, signType: SignType, credentials: CredentialsData, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        
        return signAquaTreeUtil(aquaTree, signType, credentials, enableScalar)
    }

    /**
     * @method signMultipleAquaTrees
     * @description This method signs multiple aqua trees
     * @param aquaTrees - The aqua trees to sign
     * @param signType - The sign type to use
     * @param credentials - The credentials to use
     * @returns Result<AquaOperationData, LogData[]>
     */
    signMultipleAquaTrees = async (aquaTrees: AquaTreeWrapper[], signType: SignType, credentials: CredentialsData): Promise<Result<AquaOperationData, LogData[]>> => {
        return signMultipleAquaTreesUtil(aquaTrees, signType, credentials)
    }

    /**
     * @method linkAquaTree
     * @description This method links an aqua tree to another aqua tree
     * @param aquaTreeWrapper - The aqua tree to link
     * @param linkAquaTreeWrapper - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkAquaTree = async (aquaTreeWrapper: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkAquaTreeUtil(aquaTreeWrapper, linkAquaTreeWrapper, enableScalar)
    }

    /**
     * @method linkMultipleAquaTrees
     * @description This method links multiple aqua trees to another aqua tree
     * @param aquaTreeWrappers - The aqua trees to link
     * @param linkAquaTreeWrapper - The aqua tree to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkMultipleAquaTrees = async (aquaTreeWrappers: AquaTreeWrapper[], linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar)
    }

    /**
     * @method linkAquaTreesToMultipleAquaTrees
     * @description This method links multiple aqua trees to multiple aqua trees
     * @param aquaTreeWrappers - The aqua trees to link
     * @param linkAquaTreeWrapper - The aqua trees to link to
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, LogData[]>
     */
    linkAquaTreesToMultipleAquaTrees = async (aquaTreeWrappers: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper[], enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkAquaTreesToMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar)
    }

    /**
     * @method createFormRevision
     * @description This method creates a form revision for the aqua tree
     * @param aquaTree - The aqua tree to create the form revision for
     * @param fileObject - The file object to create the form revision for
     * @param enableScalar - A boolean value to enable scalar
     * @returns Result<AquaOperationData, Log[]>
     */
    createFormRevision = async (aquaTree: AquaTreeWrapper, fileObject: FileObject, enableScalar: boolean = true): Promise<Result<AquaOperationData, LogData[]>> => {
        return createFormRevisionUtil(aquaTree, fileObject, enableScalar)
    }

    /**
     * @method hideFormElements
     * @description This method hides form elements
     * @param aquaTree - The aqua tree to hide form elements
     * @param keyToHide - The key to hide
     * @returns Result<AquaOperationData, LogData[]>
     */
    hideFormElements = async (aquaTree: AquaTreeWrapper, keyToHide: string): Promise<Result<AquaOperationData, LogData[]>> => {
        return hideFormElementsUtil(aquaTree, keyToHide)
    }

    /**
     * @method unHideFormElements
     * @description This method unhides form elements
     * @param aquaTree - The aqua tree to unhide form elements
     * @param keyToUnHide - The key to unhide
     * @param content - The content to unhide
     * @returns Result<AquaOperationData, Log[]>
     */
    unHideFormElements = async (aquaTree: AquaTreeWrapper, keyToUnHide: string, content: string): Promise<Result<AquaOperationData, LogData[]>> => {
        return unHideFormElementsUtil(aquaTree, keyToUnHide, content)
    }

    //get files to be read to file objects 
    fetchFilesToBeRead = (aquaTree: AquaTree): string[] => {
        return fetchFilesToBeReadUtil(aquaTree)
    }

    checkIfFileAlreadyNotarized = (aquaTree: AquaTree, fileObject: FileObject): boolean => {
        return checkIfFileAlreadyNotarizedUtil(aquaTree, fileObject)
    }


    // Revisions
    getRevisionByHash = (aquaTree: AquaTree, hash: string): Result<Revision, LogData[]> => {
        return getRevisionByHashUtil(aquaTree, hash)
    }

    // Revisions
    getLastRevision = (aquaTree: AquaTree): Result<Revision, LogData[]> => {
        return getLastRevisionUtil(aquaTree)
    }

    // get file
    getFileByHash = async (aquaTree: AquaTree, hash: string): Promise<Result<string, LogData[]>> => {
        return getFileByHashUtil(aquaTree, hash)
    }

    getVersionFromPackageJson = (): string => {
        let version = "1.3.2.0"
        console.log(packageJson.version);
        return packageJson.version ? packageJson.version : version

    }

    renderTree = (aquaTree: AquaTree) => {
        if (aquaTree.tree) {
            logAquaTree(aquaTree?.tree)
        }
    }

}


export class AquafierChainable {
    private value: AquaTree;
    private verificationResult: Result<AquaOperationData, LogData[]>;
    private logs: LogData[] = [];

    constructor(initialValue: AquaTree | null) {
        if (initialValue) {
            this.value = initialValue;
        }
    }

    unwrap(result: Result<AquaOperationData, LogData[]>): AquaTree {
        if (result.isErr()) {
            console.log(result.data)
            this.logs.push(...result.data)
            throw Error("an error occured")

        } else {
            this.logs.push(...result.data.logData)
        }
        return result.data.aquaTree!
    }

    async notarize(fileObject: FileObject, isForm: boolean = false, enableContent: boolean = false, enableScalar: boolean = true): Promise<this> {
        let data = await createGenesisRevision(fileObject, isForm, enableContent, enableScalar);

        if (data.isOk()) {
            this.value = this.unwrap(data);
            this.logs.push(...data.data.logData)
        } else {
            this.logs.push(...data.data)
        }


        return this;
    }

    async sign(signType: SignType = "metamask", credentials: CredentialsData = {
        mnemonic: "",
        nostr_sk: "",
        "did_key": "",
        alchemy_key: "",
        witness_eth_network: "",
        witness_method: ""
    }, enableScalar: boolean = true): Promise<this> {
        let data = await signAquaTreeUtil({
            aquaTree: this.value,
            fileObject: {
                fileName: "test.txt",
                fileContent: "",
                path: "/fake/path/test.txt"
            },
            revision: ""
        }, signType, credentials, enableScalar)

        // this.value = this.unwrap(data);

        if (data.isOk()) {
            this.value = this.unwrap(data);
            this.logs.push(...data.data.logData)
        } else {
            this.logs.push(...data.data)
        }

        return this;
    }

    async witness(witnessType: WitnessType = "eth", witnessNetwork: WitnessNetwork = "sepolia", witnessPlatform: WitnessPlatformType = "metamask", credentials: CredentialsData = {
        mnemonic: "",
        nostr_sk: "",
        "did_key": "",
        alchemy_key: "",
        witness_eth_network: "",
        witness_method: ""
    }, enableScalar: boolean = true): Promise<this> {
        let data = await witnessAquaTreeUtil({
            aquaTree: this.value,
            fileObject: undefined,
            revision: ""
        }, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
        // this.value = this.unwrap(data);

        if (data.isOk()) {
            this.value = this.unwrap(data);
            this.logs.push(...data.data.logData)
        } else {
            this.logs.push(...data.data)
        }

        return this;
    }

    async verify(linkedFileObject: Array<FileObject> = []): Promise<this> {
        let data = await verifyAquaTreeUtil(this.value, linkedFileObject)
        if (data.isOk()) {
            this.logs.push(...data.data.logData)
        } else {
            this.logs.push(...data.data)
        }
        this.verificationResult = data;
        return this;
    }

    getValue(): AquaTree {
        return this.value;
    }
    getVerificationValue(): Result<AquaOperationData, LogData[]> {
        return this.verificationResult;
    }
    getLogs(): LogData[] {
        return this.logs;
    }
}
