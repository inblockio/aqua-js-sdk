import { SignatureResult } from '../types';
export declare class DIDSigner {
    verify(jws: any, key: string, hash: string): Promise<boolean>;
    sign(verificationHash: string, privateKey: Uint8Array): Promise<SignatureResult>;
}
