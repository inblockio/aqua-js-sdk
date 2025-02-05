
class AquaTree {
    // constructor(aquaFilename = null, timestamp = null, revisionType = null, enableScalar = true) {
    //   if (aquaFilename !== null) {
    //     this.read(aquaFilename)
    //   } else if (timestamp !== null && revisionType !== null) {
    //     this.aquaObject = createNewAquaObject()
    //     this.lastRevisionHash = ""
    //     this.createNewRevision(timestamp, revisionType, enableScalar)
    //   }
    // }
  
    // read = (aquaFilename) => {
    //   this.aquaFilename = aquaFilename
    //   this.aquaObject = JSON.parse(fs.readFileSync(aquaFilename))
    //   const revisions = this.aquaObject.revisions
    //   const verificationHashes = Object.keys(revisions)
    //   this.lastRevisionHash = verificationHashes[verificationHashes.length - 1]
    // }
  
    removeLastRevision = (aquaObject : ) => {
      const lastRevision = aquaObject.revisions[this.lastRevisionHash]
      switch (lastRevision.revision_type) {
        case "file":
          delete this.aquaObject.file_index[lastRevision.file_hash]
          break
        case "link":
          for (const vh of lastRevision.link_verification_hashes) {
            delete this.aquaObject.file_index[vh]
          }
      }
  
      delete this.aquaObject.revisions[lastRevisionHash]
      console.log(`Most recent revision ${lastRevisionHash} has been removed`)
      if (Object.keys(this.aquaObject.revisions).length === 0) {
        // If there are no revisions left, delete the .aqua.json file
        try {
          fs.unlinkSync(this.aquaFilename)
          console.log(
            `${this.aquaFilename} has been deleted because there are no revisions left.`,
          )
          // Since we've deleted the file, there's no need to return here; the script should end.
        } catch (err) {
          console.error(`Failed to delete ${this.aquaFilename}:`, err)
        }
      } else {
        serializeAquaObject(this.aquaFilename, this.aquaObject)
      }
    }
  
    createNewRevision = async (timestamp, revisionType, enableScalar) => {
      const previousVerificationHash = this.lastRevisionHash
      const validRevisionTypes = ["file", "signature", "witness", "form", "link"]
      if (!validRevisionTypes.includes(revisionType)) {
        console.error(`Invalid revision type: ${revisionType}`)
        process.exit(1)
      }
  
      let verificationData = {
        previous_verification_hash: previousVerificationHash,
        local_timestamp: timestamp,
        revision_type: revisionType,
      }
  
      let fileHash
      switch (revisionType) {
        case "file":
          const fileContent = fs.readFileSync(filename)
          fileHash = main.getHashSum(fileContent)
          checkFileHashAlreadyNotarized(fileHash, this.aquaObject)
          if (enableContent) {
            verificationData["content"] = fileContent.toString("utf8")
          }
          verificationData["file_hash"] = fileHash
          verificationData["file_nonce"] = prepareNonce()
          break
        case "signature":
          const sigData = await prepareSignature(previousVerificationHash)
          verificationData = { ...verificationData, ...sigData }
          break
        case "witness":
          const witness = await prepareWitness(previousVerificationHash)
          verificationData = { ...verificationData, ...witness }
          // verificationData.witness_merkle_proof = JSON.stringify(
          //   verificationData.witness_merkle_proof,
          // )
          break
        case "form":
          let form_data
          try {
            // Read the file
            form_data = fs.readFileSync(form_file_name)
          } catch (readError) {
            // Handle file read errors (e.g., file not found, permission issues)
            console.error(
              "Error: Unable to read the file. Ensure the file exists and is accessible.",
            )
            process.exit(1)
          }
  
          // Calculate the hash of the file
          fileHash = main.getHashSum(form_data)
          checkFileHashAlreadyNotarized(fileHash, this.aquaObject)
          verificationData["file_hash"] = fileHash
          verificationData["file_nonce"] = prepareNonce()
  
          let form_data_json
          try {
            // Attempt to parse the JSON data
            form_data_json = JSON.parse(form_data)
          } catch (parseError) {
            // Handle invalid JSON data
            console.error("Error: The file does not contain valid JSON data.")
            process.exit(1)
          }
  
          // Sort the keys
          let form_data_sorted_keys = Object.keys(form_data_json)
          let form_data_sorted_with_prefix = {}
          for (let key of form_data_sorted_keys) {
            form_data_sorted_with_prefix[`forms_${key}`] = form_data_json[key]
          }
  
          verificationData = {
            ...verificationData,
            ...form_data_sorted_with_prefix,
          }
          break
  
        case "link":
          const linkURIsArray = linkURIs.split(",")
          // Validation
          linkURIsArray.map((uri) => {
            if (!uri.endsWith(".aqua.json")) return
            console.error(`${uri} is an Aqua file hence not applicable`)
            process.exit(1)
          })
          const linkAquaFiles = linkURIsArray.map((e) => `${e}.aqua.json`)
          const linkVHs = linkAquaFiles.map(getLatestVH)
          const linkFileHashes = linkURIsArray.map(main.getFileHashSum)
          // Validation again
          linkFileHashes.map((fh) => {
            if (!(fh in this.aquaObject.file_index)) return
            console.error(
              `${fh} detected in file index. You are not allowed to interlink Aqua files of the same file`,
            )
            process.exit(1)
          })
  
          const linkData = {
            link_type: "aqua",
            link_require_indepth_verification: true,
            link_verification_hashes: linkVHs,
            link_file_hashes: linkFileHashes,
          }
          verificationData = { ...verificationData, ...linkData }
      }
  
      let verificationHash, out
      if (enableScalar) {
        // A simpler version of revision -- scalar
        const scalarData = verificationData //JSON.stringify(verificationData)
        verificationHash = "0x" + main.getHashSum(JSON.stringify(verificationData))
        out =  {
          verification_hash: verificationHash,
          data: scalarData,
        }
      } else {
        // Merklelize the dictionary
        const leaves = main.dict2Leaves(verificationData)
        const tree = new MerkleTree(leaves, main.getHashSum, {
          duplicateOdd: false,
        })
        verificationData.leaves = leaves
        verificationHash = tree.getHexRoot()
        out = {
          verification_hash: verificationHash,
          data: verificationData,
        }
      }
  
      this.lastRevisionHash = verificationHash
      this.aquaObject.revisions[this.lastRevisionHash] = verificationData
      maybeUpdateFileIndex(this.aquaObject, out, revisionType)
      return out
    }
}
// // import { verifyAquaChain, verifyRevision, verifySignature, verifyWitness } from "./AquaProtocol";
// import { generateContentRevision, generateGenesisRevisionUtil, generateScalaRevision, removeLastRevision, verifyAquaChain, verifyRevision } from "./core/revision";
// import { verifySignature } from "./core/signature";
// import { verifyWitness } from "./core/witness";
// import { AquaChainResult, FileData, RevisionAquaChainResult } from "./models/library_models";
// import { AquaChain, ProtocolLogs, Revision } from "./models/protocol_models";

// // export * from "./models/library_models";

// export interface VerificationOptions {
//     version: number;
//     strict?: boolean;
//     allowNull?: boolean;
//     customMessages?: Record<string, string>;
//     alchemyKey: string,
//     doAlchemyKeyLookUp: boolean
// }


// export default class AquaProtocol {

//     private options: VerificationOptions;

//     constructor(options: VerificationOptions = { version: 1.2, alchemyKey: "", doAlchemyKeyLookUp: false }) {


//         this.options = {
//             ...options,
//             strict: false,
//             allowNull: false,
//             customMessages: {},
//         };
//     }


//     public fetchVerificationOptions() {
//         return this.options
//     }


//     public generateGenesisRevision(file_name: string, file_data: string): AquaChainResult {
//         return generateGenesisRevisionUtil(file_name, file_data);
//     }

//     public generateContentRevision(aqua_chain: AquaChain, file_name: string, file_data: string): AquaChainResult {
//         return generateContentRevision(aqua_chain, file_name, file_data);
//     }

//     public generateScalaRevision(aqua_chain: AquaChain): AquaChainResult {
//         return generateScalaRevision(aqua_chain);
//     }

//     public removeLastRevision(aqua_chain: AquaChain): AquaChainResult {
//         return removeLastRevision(aqua_chain);
//     }


//     public verifyRevision(revision: Revision, linkedRevisions: Array<AquaChain>, fileData: Array<FileData>): Promise<RevisionAquaChainResult> {
//         if (this.options.doAlchemyKeyLookUp && this.options.alchemyKey === "") {
//             throw new Error("ALCHEMY KEY NOT SET");
//         }
//         return verifyRevision(revision, linkedRevisions, fileData)

//     }

//     public verifySignature(signature: Revision): Promise<[boolean, ProtocolLogs[]]> {
//         return verifySignature(signature)

//     }

//     public verifyWitness(witness: Revision, verification_hash: string,
//         doVerifyMerkleProof: boolean): Promise<[boolean, ProtocolLogs[]]> {
//         // if (this.options.doAlchemyKeyLookUp && this.options.alchemyKey === "") {
//         //     throw new Error("ALCHEMY KEY NOT SET");
//         // }
//         // witness merkle proof verification is not implemented
//         // its to be improved in future
//         return verifyWitness(witness, false)

//     }



//     public verifyAquaChain(aquaChain: AquaChain, linkedRevisions: Array<AquaChain>, fileData: Array<FileData>): Promise<RevisionAquaChainResult> {
//         // if (this.options.doAlchemyKeyLookUp && this.options.alchemyKey === "") {
//         //     throw new Error("ALCHEMY KEY NOT SET");
//         // }

//         return verifyAquaChain(aquaChain, linkedRevisions, fileData)

//     }
// }

