import { Result } from "rustic";
import { AquaOperationData, LogData, AquaObject } from "../types";
export declare function verifyAquaObjectUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>>;
