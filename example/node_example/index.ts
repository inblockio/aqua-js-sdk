

import * as fs from "fs"

import Aquafier, { AquaTree, FileObject, AquafierChainable, printLogs, isOk, AquaTreeWrapper } from "aquafier-js-sdk"





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
    fileContent: testFileContent ?? "",
    path: "./text.txt"
}

let creds = JSON.parse(readFile("credentials.json") ?? "")

async function chainExample() {

    // const result = await new AquafierChainable(null).notarize(aquaFileObject)
    //     .then(chain => chain.sign())
    //     .then(chain => chain.witness())
    //     .then(chain => chain.verify([aquaFileObject]))
    //     .then(chain => {
    //         let aquaTree = chain.getValue()
    //         writeAquaFile('test.aqua.json', aquaTree)
    //         return chain
    //     })
    //     .then(chain => chain.getVerificationValue())
    //     .catch(error => console.log(`An error occured ${error}`))

    // console.log("================= Result ==================")
    // console.log(JSON.stringify(result, null, 4))
    // if (result!.isOk()) {
    //     printLogs(result.data.logData, true)
    // }
    // else {
    //     console.log("Some weird error occured!")
    // }
};

async function chainExampleWithMultipleParameters() {

    // (await (await new AquafierChainable(null).notarize(aquaFileObject)).sign()).witness()

    const aqt = await new AquafierChainable(null).notarize(aquaFileObject);
    // await result.sign()
    // await result.witness()
    // await result.witness()

    await aqt.sign("cli", creds);
    await aqt.witness("eth", "sepolia", "metamask", creds);
    await aqt.sign("cli", creds);

    let result = aqt.getValue();

    console.log(JSON.stringify(result, null, 4));
    // const result = await new AquafierChainable(null).notarize(aquaFileObject)
    //     .then(chain => chain.sign("cli", creds))
    //     .then(chain => chain.sign("did", creds))
    //     // .then(chain => chain.sign("metamask", creds))
    //     .then(chain => chain.witness('eth', 'sepolia', 'cli', creds))
    //     // .then(chain => chain.witness('nostr', 'sepolia', 'cli', creds))
    //     // .then(chain => chain.witness('tsa', 'sepolia', 'cli', creds))
    //     // .then(chain => chain.witness('eth', 'sepolia', 'metamask', creds))
    //     // .then(chain => chain.witness('eth', 'holesky', 'metamask', creds))
    //     .then(chain => chain.verify([aquaFileObject]))
    //     .then(chain => {
    //         let aquaTree = chain.getValue()
    //         writeAquaFile('test_complete.aqua.json', aquaTree)
    //         return chain
    //     })
    //     .then(chain => chain.getVerificationValue())
    //     .catch(error => console.log(`An error occured ${error}`))

    // const result = await new AquafierChainable(null).notarize(aquaFileObject).si
    // .then(chain => chain.sign("cli", creds))
    // .then(chain => chain.sign("did", creds))
    // // .then(chain => chain.sign("metamask", creds))
    // .then(chain => chain.witness('eth', 'sepolia', 'cli', creds))
    // // .then(chain => chain.witness('nostr', 'sepolia', 'cli', creds))
    // // .then(chain => chain.witness('tsa', 'sepolia', 'cli', creds))
    // // .then(chain => chain.witness('eth', 'sepolia', 'metamask', creds))
    // // .then(chain => chain.witness('eth', 'holesky', 'metamask', creds))
    // .then(chain => chain.verify([aquaFileObject]))
    // .then(chain => {
    //     let aquaTree = chain.getValue()
    //     writeAquaFile('test_complete.aqua.json', aquaTree)
    //     return chain
    // })
    // .then(chain => chain.getVerificationValue())
    // .catch(error => console.log(`An error occured ${error}`))

    // console.log("================= Result ==================")
    // console.log(JSON.stringify(result, null, 4))
    // if (result!.isOk()) {
    //     printLogs(result.data.logData, true)
    // }
    // else {
    //     console.log("Some weird error occured!")
    // }


    // let aquafier = new Aquafier()
    // let aquaTree = await aquafier.createGenesisRevision(aquaFileObject)
    // if (isOk(aquaTree)) {
    //     let aquaTreeResult = aquaTree.data.aquaTree
    //     let aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: aquaTreeResult,
    //         fileObject: aquaFileObject,
    //         revision: ""
    //     }
    //     let signResult = await aquafier.signAquaTree(aquaTreeWrapper, "cli", creds)
    // }
};

chainExampleWithMultipleParameters()
// chainExample();
