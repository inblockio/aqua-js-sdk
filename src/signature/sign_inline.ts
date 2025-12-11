import { CredentialsData, InlineSignerOptions, LogData } from '../types';


/**
 * Handles signing operations using MetaMask wallet
 * 
 * This class provides functionality to sign Aqua Tree revisions using
 * MetaMask wallet in both browser and Node.js environments. In Node.js,
 * it spins up a local server to facilitate MetaMask interaction.
 */
export class InlineSigner {

    constructor() {

    }


    /**
     * Creates a standardized message for signing
     * 
     * @param verificationHash - Hash of the revision to sign
     * @returns Formatted message string
     */
    private createMessage(verificationHash: string): string {
        return `I sign this revision: [${verificationHash}]`;
    }



    /**
     * Handles signing process in browser environment
     * 
     * @param verificationHash - Hash of the revision to sign
     * @returns Promise resolving to [signature, wallet address, public key]
     * 
     * This method:
     * - Checks for MetaMask presence
     * - Requests account access
     * - Signs message using MetaMask
     * - Recovers public key from signature
     */
    private async signInline(verificationHash: string, signature: string, _walletAddress: string): Promise<[string, string, string]> {
        const message = this.createMessage(verificationHash);
        try {
            const { ethers } = await import('ethers');

            const walletAddress = ethers.getAddress(_walletAddress);

            if (!walletAddress) {
                throw new Error("No wallet address selected");
            }
            const publicKey = await this.recoverPublicKey(message, signature);
            return [signature, walletAddress, publicKey];
        } catch (error) {
            throw error;
        }
    }


    /**
     * Recovers public key from signature
     * 
     * @param message - Original signed message
     * @param signature - Ethereum signature
     * @returns Promise resolving to public key
     * 
     * Uses ethers.js to recover the public key from
     * the signature and message hash.
     */
    private async recoverPublicKey(message: string, signature: string): Promise<string> {
        const { ethers } = await import('ethers');
        return ethers.SigningKey.recoverPublicKey(
            ethers.hashMessage(message),
            signature
        );
    }


    /**
     * Signs a verification hash using MetaMask (legacy interface)
     * 
     * @param verificationHash - Hash of the revision to sign
     * @param network - Ethereum network
     * @returns Promise resolving to [signature, wallet address, public key]
     * 
     * This method:
     * - Detects environment (Node.js, browser, or React Native)
     * - Routes to appropriate signing method
     * - Returns complete signature information
     */
    public async signWithNetwork(verificationHash: string, signature: string, walletAddress: string): Promise<[string, string, string]> {
        return this.signInline(verificationHash, signature, walletAddress);
    }

    public async sign(targetRevisionHash: string, inlineSignerOptions: InlineSignerOptions): Promise<{
        signature: string,
        walletAddress: string,
        publicKey: string,
        signatureType: "ethereum:eip-191"
    }> {

        const [signature, walletAddress, publicKey] = await this.signWithNetwork(targetRevisionHash, inlineSignerOptions?.signature, inlineSignerOptions?.walletAddress);
        
        return {
            signature,
            walletAddress,
            publicKey,
            signatureType: "ethereum:eip-191"
        }
    }

    public validate(_credentials: CredentialsData, _identCharacter: string): LogData[] {
        // No credentials needed for inline signing
        return [];
    }
}