

import * as fs from "fs"
import * as dotenv from "dotenv"
dotenv.config()

import Aquafier, { FileObject, AquaTreeWrapper, CredentialsData, Result, AquaOperationData, LogData, OkResult, AquaTree } from "aqua-js-sdk";




// let aquaTree = readAquaFile("./README.md.aqua.json")
let testFileContent = readFile("./test.txt")

let aquaFileObject: FileObject = {
    fileName: "text.txt",
    fileContent: testFileContent ? testFileContent : "",
    path: "./text.txt"
}

let creds: CredentialsData = {
    did_key: "",
    alchemy_key: process.env.ALCHEMY_KEY || "",
    mnemonic: "",
    nostr_sk: "",
    witness_eth_network: "sepolia",
    witness_method: "metmask",
}

if (fs.existsSync("credentials.json")) {
    creds = JSON.parse(readFile("credentials.json")!!)
}


async function main() {
    


    let aquafier = new Aquafier();
    let genesisRevisionResult = await aquafier.createGenesisRevision(aquaFileObject);
    if (genesisRevisionResult.isOk()) {

        console.log("Genesis revision successful: \n", JSON.stringify(genesisRevisionResult.data, null, 4));
        let aqua_wrapper: AquaTreeWrapper = {
            aquaTree: genesisRevisionResult.data.aquaTree!!,
            fileObject: aquaFileObject,
            revision: "",
        };
        let signedResult = await aquafier.signAquaTree(aqua_wrapper, "metamask", creds, true);

        if (signedResult.isOk()) {

            console.log("Signing successful: \n", JSON.stringify(signedResult.data, null, 4));

            let aqua_wrapper_2: AquaTreeWrapper = {
                aquaTree: genesisRevisionResult.data.aquaTree!!,
                fileObject: aquaFileObject,
                revision: "",
            };

            let witnessResult = await aquafier.witnessAquaTree(aqua_wrapper_2, "eth", "sepolia", "metamask", creds, true);

            if (witnessResult.isOk()) {

                console.log("Witnessing successful: \n", JSON.stringify(witnessResult.data, null, 4));

                // Verify and get graph data
                let graphData = await aquafier.verifyAndGetGraphData(witnessResult.data.aquaTree!!, [aquaFileObject],
                    creds
                );

                if (graphData.isOk()) {
                    console.log("Successful result: \n", JSON.stringify(graphData.data, null, 4));
                }
                else {
                    console.log("Failed graph data: \n", JSON.stringify(graphData.data, null, 4));
                }
            } else {
                console.log("Witnessing failed: \n", JSON.stringify(witnessResult.data, null, 4));
            }
        } else {
            console.log("Signing failed: \n", JSON.stringify(signedResult.data, null, 4));
        }

    } else {
        console.log("Genesis revision failed: \n", JSON.stringify(genesisRevisionResult.data, null, 4));
    }

};


// Call the main function to execute the script
main()


function readAquaFile(aquaFilePath: string): AquaTree | null {
    try {
        // Read the file synchronously
        const fileContent = fs.readFileSync(aquaFilePath, { encoding: "utf-8" });

        // Parse the file content as JSON
        const aquaTree: AquaTree = JSON.parse(fileContent);

        // Return the parsed object
        return aquaTree;
    } catch (error) {
        // Handle errors (e.g., file not found, invalid JSON)
        console.error(`Error reading or parsing the file at ${aquaFilePath}:`, error);
        return null; // Return null or throw an error, depending on your use case
    }
}


function writeAquaFile(aquaFilePath: string, aquaTree: AquaTree): AquaTree | null {
    try {
        // Read the file synchronously
        const fileContent = fs.writeFileSync(aquaFilePath, JSON.stringify(aquaTree, null, 4), { encoding: "utf-8" });

        // Return the parsed object
        return aquaTree;
    } catch (error) {
        // Handle errors (e.g., file not found, invalid JSON)
        console.error(`Error reading or parsing the file at ${aquaFilePath}:`, error);
        return null; // Return null or throw an error, depending on your use case
    }
}


function readFile(aquaFilePath: string): string | null {
    try {
        // Read the file synchronously
        const fileContent = fs.readFileSync(aquaFilePath, { encoding: "utf-8" });

        // Return the parsed object
        return fileContent;
    } catch (error) {
        // Handle errors (e.g., file not found, invalid JSON)
        console.error(`Error reading or parsing the file at ${aquaFilePath}:`, error);
        return null; // Return null or throw an error, depending on your use case
    }
}

