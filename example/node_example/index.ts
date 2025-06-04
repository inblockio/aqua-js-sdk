

import * as fs from "fs"

import Aquafier, { AquaTree, FileObject, AquafierChainable, printLogs, isOk, AquaTreeWrapper, CredentialsData } from "aquafier-js-sdk"





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



// let aquaTree = readAquaFile("./README.md.aqua.json")
let testFileContent = readFile("./test.txt")

let aquaFileObject: FileObject = {
    fileName: "text.txt",
    fileContent: testFileContent ?  testFileContent : "",
    path: "./text.txt"
}

let creds : CredentialsData  = {
    "did_key":"",
    alchemy_key:"",
    mnemonic:"",
    nostr_sk:"",
    witness_eth_network:"sepolia",
    witness_method:"metmask",
}

if (fs.existsSync("credentials.json")) {
    creds = JSON.parse(readFile("credentials.json")!!)
}


async function chainExampleWithMultipleParameters() {
    const aqt = await new AquafierChainable(null).notarize(aquaFileObject);
    // await result.sign()
    // await result.witness()
    // await result.witness()

    await aqt.sign("cli", creds);
    await aqt.witness("eth", "sepolia", "metamask", creds);
    await aqt.sign("cli", creds);

    let result = aqt.getValue();

};

// chainExampleWithMultipleParameters()


// async function displayGraphTree(){
//     let aquafier = new Aquafier()
//     let genesisRevisionResult = await aquafier.createGenesisRevision(aquaFileObject)
//     if(genesisRevisionResult.isOk()){
//         let signedResult = await aquafier.signAquaTree(genesisRevisionResult.data.aquaTree!!, "cli", creds, true)
//         let graphData = await aquafier.verifyAndGetGraphData(genesisRevisionResult.data.aquaTree!!, [aquaFileObject])
//         if(graphData.isOk()){
//             console.log("Successful result: \n", JSON.stringify(graphData.data, null, 4))
//         }else{
//             console.log("Failed graph data: \n", JSON.stringify(graphData.data, null, 4))
//         }
//     }
// }

// displayGraphTree()
