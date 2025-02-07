import { Result, Err, Ok, isOk } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper } from "../types";
import { dict2Leaves,  getHashSum, getLatestVH, getTimestamp } from "../utils";
import MerkleTree from "merkletreejs";
import { createAquaTree } from "../aquavhtree";



export async function verifyLinkUtil(_revision: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    // let _linkOk: boolean = true
    // for (const [idx, vh] of revision.link_verification_hashes.entries()) {
    //     // const fileUri = getUnixPathFromAquaPath(aquaObject.file_index[fileHash])
    //     const fileUri = revision.file_index[vh];
    //     const aquaFileUri = `${fileUri}.aqua.json`
    //     const linkAquaObject = await readExportFile(aquaFileUri)
    //     let linkStatus: string
    //     [linkStatus, _] = await verifyPage(linkAquaObject, false, doVerifyMerkleProof)
    //     const expectedVH = input.link_verification_hashes[idx]
    //     const linkVerificationHashes = Object.keys(linkAquaObject.revisions)
    //     const actualVH = linkVerificationHashes[linkVerificationHashes.length - 1]
    //     linkOk = linkOk && (linkStatus === VERIFIED_VERIFICATION_STATUS) && (expectedVH == actualVH)
    // }
    // typeOk = linkOk
    // break

    return Err(logs)
}


export async function linkAquaObjectUtil(aquaObjectWrapper: AquaObjectWrapper, linkAquaObjectWrapper: AquaObjectWrapper, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    const timestamp = getTimestamp()
    let previous_verification_hash = aquaObjectWrapper.revision

    if(!aquaObjectWrapper.revision || aquaObjectWrapper.revision === ""){
        previous_verification_hash = getLatestVH(aquaObjectWrapper.aquaObject)
    }

    let newRevision: Revision = {
        previous_verification_hash: previous_verification_hash, //previousVerificationHash,
        local_timestamp: timestamp,
        revision_type: "link",
    }

    const linkVHs = [getLatestVH(linkAquaObjectWrapper.aquaObject)]

    const linkFileHashes = [getHashSum(linkAquaObjectWrapper.fileObject.fileContent)]
    // Validation again
    linkFileHashes.map((fh) => {
        if (!(fh in linkAquaObjectWrapper.aquaObject.file_index)) {
            // Add log here
            return Err(logs)
        }
        console.error(
            `${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`,
        )
        process.exit(1)
    })

    const linkData = {
        link_type: "aqua",
        //link_require_indepth_verification: true,
        link_verification_hashes: linkVHs,
        link_file_hashes: linkFileHashes,
    }

    newRevision = {
        ...newRevision,
        ...linkData
    }

    const leaves = dict2Leaves(newRevision)
    if (!enableScalar) {
        newRevision.leaves = leaves;
    }
    const tree = new MerkleTree(leaves, getHashSum, {
        duplicateOdd: false,
    })

    const currentVerificationHash = tree.getHexRoot()

    let updatedAquaObject: AquaObject = {
        revisions: {
            ...aquaObjectWrapper.aquaObject.revisions,
            [currentVerificationHash]: newRevision
        },
        file_index: {
            ...aquaObjectWrapper.aquaObject.file_index,
            [currentVerificationHash]: currentVerificationHash
        }
    }

    // Tree creation
    let aquaObjectWithTree = createAquaTree(updatedAquaObject)

    let resutData: AquaOperationData = {
        aquaObject: aquaObjectWithTree,
        logData: logs,
        aquaObjects: []
    };

    return Ok(resutData)
}

export async function linkMultipleAquaObjectsUtil(aquaObjectWrappers: AquaObjectWrapper[], linkAquaObjectWrapper: AquaObjectWrapper, enableScalar: boolean): Promise<Result<AquaOperationData[], LogData[]>> {
    // let logs: Array<LogData> = [];

    let logs: Array<LogData> = [];
    let aquaOperationResults: AquaOperationData[] = [];

    for (const aquaObject of aquaObjectWrappers) {
        const result = await linkAquaObjectUtil(aquaObject, linkAquaObjectWrapper, enableScalar); // Assuming enableScalar is false by default

        if (isOk(result)) {
            aquaOperationResults.push(result.data);
        } else {
            logs.push(...result.data);
        }
    }

    if (logs.length > 0) {
        return Err(logs);
    }

    return Ok(aquaOperationResults);
}