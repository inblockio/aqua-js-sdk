import { HDNodeWallet } from "ethers"
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
        const signature = await this.doSign(wallet, targetRevisionHash)
        
        return {
            signature,
            walletAddress,
            publicKey,
            signatureType: "ethereum:eip-191"
        }
    }

    /**
 * Signs a verification hash using the provided wallet (legacy interface)
 * 
 * @param wallet - HDNodeWallet instance for signing
 * @param verificationHash - Hash of the revision to sign
 * @returns Promise resolving to the signature string
 * 
 * This method:
 * - Creates a standardized message with the verification hash
 * - Signs the message using the wallet's private key
 * - Returns the resulting signature
 */
public async doSign(wallet: HDNodeWallet, verificationHash: string) {
    const message = "I sign this revision: [" + verificationHash + "]"
    const signature = await wallet.signMessage(message)
    return signature
  }

}
  