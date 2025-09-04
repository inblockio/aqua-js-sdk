
import { Revision, AquaOperationData, LogData, AquaTree, AquaTreeView, LogType } from "../types";
import { dict2Leaves, getHashSum, getLatestVH, getMerkleRoot, getTimestamp, reorderAquaTreeRevisionsProperties, reorderRevisionsProperties } from "../utils";

import { createAquaTree } from "../aquatreevisualization";
import { Err, isOk, Ok, Result } from "../type_guards";



/**
 * Links one Aqua Tree to another by creating a link revision
 * 
 * @param aquaTreeView - Source Aqua Tree view to create link from
 * @param linkAquaTreeView - Target Aqua Tree view to link to
 * @param enableScalar - Flag to use scalar mode instead of tree mode
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 * 
 * This function:
 * - Creates a link revision with metadata
 * - Validates link targets
 * - Creates verification data with Merkle tree or scalar hash
 * - Updates the source Aqua Tree with new link revision
 * - Updates file index with linked tree information
 */
export async function linkAquaTreeUtil(aquaTreeView: AquaTreeView, linkAquaTreeView: AquaTreeView, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    const timestamp = getTimestamp()
    let previous_verification_hash = aquaTreeView.revision

    if (!aquaTreeView.revision || aquaTreeView.revision === "") {
        previous_verification_hash = getLatestVH(aquaTreeView.aquaTree)
    }

    let newRevision: Revision = {
        previous_verification_hash: previous_verification_hash,
        local_timestamp: timestamp,
        revision_type: "link",
        version: `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? 'scalar' : 'tree'}`
    }


    const linkVHs = [getLatestVH(linkAquaTreeView.aquaTree)]

    const linkFileHashes = [getHashSum(linkAquaTreeView.fileObject.fileContent as string)]
    // Validation again
    for (const fh of linkFileHashes) {
        if (!(fh in linkAquaTreeView.aquaTree.file_index)) {
            // Add log here
            logs.push({
                logType: LogType.ERROR,
                log: `${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`
            })
            return Err(logs)
        }
        // console.error(
        //     `${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`,
        // )
        // // TODO: Fix this, return an error here instead of throw
        // process.exit(1)
        // // throw new Error(`${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`)
        // logs.push({
        //     logType: LogType.ERROR,
        //     log: `${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`
        // })
        // return Err(logs)
    }

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

    let revisionData = reorderRevisionsProperties(newRevision)



    const leaves = dict2Leaves(revisionData)

    let verificationHash = "";
    if (enableScalar) {

        logs.push({
            log: `Scalar enabled`,
            logType: LogType.SCALAR
        });
        let stringifiedData = JSON.stringify(revisionData)

        verificationHash = "0x" + getHashSum(stringifiedData);
    } else {
        revisionData.leaves = leaves
        verificationHash = getMerkleRoot(leaves);
    }

    let updatedAquaTree: AquaTree = {
        revisions: {
            ...aquaTreeView.aquaTree.revisions,
            [verificationHash]: revisionData
        },
        file_index: {
            ...aquaTreeView.aquaTree.file_index,
            [linkVHs[0]]: linkAquaTreeView.fileObject.fileName
        }
    }

    // Tree creation
    let aquaTreeWithTree = createAquaTree(updatedAquaTree)

    let orderedAquaTreeWithTree = reorderAquaTreeRevisionsProperties(aquaTreeWithTree)
    logs.push({
        log: "Linking successful",
        logType: LogType.LINK
    })

    let resutData: AquaOperationData = {
        aquaTree: orderedAquaTreeWithTree,
        logData: logs,
        aquaTrees: []
    };

    return Ok(resutData)
}

/**
 * Links multiple target Aqua Trees to a single source Aqua Tree
 * 
 * @param aquaTreeViews - Source Aqua Tree view
 * @param linkAquaTreeView - Array of target Aqua Tree views to link to
 * @param enableScalar - Flag to use scalar mode instead of tree mode
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 * 
 * This function:
 * - Iteratively links each target tree to the source tree
 * - Accumulates logs from each linking operation
 * - Updates the source tree with all link revisions
 */
export async function linkAquaTreesToMultipleAquaTreesUtil(aquaTreeViews: AquaTreeView, linkAquaTreeView: AquaTreeView[], enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {


    let logs: Array<LogData> = [];
    // 
    let aquaTree = aquaTreeViews;
    for (const linkAquaTree of linkAquaTreeView) {
        const result = await linkAquaTreeUtil(aquaTree, linkAquaTree, enableScalar); // Assuming enableScalar is false by default

        if (isOk(result)) {
            const resData = result.data
            aquaTree = {
                aquaTree: resData.aquaTree,
                fileObject: aquaTreeViews.fileObject,
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

/**
 * Links a single target Aqua Tree to multiple source Aqua Trees
 * 
 * @param aquaTreeViews - Array of source Aqua Tree views
 * @param linkAquaTreeView - Target Aqua Tree view to link to
 * @param enableScalar - Flag to use scalar mode instead of tree mode
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 * 
 * This function:
 * - Iteratively links the target tree to each source tree
 * - Accumulates logs from each linking operation
 * - Returns array of updated Aqua Trees
 */
export async function linkMultipleAquaTreesUtil(aquaTreeViews: AquaTreeView[], linkAquaTreeView: AquaTreeView, enableScalar: boolean): Promise<Result<AquaOperationData, LogData[]>> {


    let logs: Array<LogData> = [];
    let aquaTrees: AquaTree[] = []

    for (const aquaTree of aquaTreeViews) {
        const result = await linkAquaTreeUtil(aquaTree, linkAquaTreeView, enableScalar); // Assuming enableScalar is false by default

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