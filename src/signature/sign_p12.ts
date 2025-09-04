import { getCrypto, getForge } from '../platform/crypto';
import { CredentialsData, LogData } from '../types';
import { SignerStrategy, SignResult } from '../core/signer-types';

export class P12Signer implements SignerStrategy {
  // Use our platform compatibility layer instead of direct Node.js imports
  private async getCrypto() {
    return await getCrypto();
  }

  private async getForge() {
    return await getForge();
  }

  /**
   * Validates credentials for P12 signing
   * 
   * @param credentials - Credentials data
   * @param identCharacter - Identifier character for logging
   * @returns Array of validation errors (empty if valid)
   */
  public validate(credentials: CredentialsData, identCharacter: string): LogData[] {
    return []
  }

  /**
   * Signs a verification hash using P12 certificate (SignerStrategy interface)
   * 
   * @param targetRevisionHash - Hash of the revision to sign
   * @param credentials - Credentials data containing P12 content and password
   * @returns Promise resolving to SignResult
   */
  public async sign(targetRevisionHash: string, credentials: CredentialsData): Promise<SignResult> {
    const { signature, pubKey } = await this.signWithP12(targetRevisionHash, credentials["p12_content"], credentials["p12_password"])
    
    return {
      signature,
      walletAddress: pubKey,
      publicKey: pubKey,
      signatureType: "p12"
    }
  }

  public async verify(signature: string, pubKey: string, data: string): Promise<boolean> {
    const { createVerify } = await this.getCrypto()
    
    // Convert hex-encoded public key back to a buffer
    const pubKeyBuffer = Buffer.from(pubKey, 'hex')
    
    // Convert hex-encoded signature to buffer
    const signatureBuffer = Buffer.from(signature, 'hex')
    
    try {
      // Create verifier and update with data
      const verifier = createVerify('RSA-SHA256')
      verifier.update(data)
      
      // Verify the signature
      return verifier.verify(pubKeyBuffer, signatureBuffer)
    } catch (error) {
      console.error('Error verifying signature:', error)
      return false
    }
  }
  
  public async signWithP12(verificationHash: string, privateKey: string, password: string | null): Promise<{signature: string, pubKey: string, walletAddress: string}> {
    const { createSign } = await this.getCrypto()
    const forge = await this.getForge()
    
    const p12Asn1  = forge.asn1.fromDer(privateKey)
    const p12      = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password)

    // 2. pull out the first private-key bag (most files have only one)
    const bagType = forge.pki.oids.pkcs8ShroudedKeyBag
    const bag = p12.getBags({ bagType })[bagType][0]
    const keyPem = forge.pki.privateKeyToPem(bag.key)

    // Use forge for key operations instead of Node.js crypto
    const privateKeyObj = forge.pki.privateKeyFromPem(keyPem)
    const publicKey = forge.pki.rsa.setPublicKey(privateKeyObj.n, privateKeyObj.e)
    
    // Convert public key to DER format and then to hex string
    const publicKeyAsn1 = forge.pki.publicKeyToAsn1(publicKey)
    const publicKeyDer = forge.asn1.toDer(publicKeyAsn1).getBytes()
    const pubKeyString = Buffer.from(publicKeyDer, 'binary').toString('hex')
    
    // Use the crypto-compatible signer
    const signer = createSign('RSA-SHA256')
    signer.update(verificationHash)
    
    // We have two options for signing:
    // Option 1: Use the crypto signer (preferred for React Native compatibility)
    let signature;
    try {
      // Try to use the crypto signer first
      signature = signer.sign(privateKeyObj)
    } catch (error) {
      // Fallback to forge for signing if crypto signer fails
      console.warn('Crypto signer failed, falling back to forge:', error)
      const md = forge.md.sha256.create()
      md.update(verificationHash)
      signature = privateKeyObj.sign(md)
    }
    
    return { 
      signature: Buffer.from(signature, 'binary').toString('hex'), 
      pubKey: pubKeyString, 
      walletAddress: pubKeyString 
    }
  }
}