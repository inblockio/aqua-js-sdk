import { Result, Err, Option, Ok, isErr } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper, WitnessNetwork, WitnessType, WitnessResult, GasEstimateResult, WitnessPlatformType, CredentialsData, IWitnessConfig, WitnessEthResponse, LogType, WitnessConfig, TransactionResult } from "../types";
import MerkleTree from "merkletreejs";
import { dict2Leaves, estimateWitnessGas, formatMwTimestamp, getHashSum, getWallet, maybeUpdateFileIndex, verifyMerkleIntegrity } from "../utils";
import { WitnessEth } from "../witness/wintess_eth";
import { WitnessTSA } from "../witness/witness_tsa";
import { WitnessNostr } from "../witness/witness_nostr";
import { createAquaTree } from "../aquavhtree";


export async function verifyWitnessUtil(witness: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function witnessAquaObjectUtil(aquaObject: AquaObject, witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: Option<CredentialsData>, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];


    const verificationHashes = Object.keys(aquaObject.revisions);
    let lastRevisionHash = verificationHashes[verificationHashes.length - 1];

    const now = new Date().toISOString()
    const timestamp = formatMwTimestamp(now.slice(0, now.indexOf(".")))
    const revisionType = "witness";

    let verificationData: any = {
        previous_verification_hash: lastRevisionHash,
        local_timestamp: timestamp,
        revision_type: revisionType,

    }
    const revisionResultData = await prepareWitness(lastRevisionHash, witnessType, witnessPlatform, credentials!!, witnessNetwork)

    if (isErr(revisionResultData)) {
        revisionResultData.data.forEach((e) => logs.push(e));
        return Err(logs)
    }

    let witness: WitnessResult = revisionResultData.data;

    verificationData = { ...verificationData, ...witness }

    // Merklelize the dictionary
    const leaves = dict2Leaves(verificationData)
    const tree = new MerkleTree(leaves, getHashSum, {
        duplicateOdd: false,
    })


    let verification_hash = "";
    if (!enableScalar) {
        verification_hash = "0x" + getHashSum(JSON.stringify(verificationData))
        verificationData.leaves = leaves
    } else {
        verification_hash = tree.getHexRoot()
    }

    const revisions = aquaObject.revisions
    revisions[verification_hash] = verificationData

    let aquaObjectWithTree = createAquaTree(aquaObject)

    let result: AquaOperationData = {
        aquaObject: aquaObjectWithTree,
        aquaObjects: null,
        logData: logs
    }
    return Ok(result)
}

export async function witnessMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witnessPlatform: WitnessPlatformType, credentials: Option<CredentialsData>, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    let lastRevisionOrSpecifiedHashes = [];

    for (let item of aquaObjects) {
        if (item.revision != null && item.revision != undefined && item.revision.length > 0) {
            lastRevisionOrSpecifiedHashes.push(item.revision)
        } else {
            const verificationHashes = Object.keys(item.aquaObject.revisions);
            lastRevisionOrSpecifiedHashes.push(verificationHashes[verificationHashes.length - 1]);
        }
    }

    const tree2 = new MerkleTree(lastRevisionOrSpecifiedHashes, getHashSum, {
        duplicateOdd: false,
    })

    let merkleRoot = tree2.getHexRoot();
    let merkleProofArray: string[][] = [];

    lastRevisionOrSpecifiedHashes.forEach((hash) => {
        let merkleProof = tree2.getHexProof(hash);
        merkleProofArray.push(merkleProof);
    });

    console.log("Merkle proof: ", merkleProofArray);


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

    let aquaObjectsResult: AquaObject[] = [];
    // let index = 0;
    for (let item of aquaObjects) {
        let latestOrSpecifiedRevisionKey = "";
        if (item.revision != null && item.revision != undefined && item.revision.length > 0) {
            latestOrSpecifiedRevisionKey = item.revision
        } else {
            const verificationHashes = Object.keys(item.aquaObject.revisions);
            latestOrSpecifiedRevisionKey = verificationHashes[verificationHashes.length - 1];
        }
        let verificationData: any = {
            previous_verification_hash: latestOrSpecifiedRevisionKey,
            local_timestamp: timestamp,
            revision_type: revisionType,
            ...revisionResult
        }
        const revisions = item.aquaObject.revisions

        const leaves = dict2Leaves(verificationData)
        if (!enableScalar) {
            verificationData.leaves = leaves;
        }
        const tree = new MerkleTree(leaves, getHashSum, {
            duplicateOdd: false,
        })
        const verificationHash = tree.getHexRoot()
        revisions[verificationHash] = verificationData
        // console.log(`\n\n Writing new revision ${verificationHash} to ${current_file} current file current_file_aqua_object ${JSON.stringify(current_file_aqua_object)} \n\n `)
        let res = maybeUpdateFileIndex(item.aquaObject, {
            verification_hash: verificationHash,
            data: verificationData
        }, revisionType, item.fileObject.fileName, "");

        aquaObjectsResult.push(res);
    }

    let resutData: AquaOperationData = {
        aquaObject: null,
        logData: logs,
        aquaObjects: aquaObjectsResult
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

    // if (!witnessMethod) {
    //   console.error("Witness method must be specified");
    //   process.exit(1);
    // }

    // const options_array: WitnessMethod[] = ["nostr", "tsa", "eth"];
    // if (!options_array.includes(witnessMethod)) {
    //   console.log(`❌ An invalid witness method provided ${witnessMethod}.\n💡 Hint use one of ${options_array.join(",")}`);
    //   process.exit(1);
    // }

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
            // let useNetwork = "sepolia";
            // if (network === "mainnet") {
            //     useNetwork = "mainnet";
            // }
            // witness_network = useNetwork;
            smart_contract_address = "0x45f59310ADD88E6d23ca58A0Fa7A55BEE6d2a611";

            let network: WitnessNetwork = "sepolia"
            if (witness_network == "holesky") {
                network = "holesky"
            } else if (witness_network == "mainnet") {
                network = "mainnet"
            }

            if (WitnessPlatformType === "cli") {
                //   const creds: Credentials = readCredentials();

                if (credentials == null || credentials == undefined) {
                    return Err(logs)
                }
                let [wallet, walletAddress, publicKey] = getWallet(credentials.mnemonic);

                console.log("Wallet address: ", walletAddress);

                const gasEstimateResult: GasEstimateResult = await estimateWitnessGas(
                    walletAddress,
                    merkle_root,
                    witness_network,
                    smart_contract_address,
                    ""
                );

                console.log("Gas estimate result: ", gasEstimateResult);

                if (gasEstimateResult.error !== null) {
                    console.log(`Unable to Estimate gas fee: ${gasEstimateResult?.error}`);
                    process.exit(1);
                }

                if (!gasEstimateResult.hasEnoughBalance) {
                    console.log(`You do not have enough balance to cater for gas fees`);
                    console.log(`Add some faucets to this wallet address: ${walletAddress}\n`);
                    process.exit(1);
                }


                let transactionResult: TransactionResult | null = null;
                try {


                    transactionResult = await WitnessEth.witnessCli(
                        walletAddress,
                        verificationHash,
                        smart_contract_address,
                        network,
                        ""

                    );

                    console.log("cli signing result: ", JSON.stringify(transactionResult));


                } catch (e) {

                    logs.push({
                        logType: LogType.ERROR,
                        log: "an error witnessing using etherium "
                    })
                }

                if (transactionResult?.error != null) {
                    return Err(logs);
                }

                transactionHash = transactionResult?.transactionHash ?? "--error--";
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
        witness_network: witness_type,
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