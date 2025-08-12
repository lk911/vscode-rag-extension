export interface CodeChunk {
    id: number,
    type: string; // e.g., 'function', 'class'
    name?: string; // e.g., 'greet', 'MyClass
    content: string; // The actual code string
    startLine: number;
    endLine: number;
    startByte: number;
    endByte: number;
    filePath: string; 
    languageId: string;
}