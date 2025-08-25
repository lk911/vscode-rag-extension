import { HierarchicalNSW } from "hnswlib-node";
import { SearchKnnResult } from './searchKnnType';
export class VectorDataBase{
    index : HierarchicalNSW | undefined
    savedVectors: Float32Array[]=[];
    numElements: number = 10000
    dimensions:number|undefined
    currNum:number = 0
    constructor(dims:number){
        this.dimensions = dims;
        this.index = new HierarchicalNSW('cosine',this.dimensions);
        this.index.initIndex(this.numElements);
    }
    add(vector:Float32Array,id:number){
        this.index?.addPoint(Array.from(vector),id);
        this.currNum++;
        this.savedVectors?.push(vector);
        if(this.currNum ===this.numElements){
            this.resize();
        }
    }
    delete(id:number){
        this.index?.markDelete(id);
    }
    resize(){
        if (this.dimensions) {
            let id = 0;
            const newNumElements = (this.numElements)*2;
            const newIndex = new HierarchicalNSW('cosine', this.dimensions);
            newIndex.initIndex(newNumElements);
            for (let i = 0; i < this.currNum+1; i++) {
                newIndex.addPoint(Array.from(this.savedVectors[i]), i);
            }
            this.index = newIndex;
        }    
    }
    async search(queryVector:Float32Array,k:number): Promise<SearchKnnResult|undefined>{
        const result = this.index?.searchKnn(Array.from(queryVector),k);
        if (result) {
            const resultData:SearchKnnResult = {
                distances: result?.distances,
                neighbors:result?.neighbors
            }
            console.log('Labels:', result.neighbors);
            console.log('Distances:', result.distances);
            return {
                distances: result?.distances,
                neighbors:result?.neighbors
            };
        }
        else{return undefined};
    }
}


