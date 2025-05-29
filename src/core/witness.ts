import { Revision, AquaOperationData, LogData, AquaTree, AquaTreeWrapper, WitnessNetwork, WitnessType, WitnessResult, WitnessPlatformType, CredentialsData, LogType, WitnessConfig, TransactionResult } from "../types";
import { checkInternetConnection, dict2Leaves, estimateWitnessGas, formatMwTimestamp, getHashSum, getMerkleRoot, getWallet, reorderAquaTreeRevisionsProperties, reorderRevisionsProperties, verifyMerkleIntegrity } from "../utils";
import { WitnessEth } from "../witness/wintess_eth";
import { WitnessTSA } from "../witness/witness_tsa";
import { WitnessNostr } from "../witness/witness_nostr";
import { createAquaTree } from "../aquavhtree";
import { Err, isErr, Ok, Result } from "../type_guards";




/**
 * Creates a witness revision for an Aqua Tree
 * 
 * @param aquaTreeWrapper - Wrapper containing the Aqua Tree to witness
 * @param witnessType - Type of witness (nostr, tsa, etc.)
 * @param witnessNetwork - Network to witness on (e.g., sepolia)
 * @param witnessPlatform - Platform type for witnessing
 * @param credentials - Credentials data required for witnessing
 * @param enableScalar - Optional flag to use scalar mode instead of tree mode
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 * 
 * This function:
 * - Creates witness revision with metadata
 * - Prepares witness data based on type and network
 * - Creates verification data with Merkle tree or scalar hash
 * - Updates Aqua Tree with witness revision
 */
export async function witnessAquaTreeUtil(aquaTreeWrapper: AquaTreeWrapper, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    let lastRevisionHash = "";
    if (aquaTreeWrapper.revision == undefined || aquaTreeWrapper.revision == null || aquaTreeWrapper.revision.length == 0) {
        const verificationHashes = Object.keys(aquaTreeWrapper.aquaTree.revisions);
        lastRevisionHash = verificationHashes[verificationHashes.length - 1];
    } else {
        lastRevisionHash = aquaTreeWrapper.revision;
    }

    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
    const revisionType = "witness";

    let verificationDataBasic: any = {
        previous_verification_hash: lastRevisionHash,
        local_timestamp: timestamp,
        revision_type: revisionType,
    }
    verificationDataBasic["version"] = `https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: ${enableScalar ? 'scalar' : 'tree'}`


    const revisionResultData = await prepareWitness(lastRevisionHash, witnessType, witnessPlatform, credentials!!, witnessNetwork)

    if (isErr(revisionResultData)) {
        revisionResultData.data.forEach((e) => logs.push(e));
        return Err(logs)
    }

    let witness: WitnessResult = revisionResultData.data;

    let verificationDataRaw = { ...verificationDataBasic, ...witness }


    let verificationData = reorderRevisionsProperties(verificationDataRaw)
    // Merklelize the dictionary
    const leaves = dict2Leaves(verificationData)

    let verification_hash = "";
    if (enableScalar) {
        verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
    } else {
        verification_hash = getMerkleRoot(leaves); //tree.getHexRoot() 
        verificationData.leaves = leaves
    }

    const revisions = aquaTreeWrapper.aquaTree.revisions
    revisions[verification_hash] = verificationData

    let aquaTreeWithTree = createAquaTree(aquaTreeWrapper.aquaTree)
    if (!aquaTreeWithTree) {
        logs.push({
            log: `Failed to create AquaTree`,
            logType: LogType.ERROR
        });
        return Err(logs);
    }

    logs.push({
        log: `AquaTree witnessed succesfully`,
        logType: LogType.SUCCESS
    });

    let result: AquaOperationData = {
        aquaTree: aquaTreeWithTree,
        aquaTrees: [],
        logData: logs
    }
    return Ok(result)
}

/**
 * Creates witness revisions for multiple Aqua Trees in a batch
 * 
 * @param aquaTrees - Array of Aqua Tree wrappers to witness
 * @param witnessType - Type of witness (nostr, tsa, etc.)
 * @param witnessNetwork - Network to witness on
 * @param witnessPlatform - Platform type for witnessing
 * @param credentials - Credentials data required for witnessing
 * @param enableScalar - Optional flag to use scalar mode
 * @returns Promise resolving to either AquaOperationData on success or array of LogData on failure
 * 
 * This function:
 * - Collects revision hashes from all trees
 * - Creates a single witness for all trees using Merkle root
 * - Updates each tree with witness revision
 * - Handles batch witnessing efficiently
 */
export async function witnessMultipleAquaTreesUtil(aquaTrees: AquaTreeWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    let lastRevisionOrSpecifiedHashes: string[] = [];

    for (let item of aquaTrees) {
        if (item.revision != null && item.revision != undefined && item.revision.length > 0) {
            lastRevisionOrSpecifiedHashes.push(item.revision)
        } else {
            const verificationHashes = Object.keys(item.aquaTree.revisions);
            lastRevisionOrSpecifiedHashes.push(verificationHashes[verificationHashes.length - 1]);
        }
    }



    let merkleRoot = getMerkleRoot(lastRevisionOrSpecifiedHashes);

    let revisionResultData = await prepareWitness(merkleRoot, witnessType, witnessPlatform, credentials!!, witnessNetwork);

    if (isErr(revisionResultData)) {
        revisionResultData.data.forEach((e) => logs.push(e));
        return Err(logs)
    }

    let revisionResult = revisionResultData.data
    revisionResult.witness_merkle_proof = lastRevisionOrSpecifiedHashes;

    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
    const revisionType = "witness";

    let aquaTreesResult: AquaTree[] = [];
    let hasError = false;
    for (let item of aquaTrees) {
        let latestOrSpecifiedRevisionKey = "";
        if (item.revision != null && item.revision != undefined && item.revision.length > 0) {
            latestOrSpecifiedRevisionKey = item.revision
        } else {
            const verificationHashes = Object.keys(item.aquaTree.revisions);
            latestOrSpecifiedRevisionKey = verificationHashes[verificationHashes.length - 1];
        }
        let verificationData: any = {
            previous_verification_hash: latestOrSpecifiedRevisionKey,
            local_timestamp: timestamp,
            revision_type: revisionType,
            ...revisionResult
        }
        const revisions = item.aquaTree.revisions

        const leaves = dict2Leaves(verificationData)
        if (!enableScalar) {
            verificationData.leaves = leaves;
        }

        const verificationHash = getMerkleRoot(leaves);
        revisions[verificationHash] = verificationData

        item.aquaTree.revisions = revisions

        let aquaTreeUpdatedData = createAquaTree(item.aquaTree)
        let aquaTreeUpdated = reorderAquaTreeRevisionsProperties(aquaTreeUpdatedData)

        if (aquaTreeUpdated) {
            aquaTreesResult.push(aquaTreeUpdated);
        }
    }

    if (hasError) {
        return Err(logs);
    }
    logs.push({
        log: `All aquaTrees witnessed succesfully`,
        logType: LogType.SUCCESS
    });

    let resutData: AquaOperationData = {
        aquaTree: null,
        logData: logs,
        aquaTrees: aquaTreesResult
    };


    return Ok(resutData)
}

/**
 * Determines the appropriate witness network based on witness type
 * 
 * @param witnessType - Type of witness (nostr, tsa, etc.)
 * @param witnessNetwork - Default network name
 * @returns Resolved witness network name
 * 
 * This function maps witness types to their corresponding networks,
 * with special handling for nostr and TSA witnesses
 */
function getWitnessNetwork(witnessType: WitnessType, witnessNetwork: string) {
    let witness_network = witnessNetwork
    switch (witnessType) {
        case "nostr": {
            witness_network = "nostr"
            break;
        }
        case "tsa": {
            witness_network = "TSA_RFC3161"
            break;
        }
    }
    return witness_network
}

/**
 * Prepares witness data based on witness type and platform
 * 
 * @param verificationHash - Hash to be witnessed
 * @param witnessType - Type of witness (nostr, tsa, etc.)
 * @param WitnessPlatformType - Platform type for witnessing
 * @param credentials - Credentials data required for witnessing
 * @param witness_network - Optional network name (default: 'sepolia')
 * @returns Promise resolving to either WitnessResult on success or array of LogData on failure
 * 
 * This function:
 * - Handles different witness types (nostr, tsa, ethereum)
 * - Prepares witness-specific data
 * - Manages witness transactions and timestamps
 * - Validates witness results
 */
const prepareWitness = async (
    verificationHash: string,
    witnessType: WitnessType,
    WitnessPlatformType: WitnessPlatformType,
    credentials: CredentialsData,
    witness_network: string = 'sepolia',
): Promise<Result<WitnessResult, LogData[]>> => {

    let logs: Array<LogData> = [];

    const merkle_root: string = verificationHash;
    // let witness_type: string = "";
    let smart_contract_address: string,
        transactionHash: string,
        publisher: string,
        witnessTimestamp: number;

    switch (witnessType) {
        case "nostr": {

            let witnessNostr = new WitnessNostr();
            [transactionHash, publisher, witnessTimestamp] = await witnessNostr.witness(merkle_root, credentials);

            // witness_type = "nostr";
            smart_contract_address = "N/A";
            break;
        }
        case "tsa": {
            const tsaUrl = "http://timestamp.digicert.com"; // DigiCert's TSA URL
            let witnessTsa = new WitnessTSA();
            [transactionHash, publisher, witnessTimestamp] =
                await witnessTsa.witness(merkle_root, tsaUrl);
            // witness_type = "TSA_RFC3161";
            smart_contract_address = tsaUrl;
            break;
        }
        case "eth": {

            smart_contract_address = "0x45f59310ADD88E6d23ca58A0Fa7A55BEE6d2a611";

            let network: WitnessNetwork = "sepolia"
            if (witness_network == "holesky") {
                network = "holesky"
            } else if (witness_network == "mainnet") {
                network = "mainnet"
            }

            if (WitnessPlatformType === "cli") {
                
                if (credentials.alchemy_key == null || credentials.alchemy_key == undefined || credentials.alchemy_key == "") {
                    logs.push({
                        log: `Alchemy key is missing`,
                        logType: LogType.DEBUGDATA
                    });
                    process.exit(1);
                }


                let alchemyProvider = `https://eth-${witness_network}.g.alchemy.com/v2/${credentials.alchemy_key}`


                if (credentials == null || credentials == undefined) {
                    logs.push({
                        log: `credentials not found`,
                        logType: LogType.ERROR
                    });
                    return Err(logs)
                }

                let [_wallet, walletAddress, _publicKey] = await getWallet(credentials.mnemonic);


                logs.push({
                    log: `Wallet address: ${_wallet}`,
                    logType: LogType.SIGNATURE
                });

                const [gasEstimateResult, logData] = await estimateWitnessGas(
                    walletAddress,
                    merkle_root,
                    witness_network,
                    smart_contract_address,
                    alchemyProvider
                );

                logs.push(...logData)

                logs.push({
                    log: `Gas estimate result: : ${gasEstimateResult}`,
                    logType: LogType.DEBUGDATA
                });

                if (gasEstimateResult.error !== null) {
                    logs.push({
                        log: `Unable to Estimate gas fee: ${gasEstimateResult.error}`,
                        logType: LogType.DEBUGDATA
                    });
                    process.exit(1);
                }

                if (!gasEstimateResult.hasEnoughBalance) {
                    logs.push({
                        log: `🔷 You do not have enough balance to cater for gas fees : ${gasEstimateResult}`,
                        logType: LogType.DEBUGDATA
                    });
                    logs.push({
                        log: `Add some faucets to this wallet address: ${walletAddress}\n`,
                        logType: LogType.DEBUGDATA
                    });
                    process.exit(1);
                }

                let transactionResult: TransactionResult | null = null;
                try {


                    let [transactionResultData, resultLogData] = await WitnessEth.witnessCli(
                        _wallet.privateKey,
                        verificationHash,
                        smart_contract_address,
                        network,
                        alchemyProvider,
                        credentials.alchemy_key
                    );

                    transactionResult = transactionResultData
                    logs.push(...resultLogData)

                    logs.push({
                        logType: LogType.WITNESS,
                        log: "cli witness result: \n" + JSON.stringify(transactionResult)
                    });


                } catch (e) {

                    logs.push({
                        logType: LogType.ERROR,
                        log: "An error witnessing using etherium "
                    })
                }

                if (transactionResult == null || transactionResult.error != null || !transactionResult.transactionHash) {
                    logs.push({
                        logType: LogType.ERROR,
                        log: "An error witnessing using etherium (empty object or missing transaction hash)"
                    })
                    return Err(logs);
                }

                transactionHash = transactionResult.transactionHash;
                publisher = walletAddress;
            } else {
                /**
                 *  merkle_root,
                    witness_network,
                    smart_contract_address
                 */

                let config: WitnessConfig = {
                    smartContractAddress: smart_contract_address,
                    witnessEventVerificationHash: merkle_root,
                    witnessNetwork: network
                }
                let witnessResult = await WitnessEth.witnessMetamask(
                    config
                );
                transactionHash = witnessResult.transaction_hash
                publisher = witnessResult.wallet_address;
            }

            witnessTimestamp = Math.floor(Date.now() / 1000);
            break;
        }
        default: {
            console.error(`Unknown witness method: ${witnessType}`);
            process.exit(1);
        }
    }

    const witness: WitnessResult = {
        witness_merkle_root: merkle_root,
        witness_timestamp: witnessTimestamp,
        witness_network: getWitnessNetwork(witnessType, witness_network),
        witness_smart_contract_address: smart_contract_address,
        witness_transaction_hash: transactionHash,
        witness_sender_account_address: publisher,
        witness_merkle_proof: [verificationHash],
    };



    return Ok(witness);
};


/**
 * Verifies a witness revision
 * 
 * @param witnessData - The witness revision data to verify
 * @param verificationHash - Hash to verify against
 * @param doVerifyMerkleProof - Flag to verify Merkle proof
 * @param indentCharacter - Character for log indentation
 * @returns Promise resolving to tuple of [verification success boolean, array of logs]
 * 
 * This function:
 * - Verifies witness data integrity
 * - Validates witness timestamps
 * - Checks witness signatures and proofs
 * - Verifies network-specific witness data
 */
export async function verifyWitness(
    witnessData: Revision,
    verificationHash: string,
    doVerifyMerkleProof: boolean,
    indentCharacter: string,
): Promise<[boolean, LogData[]]> {
    let logs: Array<LogData> = [];

    let isValid: boolean = false;

    // Check for internet connection first
    const hasInternet = await checkInternetConnection();
    if (!hasInternet) {
        logs.push({
            log: `No internet connection available. Witness verification requires internet access.`,
            logType: LogType.ERROR,
            ident: indentCharacter
        });
        return [false, logs];
    }


    if (verificationHash === "") {

        logs.push({
            log: `The verification Hash MUST NOT be empty`,
            logType: LogType.ERROR,
            ident: indentCharacter
        })
        return [isValid, logs]
    }





    if (witnessData.witness_network === "nostr") {
        let witnessNostr = new WitnessNostr();
        isValid = await witnessNostr.verify(
            witnessData.witness_transaction_hash!,
            witnessData.witness_merkle_root!,
            witnessData.witness_timestamp!,
        )
    } else if (witnessData.witness_network === "TSA_RFC3161") {
        let witnessTsa = new WitnessTSA();
        isValid = await witnessTsa.verify(
            witnessData.witness_transaction_hash!,
            witnessData.witness_merkle_root!,
            witnessData.witness_timestamp!,
        )
    } else {
        // Verify the transaction hash via the Ethereum blockchain
        // let  witnessEth =  new WitnessEth();
        let logMessage = "";
        [isValid, logMessage] = await WitnessEth.verify(
            witnessData.witness_network as WitnessNetwork,
            witnessData.witness_transaction_hash!,
            witnessData.witness_merkle_root!,
            witnessData.witness_timestamp,
        )
        logs.push({
            log: logMessage,
            logType: isValid ? LogType.SUCCESS : LogType.ERROR,
            ident: indentCharacter
        })


    }

    // At this point, we know that the witness matches.
    if (doVerifyMerkleProof) {
        logs.push({
            log: `verifying merkle integrity`,
            logType: LogType.INFO,
            ident: indentCharacter
        })
        // Only verify the witness merkle proof when verifyWitness is successful,
        // because this step is expensive.

        //todo this will improved
        isValid = verifyMerkleIntegrity(
            // JSON.parse(witnessData.witness_merkle_proof),
            // verification_hash,
            witnessData.witness_merkle_proof ? witnessData.witness_merkle_proof : [],
            witnessData.witness_merkle_root!
        )

        logs.push({
            log: `Merkle integrity is ${isValid ? '' : 'NOT'} valid `,
            logType: isValid ? LogType.SUCCESS : LogType.ERROR,
            ident: indentCharacter
        })

    }
    return [isValid, logs]
}