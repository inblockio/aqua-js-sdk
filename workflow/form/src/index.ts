import Aquafier, { AquaOperationData, AquaTree, CredentialsData, Err, LogData, LogType, Result } from "aqua-js-sdk";
import { detectEnvironment, splitFilePath } from "./utils";


/**
 * AquaForm class for managing form data with validation, linking, and signing capabilities
 */
export default class AquaForm {
    private aquaTree : Aquatree;
    private formData: FormData;
    private schema: any;

    constructor(form: FormData, formSchema: string | object) {
        this.formData = form;

        // Handle schema loading
        if (typeof formSchema === 'string') {
            // In a real implementation, we would load the schema file
            // For now, we'll simulate loading it
            this.schema = this.loadSchema(formSchema);
        } else {
            this.schema = formSchema;
        }


    }


    sign = (signatureType : string , credential : CredentialsData)=>{
        const aqua = new Aquafier();

        if(this.aquaTree){
            let wrapper =  
            aqua.signAquaTree()
        }

    }

    /**
  * Load schema from a file path
  * @param schemaPath Path to schema file
  * @private
  */
    private loadSchema(schemaPath: string): any {
        // In a real implementation, this would load the schema from the file system
        console.log(`Loading schema from ${schemaPath}`);
        // Placeholder for schema loading logic
        return { type: 'object', properties: {} };
    }
}


export async function  aquafy(filePath: string): Promise<Result<AquaOperationData, LogData[]>> {
    let env = detectEnvironment()
    if (env == "browser") {

        let log: Array<LogData> = [];
        log.push({
            logType: LogType.ERROR,
            log: `Browser not supported`
        })

        return Err(log)
    } else {
        const fs = require("fs");
        const aqua = new Aquafier();

        // Use the helper function to get path and filename
        const { path, name: fileNameOnly } = splitFilePath(filePath);

        const fileContent = fs.readFileSync(path, { encoding: "utf-8" });
        const fileObject = {
            fileName: fileNameOnly,
            fileContent: fileContent,
            path: path
        };

        const res = await aqua.createGenesisRevision(fileObject);
        return res;
    }
}