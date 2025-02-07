import { Err, Ok } from "rustic";
import { dict2Leaves, getHashSum, getLatestVH, getTimestamp } from "../utils";
import MerkleTree from "merkletreejs";
import { createAquaTree } from "../aquavhtree";
export async function verifyLinkUtil(revision) {
    let logs = [];
    let linkOk = true;
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
    return Err(logs);
}
export async function linkAquaObjectUtil(aquaObject, linkAquaObjectWrapper, enableScalar) {
    let logs = [];
    const timestamp = getTimestamp();
    const previous_verification_hash = getLatestVH(aquaObject);
    let newRevision = {
        previous_verification_hash: previous_verification_hash, //previousVerificationHash,
        local_timestamp: timestamp,
        revision_type: "link",
    };
    const linkVHs = [getLatestVH(linkAquaObjectWrapper.aquaObject)];
    const linkFileHashes = [getHashSum(linkAquaObjectWrapper.fileObject.fileContent)];
    // Validation again
    linkFileHashes.map((fh) => {
        if (!(fh in linkAquaObjectWrapper.aquaObject.file_index)) {
            // Add log here
            return Err(logs);
        }
        console.error(`${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`);
        process.exit(1);
    });
    const linkData = {
        link_type: "aqua",
        //link_require_indepth_verification: true,
        link_verification_hashes: linkVHs,
        link_file_hashes: linkFileHashes,
    };
    newRevision = {
        ...newRevision,
        ...linkData
    };
    const leaves = dict2Leaves(newRevision);
    if (!enableScalar) {
        newRevision.leaves = leaves;
    }
    const tree = new MerkleTree(leaves, getHashSum, {
        duplicateOdd: false,
    });
    const currentVerificationHash = tree.getHexRoot();
    let updatedAquaObject = {
        revisions: {
            ...aquaObject.revisions,
            [currentVerificationHash]: newRevision
        },
        file_index: {
            ...aquaObject.file_index,
            [currentVerificationHash]: currentVerificationHash
        }
    };
    // Tree creation
    let aquaObjectWithTree = createAquaTree(updatedAquaObject);
    let resutData = {
        aquaObject: aquaObjectWithTree,
        logData: logs,
        aquaObjects: []
    };
    return Ok(resutData);
}
export async function linkMultipleAquaObjectsUtil(aquaObjects) {
    let logs = [];
    return Err(logs);
}
