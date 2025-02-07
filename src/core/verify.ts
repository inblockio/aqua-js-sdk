import { Result, Err, Ok } from "rustic";
import { Revision, AquaOperationData, LogData, AquaObject } from "../types";


export async function verifyAquaObjectUtil(aquaObject: AquaObject): Promise<Result<AquaOperationData, LogData[]>> {
    let logs: Array<LogData> = [];

    let verificationHashes = Object.keys(aquaObject.revisions)
    console.log("Page Verification Hashes: ", verificationHashes)

    for (let revisionItemHash in verificationHashes) {
        let revision :  Revision = aquaObject.revisions[revisionItemHash]
        // We use fast scalar verification if input does not have leaves property
        const isScalar = !revision.hasOwnProperty('leaves');


        let result = await verifyRevision(revision,isScalar);

        result[1].forEach((e)=>logs.push(e))
        if (!result){
            
            return Err(logs);
            
        }
     
        

    }
    let data : AquaOperationData = {
        aquaObject: aquaObject,
        aquaObjects: null,
        logData: logs
    }

    return Ok(data);
}

async function verifyRevision(revision:Revision, isScalar : boolean) : Promise<[boolean, Array<LogData> ]> {
    
    if (isScalar) {
        console.log("We should see me  input " + JSON.stringify(input));
    
        result.scalar = true
    
        if (input.witness_merkle_proof && input.witness_merkle_proof.length > 1) {
          console.log("@@@ Verifying merkle proof...");
          [ok, result] = verifyRevisionMerkleTreeStructure(input, result, verificationHash)
          if (!ok) {
            return [ok, result]
          }
        } else {
          const actualVH = "0x" + getHashSum(JSON.stringify(input))
          ok = actualVH === verificationHash
        }
        console.log("\n Okay is ok " + ok)
      } else {
        console.log("###Verifying merkle proof...");
        [ok, result] = verifyRevisionMerkleTreeStructure(input, result, verificationHash)
        if (!ok) {
          return [ok, result]
        }
      }
    
      let typeOk: boolean, _
      switch (input.revision_type) {
        case "form":
          typeOk = true;
          break
        case "file":
          let fileContent: Buffer
          if (!!input.content) {
            fileContent = Buffer.from(input.content, "utf8")
          } else {
            console.log("File index", JSON.stringify(aquaObject.file_index));
            console.log("Has needed  ", verificationHash);
            fileContent = fs.readFileSync(aquaObject.file_index[verificationHash])
          }
          const fileHash = getHashSum(fileContent)
          typeOk = fileHash === input.file_hash
          break
        case "signature":
          // Verify signature
          [typeOk, _] = await verifySignature(
            input,
            input.previous_verification_hash,
          )
          break
        case "witness":
          // Verify witness
          const [witnessStatus, witnessResult] = await verifyWitness(
            input,
            input.previous_verification_hash,
            doVerifyMerkleProof,
          )
          result.witness_result = witnessResult
    
          // Specify witness correctness
          typeOk = (witnessStatus === "VALID")
          break
        case "link":
          let linkOk: boolean = true
          for (const [idx, vh] of input.link_verification_hashes.entries()) {
            // const fileUri = getUnixPathFromAquaPath(aquaObject.file_index[fileHash])
            const fileUri = aquaObject.file_index[vh];
            const aquaFileUri = `${fileUri}.aqua.json`
            const linkAquaObject = await readExportFile(aquaFileUri)
            let linkStatus: string
            [linkStatus, _] = await verifyPage(linkAquaObject, false, doVerifyMerkleProof)
            const expectedVH = input.link_verification_hashes[idx]
            const linkVerificationHashes = Object.keys(linkAquaObject.revisions)
            const actualVH = linkVerificationHashes[linkVerificationHashes.length - 1]
            linkOk = linkOk && (linkStatus === VERIFIED_VERIFICATION_STATUS) && (expectedVH == actualVH)
          }
          typeOk = linkOk
          break
      }
      result.status.type_ok = typeOk ? "valid" : "invalid"
      result.status.verification = ok ? VERIFIED_VERIFICATION_STATUS : INVALID_VERIFICATION_STATUS
    
}