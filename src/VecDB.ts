import VectorDB from '@themaximalist/vectordb.js';
import { CodeChunk } from './codeChunk';
const db = new VectorDB;

export async function AddtoDb(chunk:CodeChunk,vector:number[]){
    try{
        db.add({
            vec: vector,
            code: chunk.content,
            path: chunk.filePath,
            name: chunk.name
        })
    }
    catch(e){
        console.log(e);
    }
}