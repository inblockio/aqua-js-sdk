import { useEffect } from 'react'
import Aquafier, { FileObject } from "aquafier-js-sdk";
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
