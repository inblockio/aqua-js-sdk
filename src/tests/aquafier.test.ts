import { jest } from "@jest/globals";
import Aquafier, { AquaOperationData, AquaTree, AquaTreeWrapper, FileObject, LogData, Result, Revision } from "../index";  // Adjust the path based on your structure
// import { AquaTree, AquaTreeWrapper, CredentialsData, FileObject } from "../types";
// import { mockAquaTreeOnerevision, mockAquaTreeTworevisions, mockAquaTreeTworevisionsReArranged } from "./test_revisions";
// // import { createAquaTreeTree } from "../aquavhtree";
import { default as credentialsData } from "./../credentials.json";
import { mockAquaTreeOnerevision } from "./test_revisions";
//check readme

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

    describe("1. Genesis revision without content", () => {
        test("should create a valid revision", async () => {
            const fileObject: FileObject = {
                fileName: "test.txt",
                fileContent: "Sample content",
                path: "/fake/path/test.txt"
            };

            const result = await aquafier.createGenesisRevision(fileObject);
            expect(result.isOk()).toBe(true);
        });
    });

    describe("1.1 Genesis revision with content", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            result = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (result.isOk()) {
                const data = result.data;
                const aquaTree = data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];
                verificationResult = await aquafier.verifyAquaTreeRevision(aquaTree!, firstRevision, Object.keys(aquaTree!.revisions)[0], [fileObject]);
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have content defined", () => {
            expect(firstRevision.content).not.toBe(undefined);
        });

        test("Should have correct content value", () => {
            expect(firstRevision.content).toBe(fileObject.fileContent);
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    describe("2. Form revision", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        const fileObject: FileObject = {
            fileName: "test.json",
            fileContent: JSON.stringify({ "name": "kenn", "age": 200 }),
            path: "/fake/path/test.json"
        };

        beforeAll(async () => {
            result = await aquafier.createGenesisRevision(fileObject, true, true, false);
            if (result.isOk()) {
                const data = result.data;
                const aquaTree = data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];
                verificationResult = await aquafier.verifyAquaTreeRevision(aquaTree!, firstRevision, Object.keys(aquaTree!.revisions)[0], [fileObject]);
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have revision type 'form'", () => {
            expect(firstRevision.revision_type).toBe("form");
        });

        test("Should not have content", () => {
            expect(firstRevision.content).toBe(undefined);
        });

        test("Should have forms_name field", () => {
            expect(firstRevision.forms_name).not.toBe(undefined);
            expect(firstRevision.forms_name).toContain("kenn");
        });

        test("Should have forms_age field", () => {
            expect(firstRevision.forms_age).not.toBe(undefined);
            expect(firstRevision.forms_age).toContain("200");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    describe("3. Form revision with nested objects", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        const fileObject: FileObject = {
            fileName: "test.json",
            fileContent: JSON.stringify({ "name": "kenn", "age": 200, "address": { "city": "New York", "country": "USA" } }),
            path: "/fake/path/test.json"
        };

        beforeAll(async () => {
            result = await aquafier.createGenesisRevision(fileObject, true, true, false);
            if (result.isOk()) {
                const data = result.data;
                const aquaTree = data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];
                verificationResult = await aquafier.verifyAquaTreeRevision(aquaTree!, firstRevision, Object.keys(aquaTree!.revisions)[0], [fileObject]);
            }
        });

        test("should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have revision type 'form'", () => {
            expect(firstRevision.revision_type).toBe("form");
        });

        test("Should not have content", () => {
            expect(firstRevision.content).toBe(undefined);
        });

        test("Should have forms_name field", () => {
            expect(firstRevision.forms_name).not.toBe(undefined);
            expect(firstRevision.forms_name).toContain("kenn");
        });

        test("Should have forms_age field", () => {
            expect(firstRevision.forms_age).not.toBe(undefined);
            expect(firstRevision.forms_age).toContain("200");
        });

        test("Should have forms_address field", () => {
            expect(firstRevision.forms_address).not.toBe(undefined);
            expect(firstRevision.forms_address).toContain("New York");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    describe("4. Form revision with nested objects and arrays", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        const fileObject: FileObject = {
            fileName: "test.json",
            fileContent: JSON.stringify('[{"name":"kenn","age":200,"address":{"city":"New York","country":"USA"},"hobbies":["reading","traveling","sports"]}]'),
            path: "/fake/path/test.json"
        };

        beforeAll(async () => {
            result = await aquafier.createGenesisRevision(fileObject, true, true, false);
            if (result.isOk()) {
                const data = result.data;
                const aquaTree = data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];
                verificationResult = await aquafier.verifyAquaTreeRevision(aquaTree!, firstRevision, Object.keys(aquaTree!.revisions)[0], [fileObject]);
            }

        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have revision type 'form'", () => {
            expect(firstRevision.revision_type).toBe("form");
        });

        test("Should not have content", () => {
            expect(firstRevision.content).toBe(undefined);
        });

        test("Should have forms_0 field for array data", () => {
            expect(firstRevision.forms_0).not.toBe(undefined);
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    describe("5. Create Genesis Revisions and Link 2 Files", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let resultWithRemovedRevision: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        const fileObject1: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };
        const fileObject2: FileObject = {
            fileName: "test2.txt",
            fileContent: "Sample content 2",
            path: "/fake/path/test2.txt"
        };

        beforeAll(async () => {
            const test1Result = await aquafier.createGenesisRevision(fileObject1, false, true, false);
            const test2Result = await aquafier.createGenesisRevision(fileObject2, false, true, false);

            if (test1Result.isOk() && test2Result.isOk()) {
                const test1AquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: test1Result.data.aquaTree!,
                    revision: "",
                    fileObject: fileObject1
                }

                const test2AquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: test2Result.data.aquaTree!,
                    revision: "",
                    fileObject: fileObject2
                }

                result = await aquafier.linkAquaTree(test1AquaTreeWrapper, test2AquaTreeWrapper, false);
                if (result.isOk()) {
                    const aquaTree = result.data.aquaTree;
                    firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTreeRevision(aquaTree!, firstRevision, Object.keys(aquaTree!.revisions)[0], [fileObject1]);
                    resultWithRemovedRevision = aquafier.removeLastRevision(aquaTree!);
                }
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have content defined", () => {
            expect(firstRevision.content).not.toBe(undefined);
        });

        test("Should have correct content value", () => {
            expect(firstRevision.content).toBe(fileObject1.fileContent);
        });

        test("Should have revision type 'link' in second revision", () => {
            expect(secondRevision.revision_type).toBe("link");
        });

        test("Should have link_file_hashes defined", () => {
            expect(secondRevision.link_file_hashes).not.toBe(undefined);
        });

        test("Should have link_verification_hashes defined", () => {
            expect(secondRevision.link_verification_hashes).not.toBe(undefined);
        });

        test("Should have link_type defined", () => {
            expect(secondRevision.link_type).not.toBe(undefined);
        });

        test("Should have link_verification_hashes defined", () => {
            expect(secondRevision.link_verification_hashes).not.toBe(undefined);
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });

        describe("5.1 Remove last revision", () => {
            test("Should remove the last revision", () => {
                expect(resultWithRemovedRevision.isOk()).toBe(true);
                if (resultWithRemovedRevision.isOk()) {
                    const data = resultWithRemovedRevision.data
                    expect(Object.keys(data.aquaTree!.revisions).length).toBe(1);
                }
            });
        });
    });

    describe("6. Sign aqua tree (CLI)", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        let aquaTree: AquaTree;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            const aquaTreeCreationResult = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (aquaTreeCreationResult.isOk()) {
                aquaTree = aquaTreeCreationResult.data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];

                const aquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: aquaTree!,
                    revision: "",
                    fileObject: fileObject
                }

                result = await aquafier.signAquaTree(aquaTreeWrapper, "cli", credentialsData, true);
                if (result.isOk()) {
                    const signedAquaTree = result.data.aquaTree;
                    aquaTree = signedAquaTree;
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTree(aquaTree!, [fileObject], credentialsData);
                }
            }
        });


        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have 2 revisions", () => {
            expect(Object.keys(aquaTree!.revisions).length).toBe(2);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have second revision type 'signature'", () => {
            expect(secondRevision.revision_type).toBe("signature");
        });

        test("Should have 'ethereum:eip-191' signature type", () => {
            expect(secondRevision.signature_type).toBe("ethereum:eip-191");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    // Skip the Metamask test as it requires browser interaction and causes dynamic import issues
    // If you don't want to skip it, remove the .skip() from the `describe` block

    describe.skip("7. Sign aqua tree (Metamask)", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        let aquaTree: AquaTree;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            const aquaTreeCreationResult = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (aquaTreeCreationResult.isOk()) {
                aquaTree = aquaTreeCreationResult.data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];

                const aquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: aquaTree!,
                    revision: "",
                    fileObject: fileObject
                }

                result = await aquafier.signAquaTree(aquaTreeWrapper, "metamask", credentialsData, true);
                if (result.isOk()) {
                    const signedAquaTree = result.data.aquaTree;
                    aquaTree = signedAquaTree;
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTree(aquaTree!, [fileObject], credentialsData);
                }
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have 2 revisions", () => {
            expect(Object.keys(aquaTree!.revisions).length).toBe(2);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have second revision type 'signature'", () => {
            expect(secondRevision.revision_type).toBe("signature");
        });

        test("Should have 'ethereum:eip-191' signature type", () => {
            expect(secondRevision.signature_type).toBe("ethereum:eip-191");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    describe("8. Sign aqua tree (DID)", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        let aquaTree: AquaTree;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            const aquaTreeCreationResult = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (aquaTreeCreationResult.isOk()) {
                aquaTree = aquaTreeCreationResult.data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];

                const aquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: aquaTree!,
                    revision: "",
                    fileObject: fileObject
                }

                result = await aquafier.signAquaTree(aquaTreeWrapper, "did", credentialsData, true);
                if (result.isOk()) {
                    const signedAquaTree = result.data.aquaTree;
                    aquaTree = signedAquaTree;
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTree(aquaTree!, [fileObject], credentialsData);
                }
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have 2 revisions", () => {
            expect(Object.keys(aquaTree!.revisions).length).toBe(2);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have second revision type 'signature'", () => {
            expect(secondRevision.revision_type).toBe("signature");
        });

        test("Should have 'did_key' signature type", () => {
            expect(secondRevision.signature_type).toBe("did_key");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    describe("9. Witness aqua tree (ETH, CLI)", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        let aquaTree: AquaTree;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            const aquaTreeCreationResult = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (aquaTreeCreationResult.isOk()) {
                aquaTree = aquaTreeCreationResult.data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];

                const aquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: aquaTree!,
                    revision: "",
                    fileObject: fileObject
                }

                result = await aquafier.witnessAquaTree(aquaTreeWrapper, "eth", "sepolia", "cli", credentialsData, true);
                if (result.isOk()) {
                    const signedAquaTree = result.data.aquaTree;
                    aquaTree = signedAquaTree;
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTree(aquaTree!, [fileObject], credentialsData);
                }
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have 2 revisions", () => {
            expect(Object.keys(aquaTree!.revisions).length).toBe(2);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have second revision type 'witness'", () => {
            expect(secondRevision.revision_type).toBe("witness");
        });

        test("Should have 'sepolia' witness network", () => {
            expect(secondRevision.witness_network).toBe("sepolia");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    // Skip the Metamask test as it requires browser interaction
    // TEST: It works but sometimes fails
    describe.skip("10. Witness aqua tree (ETH, METAMASK)", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        let aquaTree: AquaTree;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            const aquaTreeCreationResult = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (aquaTreeCreationResult.isOk()) {
                aquaTree = aquaTreeCreationResult.data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];

                const aquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: aquaTree!,
                    revision: "",
                    fileObject: fileObject
                }

                result = await aquafier.witnessAquaTree(aquaTreeWrapper, "eth", "sepolia", "metamask", credentialsData, true);
                if (result.isOk()) {
                    const signedAquaTree = result.data.aquaTree;
                    aquaTree = signedAquaTree;
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTree(aquaTree!, [fileObject], credentialsData);
                }
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have 2 revisions", () => {
            expect(Object.keys(aquaTree!.revisions).length).toBe(2);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have second revision type 'witness'", () => {
            expect(secondRevision.revision_type).toBe("witness");
        });

        test("Should have 'sepolia' witness network", () => {
            expect(secondRevision.witness_network).toBe("sepolia");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    // Skip the TSA test as it requires browser interaction
    // TEST: It works but sometimes fails
    // TODO: Fix this
    describe.skip("11. Witness aqua tree (TSA, CLI) - TODO: Fix this", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        let aquaTree: AquaTree;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            const aquaTreeCreationResult = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (aquaTreeCreationResult.isOk()) {
                aquaTree = aquaTreeCreationResult.data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];

                const aquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: aquaTree!,
                    revision: "",
                    fileObject: fileObject
                }

                result = await aquafier.witnessAquaTree(aquaTreeWrapper, "tsa", "sepolia", "cli", credentialsData, true);
                if (result.isOk()) {
                    const signedAquaTree = result.data.aquaTree;
                    aquaTree = signedAquaTree;
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTree(aquaTree!, [fileObject], credentialsData);
                }
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have 2 revisions", () => {
            expect(Object.keys(aquaTree!.revisions).length).toBe(2);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have second revision type 'witness'", () => {
            expect(secondRevision.revision_type).toBe("witness");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    // TEST: It works but sometimes fails
    // TODO: Fix this
    describe("12. Witness aqua tree (NOSTR, CLI) - TODO: Fix this", () => {
        let result: Result<AquaOperationData, LogData[]>;
        let firstRevision: Revision;
        let secondRevision: Revision;
        let verificationResult: Result<AquaOperationData, LogData[]>;
        let aquaTree: AquaTree;
        const fileObject: FileObject = {
            fileName: "test.txt",
            fileContent: "Sample content",
            path: "/fake/path/test.txt"
        };

        beforeAll(async () => {
            const aquaTreeCreationResult = await aquafier.createGenesisRevision(fileObject, false, true, false);
            if (aquaTreeCreationResult.isOk()) {
                aquaTree = aquaTreeCreationResult.data.aquaTree;
                firstRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[0]];

                const aquaTreeWrapper: AquaTreeWrapper = {
                    aquaTree: aquaTree!,
                    revision: "",
                    fileObject: fileObject
                }

                result = await aquafier.witnessAquaTree(aquaTreeWrapper, "nostr", "sepolia", "cli", credentialsData, true);
                if (result.isOk()) {
                    const signedAquaTree = result.data.aquaTree;
                    aquaTree = signedAquaTree;
                    secondRevision = aquaTree!.revisions[Object.keys(aquaTree!.revisions)[1]];
                    verificationResult = await aquafier.verifyAquaTree(aquaTree!, [fileObject], credentialsData);
                }
            }
        });

        test("Should create a valid revision", () => {
            expect(result.isOk()).toBe(true);
        });

        test("Should have 2 revisions", () => {
            expect(Object.keys(aquaTree!.revisions).length).toBe(2);
        });

        test("Should have revision type 'file'", () => {
            expect(firstRevision.revision_type).toBe("file");
        });

        test("Should have second revision type 'witness'", () => {
            expect(secondRevision.revision_type).toBe("witness");
        });

        test("Should have 'nostr' witness network", () => {
            expect(secondRevision.witness_network).toBe("nostr");
        });

        test("Should verify the aqua tree", () => {
            expect(verificationResult.isOk()).toBe(true);
        });
    });

    describe("13. Hide form in form revision item", () => {
        let mockAquaTree: AquaTree;
        let fileObject: FileObject;
        let aquaTreeWrapper: AquaTreeWrapper;
        let resultFormRevision: Result<AquaOperationData, LogData[]>;
        let resultHide: Result<AquaOperationData, LogData[]>;
        
        beforeAll(async () => {
            mockAquaTree = structuredClone(mockAquaTreeOnerevision);
            fileObject = {
                fileName: "test.json",
                fileContent: '{"name":"kenn","age":200}',
                path: "/fake/path/test.json"
            };
            aquaTreeWrapper = {
                aquaTree: mockAquaTree,
                fileObject: fileObject,
                revision: ""
            };
            
            resultFormRevision = await aquafier.createFormRevision(aquaTreeWrapper, fileObject);
            if (resultFormRevision.isOk()) {
                resultHide = await aquafier.hideFormElements(aquaTreeWrapper, "name");
            }
        });
        
        test("Should create a valid form revision", () => {
            expect(resultFormRevision.isOk()).toBe(true);
        });
        
        test("Should hide form element successfully", () => {
            expect(resultHide.isOk()).toBe(true);
        });
        
        test("Should contain deleted marker in tree", () => {
            if (resultHide.isOk()) {
                const data = resultHide.data;
                expect(JSON.stringify(data.aquaTree)).toContain('.deleted');
            }
        });
    });

    describe.skip("14. Hide and unhide form in form revision item - TODO: Fix this", () => {
        let mockAquaTree: AquaTree;
        let fileObject: FileObject;
        let aquaTreeWrapper: AquaTreeWrapper;
        let resultFormRevision: Result<AquaOperationData, LogData[]>;
        let resultHide: Result<AquaOperationData, LogData[]>;
        let resultUnHide: Result<AquaOperationData, LogData[]>;
        
        beforeAll(async () => {
            mockAquaTree = structuredClone(mockAquaTreeOnerevision);
            fileObject = {
                fileName: "test.json",
                fileContent: '{"name":"kenn","age":200}',
                path: "/fake/path/test.json"
            };
            aquaTreeWrapper = {
                aquaTree: mockAquaTree,
                fileObject: fileObject,
                revision: ""
            };
            
            resultFormRevision = await aquafier.createFormRevision(aquaTreeWrapper, fileObject);
            if (resultFormRevision.isOk()) {
                const aquaTreeWrapperToHideWrapper: AquaTreeWrapper = {
                    aquaTree: resultFormRevision.data.aquaTree!,
                    fileObject: fileObject,
                    revision: ""
                };
                resultHide = await aquafier.hideFormElements(aquaTreeWrapperToHideWrapper, "name");
                
                if (resultHide.isOk()) {
                    const aquaTreeWrapperHidenElementsWrapper: AquaTreeWrapper = {
                        aquaTree: resultHide.data.aquaTree!,
                        fileObject: fileObject,
                        revision: ""
                    };
                    resultUnHide = await aquafier.unHideFormElements(aquaTreeWrapperHidenElementsWrapper, "name", "arthur");
                    console.log(resultHide.data.aquaTree)
                }
            }
        });
        
        test("Should create a valid form revision", () => {
            expect(resultFormRevision.isOk()).toBe(true);
        });
        
        test("Should hide form element successfully", () => {
            expect(resultHide.isOk()).toBe(true);
        });
        
        test("Should contain deleted marker after hiding", () => {
            if (resultHide.isOk()) {
                const data = resultHide.data;
                expect(JSON.stringify(data.aquaTree)).toContain('.deleted');
            }
        });
        
        test("Should unhide form element successfully", () => {
            expect(resultUnHide.isOk()).toBe(true);
        });
        
        test("Should not contain deleted marker after unhiding", () => {
            if (resultUnHide.isOk()) {
                const data = resultUnHide.data;
                expect(JSON.stringify(data.aquaTree)).not.toContain('.deleted');
            }
        });
    });

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
    // });

    // test("should fetch files to be read", () => {
    //     const mockAquaTree: AquaTree = mockAquaTreeOnerevision

    //     const result = aquafier.fetchFilesToBeRead(mockAquaTree);
    //     expect(result).toBeInstanceOf(Array);
    // });

    // test("should remove one revision", () => {
    //     const mockAquaTree: AquaTree = mockAquaTreeTworevisions

    //     const result = aquafier.removeLastRevision(mockAquaTree);
    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree!.revisions).length).toBe(1);
    //     }
    // });

    // test("should sign aquatree via cli", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
    //     const fileObject: FileObject = {
    //         fileName: "test.txt",
    //         fileContent: "Sample content",
    //         path: "/fake/path/test.txt"
    //     };
    //     const aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: fileObject,
    //         revision: ""
    //     }

    //     // const filePath = "./../credentials.json";
    //     // const content = await fs.readFile(filePath, "utf-8");
    //     const creds: CredentialsData = credentialsData;

    //     const result = await aquafier.signAquaTree(aquaTreeWrapper, "metamask", creds, true);

    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree!.revisions).length).toBe(2);
    //     }
    // });

    // test("should sign aquatree via did", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
    //     const fileObject: FileObject = {
    //         fileName: "test.txt",
    //         fileContent: "Sample content",
    //         path: "/fake/path/test.txt"
    //     };
    //     const aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: fileObject,
    //         revision: ""
    //     }

    //     // const filePath = "./../credentials.json";
    //     // const content = await fs.readFile(filePath, "utf-8");
    //     const creds: CredentialsData = credentialsData;

    //     const result = await aquafier.signAquaTree(aquaTreeWrapper, "did", creds, true);

    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree!.revisions).length).toBe(2);
    //     }
    // });

    // test("should witness aquatree via cli", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

    //     const aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: {
    //             fileName: "test.txt",
    //             fileContent: "",
    //             path: "/fake/path/test.txt"
    //         },
    //         revision: ""
    //     }
    //     const creds: CredentialsData = credentialsData;

    //     const result = await aquafier.witnessAquaTree(aquaTreeWrapper, "eth", "sepolia", "cli", creds,);

    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree?.revisions || {}).length).toBe(2);
    //     } else {
    //         console.log(result.data)
    //     }
    // });

    // // Uncomment if your IP is not blocked by TSA servers
    // // test("should witness aquatree via tsa", async () => {
    // //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

    // //     const creds: CredentialsData = credentialsData;

    // //     const result = await aquafier.witnessAquaTree(mockAquaTree, "tsa", "sepolia", "cli", creds, );

    // //     expect(result.isOk()).toBe(true);
    // //     if (result.isOk()) {
    // //         const data = result.data
    // //         expect(Object.keys(data.aquaTree.revisions).length).toBe(2);
    // //     }
    // // });

    // test("should witness aquatree via nostr", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

    //     const creds: CredentialsData = credentialsData;


    //     const aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: {
    //             fileName: "test.txt",
    //             fileContent: "",
    //             path: "/fake/path/test.txt"
    //         },
    //         revision: ""
    //     }

    //     const result = await aquafier.witnessAquaTree(aquaTreeWrapper, "nostr", "sepolia", "cli", creds,);

    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree!.revisions).length).toBe(2);
    //     }
    // });

    // test("should link aquatree", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)

    //     const fileObject: FileObject = {
    //         fileName: "test.txt",
    //         fileContent: "Sample content",
    //         path: "/fake/path/test.txt"
    //     };

    //     const aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: fileObject,
    //         revision: ""
    //     }

    //     const linkaquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: fileObject,
    //         revision: ""
    //     }

    //     const result = await aquafier.linkAquaTree(aquaTreeWrapper, linkaquaTreeWrapper);

    //     expect(result.isOk()).toBe(true);
    //     if (result.isOk()) {
    //         const data = result.data
    //         expect(Object.keys(data.aquaTree!.revisions).length).toBe(2);
    //     }
    // });


    // test("should create a form revision", async () => {
    //     const mockAquaTree: AquaTree = structuredClone(mockAquaTreeOnerevision)
    //     const fileObject: FileObject = {
    //         fileName: "test.json",
    //         fileContent: '{"name":"kenn","age":200}',
    //         path: "/fake/path/test.json"
    //     };
    //     const aquaTreeWrapper: AquaTreeWrapper = {
    //         aquaTree: mockAquaTree,
    //         fileObject: fileObject,
    //         revision: ""
    //     }

    //     const result = await aquafier.createFormRevision(aquaTreeWrapper, fileObject);
    //     expect(result.isOk()).toBe(true);
    // });

    


});
