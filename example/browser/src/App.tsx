import { useEffect, useState } from 'react'
import Aquafier, { FileObject } from "aquafier-js-sdk";

function App() {

  // const [files, setFiles] = useState<FileObject[]>([]);

  useEffect(() => {
    (async () => {
      let aquafier = new Aquafier();
      const fileObject: FileObject = {
        fileName: "test.txt",
        fileContent: "Sample content",
        path: "/fake/path/test.txt"
      };

      const result = await aquafier.createGenesisRevision(fileObject);
      console.log("Result")
      console.log(JSON.stringify(result, null, 4))
    })()

  }, [])


  return (
   <div>hi</div>
  );
}

export default App
