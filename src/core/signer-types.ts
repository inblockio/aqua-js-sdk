import { CredentialsData, LogData, SignatureData } from "../types"
import { ReactNativeMetaMaskOptions } from "../types"

export interface SignerStrategy {
  sign(targetRevisionHash: string, credentials: CredentialsData, reactNativeOptions?: ReactNativeMetaMaskOptions): Promise<SignResult>
  validate(credentials: CredentialsData, identCharacter: string): LogData[]
}

export interface SignResult {
  signature: string | SignatureData
  walletAddress: string
  publicKey: string
  signatureType: string
}