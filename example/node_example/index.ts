
import * as fs from "fs"

function readAquaFile(aquaFilePath: string){
    try{
        let fileContent = fs.readFileSync(aquaFilePath)
        let aquaObject = JSON.parse(fileContent)
    }
}