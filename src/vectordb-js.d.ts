declare module '@themaximalist/vectordb.js' {
  export default class VectorDB {
    constructor();
    add(item: any): void;
    search(vector: number[], topN: number): any[];
  }
}