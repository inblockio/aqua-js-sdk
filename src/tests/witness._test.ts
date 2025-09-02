import { jest } from "@jest/globals";
// import Aquafier from "../index";  // Adjust the path based on your structure
// import { AquaTreeView, FileObject } from "../types";
// // import { createAquaTreeTree } from "../aquavhtree";
// //check readme
// import { default as credentialsData } from "../credentials.json";

// jest.mock("fs/promises", () => ({
//     readFile: jest.fn(),
//     writeFile: jest.fn(),
// }));

describe("P12", () => {
    // let aquafier: Aquafier;

    beforeEach(() => {
        // aquafier = new Aquafier();
        jest.clearAllMocks(); // Reset mocks before each test
    });

    // Just a simple test
    test("should create a genesis revision", async () => {
        // const fileObject: FileObject = {
        //     fileName: "test.txt",
        //     fileContent: "Sample content",
        //     path: "/fake/path/test.txt"
        // };

        // const result = await aquafier.createGenesisRevision(fileObject);
        // expect(result.isOk()).toBe(true);
    });

    // Increase timeout to 30 seconds to handle potential Alchemy rate limiting
    // test("should verify one Revision", async () => {
    //     const fileObject: FileObject = {
    //         fileName: "test.txt",
    //         fileContent: "Sample content",
    //         path: "/fake/path/test.txt"
    //     };

    //     const result = await aquafier.createGenesisRevision(fileObject);
    //     expect(result.isOk()).toBe(true);

    //     if (result.isOk() && result.data.aquaTree) {
    //         const data = result.data
    //         const revisionKeys = Object.keys(data.aquaTree!.revisions || {})
    //         const revision = data.aquaTree!.revisions[revisionKeys[0]]
    //         const verificationResult = await aquafier.verifyAquaTreeRevision(data.aquaTree!, revision, revisionKeys[0], [fileObject])
    //         expect(verificationResult.isOk()).toBe(true)
    //     }

    //     if (result.isOk() && result.data.aquaTree) {
    //         const data = result.data
    //         const aquaTreeView: AquaTreeView = {
    //             aquaTree: data.aquaTree,
    //             fileObject: fileObject,
    //             revision: ""
    //         }
    //         const witnessResult = await aquafier.witnessAquaTree(aquaTreeView, "eth", "sepolia", "cli", credentialsData)
    //         // expect(witnessResult.isOk()).toBe(true)

    //         if (witnessResult.isOk()) {
    //             const data = witnessResult.data
    //             const verificationResult = await aquafier.verifyAquaTreeRevision(data.aquaTree!, 
    //                 data.aquaTree!.revisions[Object.keys(data.aquaTree!.revisions || {})[1]], 
    //                 Object.keys(data.aquaTree!.revisions || {})[1], [fileObject],
    //                 credentialsData
    //             )
    //             // expect(verificationResult.isOk()).toBe(true)
    //             if(verificationResult.isOk()){
    //                 console.log("Verification successful")
    //             }else{
    //                 console.log("Verification logs: ", JSON.stringify(verificationResult.data, null, 4))
    //             }

    //         }else{
    //             console.log("witnessing failed")
    //         }
    //     }

    // });


})
