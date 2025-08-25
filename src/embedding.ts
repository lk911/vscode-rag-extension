// @ts-ignore
const ort = require('onnxruntime-web');
ort.env.wasm.wasmPaths = {
  'ort-wasm.wasm': 'file:///' + __dirname.replace(/\\/g, '/') + '/node_modules/onnxruntime-web/dist/ort-wasm.wasm'
};
import { env } from '@xenova/transformers';
env.backends.onnx = ort;
env.allowRemoteModels = true;

import { pipeline } from '@xenova/transformers';

let extractor: any = null;
// This function loads the model only once.
export async function initializeEmbeddingModel() {
    console.log("HIIIIIIIIIIIIII");
    try {
        console.log('BEFORE pipeline, env.backends.onnx:', env.backends.onnx);
        extractor = await pipeline('feature-extraction', 'jinaai/jina-embeddings-v2-base-code', {
            quantized: true, // Comment out this line to use the 8-bit quantized version
        });
        console.log('AFTER pipeline, env.backends.onnx:', env.backends.onnx);
        console.log('extractor:', extractor);
        console.log('Embedding model loaded successfully.');
        console.log('Backend info:', env.backends.onnx);
    } catch (e: any) {
    console.error('Failed to load model:', e?.message || e);
    console.error('Cause:', e?.cause);
    throw e;
  }
}
export async function getEmbedding(text: string): Promise<number[]> {
    if (!extractor) {
        throw new Error('Embedding model has not been initialized.');
    }

    const output = await extractor(text, {
        pooling: 'mean',
        normalize: true,
    });

    const embeddingVector = Array.from(output.data) as number[];
    
    return embeddingVector;
}