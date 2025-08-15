export interface CodeChunk {
    id: number,
    type: string; 
    name?: string; 
    content: string; 
    startLine: number;
    endLine: number;
    startByte: number;
    endByte: number;
    filePath: string; 
    languageId: string;
}