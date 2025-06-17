export class P12Signer {
  private async getNodeCrypto() {
    if (typeof window !== "undefined") {
      throw new Error("P12Signer is not supported in browser environment")
    }
    return require("node:crypto")
  }

  private async getForge() {
    if (typeof window !== "undefined") {
      throw new Error("P12Signer is not supported in browser environment")
    }
    return require("node-forge")
  }

  public async verify(signature: string, pubKey: string, data: string): Promise<boolean> {
    const { verify: cryptoVerify } = await this.getNodeCrypto()
    
    // Convert hex-encoded public key back to a buffer
    const pubKeyBuffer = Buffer.from(pubKey, 'hex')
    
    // Convert hex-encoded signature to buffer
    const signatureBuffer = Buffer.from(signature, 'hex')
    
    // Use the public key format option that matches how it was exported
    return cryptoVerify(
      'RSA-SHA256', 
      Buffer.from(data), 
      { key: pubKeyBuffer, format: 'der', type: 'spki' }, 
      signatureBuffer
    )
  }
  
  public async sign(verificationHash: string, privateKey: string, password: string | null): Promise<{signature: string, pubKey: string, walletAddress: string}> {
    const { createSign, createPrivateKey, createPublicKey } = await this.getNodeCrypto()
    const forge = await this.getForge()
    
    const p12Asn1  = forge.asn1.fromDer(privateKey)
    const p12      = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password)

    // 2. pull out the first private-key bag (most files have only one)
    const bagType = forge.pki.oids.pkcs8ShroudedKeyBag
    const bag = p12.getBags({ bagType })[bagType][0]
    const keyPem = forge.pki.privateKeyToPem(bag.key)

    const keyObj = createPrivateKey({ key: keyPem, format: 'pem' })
    const pubKeyObj = createPublicKey({ key: keyPem, format: 'pem' })
    
    // Convert public key to a buffer and then to a string
    const pubKeyBuffer = Buffer.from(pubKeyObj.export({ type: 'spki', format: 'der' }))
    const pubKeyString = pubKeyBuffer.toString('hex')
    
    const signer = createSign('RSA-SHA256')
    signer.update(verificationHash)
    const signature = signer.sign(keyObj)
    
    return { 
      signature: signature.toString('hex'), 
      pubKey: pubKeyString, 
      walletAddress: pubKeyString 
    }
  }
}