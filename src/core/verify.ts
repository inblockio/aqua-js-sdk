import { Revision, AquaOperationData, LogData, AquaTree, FileObject, LogType } from "../types";
import { dict2Leaves, getHashSum, getMerkleRoot } from "../utils";
import { verifySignature } from "./signature";
import { verifyWitness } from "./witness";
import { Err, isErr, Ok, Result } from "../type_guards";

export async function verifyAquaTreeRevisionUtil(aquaTree: AquaTree, revision: Revision, revisionItemHash: string, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = []

    const isScalar = !revision.hasOwnProperty('leaves');
    let result = await verifyRevision(aquaTree, revision, revisionItemHash, fileObject, isScalar);

    result[1].forEach((e) => logs.push(e));
    if (!result[0]) {
        Err(logs)
    }

    // logs.push({
    //     log: `AquaTree verified succesfully`,
    //     logType: LogType.SUCCESS
    // });
    let data: AquaOperationData = {
        aquaTree: aquaTree,
        aquaTrees: [],
        logData: logs
    }

    return Ok(data);
}




export async function verifyAquaTreeUtil(aquaTree: AquaTree, fileObject: Array<FileObject>): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    let verificationHashes = Object.keys(aquaTree.revisions)
    let isSuccess = true
    for (let revisionItemHash of verificationHashes) {
        logs.push({
            logType: LogType.EMPTY,
            log: "\n"
        })

        let revision: Revision = aquaTree.revisions[revisionItemHash]
        let revisionIndex = verificationHashes.indexOf(revisionItemHash)
        logs.push({
            logType: LogType.DEBUGDATA,
            log: `${revisionIndex + 1}. Verifying Revision Hash: ${revisionItemHash}`
        })
        logs.push({
            logType: LogType.DEBUGDATA,
            log: "Revision data: \n " + JSON.stringify(revision, null, 4)
        })
        // We use fast scalar verification if input does not have leaves property
        const isScalar = !revision.hasOwnProperty('leaves');

        let result = await verifyRevision(aquaTree, revision, revisionItemHash, fileObject, isScalar);


        if (result[1].length > 0) {
            logs.push(...result[1]);
        }
        if (!result[0]) {
            isSuccess = false;
        }
        // logs.push({
        //     logType: LogType.EMPTY,
        //     log: "\n"
        // })
    }


    if (!isSuccess) {
        return Err(logs);
    }

    let data: AquaOperationData = {
        aquaTree: aquaTree,
        aquaTrees: [],
        logData: logs
    }

    return Ok(data);
}

async function verifyRevision(aquaTree: AquaTree, revision: Revision, verificationHash: string, fileObjects: Array<FileObject>, isScalar: boolean): Promise<[boolean, Array<LogData>]> {
    let logs: Array<LogData> = [];
    let doVerifyMerkleProof = false; // todo to be improved rather than hard coded
    let isSuccess = true;
    let isScalarSuccess = true;

    let verifyWitnessMerkleProof = false

    if (revision.revision_type === 'witness' && revision.witness_merkle_proof.length > 1) {
        verifyWitnessMerkleProof = true
    }

    if (isScalar && !verifyWitnessMerkleProof) {
        // logs.push({
        //     logType: LogType.SCALAR,
        //     log: "Scalar revision detected."
        // })
        // todo fix verifyRevisionMerkleTreeStructure
        // if (revision.witness_merkle_proof && revision.witness_merkle_proof.length > 1) {

        //     let [ok, logs] = verifyRevisionMerkleTreeStructure(revision, verificationHash)
        //     if (!ok) {
        //         return [ok, logs]
        //     }
        // } else {
        // }

        // const leaves = dict2Leaves(revision)
        // const actualVH = getMerkleRoot(leaves);

        const actualVH = "0x" + getHashSum(JSON.stringify(revision))
        isScalarSuccess = actualVH === verificationHash

        // console.log("\n  revision data "+JSON.stringify(revision)+"\n actualVH  "+actualVH+" \n leaves " + JSON.stringify(leaves) + "\n")

        if (!isScalarSuccess) {
            logs.push({
                logType: LogType.ERROR,
                log: `Scalar revision verification failed.\n\tcalculated  hash ${actualVH} \n\t expected hash ${verificationHash} `
            });
        } else {
            logs.push({
                logType: LogType.SUCCESS,
                log: "Scalar revision hash verified succeessully."
            })
        }


    } else {
        if (doVerifyMerkleProof) {
            logs.push({
                logType: LogType.INFO,
                log: "Verifying revision merkle tree ."
            })
            let [ok, result] = verifyRevisionMerkleTreeStructure(revision, verificationHash)
            if (!ok) {
                return [ok, result]
            }
        }
    }


    let logsResult: Array<LogData> = []
    switch (revision.revision_type) {
        case "form":
            logs.push({
                logType: LogType.FORM,
                log: "Verifying form revision. \n"
            })
            let res = verifyFormRevision(
                revision,
                revision.leaves,
            );
            isSuccess = res[0];
            logsResult = res[1];
            // verification is already done in verifyRevisionMerkleTreeStructure
            // isSuccess = true;
            break
        case "file":
            logs.push({
                logType: LogType.FILE,
                log: "Verifying file revision.\n"
            })
            let fileContent: Buffer
            if (!!revision.content) {
                fileContent = Buffer.from(revision.content, "utf8")
            } else {
                // console.log("File index", JSON.stringify(aquaTree.file_index));
                // console.log("Has needed  ", verificationHash);
                let fileName = aquaTree.file_index[verificationHash]
                let fileObjectItem = fileObjects.find((e) => e.fileName == fileName);
                if (fileObjectItem == undefined) {
                    logs.push({
                        log: `file not found in file objects`,
                        logType: LogType.ERROR
                    })
                    return [false, logs]
                }
                fileContent = Buffer.from(fileObjectItem.fileContent as string)
            }
            const fileHash = getHashSum(fileContent)
            isSuccess = fileHash === revision.file_hash
            break
        case "signature":
            logs.push({
                logType: LogType.SIGNATURE,
                log: "Verifying signature revision.\n"
            });
            // Verify signature
            [isSuccess, logsResult] = await verifySignature(
                revision,
                revision.previous_verification_hash,
            );


            break
        case "witness":
            logs.push({
                logType: LogType.WITNESS,
                log: "Verifying witness revision.\n"
            });
            // Verify witness
            // If multiple use merkle root else use previous verification hash
            let hash_ = revision.previous_verification_hash
            if (revision.previous_verification_hash !== revision.witness_merkle_root) {
                hash_ = revision.witness_merkle_root
            }
            let [isSuccessResult, logsResultData] = await verifyWitness(
                revision,
                hash_,
                doVerifyMerkleProof,
            );
            // console.log(`Witness  result ${isSuccessResult} ---  data ${JSON.stringify(logsResultData)}`)
            logsResult = logsResultData;
            isSuccess = isSuccessResult

            break
        case "link":
            logs.push({
                logType: LogType.LINK,
                log: "Verifying link revision.\n"
            });
            let linkOk: boolean = true
            for (const [_idx, vh] of revision.link_verification_hashes.entries()) {
                const fileUri = aquaTree.file_index[vh];
                const aquaFileUri = `${fileUri}.aqua.json`

                let fileObj = fileObjects.find(fileObj => fileObj.fileName === aquaFileUri)

                if (!fileObj) {
                    linkOk = false;
                    logs.push({
                        log: `File ${fileUri} not found in file objects`,
                        logType: LogType.ERROR
                    })
                } else {

                    logs.push({
                        log: `Verifying linked File ${aquaFileUri}.`,
                        logType: LogType.INFO
                    })

                    try {
                        const linkAquaTree = fileObj.fileContent as AquaTree;//JSON.parse(fileObj.fileContent)  as AquaTree;

                        let linkVerificationResult = await verifyAquaTreeUtil(linkAquaTree, fileObjects)

                        if (isErr(linkVerificationResult)) {
                            linkOk = false
                            // logs.push(...linkVerificationResult.data)
                            logs.push({
                                log: `\t  verification of ${fileUri}.aqua.json failed `,
                                logType: LogType.ERROR
                            })
                        } else {
                            // logs.push(...linkVerificationResult.data.logData)
                            logs.push({
                                log: `\t successfully verified ${fileUri}.aqua.json `,
                                logType: LogType.SUCCESS
                            })
                        }
                    } catch (error) {
                        linkOk = false;
                        logs.push({
                            log: `Error verifying linked file ${aquaFileUri}: ${error}`,
                            logType: LogType.ERROR
                        })

                    }
                }
            }
            isSuccess = linkOk
            break
    }

    logs.push(...logsResult)

    if (isSuccess && isScalarSuccess) {

        logs.push({
            log: `Successfully verified revision ${revision.revision_type}  with hash ${verificationHash} \n`,
            logType: LogType.SUCCESS
        })
    } else {
        logs.push({
            log: `Error verifying revision ${revision.revision_type}  with hash ${verificationHash} \n\n`,
            logType: LogType.ERROR
        })
    }

    return [isSuccess && isScalarSuccess, logs]
}


function verifyFormRevision(input: any, leaves: any): [boolean, Array<LogData>] {
    let logs: Array<LogData> = [];
    let contains_deleted_fields = false;
    let fieldsWithVerification: any = [];
    let fieldsWithPartialVerification: any = [];
    let ok = true;

    Object.keys(input).sort().forEach((field, i: number) => {
        let new_hash = getHashSum(`${field}:${input[field]}`);

        if (!field.endsWith('.deleted')) {
            if (field.startsWith('forms_')) {
                if (new_hash !== leaves[i]) {
                    ok = false;
                    fieldsWithVerification.push(`🚫 ${field}: ${input[field]}`);
                } else {
                    fieldsWithVerification.push(`✅ ${field}: ${input[field]}`);
                }
            }
        } else {
            contains_deleted_fields = true;
            fieldsWithPartialVerification.push(field);
        }
    })

    if (contains_deleted_fields) {
        logs.push({
            log: `Warning: The following fields cannot be verified:`,
            logType: LogType.WARNING
        });
        fieldsWithPartialVerification.forEach((field: any, i: number) => {
            logs.push({
                log: `${i + 1}. ${field.replace('.deleted', '')}\n`,
                logType: LogType.WARNING
            });
        });
    }

    logs.push({
        log: `The following fields were verified:`,
        logType: LogType.SUCCESS
    });
    fieldsWithVerification.forEach((field: any) => {
        logs.push({
            log: `${field}\n`,
            logType: LogType.SUCCESS
        });
    });

    return [ok, logs]

}

function verifyRevisionMerkleTreeStructure(input: Revision, verificationHash: string): [boolean, Array<LogData>] {
    // console.log("verification hash: ", verificationHash)

    let logs: Array<LogData> = [];

    let ok: boolean = true
    let vhOk: boolean = true

    // Ensure mandatory claims are present
    const mandatory: any = {
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
    // const actualLeaves = []
    // let fieldsWithPartialVerification: string[] = []
    // let fieldsWithVerification: string[] = []

    if (input.revision_type === 'form') {

        let [isOk, logsAll] = verifyFormRevision(input, leaves);

        logs.push(...logsAll)

        vhOk = isOk

    }
    // For witness, we verify the merkle root
    else if (input.revision_type === "witness" && input.witness_merkle_proof && input.witness_merkle_proof.length > 1) {

        let witnessMerkleProofLeaves = input.witness_merkle_proof

        const hexRoot = getMerkleRoot(witnessMerkleProofLeaves);  // tree.getHexRoot()
        vhOk = hexRoot === input.witness_merkle_root;

        // console.log(`1. test vh ${vhOk} \n hexRoot  ${hexRoot} \n input.witness_merkle_root ${input.witness_merkle_root} `);
    } else {

        // console.log(`\n all data ${JSON.stringify(input, null, 4)}`)
        // Verify leaves
        for (const [i, claim] of Object.keys(input).sort().entries()) {
            const actual = getHashSum(`${claim}:${input[claim]}`)
            const claimOk = leaves[i] === actual
            // result.status[claim] = claimOk
            //todo this can be impoved 
            ok = ok && claimOk
            // actualLeaves.push(actual)
        }

        const leaves2 = dict2Leaves(input)

        const hexRoot = getMerkleRoot(leaves2);// tree.getHexRoot()
        vhOk = hexRoot === verificationHash;

        // console.log(`2. test vh ${vhOk} -- \n new data ${hexRoot} \n  hahaha ${verificationHash} `);


    }


    ok = ok && vhOk
    return [ok, logs]
}