import VectorDB from '@themaximalist/vectordb.js';
import { CodeChunk } from './codeChunk';
import { language } from 'tree-sitter-javascript';
const db = new VectorDB(
    {
        dimensions: 768
    }
);

export async function AddtoDb(chunk:CodeChunk,vector:number[]){
    try{
        const embedding = vector;

    }

    catch(e){
        console.log(e);
    }
}