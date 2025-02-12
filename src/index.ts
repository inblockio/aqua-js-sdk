import { createContentRevisionUtil, getFileByHashUtil } from "./core/content";
import { createFormRevisionUtil, hideFormElementsUtil, unHideFormElementsUtil } from "./core/forms";
import { linkAquaTreeUtil, linkMultipleAquaTreesUtil } from "./core/link";
import { createGenesisRevision, getLastRevisionUtil, getRevisionByHashUtil, removeLastRevisionUtil } from "./core/revision";
import { signAquaTreeUtil, signMultipleAquaTreesUtil } from "./core/signature";
import { verifyAquaTreeRevisionUtil, verifyAquaTreeUtil } from "./core/verify";
import { witnessAquaTreeUtil, witnessMultipleAquaTreesUtil } from "./core/witness";
import { Err, Result } from "./type_guards";
import { AquaTree, AquaTreeWrapper, AquaOperationData, CredentialsData, FileObject, LogData, Revision, SignType, WitnessNetwork, WitnessPlatformType, WitnessType } from "./types"


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

    signAquaTree = async (aquaTree: AquaTreeWrapper, hash: string, signType: SignType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return signAquaTreeUtil(aquaTree, hash, signType, credentials, enableScalar)
    }

    signMultipleAquaTrees = async (aquaTrees: AquaTreeWrapper[], signType: SignType, credentials: CredentialsData): Promise<Result<AquaOperationData, LogData[]>> => {
        return signMultipleAquaTreesUtil(aquaTrees, signType, credentials)
    }


    linkAquaTree = async (aquaTreeWrapper: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkAquaTreeUtil(aquaTreeWrapper, linkAquaTreeWrapper, enableScalar)
    }

    linkMultipleAquaTrees = async (aquaTreeWrappers: AquaTreeWrapper[], linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean = false): Promise<Result<AquaOperationData[], LogData[]>> => {
        return linkMultipleAquaTreesUtil(aquaTreeWrappers, linkAquaTreeWrapper, enableScalar)
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


/**indepedent function to enable chaining */

export function unwrap(result: Result<AquaOperationData, LogData[]>): AquaTree {
    if (result.isErr()) {
        throw Error("an error occured")
    }
    return result.data.aquaTree
}

export async function sign(_aquaTree: AquaTree): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = []
    return Promise.resolve(Err(logs))
}

export async function witness(_aquaTree: AquaTree): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = []
    return Promise.resolve(Err(logs))
}