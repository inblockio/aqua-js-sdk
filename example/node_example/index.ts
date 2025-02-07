
import * as fs from "fs"

function readAquaFile(aquaFilePath: string): AquaObject | null {
    try {
        // Read the file synchronously
        const fileContent = fs.readFileSync(aquaFilePath, { encoding: "utf-8" });

        // Parse the file content as JSON
        const aquaObject: AquaObject = JSON.parse(fileContent);

        // Return the parsed object
        return aquaObject;
    } catch (error) {
        // Handle errors (e.g., file not found, invalid JSON)
        console.error(`Error reading or parsing the file at ${aquaFilePath}:`, error);
        return null; // Return null or throw an error, depending on your use case
    }
}