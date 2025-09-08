import Aquafier, { FileObject, AquaTreeWrapper, CredentialsData, Result, AquaOperationData, LogData, OkResult, AquaTree } from "aqua-js-sdk";
import './App.css';

function App() {
  // Configuration constants
  const CREDENTIALS: CredentialsData = {
    mnemonic: "",
    nostr_sk: "",
    did_key: "",
    alchemy_key: "",
    witness_eth_network: "sepolia",
    witness_method: "metamask"
  };

  const SAMPLE_FILES = {
    testFile: {
      fileName: "test.txt",
      fileContent: "Sample content",
      path: ""
    } as FileObject,
    licenseFile: {
      fileName: "LICENCE",
      fileContent: "mit licence",
      path: ""
    } as FileObject
  };

  // Helper function to handle errors
  const handleError = (result: any, errorMessage: string): boolean => {
    if (result.isErr()) {
      console.log(`${errorMessage}:`, JSON.stringify(result.data, null, 2));
      return true;
    }
    return false;
  };

  // Helper function to create AquaTreeWrapper
  const createWrapper = (aquaTree: AquaTree, fileObject: FileObject): AquaTreeWrapper => ({
    aquaTree,
    fileObject,
    revision: ""
  });

  // Step 1: Create genesis revisions
  const createGenesisRevisions = async (aquafier: Aquafier) => {
    console.log("Creating genesis revisions...");
    
    const testGenResult = await aquafier.createGenesisRevision(SAMPLE_FILES.testFile);
    if (handleError(testGenResult, "Failed to create test file genesis")) return null;

    const licenseGenResult = await aquafier.createGenesisRevision(SAMPLE_FILES.licenseFile);
    if (handleError(licenseGenResult, "Failed to create license file genesis")) return null;

    console.log("License Genesis:", JSON.stringify(licenseGenResult.data, null, 2));
    
    return { testGenResult, licenseGenResult };
  };

  // Step 2: Link aqua trees
  const linkTrees = async (aquafier: Aquafier, testGenResult:  OkResult<AquaOperationData, LogData[]> , licenseGenResult:  OkResult<AquaOperationData, LogData[]>) => {
    console.log("Linking aqua trees...");
    
    const licenseWrapper = createWrapper(licenseGenResult.data.aquaTree!, SAMPLE_FILES.testFile);
    const testWrapper = createWrapper(testGenResult.data.aquaTree!, SAMPLE_FILES.testFile);
    
    const linkResult = await aquafier.linkAquaTree(licenseWrapper, testWrapper);
    if (handleError(linkResult, "Failed to link aqua trees")) return null;
    
    return linkResult;
  };

  // Step 3: Sign aqua tree
  const signTree = async (aquafier: Aquafier, linkResult: OkResult<AquaOperationData, LogData[]>) => {
    console.log("Signing aqua tree...");
    
    const wrapper = createWrapper(linkResult.data.aquaTree!, SAMPLE_FILES.testFile);
    const signResult = await aquafier.signAquaTree(wrapper, "metamask", CREDENTIALS);
    
    if (signResult.isErr()) {
      alert("Error encountered during signing");
      return null;
    }
    
    return signResult;
  };

  // Step 4: Witness aqua tree
  const witnessTree = async (aquafier: Aquafier, signResult: any) => {
    console.log("Witnessing aqua tree...");
    
    const wrapper = createWrapper(signResult.data.aquaTree, SAMPLE_FILES.testFile);
    const witnessResult = await aquafier.witnessAquaTree(
      wrapper, 
      "eth", 
      "sepolia", 
      "metamask", 
      CREDENTIALS
    );
    
    if (handleError(witnessResult, "Failed to witness aqua tree")) {
      return witnessResult; // Still return for final logging
    }
    
    return witnessResult;
  };

  // Main function orchestrating the entire flow
  const tryAquafier = async (): Promise<void> => {
    try {
      console.log("Starting Aquafier process...");
      const aquafier = new Aquafier();

      // Step 1: Create genesis revisions
      const genesisResults = await createGenesisRevisions(aquafier);
      if (!genesisResults) return;

      const { testGenResult, licenseGenResult } = genesisResults;

      if (testGenResult.isErr()) {
        alert("Error encountered during genesis creation for test file");
        return;
      }

      if (licenseGenResult.isErr()) {
        alert("Error encountered during genesis creation for licence file");
        return;
      }

      // Step 2: Link trees
      const linkResult = await linkTrees(aquafier, testGenResult, licenseGenResult);
      if (!linkResult) return;

      if (linkResult.isErr()) {
        alert("Error encountered during linking");
        return;
      }

      // Step 3: Sign tree
      const signResult = await signTree(aquafier, linkResult);
      if (!signResult) return;

      // Step 4: Witness tree
      const witnessResult = await witnessTree(aquafier, signResult);
      
      console.log("Final Result:", JSON.stringify(witnessResult?.data, null, 2));
      console.log("Aquafier process completed!");
      
    } catch (error) {
      console.error("Unexpected error in Aquafier process:", error);
      alert("An unexpected error occurred. Check the console for details.");
    }
  };

  return (
    <div className="app">
      <h1>Aquafier Demo</h1>
      <p>Check the browser console for detailed output.</p>
      <button onClick={tryAquafier} className="try-button">
        Try Aquafier
      </button>
    </div>
  );
}

export default App;