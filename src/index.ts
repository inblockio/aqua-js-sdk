import { AquaObject, AquaOperationData, FileObject, LogData, Revision, RevisionType } from "./types"
import { Result, Err, Ok, isOk, Option } from 'rustic';

class AquaTree {
    
    removeLastRevision = (aquaObject :AquaObject ) : Result<AquaOperationData, LogData[]> => {
        let logs : Array<LogData> = [];
        return Err(logs)
    }
  
    createNewRevision = async (timestamp : string, revisionType : RevisionType, enableScalar :  boolean, fileObject : Option<FileObject>) : Promise<Result<AquaOperationData, LogData[]>> => {
        let logs : Array<LogData> = [];
        return Err(logs);
    }

    verifyAquaObject =  async (aquaObject :AquaObject) : Promise<Result<AquaOperationData, LogData[]>> => {
        let logs : Array<LogData> = [];
        return Err(logs) 
    }

    verifyWitness = async (witness: Revision):  Promise<Result<AquaOperationData, LogData[]>> => {
        return verifyWitnessUtil(witness)
    }

    verifySignature = async (signature: Revision):  Promise<Result<AquaOperationData, LogData[]>> => {
        return verifySignatureUtil(signature)
    }

    // link 
    // forms -- also and form key ,remove form key
    // get revision by hash
    // get file
    // 
}