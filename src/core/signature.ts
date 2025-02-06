import { Result, Err, Option, Ok } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper, CredentialsData, LogType } from "../types";
import { SignType } from "../types";
import { MetaMaskSigner } from "../signature/sign_metamask";
import { CLISigner } from "../signature/sign_cli";
import { dict2Leaves, formatMwTimestamp, getHashSum, getWallet } from "../utils";
import { DIDSigner } from "../signature/sign_did";
import MerkleTree from "merkletreejs";



export async function verifySignatureUtil(signature: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}


export async function signAquaObjectUtil(aquaObjectWrapper: AquaObjectWrapper, hash: string, signType: SignType, credentials: Option<CredentialsData>, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let aquaObject = aquaObjectWrapper.aquaObject
    let logs: Array<LogData> = [];
    let targetRevisionHash = "";
    if (aquaObjectWrapper.revision == undefined || aquaObjectWrapper.revision == null || aquaObjectWrapper.revision.length == 0) {
        const verificationHashes = Object.keys(aquaObjectWrapper.aquaObject.revisions)
        const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
        targetRevisionHash = lastRevisionHash
    } else {
        targetRevisionHash = aquaObjectWrapper.revision
    }

    let signature, walletAddress, publicKey, signature_type

    switch (signType) {
        case "metamask":
            let sign = new MetaMaskSigner();
            [signature, walletAddress, publicKey] = await sign.sign(targetRevisionHash)
            signature_type = "ethereum:eip-191"
            break
        case "cli":
            try {
                // const credentials = readCredentials()

                if (credentials == null) {
                    logs.push({
                        log: "credentials not found ",
                        logType: LogType.ERROR
                    })
                    return Err(logs);
                }
                let [wallet, walletAddress, publicKey] = getWallet(credentials.mnemonic)
                let sign = new CLISigner();
                signature = await sign.doSign(wallet, targetRevisionHash)
            } catch (error) {
                console.error("Failed to read mnemonic:", error)
                process.exit(1)
            }
            signature_type = "ethereum:eip-191"
            break
        case "did":
            // const credentials = readCredentials()
            if (credentials == null || credentials == undefined || credentials['did:key'].length === 0 || !credentials['did:key']) {

                console.log("DID key is required.  Please get a key from https://hub.ebsi.eu/tools/did-generator")

                process.exit(1)
            }

            let did = new DIDSigner();
            const { jws, key } = await did.sign(
                targetRevisionHash,
                Buffer.from(credentials["did:key"], "hex"),
            )
            signature = jws //jws.payload
            walletAddress = key
            publicKey = key
            signature_type = "did:key"
            break
    }

    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))

    let verificationData: Revision = {
        previous_verification_hash: targetRevisionHash, //previousVerificationHash,
        local_timestamp: timestamp,
        revision_type: "signature",
        signature: signature,
        signature_public_key: publicKey,
        signature_wallet_address: walletAddress,
        signature_type: signature_type,
    }

    // Merklelize the dictionary
    const leaves = dict2Leaves(verificationData)
    const tree = new MerkleTree(leaves, getHashSum, {
        duplicateOdd: false,
    })

    if (!enableScalar) {
        verificationData.leaves = leaves
    }
    let verification_hash: string = tree.getHexRoot();

    aquaObject.revisions[verification_hash] = verificationData;

    let data: AquaOperationData = {
        aquaObjects: null,
        aquaObject: aquaObject,
        logData: logs
    }
    return Ok(data)
}

export async function signMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], signType: SignType, credentials: Option<CredentialsData>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}