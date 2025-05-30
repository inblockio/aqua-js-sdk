import { createSign, createPrivateKey, createPublicKey, verify } from 'node:crypto'
import forge from 'node-forge'

export class P12Signer {
  public async verify(signature: string, pubKey: string, data: string): Promise<boolean> {
    return verify(null, data, pubKey, signature)
  }

  public async sign(verificationHash: string, privateKey: string, password: string | null): Promise<any> {
    const p12Asn1  = forge.asn1.fromDer(privateKey)
    const p12      = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password)

    // 2. pull out the first private-key bag (most files have only one)
    const bagType = forge.pki.oids.pkcs8ShroudedKeyBag
    const bag = p12.getBags({ bagType })[bagType][0]
    const keyPem = forge.pki.privateKeyToPem(bag.key)

    const keyObj = createPrivateKey({ key: keyPem, format: 'pem' })
    const pubKey = createPublicKey({ key: keyPem, format: 'pem' })
    const signer = createSign('RSA-SHA256')
    signer.update(verificationHash)
    const signature = signer.sign(keyObj)
    return { signature, pubKey }
  }
}
