
import { Revision, AquaOperationData, LogData, AquaTree, AquaTreeWrapper, LogType } from "../types";
import { dict2Leaves, getHashSum, getLatestVH, getMerkleRoot, getTimestamp } from "../utils";

import { createAquaTree } from "../aquavhtree";
import { Err, isOk, Ok, Result } from "../type_guards";



export async function linkAquaTreeUtil(aquaTreeWrapper: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    const timestamp = getTimestamp()
    let previous_verification_hash = aquaTreeWrapper.revision

    if (!aquaTreeWrapper.revision || aquaTreeWrapper.revision === "") {
        previous_verification_hash = getLatestVH(aquaTreeWrapper.aquaTree)
    }

    let newRevision: Revision = {
        previous_verification_hash: previous_verification_hash,
        local_timestamp: timestamp,
        revision_type: "link",
    }

    const linkVHs = [getLatestVH(linkAquaTreeWrapper.aquaTree)]

    const linkFileHashes = [getHashSum(linkAquaTreeWrapper.fileObject.fileContent)]
    // Validation again
    linkFileHashes.forEach((fh) => {
        if (!(fh in linkAquaTreeWrapper.aquaTree.file_index)) {
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

    let verificationHash = "";
    if (enableScalar) {

        logs.push({
            log: `Scalar enabled`,
            logType: LogType.SCALAR
        });
        let stringifiedData = JSON.stringify(newRevision)

        verificationHash = "0x" + getHashSum(stringifiedData);
    } else {
        newRevision.leaves = leaves
        verificationHash = getMerkleRoot(leaves);
    }

    let updatedAquaTree: AquaTree = {
        revisions: {
            ...aquaTreeWrapper.aquaTree.revisions,
            [verificationHash]: newRevision
        },
        file_index: {
            ...aquaTreeWrapper.aquaTree.file_index,
            [linkVHs[0]]: linkAquaTreeWrapper.fileObject.fileName
        }
    }

    // Tree creation
    let aquaTreeWithTree = createAquaTree(updatedAquaTree)
    logs.push({
        log: "Linking successful",
        logType: LogType.LINK
    })

    let resutData: AquaOperationData = {
        aquaTree: aquaTreeWithTree,
        logData: logs,
        aquaTrees: []
    };

    return Ok(resutData)
}

export async function linkAquaTreesToMultipleAquaTreesUtil(aquaTreeWrappers: AquaTreeWrapper, linkAquaTreeWrapper: AquaTreeWrapper[], enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {


    let logs: Array<LogData> = [];
    // 
    let aquaTree = aquaTreeWrappers;
    for (const linkAquaTree of linkAquaTreeWrapper) {
        const result = await linkAquaTreeUtil(aquaTree, linkAquaTree, enableScalar); // Assuming enableScalar is false by default

        if (isOk(result)) {
            const resData = result.data
            aquaTree = {
                aquaTree: resData.aquaTree,
                fileObject: aquaTreeWrappers.fileObject,
                revision: ""
            }
            logs.push(...resData.logData)
        } else {
            logs.push(...result.data);
        }
    }


    let resutData: AquaOperationData = {
        aquaTree: aquaTree.aquaTree,
        logData: logs,
        aquaTrees: []
    };

    return Ok(resutData);


}

export async function linkMultipleAquaTreesUtil(aquaTreeWrappers: AquaTreeWrapper[], linkAquaTreeWrapper: AquaTreeWrapper, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {


    let logs: Array<LogData> = [];
    let aquaTrees: AquaTree[] = []

    for (const aquaTree of aquaTreeWrappers) {
        const result = await linkAquaTreeUtil(aquaTree, linkAquaTreeWrapper, enableScalar); // Assuming enableScalar is false by default

        if (isOk(result)) {
            const resData = result.data
            aquaTrees.push(resData.aquaTree)
            logs.push(...resData.logData)
        } else {
            logs.push(...result.data);
        }
    }


    let resutData: AquaOperationData = {
        aquaTree: null,
        logData: logs,
        aquaTrees: aquaTrees
    };

    return Ok(resutData);
}