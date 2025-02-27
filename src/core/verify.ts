import { Revision, AquaOperationData, LogData, AquaTree, FileObject, LogType, VerificationGraphData } from "../types";
import { dict2Leaves, getHashSum, getMerkleRoot } from "../utils";
import { verifySignature } from "./signature";
import { verifyWitness } from "./witness";
import { Err, isErr, isOk, Ok, Result } from "../type_guards";

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




export async function verifyAquaTreeUtil(aquaTree: AquaTree, fileObject: Array<FileObject>, identCharacter: string = ""): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    let verificationHashes = Object.keys(aquaTree.revisions)
    let isSuccess = true
    for (let revisionItemHash of verificationHashes) {


        let revision: Revision = aquaTree.revisions[revisionItemHash]
        let revisionIndex = verificationHashes.indexOf(revisionItemHash)
        logs.push({
            logType: LogType.ARROW,
            log: ` ${revisionIndex + 1}.Verifying Revision: ${revisionItemHash}`,
            ident: identCharacter
        })


        switch (revision.revision_type) {
            case "form":
                logs.push({
                    logType: LogType.FORM,
                    log: "Type:Form.",
                    ident: `${identCharacter}\t`
                })
                break;
            case "file":
                logs.push({
                    logType: LogType.FILE,
                    log: "Type: File.",
                    ident: `${identCharacter}\t`
                })
                break;
            case "signature":
                if (revision.signature_type)
                    logs.push({
                        logType: LogType.SIGNATURE,
                        log: "Type:Signature.",
                        ident: `${identCharacter}\t`
                    });
                break;
            case "witness":
                logs.push({
                    logType: LogType.WITNESS,
                    log: "Type:Witness.",
                    ident: `${identCharacter}\t`
                });
                break;
            case "link":
                logs.push({
                    logType: LogType.LINK,
                    log: "Type:Link.",
                    ident: `${identCharacter}\t`
                });
                break;
            default:
                logs.push({
                    logType: LogType.WARNING,
                    log: `Type:Unknown ${revision.revision_type}.\n`,
                    ident: `${identCharacter}\t`
                });
        }
        // We use fast scalar verification if input does not have leaves property
        const isScalar = !revision.hasOwnProperty('leaves');

        let result = await verifyRevision(aquaTree, revision, revisionItemHash, fileObject, isScalar, identCharacter);


        if (result[1].length > 0) {
            logs.push(...result[1]);
        }
        if (!result[0]) {
            isSuccess = false;
        }

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


function findNode(tree: VerificationGraphData, hash: string): VerificationGraphData | null {
    if (tree.hash === hash) {
        return tree;
    }
    for (let i = 0; i < tree.verificationGraphData.length; i++) {
        const child = tree.verificationGraphData[i];
        const result = findNode(child, hash);
        if (result) {
            return result;
        }
    }
    return null;
}


export async function verifyAndGetGraphDataUtil(aquaTree: AquaTree, fileObject: Array<FileObject>, identCharacter: string = ""): Promise<Result<VerificationGraphData, LogData[]>> {
    let verificationHashes = Object.keys(aquaTree.revisions)
    const logs: LogData[] = [];

    if (verificationHashes.length === 0) {

        logs.push({
            logType: LogType.ERROR,
            log: "Revisions should be greater than 0"
        })
        return Err(logs)
    }
    let genesisRevisionData = aquaTree.revisions[verificationHashes[0]]
    const isScalar = !genesisRevisionData.hasOwnProperty('leaves');

    let [isGenesisOkay, _genesisVerificationLogs] = await verifyRevision(aquaTree, genesisRevisionData, verificationHashes[0], fileObject, isScalar, identCharacter);

    const verificationResults: VerificationGraphData = {
        hash: verificationHashes[0],
        isValidationSucessful: isGenesisOkay,
        revisionType: aquaTree.revisions[verificationHashes[0]].revision_type,
        verificationGraphData: [],
        linkVerificationGraphData: []
    }

    if (verificationHashes.length === 1) {
        return Ok(verificationResults)
    }

    let isSuccess = true
    for (let revisionItemHash of verificationHashes.slice(1)) {


        let revision: Revision = aquaTree.revisions[revisionItemHash]
        let revisionIndex = verificationHashes.indexOf(revisionItemHash)
        logs.push({
            logType: LogType.ARROW,
            log: ` ${revisionIndex + 1}.Verifying Revision: ${revisionItemHash}`,
            ident: identCharacter
        })

        switch (revision.revision_type) {
            case "form":
                logs.push({
                    logType: LogType.FORM,
                    log: "Type:Form.",
                    ident: `${identCharacter}\t`
                })
                break;
            case "file":
                logs.push({
                    logType: LogType.FILE,
                    log: "Type: File.",
                    ident: `${identCharacter}\t`
                })
                break;
            case "signature":
                if (revision.signature_type)
                    logs.push({
                        logType: LogType.SIGNATURE,
                        log: "Type:Signature.",
                        ident: `${identCharacter}\t`
                    });
                break;
            case "witness":
                logs.push({
                    logType: LogType.WITNESS,
                    log: "Type:Witness.",
                    ident: `${identCharacter}\t`
                });
                break;
            case "link":
                logs.push({
                    logType: LogType.LINK,
                    log: "Type:Link.",
                    ident: `${identCharacter}\t`
                });
                break;
            default:
                logs.push({
                    logType: LogType.WARNING,
                    log: `Type:Unknown ${revision.revision_type}.\n`,
                    ident: `${identCharacter}\t`
                });
        }
        // We use fast scalar verification if input does not have leaves property
        const isScalar = !revision.hasOwnProperty('leaves');
        let result = await verifyRevision(aquaTree, revision, revisionItemHash, fileObject, isScalar, identCharacter);

        let verificationResultsNode = findNode(verificationResults, revision.previous_verification_hash)
        if (verificationResultsNode === null) {
            logs.push({
                logType: LogType.ERROR,
                log: `A detached chain detected. Cannot find previous verification hash: ${revision.previous_verification_hash}`
            })
            isSuccess = false
            break;
        }

        let linkedVerificationGraphData: VerificationGraphData[] = []

        if (revision.revision_type === "link") {
            let aqtreeFilename = aquaTree.file_index[revision.link_verification_hashes[0]]
            let linkedAquaTree = fileObject.find(el => el.fileName === `${aqtreeFilename}.aqua.json`)
            if (!linkedAquaTree) {
                logs.push({
                    logType: LogType.ERROR,
                    log: "Linked aqua tree not found"
                })
                break;
            }

            let result = await verifyAndGetGraphDataUtil(linkedAquaTree.fileContent as AquaTree, fileObject, `${identCharacter}\t`)

            if (result.isOk()) {
                linkedVerificationGraphData = [result.data]
            } else {
                isSuccess = false
                logs.push({
                    logType: LogType.ERROR,
                    log: "Linked aqua tree failed to create graph data"
                })
                break;
            }

        }

        verificationResultsNode.verificationGraphData.push({
            hash: revisionItemHash,
            isValidationSucessful: result[0],
            revisionType: revision.revision_type,
            verificationGraphData: [],
            linkVerificationGraphData: linkedVerificationGraphData
        })

        if (result[1].length > 0) {
            logs.push(...result[1]);
        }
        if (!result[0]) {
            isSuccess = false;
        }

    }


    if (!isSuccess) {
        return Err(logs);
    }

    return Ok(verificationResults);
}

async function verifyRevision(aquaTree: AquaTree, revision: Revision, verificationHash: string, fileObjects: Array<FileObject>, isScalar: boolean, identCharacter: string = ""): Promise<[boolean, Array<LogData>]> {
    let logs: Array<LogData> = [];
    let doVerifyMerkleProof = false; // todo to be improved rather than hard coded
    let isSuccess = true;
    let isScalarSuccess = true;

    let verifyWitnessMerkleProof = false

    if (revision.revision_type === 'witness' && revision.witness_merkle_proof.length > 1) {
        verifyWitnessMerkleProof = true
    }

    // todo this can be improved.
    // remove  verifyWitnessMerkleProof which is hard coded.
    // verify scalar should be minimal
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
                log: `Scalar revision verification failed.\n\tcalculated  hash ${actualVH} \n\t expected hash ${verificationHash} `,
                ident: `${identCharacter}\t`
            });
        } else {
            // logs.push({
            //     logType: LogType.SUCCESS,
            //     log: "Scalar revision hash verified succeessully."
            // })
        }


    } else {
        if (doVerifyMerkleProof) {
            logs.push({
                logType: LogType.INFO,
                log: "Verifying revision merkle tree .",
                ident: `${identCharacter}\t`
            })
            let [ok, result] = verifyRevisionMerkleTreeStructure(revision, verificationHash)
            if (!ok) {
                return [ok, result]
            }
        }
    }


    let linkIdentChar = `${identCharacter}\t`;
    let logsResult: Array<LogData> = []
    switch (revision.revision_type) {
        case "form":

            let res = verifyFormRevision(
                revision,
                revision.leaves,
                identCharacter
            );
            isSuccess = res[0];
            logsResult = res[1];
            // verification is already done in verifyRevisionMerkleTreeStructure
            // isSuccess = true;
            break
        case "file":

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
                        logType: LogType.ERROR,
                        ident: `${identCharacter}\t`
                    })
                    return [false, logs]
                }
                fileContent = Buffer.from(fileObjectItem.fileContent as string)
            }
            const fileHash = getHashSum(fileContent)
            isSuccess = fileHash === revision.file_hash
            break
        case "signature":

            // Verify signature
            [isSuccess, logsResult] = await verifySignature(
                revision,
                revision.previous_verification_hash,
                `${identCharacter}\t`
            );


            break
        case "witness":

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

            let linkOk: boolean = true
            for (const [_idx, vh] of revision.link_verification_hashes.entries()) {
                const fileUri = aquaTree.file_index[vh];
                const aquaFileUri = `${fileUri}.aqua.json`

                let fileObj = fileObjects.find(fileObj => fileObj.fileName === aquaFileUri)

                if (!fileObj) {
                    linkOk = false;
                    logs.push({
                        log: `File ${fileUri} not found in file objects`,
                        logType: LogType.ERROR,
                        ident: `${identCharacter}\t`
                    })
                } else {

                    logs.push({
                        log: `Verifying linked File ${aquaFileUri}.`,
                        logType: LogType.INFO,
                        ident: `${identCharacter}\t`
                    })

                    try {
                        const linkAquaTree = fileObj.fileContent as AquaTree;//JSON.parse(fileObj.fileContent)  as AquaTree;



                        let linkVerificationResult = await verifyAquaTreeUtil(linkAquaTree, fileObjects, `${linkIdentChar}\t`)

                        if (isErr(linkVerificationResult)) {
                            linkOk = false

                            logs.push(...linkVerificationResult.data)
                            logs.push({
                                log: `verification of ${fileUri}.aqua.json failed `,
                                logType: LogType.ERROR,
                                ident: linkIdentChar,//`${identCharacter}\t`
                            })
                        } else {
                            logs.push(...linkVerificationResult.data.logData)

                            logs.push({
                                log: `successfully verified ${fileUri}.aqua.json `,
                                logType: LogType.SUCCESS,
                                ident: linkIdentChar //`${identCharacter}\t`
                            })
                        }
                    } catch (error) {
                        linkOk = false;
                        logs.push({
                            log: `Error verifying linked file ${aquaFileUri}: ${error}`,
                            logType: LogType.ERROR,
                            ident: `${identCharacter}\t`
                        })

                    }
                }
            }

            isSuccess = linkOk
            break
    }



    logs.push(...logsResult)

    if (isSuccess && isScalarSuccess) {


        if (isScalar) {
            logs.push({
                log: `⏺️  Scalar revision verified`,
                logType: LogType.SUCCESS,
                ident: identCharacter.length == 0 ? '\t' : `${linkIdentChar}`
            })
        } else {
            logs.push({
                log: `🌿 Tree  revision verified`,
                logType: LogType.SUCCESS,
                ident: identCharacter.length == 0 ? '\t' : `${linkIdentChar}`
            })

        }


    } else {
        logs.push({
            log: `Error verifying revision type:${revision.revision_type} with hash ${verificationHash}`,
            logType: LogType.ERROR,
            ident: `${identCharacter}\t`
        })
    }

    logs.push({
        log: `\n`,
        logType: LogType.EMPTY
    })

    return [isSuccess && isScalarSuccess, logs]
}


function verifyFormRevision(input: any, leaves: any, identCharacter: string = ""): [boolean, Array<LogData>] {
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
            logType: LogType.WARNING,
            ident: identCharacter
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
        logType: LogType.SUCCESS,
        ident: identCharacter
    });
    fieldsWithVerification.forEach((field: any) => {
        logs.push({
            log: `${field}\n`,
            logType: LogType.SUCCESS,
            ident: identCharacter
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
