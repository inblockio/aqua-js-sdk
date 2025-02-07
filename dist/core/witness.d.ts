import { Result, Option } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper, WitnessNetwork, WitnessType, WitnessPlatformType, CredentialsData } from "../types";
export declare function verifyWitnessUtil(witness: Revision): Promise<Result<AquaOperationData, LogData[]>>;
export declare function witnessAquaObjectUtil(aquaObject: AquaObject, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: Option<CredentialsData>, enableScalar?: boolean): Promise<Result<AquaOperationData, LogData[]>>;
export declare function witnessMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: Option<CredentialsData>, enableScalar?: boolean): Promise<Result<AquaOperationData, LogData[]>>;
