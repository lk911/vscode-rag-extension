import VectorDB from "@themaximalist/vectordb.js"
import { CodeChunk } from './codeChunk';
export const db = new VectorDB(
    {
        dimensions: 384
    }
);

export async function AddtoDb(chunk,vector){
    if (typeof chunk === CodeChunk)
    try{
        let currChunk = CodeChunk(chunk);
        const metadata = {file: currChunk.filePath, }
        
    }
    catch(e){
        console.log(e);
    }
}