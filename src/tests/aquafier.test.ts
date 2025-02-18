import { expect, jest } from "@jest/globals";
import Aquafier from "../index";  // Adjust the path based on your structure
import { FileObject, AquaTree, CredentialsData, AquaTreeWrapper } from "../types";
// import fs from "fs/promises"; // Using Node.js promises for file handling
import { mockAquaTreeOnerevision, mockAquaTreeTworevisions } from "./test_revisions";
// import * as credentials from "./../credentials.json"
import { default as credentialsData } from "./../credentials.json";

jest.mock("fs/promises", () => ({
    readFile: jest.fn(),
    writeFile: jest.fn(),
}));

describe("Aquafier", () => {
    let aquafier: Aquafier;

    beforeEach(() => {
        aquafier = new Aquafier();
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("should create a genesis revision", async () => {
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        const result = await aquafier.createGenesisRevision(fileObject);
        expect(result.isOk()).toBe(true);
    });

    test("should verify Genesis Revision", async () => {
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        const result = await aquafier.createGenesisRevision(fileObject);
        expect(result.isOk()).toBe(true);

        if (result.isOk()) {
            const data = result.data

            const verificationResult = await aquafier.verifyAquaTree(data.aquaTree, [fileObject])
            expect(verificationResult.isOk()).toBe(true)
        }
    });

    test("should verify one Revision", async () => {
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        const result = await aquafier.createGenesisRevision(fileObject);
        expect(result.isOk()).toBe(true);

        if (result.isOk()) {
            const data = result.data
            const revisionKeys = Object.keys(data.aquaTree.revisions)
            const revision = data.aquaTree.revisions[revisionKeys[0]]
            const verificationResult = await aquafier.verifyAquaTreeRevision(data.aquaTree, revision, revisionKeys[0], [fileObject])
            expect(verificationResult.isOk()).toBe(true)
        }
    });

    test("should fetch files to be read", () => {
        const mockAquaTree: AquaTree = mockAquaTreeOnerevision

        const result = aquafier.fetchFilesToBeRead(mockAquaTree);
        expect(result).toBeInstanceOf(Array);
    });

    test("should remove one revision", () => {
        const mockAquaTree: AquaTree = mockAquaTreeTworevisions

        const result = aquafier.removeLastRevision(mockAquaTree);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            const data = result.data
            expect(Object.keys(data.aquaTree.revisions).length).toBe(1);
        }
    });

    test("should sign aquatree via cli", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };
        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: fileObject,
            revision: ""
        }

        // const filePath = "./../credentials.json";
        // const content = await fs.readFile(filePath, "utf-8");
        const creds: CredentialsData = credentialsData;

        const result = await aquafier.signAquaTree(aquaTreeWrapper, "cli", creds, true);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            const data = result.data
            expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
        }
    });

    test("should sign aquatree via did", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };
        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: fileObject,
            revision: ""
        }

        // const filePath = "./../credentials.json";
        // const content = await fs.readFile(filePath, "utf-8");
        const creds: CredentialsData = credentialsData;

        const result = await aquafier.signAquaTree(aquaTreeWrapper, "did", creds, true);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            const data = result.data
            expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
        }
    });

    test("should witness aquatree via cli", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

        const creds: CredentialsData = credentialsData;

        const result = await aquafier.witnessAquaTree(mockAquaTree, "eth", "sepolia", "cli", creds,);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            const data = result.data
            expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
        }
    });

    // Uncomment if your IP is not blocked by TSA servers
    // test("should witness aquatree via tsa", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

    //     const creds: CredentialsData = credentialsData;

    //     const result = await aquafier.witnessAquaTree(mockAquaTree, "tsa", "sepolia", "cli", creds, );

    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
    //     }
    // });

    test("should witness aquatree via nostr", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

        const creds: CredentialsData = credentialsData;

        const result = await aquafier.witnessAquaTree(mockAquaTree, "nostr", "sepolia", "cli", creds,);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            const data = result.data
            expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
        }
    });

    test("should link aquatree", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: fileObject,
            revision: ""
        }

        const linkaquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: fileObject,
            revision: ""
        }

        const result = await aquafier.linkAquaTree(aquaTreeWrapper, linkaquaTreeWrapper);
   
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            const data = result.data
            expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
        }
    });

    // test("should read file content correctly", async () => {
    //     // Mock `fs.promises.readFile` to return fake content
    //     // (fs.readFile as jest.Mock).mockResolvedValue("Mock file content");

    //     const filePath = "/fake/path/test.txt";
    //     const content = await fs.readFile(filePath, "utf-8");

    //     expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
    //     expect(content).toBe("Mock file content");
    // });

    // test("should handle missing files gracefully", async () => {
    //     // Mock `fs.readFile` to throw an error when file doesn't exist
    //     // (fs.readFile as jest.Mock).mockRejectedValue(new Error("File not found"));

    //     const filePath = "/fake/path/nonexistent.txt";

    //     try {
    //         await fs.readFile(filePath, "utf-8");
    //     } catch (error: any) {
    //         expect(error.message).toBe("File not found");
    //     }
    // });

    // test("should write file content correctly", async () => {
    //     const filePath = "/fake/path/test.txt";
    //     const fileContent = "New content";

    //     await fs.writeFile(filePath, fileContent, "utf-8");

    //     expect(fs.writeFile).toHaveBeenCalledWith(filePath, fileContent, "utf-8");
    // });

    // test("should generate correct revision hashes", async () => {
    //     const fileObject: FileObject = {
    //         fileName: "test.txt",
    //         fileContent: "Sample content",
    //         path: "/fake/path/test.txt"
    //     };

    //     const revision = await aquafier.createGenesisRevision(fileObject);
    //     expect(revision.isOk()).toBe(true);
    //     expect(revision.unwrap().hash).toBeDefined();
    // });
});
