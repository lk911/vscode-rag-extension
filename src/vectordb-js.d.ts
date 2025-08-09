declare module '@themaximalist/vectordb.js' {
  export default class VectorDB {
    constructor(options?: {
      dimensions?: number;
      size?: number;
      embeddings?: any;
    });
    add(input: string, obj?: any): Promise<void>;
    search(input: string, num?: number, threshold?: number): Promise<any[]>;
    embedding(input: string, options?: any): Promise<number[]>;
    resize(size: number): void;
  }
}