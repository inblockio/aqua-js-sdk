import { useEffect } from 'react'
import Aquafier, { AquaTreeView, CredentialsData, FileObject } from "aqua-js-sdk";
import './App.css'

function App() {

  const tryAquafier = async () => {
    let aqua = Aquafier as any
    let aquafier = new aqua.Aquafier();
    const fileObject: FileObject = {
      fileName: "test.txt",
      fileContent: "Sample content",
      path: "/fake/path/test.txt"
    };

    const result = await aquafier.createGenesisRevision(fileObject);
    console.log("Result")
    console.log(JSON.stringify(result, null, 4))
    if (result.isOk()) {
      const creds: CredentialsData = {
        mnemonic: '',
        nostr_sk: '',
        did_key: '',
        alchemy_key: '',
        witness_eth_network: 'sepolia',
        witness_method: 'metmask'
      }
      const aquaTree = result.data.aquaTree
      if (aquaTree) {
        const aquaTreeView: AquaTreeView = {
          aquaTree: aquaTree,
          revision: ''
        }
        // aquaTreeWrapper.sign("cli", creds)
        // aquaTreeWrapper.witness("eth", "sepolia", "metamask", creds)
        // aquaTreeWrapper.sign("cli", creds)
        const signingResult = await aquafier.signAquaTree(aquaTreeView, "metamask", creds)
        console.log("✅ Signing Result: ", JSON.stringify(signingResult, null, 4))
      }
    }

  }

  // async function testAquaSDK() {
  //   console.log("Hello World");
  //   console.log("AquaSDK available:", typeof AquaSDK !== 'undefined');
  //   console.log("AquaSDK contents:", AquaSDK);

  //   // Test different ways to access Aquafier
  //   if (typeof AquaSDK !== 'undefined') {
  //     console.log()
  //     try {
  //       // Try as named export


  //       // Try as default export (UMD should expose the default export directly)
  //       if (typeof AquaSDK === 'function') {
  //         const aquafier2 = new AquaSDK();
  //         console.log("✅ Aquafier via default export:", aquafier2);
  //       }

  //       // Try accessing default property
  //       // if (AquaSDK.default) {
  //       //     const aquafier3 = new AquaSDK.default();
  //       //     console.log("✅ Aquafier via default property:", aquafier3);
  //       // }

  //       await runCreate()

  //     } catch (error) {
  //       console.error("❌ Error creating Aquafier:", error);
  //     }
  //   } else {
  //     console.error("AquaSDK not loaded properly");
  //   }
  // }

  // async function runCreate() {
  //   if (AquaSDK.default) {
  //     const aquafier1 = new AquaSDK.default.Aquafier();
  //     console.log("✅ Aquafier via named export:", aquafier1);
  //     const fileObject = {
  //       fileName: "test.txt",
  //       fileContent: "Sample content",
  //       path: "/fake/path/test.txt"
  //     };

  //     const result = await aquafier1.createGenesisRevision(fileObject);
  //     console.log("✅ Result: ", JSON.stringify(result, null, 4))
  //     if (result.isOk()) {
  //       const creds = {
  //         "did:key": "",
  //         alchemy_key: "",
  //         mnemonic: "",
  //         nostr_sk: "",
  //         witness_eth_network: "sepolia",
  //         witness_method: "metmask",
  //       }
  //       const aquaTree = result.data.aquaTree
  //       const aquaTreeView = {
  //         aquaTree: aquaTree,
  //         revision: ''
  //       }
  //       const signingResult = await aquafier1.signAquaTree(aquaTreeView, "metamask", creds)
  //       console.log("✅ Signing Result: ", JSON.stringify(signingResult, null, 4))
  //     }
  //   }
  //   else {
  //     console.error("SDK not found")
  //   }
  // }

  useEffect(() => {
    console.log(Aquafier)
    tryAquafier()
  }, [])

  return (
    <>
      check browser console for output.
    </>
  )
}

export default App
