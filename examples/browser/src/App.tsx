import { useEffect } from 'react'
import Aquafier, { AquaTreeView, CredentialsData, FileObject } from "aqua-js-sdk";
import './App.css'

function App() {

  const tryAquafier = async () => {
    let aquafier = new Aquafier();
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
      if(aquaTree){
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

  useEffect(() => {
    tryAquafier()
  }, [])

  return (
    <>
      check browser console for output.
    </>
  )
}

export default App
