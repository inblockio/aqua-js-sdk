import * as pkijs from "pkijs";
export declare class WitnessTSA {
    isoDate2unix: (t: Date | string) => number;
    extractGenTimeFromResp: (resp: pkijs.TimeStampResp) => number;
    witness: (hash: string, tsaUrl: string) => Promise<[string, string, number]>;
    verify: (transactionHash: string, expectedMR: string, expectedTimestamp: number) => Promise<boolean>;
}
