import { jest } from "@jest/globals";
// import Aquafier from "../index";  // Adjust the path based on your structure
// import { AquaTree, CredentialsData, FileObject } from "../types";
// import { mockAquaTreeThreeRevisionsP12 } from "./test_revisions";
// import fs from "fs";
// // import { createAquaTreeTree } from "../aquavhtree";
// //check readme
// import { default as credentialsData } from "./../credentials.json";

jest.mock("fs/promises", () => ({
    readFile: jest.fn(),
    writeFile: jest.fn(),
}));

describe("P12", () => {
    // let aquafier: Aquafier;

    beforeEach(() => {
        // aquafier = new Aquafier();
        jest.clearAllMocks(); // Reset mocks before each test
    });

    // Just a simple test
    test("should create a p12 aquatree", async () => {
        // const fileObject: FileObject = {
        //     fileName: "test.txt",
        //     fileContent: "Sample content",
        //     path: "/fake/path/test.txt"
        // };

        // const result = await aquafier.createGenesisRevision(fileObject);
        // expect(result.isOk()).toBe(true);
    });

    // test("should sign a revision using p12", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeTworevisionsReArranged)

    //     const aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: {
    //             fileName: "test.txt",
    //             fileContent: "",
    //             path: "/fake/path/test.txt"
    //         },
    //         revision: ""
    //     }
    //     const certPath = "/home/dalmas/E/blockchain/aqua_protocol_v2/aqua-js-sdk/src/tests/myCert.p12"
    //     const certContent = fs.readFileSync(certPath)
    //     const certStringContent = certContent.toString('binary')
    //     const creds: CredentialsData = credentialsData;
    //     creds.p12_content = certStringContent
    //     creds.p12_password = "StrongPass!"

    //     const result = await aquafier.signAquaTree(aquaTreeWrapper, "p12", creds, true);

    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree!.revisions).length).toBe(3);
    //     }
    // });

    test("should verify p12 aquatree", async () => {
        // const mockAquaTree: AquaTree = structuredClone(mockAquaTreeThreeRevisionsP12)

        // const fileObject: FileObject = {
        //     fileName: "sample.txt",
        //     fileContent: "Sample content",
        //     path: "/fake/path/sample.txt"
        // };

        // console.log(JSON.stringify(mockAquaTree, null, 4))
        // const certPath = "/home/dalmas/E/blockchain/aqua_protocol_v2/aqua-js-sdk/src/tests/myCert.p12"
        // const certContent = fs.readFileSync(certPath)
        // const certStringContent = certContent.toString('binary')
        // const creds: CredentialsData = credentialsData;
        // creds.p12_content = certStringContent
        // creds.p12_password = "StrongPass!"

        // // const result = await aquafier.verifyAquaTree(mockAquaTree, [fileObject], creds);
        // const revisionHash = Object.keys(mockAquaTree.revisions)[2]
        // console.log("Revision hash here: ", revisionHash)
        // const result = await aquafier.verifyAquaTreeRevision(mockAquaTree, mockAquaTree.revisions[revisionHash], revisionHash, [fileObject], creds);

        // if(result.isOk()) {
        //     const data = result.data
        //     expect(Object.keys(data.aquaTree!.revisions).length).toBe(3);
        //     console.log("Succesful logs: ", data.logData)
        // }else{
        //     console.log("Verification results: ", result.data)
        // }

        // expect(result.isOk()).toBe(true);
        // if (result.isOk()) {
        //     const data = result.data
        //     expect(Object.keys(data.aquaTree!.revisions).length).toBe(3);
        // }
    });

})
