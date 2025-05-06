import Aquafier, { AquaOperationData, AquaTree, AquaTreeWrapper, CredentialsData, Err, FileObject, LogData, LogType, Ok, Result, SignType } from "aqua-js-sdk";
import { detectEnvironment, splitFilePath } from "./utils";


/**
 * AquaForm class for managing form data with validation, linking, and signing capabilities
 */
export default class AquaForm {
    private aquaTree: AquaTree;
    private formData: FormData;
    private schema: FileObject;
    private files :FileObject[] =[];

    constructor(form: FormData, formSchema: string | FileObject) {
        this.formData = form;

        // Handle schema loading
        if (typeof formSchema === 'string') {
            let res = this.loadSchema(formSchema);
            if (res.isOk()) {
                this.schema = res.data
            }else{
                throw Error("Use FileObject when in browser");
            }
        } else {
            this.schema = formSchema;
        }


    }


    sign = async (signatureType: SignType, credential: CredentialsData) => {
        const aqua = new Aquafier();

        if (this.aquaTree) {
            let wrapper: AquaTreeWrapper = {
                aquaTree: this.aquaTree,
                revision: "",
            }
            let res = await aqua.signAquaTree(wrapper, signatureType, credential)
            if (res.isOk()) {
                this.aquaTree = res.data
            }
        }

    }


    verify=()=>{
        let aquafier = new Aquafier();
        return  aquafier.verifyAquaTree(this.aquaTree, this.files)
    } 

    /**
     * Load schema from a file path
     * @param schemaPath Path to schema file
     * @private
     */
    private loadSchema(schemaPath: string): Result<FileObject, LogData[]> {
        let log: Array<LogData> = [];
        let env = detectEnvironment()
        if (env == "browser") {

            log.push({
                logType: LogType.ERROR,
                log: `Browser not supported`
            })

            return Err(log)
        }

        const fs = require("fs");
        if (fs.existsSync(schemaPath)) {

            // Use the helper function to get path and filename
            const { path, name: fileNameOnly } = splitFilePath(schemaPath);

            const fileContent = fs.readFileSync(path, { encoding: "utf-8" });
            const fileObject: FileObject = {
                fileName: fileNameOnly,
                fileContent: fileContent,
                path: path
            };

            return Ok(fileObject)
        } else {

            log.push({
                logType: LogType.ERROR,
                log: `Schema not found in path`
            })

            return Err(log)


        }

    }
    
}


export async function aquafy(filePath: string): Promise<Result<AquaOperationData, LogData[]>> {
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