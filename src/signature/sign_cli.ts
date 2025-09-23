import { getWallet } from "../utils"
import { CredentialsData, LogData, LogType } from "../types"
import { SignerStrategy, SignResult } from "../core/signer-types"




/**
 * Handles signing operations using CLI wallet
 * 
 * This class provides functionality to sign Aqua Tree revisions
 * using a CLI-based Ethereum wallet. It uses ethers.js HDNodeWallet
 * for secure message signing.
 */
export class CLISigner implements SignerStrategy {

    /**
     * Validates credentials for CLI signing
     * 
     * @param credentials - Credentials data
     * @param identCharacter - Identifier character for logging
     * @returns Array of validation errors (empty if valid)
     */
    public validate(credentials: CredentialsData, identCharacter: string): LogData[] {
        if (credentials == null || credentials == undefined) {
            return [{
                log: "Credentials not found ",
                logType: LogType.ERROR,
                ident: identCharacter,
            }]
        }
        return []
    }

    /**
     * Signs a verification hash using CLI wallet (SignerStrategy interface)
     * 
     * @param targetRevisionHash - Hash of the revision to sign
     * @param credentials - Credentials data containing mnemonic
     * @returns Promise resolving to SignResult
     */
    public async sign(targetRevisionHash: string, credentials: CredentialsData): Promise<SignResult> {
        const [wallet, walletAddress, publicKey] = await getWallet(credentials.mnemonic)
        const message = "I sign this revision: [" + targetRevisionHash + "]"
        const signature = await wallet.signMessage(message)

        return {
            signature,
            walletAddress,
            publicKey,
            signatureType: "ethereum:eip-191"
        }
    }
}
