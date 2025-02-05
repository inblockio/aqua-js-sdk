import { createContentRevisionUtil, getFileByHashUtil } from "./core/content";
import { LinkAquaObjectToFormUtil, verifyFormUtil } from "./core/forms";
import { linkAquaObjectUtil, linkMultipleAquaObjectsUtil, verifyLinkUtil } from "./core/link";
import { createNewRevisionUtil, getRevisionByHashUtil, removeLastRevisionUtil } from "./core/revision";
import { signAquaObjectUtil, signMultipleAquaObjectsUtil, verifySignatureUtil } from "./core/signature";
import { verifyWitnessUtil, witnessAquaObjectUtil, witnessMultipleAquaObjectsUtil } from "./core/witness";
import { AquaObject, AquaObjectWrapper, AquaOperationData, FileObject, LogData, Revision, RevisionType } from "./types"
import { Result, Err, Ok, isOk, Option } from 'rustic';

class AquaTree {

    removeLastRevision = (aquaObject: AquaObject): Result<AquaOperationData, LogData[]> => {
        return removeLastRevisionUtil(aquaObject)
    }

    // Content
    createContentRevision = async (aquaObjects: AquaObjectWrapper): Promise<Result<AquaOperationData, LogData[]>> => {
        return createContentRevisionUtil(aquaObjects)
    }

    createNewRevision = async (timestamp: string, revisionType: RevisionType, enableScalar: boolean, fileObject: Option<FileObject>): Promise<Result<AquaOperationData, LogData[]>> => {

        return createNewRevisionUtil(timestamp, revisionType, enableScalar, fileObject)
    }

    verifyAquaObject = async (aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> => {
        let logs: Array<LogData> = [];
        return Err(logs)
    }

    // Wittness
    verifyWitness = async (witness: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyWitnessUtil(witness)
    }

    witnessAquaObject = async (aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> => {
        return witnessAquaObjectUtil(aquaObject)
    }

    witnessMultipleAquaObjects = async (aquaObjects: AquaObjectWrapper[]): Promise<Result<AquaOperationData, LogData[]>> => {
        return witnessMultipleAquaObjectsUtil(aquaObjects)
    }


    // Signature
    verifySignature = async (signature: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifySignatureUtil(signature)
    }

    signAquaObject = async (aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> => {
        return signAquaObjectUtil(aquaObject)
    }

    signMultipleAquaObjects = async (aquaObjects: AquaObjectWrapper[]): Promise<Result<AquaOperationData, LogData[]>> => {
        return signMultipleAquaObjectsUtil(aquaObjects)
    }

    // Link 
    verifyLink = async (linkRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyLinkUtil(linkRevision)
    }

    linkAquaObject = async (aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkAquaObjectUtil(aquaObject)
    }

    linkMultipleAquaObjects = async (aquaObjects: AquaObjectWrapper[]): Promise<Result<AquaOperationData, LogData[]>> => {
        return linkMultipleAquaObjectsUtil(aquaObjects)
    }

    // Forms -- also and form key ,remove form key
    verifyForm = async (formRevision: Revision): Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyFormUtil(formRevision)
    } 

    LinkAquaObjectToForm = async (aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> => {
        return LinkAquaObjectToFormUtil(aquaObject)
    }


    // Revisions
    getRevisionByHash = async (aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> => {
        return getRevisionByHashUtil(aquaObject)
    }

    // get file
    getFileByHash = async (hash: String): Promise<Result<AquaOperationData, LogData[]>> => {
        return getFileByHashUtil(hash)
    }

}