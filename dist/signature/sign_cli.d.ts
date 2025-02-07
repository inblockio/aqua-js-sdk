import { HDNodeWallet } from "ethers";
export declare class CLISigner {
    doSign(wallet: HDNodeWallet, verificationHash: string): Promise<string>;
}
