import { Result, Err, Option } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper, CredentialsData, LogType } from "../types";
import { SignType } from "../types";
import { MetaMaskSigner } from "../signature/sign_metamask";
import { CLISigner } from "../signature/sign_cli";
import { getWallet } from "../utils";



export async function verifySignatureUtil(signature: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function signAquaObjectUtil(aquaObject: AquaObjectWrapper, hash: string, signType: SignType, credentials: Option<CredentialsData>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    let targetRevision = "";
    if (aquaObject.revision == undefined || aquaObject.revision == null || aquaObject.revision.length == 0) {
        const verificationHashes = Object.keys(aquaObject.aquaObject.revisions)
        const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
        targetRevision = lastRevisionHash
    } else {
        targetRevision = aquaObject.revision
    }

    let signature, walletAddress, publicKey, signature_type

    switch (signType) {
        case "metamask":
            let sign = new MetaMaskSigner();
            [signature, walletAddress, publicKey] = await sign.sign(targetRevision)
            signature_type = "ethereum:eip-191"
            break
        case "cli":
            try {
                // const credentials = readCredentials()
                
                if (credentials == null) {
                    logs.push({
                        log:"credentials not found ",
                        logType: LogType.ERROR
                    })
                    return Err(logs);
                }
                let    [wallet, walletAddress, publicKey] = getWallet(credentials.mnemonic)
                let sign = new CLISigner();
                signature = await sign.doSign(wallet, targetRevision)
            } catch (error) {
                console.error("Failed to read mnemonic:", error)
                process.exit(1)
            }
            signature_type = "ethereum:eip-191"
            break
        case "did":
            // const credentials = readCredentials()
            if (credentials['did:key'].length === 0 || !credentials['did:key']) {

                console.log("DID key is required.  Please get a key from https://hub.ebsi.eu/tools/did-generator")

                process.exit(1)
            }

            const { jws, key } = await did.signature.sign(
                previousVerificationHash,
                Buffer.from(credentials["did:key"], "hex"),
            )
            signature = jws //jws.payload
            walletAddress = key
            publicKey = key
            signature_type = "did:key"
            break
    }

    return Err(logs)
}

export async function signMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], signType: SignType, credentials: Option<CredentialsData>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}