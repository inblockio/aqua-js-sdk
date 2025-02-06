import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import * as KeyResolver from 'key-did-resolver'
import { SignaturePayload, SignatureResult } from '../types'



const signature = {
  verify: async (jws: any, key: string, hash: string): Promise<boolean> => {
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
  },

  sign: async (verificationHash: string, privateKey: Uint8Array): Promise<SignatureResult> => {
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

export {
  signature,
  SignaturePayload,
  SignatureResult
}