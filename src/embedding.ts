import { pipeline ,env} from '@xenova/transformers';

//delete env.backends.onnx.provider;
let extractor: any = null;
env.allowRemoteModels = true;
// This function loads the model only once.
export async function initializeEmbeddingModel() {
    if (extractor === null) {
        if (extractor === null) {
            try {
                extractor = await pipeline('feature-extraction', 'Xenova/bge-base-en-v1.5');
                console.log('Embedding model loaded successfully.');
                console.log('Backend info:', env.backends.onnx);
            } catch (e) {
                console.warn('Failed to load backend.', e);
                throw e;
            }
        }
    }
}
export async function getEmbedding(text: string): Promise<number[]> {
    if (!extractor) {
        throw new Error('Embedding model has not been initialized.');
    }

    // The output is a Tensor with dimensions [1, 384] for a single sentence.
    const output = await extractor(text, {
        pooling: 'mean',
        normalize: true,
    });

    // Extract the data from the Tensor object and convert it to a number array.
    // The `data` property is a Float32Array.
    const embeddingVector = Array.from(output.data) as number[];
    
    return embeddingVector;
}