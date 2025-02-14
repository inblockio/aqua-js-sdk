import { createContentRevisionUtil, getFileByHashUtil } from "./core/content";
import { createFormRevisionUtil, hideFormElementsUtil, unHideFormElementsUtil } from "./core/forms";
import { linkAquaTreesToMultipleAquaTreesUtil, linkAquaTreeUtil, linkMultipleAquaTreesUtil } from "./core/link";
import { createGenesisRevision, getLastRevisionUtil, getRevisionByHashUtil, removeLastRevisionUtil } from "./core/revision";
import { signAquaTreeUtil, signMultipleAquaTreesUtil } from "./core/signature";
import { verifyAquaTreeRevisionUtil, verifyAquaTreeUtil } from "./core/verify";
import { witnessAquaTreeUtil, witnessMultipleAquaTreesUtil } from "./core/witness";
import { Result } from "./type_guards";
import { AquaTree, AquaTreeWrapper, AquaOperationData, CredentialsData, FileObject, LogData, Revision, SignType, WitnessNetwork, WitnessPlatformType, WitnessType } from "./types"


export * from "./utils";
export * from "./types";
export * from "./type_guards";

export default class Aquafier {

    removeLastRevision = (aquaTree: AquaTree): Result<AquaOperationData, LogData[]> => {
        return removeLastRevisionUtil(aquaTree)
    }

    // Content
    createContentRevision = async (aquaTree: AquaTreeWrapper, fileObject: FileObject, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return createContentRevisionUtil(aquaTree, fileObject, enableScalar)
    }

    createGenesisRevision = async (fileObject: FileObject, isForm: boolean = false, enableContent: boolean = false, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return createGenesisRevision(fileObject, isForm, enableContent, enableScalar)
    }

    verifyAquaTree = async (aquaTree: AquaTree, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyAquaTreeUtil(aquaTree, fileObject)
    }

    verifyAquaTreeRevision = async (aquaTree: AquaTree, revision: Revision, revisionItemHash: string, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyAquaTreeRevisionUtil(aquaTree, revision, revisionItemHash, fileObject)
    }

    witnessAquaTree = async (aquaTree: AquaTree, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return witnessAquaTreeUtil(aquaTree, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar)
    }

    witnessMultipleAquaTrees = async (aquaTrees: AquaTreeWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return witnessMultipleAquaTreesUtil(aquaTrees, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar)
    }

    signAquaTree = async (aquaTree: AquaTreeWrapper, signType: SignType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return signAquaTreeUtil(aquaTree, signType, credentials, enableScalar)
    }

    signMultipleAquaTrees = async (aquaTrees: AquaTreeWrapper[], signType: SignType, credentials: CredentialsData): Promise<Result<AquaOperationData, LogData[]>> => {
        return signMultipleAquaTreesUtil(aquaTrees, signType, credentials)
    }


    linkAquaTree = async (aquaTreeWrapper: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkAquaTreeUtil(aquaTreeWrapper, linkAquaTreeWrapper, enableScalar)
    }

    linkMultipleAquaTrees = async (aquaTreeWrappers: AquaTreeWrapper[], linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar)
    }

    linkAquaTreesToMultipleAquaTrees = async (aquaTreeWrappers: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper[], enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkAquaTreesToMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar)
    }

    createFormRevision = async (aquaTree: AquaTreeWrapper, fileObject: FileObject, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return createFormRevisionUtil(aquaTree, fileObject, enableScalar)
    }


    hideFormElements = async (aquaTree: AquaTreeWrapper, keyToHide: string): Promise<Result<AquaOperationData, LogData[]>> => {
        return hideFormElementsUtil(aquaTree, keyToHide)
    }

    unHideFormElements = async (aquaTree: AquaTreeWrapper, keyToUnHide: string, content: string): Promise<Result<AquaOperationData, LogData[]>> => {
        return unHideFormElementsUtil(aquaTree, keyToUnHide, content)
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

        }else{
            this.logs.push(...result.data.logData)
        }
        return result.data.aquaTree
    }

    async notarize(fileObject: FileObject, isForm: boolean = false, enableContent: boolean = false, enableScalar: boolean = false): Promise<this> {
        let data = await createGenesisRevision(fileObject, isForm, enableContent, enableScalar);

        if(data.isOk()){
            this.value = this.unwrap(data);
            this.logs.push(...data.data.logData)
        }else{
            this.logs.push(...data.data)
        }


        return this;
    }

    async sign(signType: SignType = "metamask", credentials: CredentialsData = {
        mnemonic: "",
        nostr_sk: "",
        "did:key": "",
        alchemy_key: "",
        witness_eth_network: "",
        witness_eth_platform: ""
    }, enableScalar: boolean = false): Promise<this> {
        let data = await signAquaTreeUtil({
            aquaTree: this.value,
            fileObject: null,
            revision: ""
        }, signType, credentials, enableScalar)
        
        // this.value = this.unwrap(data);

        if(data.isOk()){
            this.value = this.unwrap(data);
            this.logs.push(...data.data.logData)
        }else{
            this.logs.push(...data.data)
        }
        
        return this;
    }

    async witness(witnessType: WitnessType = "eth", witnessNetwork: WitnessNetwork = "sepolia", witnessPlatform: WitnessPlatformType = "metamask", credentials: CredentialsData = {
        mnemonic: "",
        nostr_sk: "",
        "did:key": "",
        alchemy_key: "",
        witness_eth_network: "",
        witness_eth_platform: ""
    }, enableScalar: boolean = false): Promise<this> {
        let data = await witnessAquaTreeUtil(this.value, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
        // this.value = this.unwrap(data);

        if(data.isOk()){
            this.value = this.unwrap(data);
            this.logs.push(...data.data.logData)
        }else{
            this.logs.push(...data.data)
        }
        
        return this;
    }

    async verify(linkedFileObject: Array<FileObject> = []): Promise<this> {
        let data = await verifyAquaTreeUtil(this.value, linkedFileObject)
        if(data.isOk()){
            this.logs.push(...data.data.logData)
        }else{
            this.logs.push(...data.data)
        }
        this.verificationResult = data;
        return this;
    }


    // content(n: number): this {
    //     this.value *= n;
    //     return this;
    // }

    // async link(n: number): Promise<this> {
    //     if (n === 0) throw new Error("Cannot divide by zero");
    //     this.value /= n;
    //     return this;
    // }

    // async form(n: number): Promise<this> {
    //     await new Promise(resolve => setTimeout(resolve, 100)); // Simulating async operation
    //     this.value += n;
    //     return this;
    // }

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


// export interface AquaTree {
//     revisions: Revisions;
//     file_index: FileIndex;
//     tree?: RevisionTree;
//     treeMapping?: TreeMapping;
//     sign(): Promise<string>; // If you want it to be async
//     // OR
//     sign(): string; // If you want it to be synchronous
//   }
  
//   export class AquaTreeImpl implements AquaTree {
//     revisions: Revisions;
//     file_index: FileIndex;
//     tree?: RevisionTree;
//     treeMapping?: TreeMapping;
  
//     constructor(
//       revisions: Revisions,
//       file_index: FileIndex,
//       tree?: RevisionTree,
//       treeMapping?: TreeMapping
//     ) {
//       this.revisions = revisions;
//       this.file_index = file_index;
//       this.tree = tree;
//       this.treeMapping = treeMapping;
//     }
  
//     sign(): string {
//       // Implement your signing logic here
//       // For example:
//       const dataToSign = JSON.stringify({
//         revisions: this.revisions,
//         file_index: this.file_index,
//         tree: this.tree,
//         treeMapping: this.treeMapping
//       });
//       // Add your signing implementation
//       return dataToSign;
//     }
//   }