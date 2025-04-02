import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import * as KeyResolver from 'key-did-resolver'
import { SignaturePayload, SignatureResult } from '../types'


/**
 * Handles signing operations using Decentralized Identifiers (DIDs)
 * 
 * This class provides functionality to sign and verify Aqua Tree revisions
 * using DID-based cryptographic operations. It uses the key-did-provider-ed25519
 * for Ed25519-based DID operations and key-did-resolver for DID resolution.
 */
export class DIDSigner {
  /**
* Verifies a DID-signed JWS against a verification hash
* 
* @param jws - JSON Web Signature to verify
* @param key - DID key used for signing
* @param hash - Verification hash that was signed
* @returns Promise resolving to boolean indicating signature validity
* 
* This method:
* - Constructs the expected signature payload
* - Verifies the JWS using DID resolver
* - Validates payload message and key match
*/
  public async verify(jws: any, key: string, hash: string): Promise<boolean> {
    const expected: SignaturePayload = { message: `I sign this revision: [${hash}]` }
    try {
      const resolver = KeyResolver.getResolver()
      const result = await (new DID({ resolver })).verifyJWS(jws)
      if (!result.payload || expected.message !== result.payload.message) return false
      if (key !== result.kid.split("#")[0]) return false
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  }

  /**
 * Signs a verification hash using DID with Ed25519 provider
 * 
 * @param verificationHash - Hash of the revision to sign
 * @param privateKey - Ed25519 private key as Uint8Array
 * @returns Promise resolving to SignatureResult containing JWS and DID
 * 
 * This method:
 * - Creates a standardized signature payload
 * - Initializes Ed25519 DID provider with private key
 * - Authenticates the DID
 * - Creates and returns a JSON Web Signature
 */
  public async sign(verificationHash: string, privateKey: Uint8Array): Promise<SignatureResult> {
    const payload: SignaturePayload = {
      message: `I sign this revision: [${verificationHash}]`
    }

    // If you need to generate a random private key:
    // const seed = randomBytes(32)
    // console.log(Buffer.from(seed).toString("hex"))

    const provider = new Ed25519Provider(privateKey)
    const resolver = KeyResolver.getResolver()
    const did = new DID({ provider, resolver })
    await did.authenticate()

    const jws = await did.createJWS(payload)
    return { jws, key: did.id }
  }
}

// export {
//   signature,
//   SignaturePayload,
//   SignatureResult
// }