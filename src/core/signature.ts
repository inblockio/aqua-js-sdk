
import { Revision, AquaOperationData, LogData, SignType, AquaTreeWrapper, CredentialsData, LogType } from "../types";
import { MetaMaskSigner } from "../signature/sign_metamask";
import { CLISigner } from "../signature/sign_cli";
import { dict2Leaves, formatMwTimestamp, getHashSum, getMerkleRoot, getWallet } from "../utils";
import { DIDSigner } from "../signature/sign_did";
import { createAquaTree } from "../aquavhtree";
import { ethers } from "ethers";
import { Err, Ok, Result } from "../type_guards";

export async function signAquaTreeUtil(aquaTreeWrapper: AquaTreeWrapper, _hash: string, signType: SignType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let aquaTree = aquaTreeWrapper.aquaTree
    let logs: Array<LogData> = [];
    let targetRevisionHash = "";
    if (aquaTreeWrapper.revision == undefined || aquaTreeWrapper.revision == null || aquaTreeWrapper.revision.length == 0) {
        const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions)
        const lastRevisionHash = verificationHashes[verificationHashes.length - 1]
        targetRevisionHash = lastRevisionHash
    } else {
        targetRevisionHash = aquaTreeWrapper.revision
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

                if (credentials == null || credentials == undefined ) {
                    logs.push({
                        log: "❌ credentials not found ",
                        logType: LogType.ERROR
                    })
                    return Err(logs);
                }
                let [wallet, _walletAddress, _publicKey] = getWallet(credentials.mnemonic)
                let sign = new CLISigner();
                signature = await sign.doSign(wallet, targetRevisionHash)
            } catch (error) {
                logs.push({
                    log:"❌ Failed to read mnemonic:" +  error,
                    logType: LogType.ERROR
                })
                return Err(logs);
                
            }
            signature_type = "ethereum:eip-191"
            break
        case "did":
            // const credentials = readCredentials()
            if (credentials == null || credentials == undefined || credentials['did:key'].length === 0 || !credentials['did:key']) {

                logs.push({
                    log: "❌ DID key is required.  Please get a key from https://hub.ebsi.eu/tools/did-generator",
                    logType: LogType.ERROR
                });
                return Err(logs);
              
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


    if (!enableScalar) {
        verificationData.leaves = leaves
    }
    let verification_hash: string = getMerkleRoot(leaves); //tree.getHexRoot();

    aquaTree.revisions[verification_hash] = verificationData;

    let data: AquaOperationData = {
        aquaTrees: null,
        aquaTree: aquaTree,
        logData: logs
    }
    // Tree creation
    let aquaTreeWithTree = createAquaTree(data)

    logs.push({
        log: `  ✅  aquaTree signed succesfully`,
        logType: LogType.SUCCESS
    });

    let result: AquaOperationData = {
        aquaTree: aquaTreeWithTree,
        aquaTrees: null,
        logData: logs
    }
    return Ok(result)
}

export async function signMultipleAquaTreesUtil(_aquaTrees: AquaTreeWrapper[], _signType: SignType, _credentials: CredentialsData, _enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    logs.push({
        log: "unimplmented need to be fixes",
        logType: LogType.ERROR
    });

    return Err(logs)
}



export async function verifySignature(data: Revision, verificationHash: string): Promise<[boolean, LogData[]]> {

    let logs: Array<LogData> = [];

    // TODO enforce that the verificationHash is a correct SHA3 sum string
    // Specify signature correctness
    let signatureOk = false
    if (verificationHash === "") {
        // The verificationHash MUST NOT be empty. This also implies that a genesis revision cannot
        // contain a signature.

        logs.push({
            log: `The verificationHash MUST NOT be empty`,
            logType: LogType.ERROR,
        })

        return [signatureOk, logs]
    }

    console.log("did:key == " + data.signature_type);
    let signerDID = new DIDSigner();
    // Signature verification
    switch (data.signature_type) {
        case "did:key":
            signatureOk = await signerDID.verify(data.signature, data.signature_public_key!!, verificationHash)
            break
        case "ethereum:eip-191":
            throw new Error("Need to be verified")
            // The padded message is required
            const paddedMessage = `I sign this revision: [${verificationHash}]`
            try {

                const recoveredAddress = ethers.recoverAddress(
                    ethers.hashMessage(paddedMessage),
                    data.signature,
                )
                signatureOk =
                    recoveredAddress.toLowerCase() ===
                    data.signature_wallet_address!!.toLowerCase()
            } catch (e) {
                // continue regardless of error
            }
            break
    }

    return [signatureOk, logs]
}