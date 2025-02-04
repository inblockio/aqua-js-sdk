// import { verifyAquaChain, verifyRevision, verifySignature, verifyWitness } from "./AquaProtocol";
import { generateContentRevision, generateGenesisRevisionUtil, generateScalaRevision, removeLastRevision, verifyAquaChain, verifyRevision } from "./core/revision";
import { verifySignature } from "./core/signature";
import { verifyWitness } from "./core/witness";
import { AquaChainResult, FileData, RevisionAquaChainResult } from "./models/library_models";
import { AquaChain, ProtocolLogs, Revision } from "./models/protocol_models";

export * from "./models/library_models";

export interface VerificationOptions {
    version: number;
    strict?: boolean;
    allowNull?: boolean;
    customMessages?: Record<string, string>;
    alchemyKey: string,
    doAlchemyKeyLookUp: boolean
}


export default class AquaProtocol {

    private options: VerificationOptions;

    constructor(options: VerificationOptions = { version: 1.2, alchemyKey: "", doAlchemyKeyLookUp: false }) {


        this.options = {
            ...options,
            strict: false,
            allowNull: false,
            customMessages: {},
        };
    }


    public fetchVerificationOptions() {
        return this.options
    }


    public generateGenesisRevision(file_name: string, file_data: string): AquaChainResult {
        return generateGenesisRevisionUtil(file_name, file_data);
    }

    public generateContentRevision(aqua_chain: AquaChain, file_name: string, file_data: string): AquaChainResult {
        return generateContentRevision(aqua_chain, file_name, file_data);
    }

    public generateScalaRevision(aqua_chain: AquaChain): AquaChainResult {
        return generateScalaRevision(aqua_chain);
    }

    public removeLastRevision(aqua_chain: AquaChain): AquaChainResult {
        return removeLastRevision(aqua_chain);
    }


    public verifyRevision(revision: Revision, linkedRevisions: Array<AquaChain>, fileData: Array<FileData>): Promise<RevisionAquaChainResult> {
        if (this.options.doAlchemyKeyLookUp && this.options.alchemyKey === "") {
            throw new Error("ALCHEMY KEY NOT SET");
        }
        return verifyRevision(revision, linkedRevisions, fileData)

    }

    public verifySignature(signature: Revision): Promise<[boolean, ProtocolLogs[]]> {
        return verifySignature(signature)

    }

    public verifyWitness(witness: Revision, verification_hash: string,
        doVerifyMerkleProof: boolean): Promise<[boolean, ProtocolLogs[]]> {
        // if (this.options.doAlchemyKeyLookUp && this.options.alchemyKey === "") {
        //     throw new Error("ALCHEMY KEY NOT SET");
        // }
        // witness merkle proof verification is not implemented
        // its to be improved in future
        return verifyWitness(witness, false)

    }



    public verifyAquaChain(aquaChain: AquaChain, linkedRevisions: Array<AquaChain>, fileData: Array<FileData>): Promise<RevisionAquaChainResult> {
        // if (this.options.doAlchemyKeyLookUp && this.options.alchemyKey === "") {
        //     throw new Error("ALCHEMY KEY NOT SET");
        // }

        return verifyAquaChain(aquaChain, linkedRevisions, fileData)

    }
}

