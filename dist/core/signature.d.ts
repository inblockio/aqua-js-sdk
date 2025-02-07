import { Result, Option } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObjectWrapper, CredentialsData } from "../types";
import { SignType } from "../types";
export declare function verifySignatureUtil(signature: Revision): Promise<Result<AquaOperationData, LogData[]>>;
export declare function signAquaObjectUtil(aquaObjectWrapper: AquaObjectWrapper, hash: string, signType: SignType, credentials: Option<CredentialsData>, enableScalar?: boolean): Promise<Result<AquaOperationData, LogData[]>>;
export declare function signMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], signType: SignType, credentials: Option<CredentialsData>, enableScalar?: boolean): Promise<Result<AquaOperationData, LogData[]>>;
