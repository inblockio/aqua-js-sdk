
import { greet } from 'aqua-protocol';

console.log(greet('John'));


// import * as fs from "fs"

// import AquaTree, { AquaObject, FileObject } from "aqua-protocol"

// function readAquaFile(aquaFilePath: string): AquaObject | null {
//     try {
//         // Read the file synchronously
//         const fileContent = fs.readFileSync(aquaFilePath, { encoding: "utf-8" });

//         // Parse the file content as JSON
//         const aquaObject: AquaObject = JSON.parse(fileContent);

//         // Return the parsed object
//         return aquaObject;
//     } catch (error) {
//         // Handle errors (e.g., file not found, invalid JSON)
//         console.error(`Error reading or parsing the file at ${aquaFilePath}:`, error);
//         return null; // Return null or throw an error, depending on your use case
//     }
// }


// function readFile(aquaFilePath: string): string | null {
//     try {
//         // Read the file synchronously
//         const fileContent = fs.readFileSync(aquaFilePath, { encoding: "utf-8" });

//         // Return the parsed object
//         return fileContent;
//     } catch (error) {
//         // Handle errors (e.g., file not found, invalid JSON)
//         console.error(`Error reading or parsing the file at ${aquaFilePath}:`, error);
//         return null; // Return null or throw an error, depending on your use case
//     }
// }

// let aquaTree = new AquaTree()

// // let aquaObject = readAquaFile("./README.md.aqua.json")
// let testFileContent = readFile("./test.txt")

// let aquaFileObject: FileObject = {
//     fileName: "text.txt",
//     fileContent: testFileContent ?? "",
//     path: "./text.txt"
// }

// // let newAquaObject = aquaTree.createGenesisRevision(aquaFileObject)

// // console.log(newAquaObject)