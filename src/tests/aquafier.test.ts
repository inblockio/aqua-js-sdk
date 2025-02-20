import { expect, jest } from "@jest/globals";
import Aquafier from "../index";  // Adjust the path based on your structure
import { FileObject, AquaTree, CredentialsData, AquaTreeWrapper } from "../types";
import { mockAquaTreeOnerevision, mockAquaTreeTworevisions } from "./test_revisions";
//check readme
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

        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: undefined,
            revision: ""
        }
        const creds: CredentialsData = credentialsData;

        const result = await aquafier.witnessAquaTree(aquaTreeWrapper, "eth", "sepolia", "cli", creds,);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            const data = result.data
            expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
        }else{
            console.log(result.data)
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


        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: undefined,
            revision: ""
        }

        const result = await aquafier.witnessAquaTree(aquaTreeWrapper, "nostr", "sepolia", "cli", creds,);

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


    test("should create a form revision", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
        const fileObject: FileObject = {
            fileName: "test.json",
            fileContent: '{"name":"kenn","age":200}',
            path: "/fake/path/test.json"
        };
        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: fileObject,
            revision: ""
        }

        const result = await aquafier.createFormRevision(aquaTreeWrapper, fileObject);
        expect(result.isOk()).toBe(true);
    });

    test("should hide form in form revision item", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
        const fileObject: FileObject = {
            fileName: "test.json",
            fileContent: '{"name":"kenn","age":200}',
            path: "/fake/path/test.json"
        };
        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: fileObject,
            revision: ""
        }

        const resultFormRevision = await aquafier.createFormRevision(aquaTreeWrapper, fileObject);
        expect(resultFormRevision.isOk()).toBe(true);

        const resultHide = await aquafier.hideFormElements(aquaTreeWrapper, "name");
        expect(resultHide.isOk()).toBe(true);

        if (resultHide.isOk()) {
            const data = resultHide.data
            // expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
            expect(JSON.stringify(data.aquaTree)).toContain('.deleted');
        } else {
            expect(true).toBe(false);
        }


    });

    test("should hide form in form revision item then unhide it", async () => {
        const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
        const fileObject: FileObject = {
            fileName: "test.json",
            fileContent: '{"name":"kenn","age":200}',
            path: "/fake/path/test.json"
        };
        const aquaTreeWrapper: AquaTreeWrapper = {
            aquaTree: mockAquaTree,
            fileObject: fileObject,
            revision: ""
        }

        const resultFormRevision = await aquafier.createFormRevision(aquaTreeWrapper, fileObject);
        expect(resultFormRevision.isOk()).toBe(true);
        if (resultFormRevision.isOk()) {
            const aquaTreeWrapperToHideWrapper: AquaTreeWrapper = {
                aquaTree: resultFormRevision.data.aquaTree,
                fileObject: fileObject,
                revision: ""
            }
            const resultHide = await aquafier.hideFormElements(aquaTreeWrapperToHideWrapper, "name");
            expect(resultHide.isOk()).toBe(true);

            if (resultHide.isOk()) {
                const data = resultHide.data
                // expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
                expect(JSON.stringify(data.aquaTree)).toContain('.deleted');


                const aquaTreeWrapperHidenElementsWrapper: AquaTreeWrapper = {
                    aquaTree: resultHide.data.aquaTree,
                    fileObject: fileObject,
                    revision: ""
                }

                const resultUnHide = await aquafier.unHideFormElements(aquaTreeWrapperHidenElementsWrapper, "name", "arthur");
                expect(resultUnHide.isOk()).toBe(true);

                if (resultUnHide.isOk()) {
                    const data = resultUnHide.data
                    // expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
                    expect(JSON.stringify(data.aquaTree)).not.toContain('.deleted');
                } else {
                    console.log("=========== Unhide failed ======================")
                    console.log(resultUnHide.data.forEach((e) => console.log(e)))
                    expect(true).toBe(false
                    );
                }


            } else {
                console.log("=========== Hide failed ======================")
                console.log(resultHide.data.forEach((e) => console.log(e)))
                expect(true).toBe(false);
            }

        } else {
            console.log("=========== creating form revision  failed ======================")
            console.log(resultFormRevision.data.forEach((e) => console.log(e)))
            expect(true).toBe(false);
        }


    });


});
