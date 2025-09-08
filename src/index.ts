// import { Aqua, createAqua, WitnessConfigs, SignConfigs } from "./aqua-v4";
import type { WitnessConfig } from "./aqua-v4";

import * as AquaV1 from "./aqua-v1";
import * as AquaV4 from "./aqua-v4";

export * from "./utils";
export * from "./types";
export * from "./type_guards";
export { recoverWalletAddress } from "./core/signature"
export * from "./core/formatter"
export { AquaV1, AquaV4 }
export type { WitnessConfig }

export default AquaV4
