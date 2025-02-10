import { createContentRevisionUtil, getFileByHashUtil } from "./core/content";
import { createGenesisRevision, getLastRevisionUtil, getRevisionByHashUtil, removeLastRevisionUtil } from "./core/revision";
import { Result } from "./type_guards";
import { AquaObject, AquaObjectWrapper, AquaOperationData, FileObject, LogData, Revision } from "./types"


export * from "./types";
export * from "./type_guards"
// // export * from "./utils";

export function greet(name: string): string {
    return `Hello, ${name}!`;
}
export default class AquaTree {

    removeLastRevision = (aquaObject: AquaObject): Result<AquaOperationData, LogData[]> => {
        return removeLastRevisionUtil(aquaObject)
    }

    // Content
    createContentRevision = async (aquaObject: AquaObjectWrapper, fileObject: FileObject, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return createContentRevisionUtil(aquaObject, fileObject, enableScalar)
    }

    createGenesisRevision = async (fileObject: FileObject, isForm: boolean = false, enableContent: boolean = false, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
        return createGenesisRevision(fileObject, isForm, enableContent, enableScalar)
    }

//     verifyAquaObject = async (aquaObject: AquaObject, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> => {
//         return verifyAquaObjectUtil(aquaObject, fileObject)
//     }

//     // Wittness
//     verifyWitness = async (witnessRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
//         return verifyWitnessUtil(witnessRevision)
//     }

//     witnessAquaObject = async (aquaObject: AquaObject, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
//         return witnessAquaObjectUtil(aquaObject, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar)
//     }

//     witnessMultipleAquaObjects = async (aquaObjects: AquaObjectWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
//         return witnessMultipleAquaObjectsUtil(aquaObjects, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar)
//     }


//     // Signature
//     verifySignature = async (signature: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
//         return verifySignatureUtil(signature)
//     }

//     signAquaObject = async (aquaObject: AquaObjectWrapper, hash: string, signType: SignType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
//         return signAquaObjectUtil(aquaObject, hash, signType, credentials, enableScalar)
//     }

//     signMultipleAquaObjects = async (aquaObjects: AquaObjectWrapper[], signType: SignType, credentials: CredentialsData): Promise<Result<AquaOperationData, LogData[]>> => {
//         return signMultipleAquaObjectsUtil(aquaObjects, signType, credentials)
//     }

//     // Link 
//     verifyLink = async (linkRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
//         return verifyLinkUtil(linkRevision)
//     }

//     linkAquaObject = async (aquaObjectWrapper: AquaObjectWrapper, linkAquaObjectWrapper: AquaObjectWrapper, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> => {
//         return linkAquaObjectUtil(aquaObjectWrapper, linkAquaObjectWrapper, enableScalar)
//     }

//     linkMultipleAquaObjects = async (aquaObjectWrappers: AquaObjectWrapper[], linkAquaObjectWrapper: AquaObjectWrapper, enableScalar: boolean = false): Promise<Result<AquaOperationData[], LogData[]>> => {
//         return linkMultipleAquaObjectsUtil(aquaObjectWrappers, linkAquaObjectWrapper, enableScalar)
//     }

//     // Forms -- also and form key ,remove form key
//     verifyForm = async (formRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
//         return verifyFormUtil(formRevision)
//     }

//     LinkAquaObjectToForm = async (aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> => {
//         return LinkAquaObjectToFormUtil(aquaObject)
//     }

//     hideFormElements = async (aquaObject: AquaObject, elementsToHide: Array<string>): Promise<Result<AquaOperationData, LogData[]>> => {
//         return hideFormElementsUtil(aquaObject, elementsToHide)
//     }


    // Revisions
    getRevisionByHash = (aquaObject: AquaObject, hash: string): Result<Revision, LogData[]> => {
        return getRevisionByHashUtil(aquaObject, hash)
    }

    // Revisions
    getLastRevision = (aquaObject: AquaObject): Result<Revision, LogData[]> => {
        return getLastRevisionUtil(aquaObject)
    }

    // get file
    getFileByHash = async (aquaObject: AquaObject, hash: string): Promise<Result<string, LogData[]>> => {
        return getFileByHashUtil(aquaObject, hash)
    }

}
