import { Result } from "rustic";
import { AquaObject, AquaObjectWrapper, AquaOperationData, FileObject, LogData } from "../types";
export declare function createContentRevisionUtil(aquaObjectWrapper: AquaObjectWrapper, fileObject: FileObject, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>>;
export declare function getFileByHashUtil(aquaObject: AquaObject, hash: string): Promise<Result<string, LogData[]>>;
