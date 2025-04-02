import { HDNodeWallet } from "ethers"




/**
 * Handles signing operations using CLI wallet
 * 
 * This class provides functionality to sign Aqua Tree revisions
 * using a CLI-based Ethereum wallet. It uses ethers.js HDNodeWallet
 * for secure message signing.
 */
export class CLISigner {

    /**
 * Signs a verification hash using the provided wallet
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
  