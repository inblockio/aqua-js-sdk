import { Result, Err, Option } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject, AquaObjectWrapper, WitnessNetwork, WitnessType, WitnessResult, GasEstimateResult, WitnessPlatformType, CredentialsData } from "../types";
import MerkleTree from "merkletreejs";
import { estimateWitnessGas, getHashSum } from "../utils";


export async function verifyWitnessUtil(witness: Revision): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function witnessAquaObjectUtil(aquaObject: AquaObject, hash: string, witnessType: WitnessType, witnessNetwork: WitnessNetwork, enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    return Err(logs)
}

export async function witnessMultipleAquaObjectsUtil(aquaObjects: AquaObjectWrapper[], witnessType: WitnessType, witnessNetwork: WitnessNetwork, witness_platform :  WitnessPlatformType, credentials : Option<CredentialsData> ,enableScalar: boolean = false): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];
    let lastRevisionOrSpecifiedHashes = [];

    for(let item of aquaObjects){
        if (item.revision != null && item.revision != undefined  && item.revision.length > 0 ){
            lastRevisionOrSpecifiedHashes.push(item.revision)
        }else{
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
  

      revisionResult = await prepareWitness(merkleRoot);

    revisionResult.witness_merkle_proof = lastRevisionOrSpecifiedHashes;
  
    
    return Err(logs)
}



const prepareWitness = async (
    verificationHash: string,
    witnessType: WitnessType,
    WitnessPlatformType : WitnessPlatformType,
    credentials : Option<CredentialsData>,
    network: string = 'sepolia',
    witness_platform_type: WitnessPlatformType = 'metamask',
  ): Promise<WitnessResult> => {
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
    let witness_network: string,
      smart_contract_address: string,
      transactionHash: string,
      publisher: string,
      witnessTimestamp: number;
  
    switch (witnessType) {
      case "nostr": {
        [transactionHash, publisher, witnessTimestamp] =
          await witnessNostr.witness(merkle_root);
        witness_network = "nostr";
        smart_contract_address = "N/A";
        break;
      }
      case "tsa": {
        const tsaUrl = "http://timestamp.digicert.com"; // DigiCert's TSA URL
        [transactionHash, publisher, witnessTimestamp] =
          await witnessTsa.witness(merkle_root, tsaUrl);
        witness_network = "TSA_RFC3161";
        smart_contract_address = tsaUrl;
        break;
      }
      case "eth": {
        let useNetwork = "sepolia";
        if (network === "mainnet") {
          useNetwork = "mainnet";
        }
        witness_network = useNetwork;
        smart_contract_address = "0x45f59310ADD88E6d23ca58A0Fa7A55BEE6d2a611";
  
        if (witness_platform_type === "cli") {
        //   const creds: Credentials = readCredentials();

        if (credentials)
          const [wallet, walletAddress, publicKey] = getWallet(credentials.mnemonic);
  
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
  
          const witnessCliResult = await witnessEth.witnessCli(
            wallet.privateKey,
            merkle_root,
            smart_contract_address,
            witness_network,
            null
          );
  
          console.log("cli signing result: ", witnessCliResult);
  
          if (witnessCliResult.error !== null) {
            console.log(`Unable to witness: ${witnessCliResult.error}`);
            process.exit(1);
          }
  
          transactionHash = witnessCliResult.transactionHash;
          publisher = walletAddress;
        } else {
          [transactionHash, publisher] = await witnessEth.witnessMetamask(
            merkle_root,
            witness_network,
            smart_contract_address
          );
        }
  
        witnessTimestamp = Math.floor(Date.now() / 1000);
        break;
      }
      default: {
        console.error(`Unknown witness method: ${witnessMethod}`);
        process.exit(1);
      }
    }
  
    const witness: WitnessResult = {
      witness_merkle_root: merkle_root,
      witness_timestamp: witnessTimestamp,
      witness_network,
      witness_smart_contract_address: smart_contract_address,
      witness_transaction_hash: transactionHash,
      witness_sender_account_address: publisher,
      witness_merkle_proof: [verificationHash],
    };
  
    return witness;
  };
  