import { Revision, AquaOperationData, LogData, AquaObject, FileObject, LogType } from "../types";
import { getHashSum } from "../utils";
import MerkleTree from "merkletreejs";
import { verifySignature } from "./signature";
import { verifyWitness } from "./witness";
import { Err, isErr, Ok, Result } from "../type_guards";


export async function verifyAquaObjectUtil(aquaObject: AquaObject, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    let verificationHashes = Object.keys(aquaObject.revisions)
    console.log("Page Verification Hashes: ", verificationHashes)
    let isSuccess = true
    for (let revisionItemHash in verificationHashes) {
        let revision: Revision = aquaObject.revisions[revisionItemHash]
        // We use fast scalar verification if input does not have leaves property
        const isScalar = !revision.hasOwnProperty('leaves');

        let result = await verifyRevision(aquaObject, revision, revisionItemHash, fileObject, isScalar);

        result[1].forEach((e) => logs.push(e));

        if (!result) {
            isSuccess = false;
            break;
        }
    }

    if (!isSuccess) {
        return Err(logs);
    }
    let data: AquaOperationData = {
        aquaObject: aquaObject,
        aquaObjects: null,
        logData: logs
    }

    return Ok(data);
}

async function verifyRevision(aquaObject: AquaObject, revision: Revision, verificationHash: string, fileObjects: Array<FileObject>, isScalar: boolean): Promise<[boolean, Array<LogData>]> {
    let logs: Array<LogData> = [];
    let doVerifyMerkleProof = false; // to be improved rather than hard coded
    let isSuccess = true;

    if (isScalar) {

        if (revision.witness_merkle_proof && revision.witness_merkle_proof.length > 1) {
            // console.log("@@@ Verifying merkle proof...");
            let [ok, logs] = verifyRevisionMerkleTreeStructure(revision, verificationHash)
            if (!ok) {
                return [ok, logs]
            }
        } else {
            const actualVH = "0x" + getHashSum(JSON.stringify(revision))
            isSuccess = actualVH === verificationHash

            if (!isSuccess) {
                return [isSuccess, logs]
            }
        }
        // console.log("\n Okay is ok " + isSuccess)
    } else {
        // console.log("###Verifying merkle proof...");
        let [ok, result] = verifyRevisionMerkleTreeStructure(revision, verificationHash)
        if (!ok) {
            return [ok, result]
        }
    }



    // let typeOk: boolean;
    let logsResult: Array<LogData> = []
    switch (revision.revision_type) {
        case "form":
            isSuccess = true;
            break
        case "file":
            let fileContent: Buffer
            if (!!revision.content) {
                fileContent = Buffer.from(revision.content, "utf8")
            } else {
                console.log("File index", JSON.stringify(aquaObject.file_index));
                console.log("Has needed  ", verificationHash);
                let fileName = aquaObject.file_index[verificationHash]
                let fileObjectItem = fileObjects.find((e) => e.fileName == fileName);
                if (fileObjectItem == undefined) {
                    logs.push({
                        log: `file not found in file objects`,
                        logType: LogType.ERROR
                    })
                    return [false, logs]
                }
                fileContent = Buffer.from(fileObjectItem.fileContent)
            }
            const fileHash = getHashSum(fileContent)
            isSuccess = fileHash === revision.file_hash
            break
        case "signature":
            // Verify signature
            [isSuccess, logsResult] = await verifySignature(
                revision,
                revision.previous_verification_hash,
            )


            break
        case "witness":
            // Verify witness
            [isSuccess, logsResult] = await verifyWitness(
                revision,
                revision.previous_verification_hash,
                doVerifyMerkleProof,
            )
            // result.witness_result = witnessResult

            // Specify witness correctness
            // typeOk = (witnessStatus === "VALID")
            break
        case "link":
            let linkOk: boolean = true
            for (const [_idx, vh] of revision.link_verification_hashes.entries()) {
                // const fileUri = getUnixPathFromAquaPath(aquaObject.file_index[fileHash])
                const fileUri = aquaObject.file_index[vh];
                const aquaFileUri = `${fileUri}.aqua.json`

                let fileObj = fileObjects.find(fileObj => fileObj.fileName === aquaFileUri)
                // const linkAquaObject = await readExportFile(aquaFileUri)
                if(!fileObj){
                    return [false, logs]
                }
                const linkAquaObject = JSON.parse(fileObj?.fileContent)

                // let _linkStatus: string

                let linkVerificationResult = await verifyAquaObjectUtil(linkAquaObject, fileObjects)

                if(isErr(linkVerificationResult)){
                    logs.concat(linkVerificationResult.data)
                    return [false, logs]
                }
                logs.concat(linkVerificationResult.data.logData)
                // const expectedVH = revision.link_verification_hashes[idx]
                // const linkVerificationHashes = Object.keys(linkAquaObject.revisions)
                // const actualVH = linkVerificationHashes[linkVerificationHashes.length - 1]

                // linkOk = linkOk && (linkStatus === VERIFIED_VERIFICATION_STATUS) && (expectedVH == actualVH)
                // isSuccess = true
          
            }
            isSuccess = linkOk
            break
    }

    logs.concat(logsResult)

    return [isSuccess, logs]
}



function verifyRevisionMerkleTreeStructure(input: Revision, verificationHash: string): [boolean, Array<LogData>] {
    console.log("verification hash: ", verificationHash)

    let logs: Array<LogData> = [];


    let ok: boolean = true
    let vhOk: boolean = true

    // Ensure mandatory claims are present
    const mandatory = {
        file: ["file_hash", "file_nonce"],
        link: ["link_verification_hashes"],
        signature: ["signature"],
        witness: ["witness_merkle_root"],
        form: [],
    }[input.revision_type]

    const mandatoryClaims = ["previous_verification_hash", "local_timestamp", ...mandatory]

    for (const claim of mandatoryClaims) {
        if (!(claim in input)) {
            logs.push({
                log: `mandatory field ${claim} is not present`,
                logType: LogType.ERROR
            })
            return [false, logs]
        }
    }


    const leaves = input.leaves
    delete input.leaves
    const actualLeaves = []
    let fieldsWithPartialVerification: string[] = []
    let fieldsWithVerification: string[] = []

    if (input.revision_type === 'form') {
        let contains_deleted_fields = false

        Object.keys(input).sort().forEach((field, i: number) => {
            let new_hash = getHashSum(`${field}:${input[field]}`)

            if (!field.endsWith('.deleted')) {
                if (field.startsWith('forms_')) {
                    fieldsWithVerification.push(`${field}: ${input[field]}`)
                }
                if (new_hash !== leaves[i]) {
                    ok = false
                    // console.log(`🚫 New hash does not match existing hash ${leaves[i]}:${new_hash} at index: ${i}`)
                    logs.push({
                        log: `🚫 New hash does not match existing hash ${leaves[i]}:${new_hash} at index: ${i}`,
                        logType: LogType.ERROR
                    })
                }
            } else {
                contains_deleted_fields = true
                fieldsWithPartialVerification.push(field)
            }
        })

        if (contains_deleted_fields) {
            // console.warn(`\n  🚨 Warning: The following fields cannot be verified:`)
            logs.push({
                log: ` 🚨 Warning: The following fields cannot be verified: `,
                logType: LogType.WARNING
            })
            fieldsWithPartialVerification.forEach((field, i: number) => console.log(`   ${i + 1}. ${field.replace('.deleted', '')}\n`))
        }

        // console.log("\n  The following fields were verified successfully: ")
        logs.push({
            log: ` The following fields were verified successfully: `,
            logType: LogType.SUCCESS
        })
        fieldsWithVerification.forEach(field => {
            // console.log(`   ✅${field}\n`)
            logs.push({
                log: `    ✅${field}: `,
                logType: LogType.SUCCESS
            })
        })

    }
    // For witness, we verify the merkle root
    else if (input.revision_type === "witness" && input.witness_merkle_proof && input.witness_merkle_proof.length > 1) {
        let witnessMerkleProofLeaves = input.witness_merkle_proof
        const tree = new MerkleTree(witnessMerkleProofLeaves, getHashSum, {
            duplicateOdd: false,
        })
        const hexRoot = tree.getHexRoot()
        vhOk = hexRoot === input.witness_merkle_root
    }

    else {

        // Verify leaves
        for (const [i, claim] of Object.keys(input).sort().entries()) {
            const actual = getHashSum(`${claim}:${input[claim]}`)
            const claimOk = leaves[i] === actual
            // result.status[claim] = claimOk
            ok = ok && claimOk
            actualLeaves.push(actual)
        }

        // Verify verification hash
        const tree = new MerkleTree(leaves, getHashSum, {
            duplicateOdd: false,
        })

        const hexRoot = tree.getHexRoot()
        vhOk = hexRoot === verificationHash
    }


    ok = ok && vhOk
    return [ok, logs]
}