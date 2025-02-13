

import * as fs from "fs"

import Aquafier, { AquaTree, FileObject, AquafierChainable, printLogs } from "aquafier-js-sdk"





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


let aquafier = new Aquafier()

// let aquaTree = readAquaFile("./README.md.aqua.json")
let testFileContent = readFile("./test.txt")

let aquaFileObject: FileObject = {
    fileName: "text.txt",
    fileContent: testFileContent ?? "",
    path: "./text.txt"
}

let creds = {
    "mnemonic": "mail ignore situate guard glove physical gaze scale they trouble chunk sock",
    "nostr_sk": "bab92dda770b41ffb8afa623198344f44950b5b9c3e83f6b36ad08977b783d55",
    "did:key": "2edfed1830e9db59438c65b63a85c73a1aea467e8a84270d242025632e04bb65",
    "alchemy_key": "ZaQtnup49WhU7fxrujVpkFdRz4JaFRtZ",
    "witness_eth_network": "sepolia",
    "witness_eth_platform": "metamask"
}


async function chainExample() {

    const result = await new AquafierChainable(null).notarize(aquaFileObject)
        .then(chain => chain.sign())
        .then(chain => chain.witness())
        .then(chain => chain.verify([aquaFileObject]))
        .then(chain => {
            let aquaTree = chain.getValue()
            writeAquaFile('test.aqua.json', aquaTree)
            return chain
        })
        .then(chain => chain.getVerificationValue())
        .catch(error => console.log(`An error occured ${error}`))

    console.log("================= Result ==================")
    console.log(JSON.stringify(result, null, 4))
    if (result!.isOk()) {
        printLogs(result.data.logData, true)
    }
    else {
        console.log("Some weird error occured!")
    }
};

async function chainExampleWithMultipleParameters() {

    const result = await new AquafierChainable(null).notarize(aquaFileObject)
        .then(chain => chain.sign("cli", creds))
        .then(chain => chain.sign("metamask", creds))
        .then(chain => chain.witness('eth', 'sepolia', 'cli', creds))
        .then(chain => chain.witness('eth', 'sepolia', 'metamask', creds))
        .then(chain => chain.witness('eth', 'holesky', 'metamask', creds))
        .then(chain => chain.verify([aquaFileObject]))
        .then(chain => {
            let aquaTree = chain.getValue()
            writeAquaFile('test_complete.aqua.json', aquaTree)
            return chain
        })
        .then(chain => chain.getVerificationValue())
        .catch(error => console.log(`An error occured ${error}`))

    console.log("================= Result ==================")
    console.log(JSON.stringify(result, null, 4))
    if (result!.isOk()) {
        printLogs(result.data.logData, true)
    }
    else {
        console.log("Some weird error occured!")
    }
};

chainExampleWithMultipleParameters()
chainExample();
