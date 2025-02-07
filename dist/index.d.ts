import { AquaObject, AquaObjectWrapper, AquaOperationData, CredentialsData, FileObject, LogData, Revision, SignType, WitnessNetwork, WitnessPlatformType, WitnessType } from "./types";
import { Result, Option } from 'rustic';
export default class AquaTree {
    removeLastRevision: (aquaObject: AquaObject) => Result<AquaOperationData, LogData[]>;
    createContentRevision: (aquaObject: AquaObjectWrapper, fileObject: FileObject, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    createGenesisRevision: (fileObject: FileObject, isForm?: boolean, enableContent?: boolean, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    verifyAquaObject: (aquaObject: AquaObject) => Promise<Result<AquaOperationData, LogData[]>>;
    verifyWitness: (witnessRevision: Revision) => Promise<Result<AquaOperationData, LogData[]>>;
    witnessAquaObject: (aquaObject: AquaObject, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: Option<CredentialsData>, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    witnessMultipleAquaObjects: (aquaObjects: AquaObjectWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: Option<CredentialsData>, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    verifySignature: (signature: Revision) => Promise<Result<AquaOperationData, LogData[]>>;
    signAquaObject: (aquaObject: AquaObjectWrapper, hash: string, signType: SignType, credentials: Option<CredentialsData>, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    signMultipleAquaObjects: (aquaObjects: AquaObjectWrapper[], signType: SignType, credentials: Option<CredentialsData>) => Promise<Result<AquaOperationData, LogData[]>>;
    verifyLink: (linkRevision: Revision) => Promise<Result<AquaOperationData, LogData[]>>;
    linkAquaObject: (aquaObject: AquaObject, linkAquaObjectWrapper: AquaObjectWrapper, enableScalar?: boolean) => Promise<Result<AquaOperationData, LogData[]>>;
    linkMultipleAquaObjects: (aquaObjects: AquaObjectWrapper[]) => Promise<Result<AquaOperationData, LogData[]>>;
    verifyForm: (formRevision: Revision) => Promise<Result<AquaOperationData, LogData[]>>;
    LinkAquaObjectToForm: (aquaObject: AquaObject) => Promise<Result<AquaOperationData, LogData[]>>;
    hideFormElements: (aquaObject: AquaObject, elementsToHide: Array<string>) => Promise<Result<AquaOperationData, LogData[]>>;
    getRevisionByHash: (aquaObject: AquaObject, hash: string) => Result<Revision, LogData[]>;
    getLastRevision: (aquaObject: AquaObject) => Result<Revision, LogData[]>;
    getFileByHash: (aquaObject: AquaObject, hash: string) => Promise<Result<string, LogData[]>>;
}
