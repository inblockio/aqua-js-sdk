// import * as fs from "fs"
import * as asn1js from "asn1js"
import * as pkijs from "pkijs"
import {getHashSum}  from "../utils"
// import { createHash } from "node:crypto"



/**
 * Handles Time Stamp Authority (TSA) witnessing operations for Aqua Protocol
 * 
 * This class provides functionality to create and verify timestamps using
 * a Time Stamp Authority service (e.g., DigiCert TSA). It implements the
 * Time-Stamp Protocol (TSP) as defined in RFC 3161 using ASN.1 encoding.
 */
export class WitnessTSA {
  /**
 * Converts ISO date to Unix timestamp
 * 
 * @param t - Date object or ISO date string
 * @returns Unix timestamp (seconds since epoch)
 * 
 * This method normalizes dates to Unix timestamps for
 * consistent timestamp handling across the system.
 */
isoDate2unix = (t: Date | string): number => {
    const date = t instanceof Date ? t : new Date(t)
    return Math.floor(date.getTime() / 1000)
  }

  /**
 * Extracts generation time from TSA response
 * 
 * @param resp - TSA response object
 * @returns Unix timestamp of when TSA generated the timestamp
 * 
 * This method:
 * - Extracts signed data from TSA response
 * - Parses TSTInfo structure
 * - Converts TSA generation time to Unix timestamp
 */
extractGenTimeFromResp = (resp: pkijs.TimeStampResp): number => {
    const signedData = new pkijs.SignedData({
      schema: resp?.timeStampToken?.content,
    })
    const tstInfoAsn1 = asn1js.fromBER(
      signedData.encapContentInfo.eContent!!.valueBlock.valueHexView,
    )
    const tstInfo = new pkijs.TSTInfo({ schema: tstInfoAsn1.result })
    return this.isoDate2unix(tstInfo.genTime)
  }

  /**
 * Creates a timestamp request and submits to TSA
 * 
 * @param hash - Hash to be timestamped
 * @param tsaUrl - URL of the Time Stamp Authority service
 * @returns Promise resolving to [base64 response, provider name, timestamp]
 * 
 * This method:
 * - Creates SHA-256 hash of input
 * - Constructs TSP request according to RFC 3161
 * - Submits request to TSA service
 * - Validates TSA response
 * - Returns encoded response and timestamp
 */
witness = async (hash: string, tsaUrl: string): Promise<[string, string, number]> => {
    // console.log("Hash before: ", hash)
    // DigiCert only supports up to SHA256
    const hashHex = getHashSum(hash) //createHash("sha256").update(hash).digest("hex")
    const hashBuffer = Uint8Array.from(Buffer.from(hashHex, "hex")) // Convert hex to ArrayBuffer
    // console.log("Hash buffer: ", hashBuffer)

    const tspReq = new pkijs.TimeStampReq({
      version: 1,
      messageImprint: new pkijs.MessageImprint({
        hashAlgorithm: new pkijs.AlgorithmIdentifier({
          algorithmId: "2.16.840.1.101.3.4.2.1", // OID for SHA2-256
        }),
        hashedMessage: new asn1js.OctetString({ valueHex: hashBuffer.buffer }),
      }),
      nonce: new asn1js.Integer({ value: Date.now() }),
      certReq: true,
    })

    // console.log("TSA Request: ", tspReq)

    // Encode the TimeStampReq to DER format
    const tspReqSchema = tspReq.toSchema()
    const tspReqBuffer = tspReqSchema.toBER(false)

    // console.log("TSA Request 1: ", tspReqSchema)
    // console.log("TSA Request 2: ", tspReqBuffer)

    const response = await fetch(tsaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/timestamp-query",
      },
      body: tspReqBuffer,
    })

    const tspResponseBuffer = await response.arrayBuffer()

    const tspResponseAsn1 = asn1js.fromBER(tspResponseBuffer)
    const tspResponse = new pkijs.TimeStampResp({
      schema: tspResponseAsn1.result,
    })

    if (tspResponse.status.status !== 0) {
      throw new Error("TSA response is invalid. Failed to witness")
    }

    const base64EncodedResp = Buffer.from(tspResponseBuffer).toString("base64")
    const witnessTimestamp = this.extractGenTimeFromResp(tspResponse)

    return [base64EncodedResp, "DigiCert", witnessTimestamp]
  }

  /**
 * Verifies a TSA timestamp response
 * 
 * @param transactionHash - Base64 encoded TSA response
 * @param expectedMR - Expected Merkle root hash
 * @param expectedTimestamp - Expected timestamp
 * @returns Promise resolving to boolean indicating verification success
 * 
 * This method:
 * - Decodes TSA response
 * - Verifies timestamp matches expected time
 * - Verifies hashed content matches expected Merkle root
 * - Uses SHA-256 for hash verification
 */
verify = async (
    transactionHash: string,
    expectedMR: string,
    expectedTimestamp: number
  ): Promise<boolean> => {
    
    const tspResponseBuffer = Buffer.from(transactionHash, "base64")
    const tspResponseAsn1 = asn1js.fromBER(tspResponseBuffer)
    const tspResponse = new pkijs.TimeStampResp({
      schema: tspResponseAsn1.result,
    })

    const signedData = new pkijs.SignedData({
      schema: tspResponse.timeStampToken!!.content,
    })
    const tstInfoAsn1 = asn1js.fromBER(
      signedData.encapContentInfo.eContent!!.valueBlock.valueHexView,
    )
    const tstInfo = new pkijs.TSTInfo({ schema: tstInfoAsn1.result })

    if (this.isoDate2unix(tstInfo.genTime) !== expectedTimestamp) {
      return false
    }

    // Verifying the content itself
    const hashHex = getHashSum(expectedMR);//createHash("sha256").update(expectedMR).digest("hex")

    const messageImprintHash = Buffer.from(
      tstInfo.messageImprint.hashedMessage.valueBlock.valueHexView,
    ).toString("hex")
    return messageImprintHash === hashHex
  }

}