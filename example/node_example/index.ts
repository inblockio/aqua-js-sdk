

import * as fs from "fs"

import Aquafier, { AquaTree, FileObject, notarize } from "aquafier-js-sdk"
import { sign } from "crypto";

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


let aquafier = new Aquafier()

// let aquaTree = readAquaFile("./README.md.aqua.json")
let testFileContent = readFile("./test.txt")

let aquaFileObject: FileObject = {
    fileName: "text.txt",
    fileContent: testFileContent ?? "",
    path: "./text.txt"
}

// let newAquaTree = aquafier.createGenesisRevision(aquaFileObject)

let newAquaTree = notarize(aquaFileObject).then((val) => sign(val));

// console.log(newAquaTree)






// import { greet,CredentialsData } from 'aqua-protocol';

// let cred : CredentialsData = {
//     "did:key":"abc",
//     alchemy_key:"",mnemonic:"",
//     nostr_sk:"", witness_eth_network:"",
//     witness_eth_platform:""
// }
// console.log(`data is ${JSON.stringify(cred)}`);
