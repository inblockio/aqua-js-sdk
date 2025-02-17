import { Revision, AquaOperationData, LogData, AquaTree, AquaTreeWrapper, WitnessNetwork, WitnessType, WitnessResult, GasEstimateResult, WitnessPlatformType, CredentialsData, LogType, WitnessConfig, TransactionResult } from "../types";
import { dict2Leaves, estimateWitnessGas, formatMwTimestamp, getHashSum, getMerkleRoot, getWallet, verifyMerkleIntegrity } from "../utils";
import { WitnessEth } from "../witness/wintess_eth";
import { WitnessTSA } from "../witness/witness_tsa";
import { WitnessNostr } from "../witness/witness_nostr";
import { createAquaTree } from "../aquavhtree";
import { Err, isErr, Ok, Result } from "../type_guards";




export async function witnessAquaTreeUtil(aquaTree: AquaTree, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];


    const verificationHashes = Object.keys(aquaTree.revisions);
    let lastRevisionHash = verificationHashes[verificationHashes.length - 1];

    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
    const revisionType = "witness";

    let verificationData: any = {
        previous_verification_hash: lastRevisionHash,
        local_timestamp: timestamp,
        revision_type: revisionType,
    }
    verificationData["version"] =`aqua-protocol.org/docs/schema/v1.3.2 | SHA256 | Method:  ${enableScalar ? 'scalar' : 'tree'}`

    
    const revisionResultData = await prepareWitness(lastRevisionHash, witnessType, witnessPlatform, credentials!!, witnessNetwork)

    if (isErr(revisionResultData)) {
        revisionResultData.data.forEach((e) => logs.push(e));
        return Err(logs)
    }

    let witness: WitnessResult = revisionResultData.data;

    verificationData = { ...verificationData, ...witness }

    // Merklelize the dictionary
    const leaves = dict2Leaves(verificationData)



    let verification_hash = "";
    if (!enableScalar) {
        verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
        verificationData.leaves = leaves
    } else {
        verification_hash = getMerkleRoot(leaves); //tree.getHexRoot()
    }

    const revisions = aquaTree.revisions
    revisions[verification_hash] = verificationData

    let aquaTreeWithTree = createAquaTree(aquaTree)


    logs.push({
        log: `AquaTree witnessed succesfully`,
        logType: LogType.SUCCESS
    });

    let result: AquaOperationData = {
        aquaTree: aquaTreeWithTree,
        aquaTrees: null,
        logData: logs
    }
    return Ok(result)
}

export async function witnessMultipleAquaTreesUtil(aquaTrees: AquaTreeWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: CredentialsData, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    let lastRevisionOrSpecifiedHashes = [];

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

        let aquaTreeUpdated = createAquaTree(item.aquaTree)

        aquaTreesResult.push(aquaTreeUpdated);
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



const prepareWitness = async (
    verificationHash: string,
    witnessType: WitnessType,
    WitnessPlatformType: WitnessPlatformType,
    credentials: CredentialsData,
    witness_network: string = 'sepolia',
): Promise<Result<WitnessResult, LogData[]>> => {
    let logs: Array<LogData> = [];

    const merkle_root: string = verificationHash;
    let witness_type: string = "";
    let smart_contract_address: string,
        transactionHash: string,
        publisher: string,
        witnessTimestamp: number;

    switch (witnessType) {
        case "nostr": {
            
            let witnessNostr = new WitnessNostr();
            [transactionHash, publisher, witnessTimestamp] = await witnessNostr.witness(merkle_root, credentials);

            witness_type = "nostr";
            smart_contract_address = "N/A";
            break;
        }
        case "tsa": {
            const tsaUrl = "http://timestamp.digicert.com"; // DigiCert's TSA URL
            let witnessTsa = new WitnessTSA();
            [transactionHash, publisher, witnessTimestamp] =
                await witnessTsa.witness(merkle_root, tsaUrl);
            witness_type = "TSA_RFC3161";
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

                if (credentials == null || credentials == undefined) {
                    logs.push({
                        log: `credentials not found`,
                        logType: LogType.ERROR
                    });
                    return Err(logs)
                }

                let [_wallet, walletAddress, _publicKey] = getWallet(credentials.mnemonic);


                logs.push({
                    log: `Wallet address: ${_wallet}`,
                    logType: LogType.DEBUGDATA
                });

                const [gasEstimateResult, logData] = await estimateWitnessGas(
                    walletAddress,
                    merkle_root,
                    witness_network,
                    smart_contract_address,
                    ""
                );

                logs.push(...logData)

                logs.push({
                    log: `Gas estimate result: : ${gasEstimateResult}`,
                    logType: LogType.DEBUGDATA
                });

                if (gasEstimateResult.error !== null) {
                    logs.push({
                        log: `Unable to Estimate gas fee: ${gasEstimateResult?.error}`,
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
                        ""
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

                if (transactionResult == null || transactionResult.error != null) {
                    logs.push({
                        logType: LogType.ERROR,
                        log: "An error witnessing using etherium (empty object) "
                    })
                    return Err(logs);
                }

                transactionHash = transactionResult!!.transactionHash ?? "--error--";
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
        witness_network: witness_network,
        witness_smart_contract_address: smart_contract_address,
        witness_transaction_hash: transactionHash,
        witness_sender_account_address: publisher,
        witness_merkle_proof: [verificationHash],
    };



    return Ok(witness);
};


export async function verifyWitness(
    witnessData: Revision,
    verificationHash: string,
    doVerifyMerkleProof: boolean,
): Promise<[boolean, LogData[]]> {
    let logs: Array<LogData> = [];



    let isValid: boolean = false;
    if (verificationHash === "") {

        logs.push({
            log: `The verification Hash MUST NOT be empty`,
            logType: LogType.ERROR,
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
        // console.log(`Narrowed down to ${isValid}  nd messae ${logMessage}`)
        logs.push({
            log: logMessage,
            logType: isValid ? LogType.SUCCESS : LogType.ERROR
        })


    }

    // At this point, we know that the witness matches.
    if (doVerifyMerkleProof) {
        logs.push({
            log: `verifying merkle integrity`,
            logType: LogType.INFO
        })
        // Only verify the witness merkle proof when verifyWitness is successful,
        // because this step is expensive.

        //todo this will improved
        isValid = verifyMerkleIntegrity(
            // JSON.parse(witnessData.witness_merkle_proof),
            // verification_hash,
            witnessData.witness_merkle_proof ?? [],
            witnessData.witness_merkle_root!
        )

        logs.push({
            log: `Merkle integrity is ${isValid ? '' : 'NOT'} valid `,
            logType: isValid ? LogType.SUCCESS : LogType.ERROR
        })

    }
    return [isValid, logs]
}