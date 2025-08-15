// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Parser, Language,Query } from 'web-tree-sitter';
import { initializeEmbeddingModel,getEmbedding } from './embedding';
import { CodeChunk } from './codeChunk';
import { VectorDataBase } from './CustomVectorDB';
let parser: Parser | undefined;
// const loadedLanguages: Map<string,Language> = new Map();
const languageQueries: Map<string,Query> = new Map();
const languageMap: { [key: string]: string } = {
  'typescript': 'tree-sitter-typescript.wasm',
  'javascript': 'tree-sitter-javascript.wasm',
  'python': 'tree-sitter-python.wasm',
  'java': 'tree-sitter-java.wasm',
  'c': 'tree-sitter-c.wasm',
  'cpp': 'tree-sitter-cpp.wasm',
  'csharp': 'tree-sitter-c-sharp.wasm',
  'php': 'tree-sitter-php.wasm',
  'go': 'tree-sitter-go.wasm',
  'swift': 'tree-sitter-swift.wasm',
  'kotlin': 'tree-sitter-kotlin.wasm',
  'rust': 'tree-sitter-rust.wasm',
  'ruby': 'tree-sitter-ruby.wasm',
  'html': 'tree-sitter-html.wasm',
  'css': 'tree-sitter-css.wasm',
  'bash': 'tree-sitter-bash.wasm',
  'json': 'tree-sitter-json.wasm'
};
export const testPrompts: string[] = [
  "How do I add a new product to the catalog?",
  "Show me how to update the stock of a product.",
  "How can I delete a product by its ID?",
  "How do I filter products by category and price?",
  "How can I sort products by price in descending order?",
  "How do I retrieve all products in the catalog?",
  "How do I get a product by its unique ID?",
  "What is the structure of a Product object?",
  "What enums are defined for product categories?",
  "How are filter options defined for products?",
  "How is the ProductCatalog class implemented?",
  "What is the purpose of the FilterOptions interface?",
  "How are asynchronous operations handled in the catalog?",
  "Show me an example of using async/await in this code.",
  "How is the ProductCatalog class used in the main function?",
  "How do I add a book to the catalog in the demo?",
  "How is product deletion demonstrated in the main logic?",
  "How does the code handle updating a product that doesn't exist?",
  "How are products seeded with initial data?",
  "How does the code ensure product IDs are unique?"
];
const chunkMap: Map<number,CodeChunk> = new Map();
let chunkId = 0;
//jinaai/jina-embeddings-v2-base-code embeds with 768 dimensions

const vectorDb = new VectorDataBase(768);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Extension "cursorathome" is starting activation...');
	try{
		const wasmUri = vscode.Uri.joinPath(context.extensionUri, 'parsers', 'tree-sitter.wasm');
        //console.log('Trying to read:', wasmUri.fsPath);
		try{
			initializeEmbeddingModel();
			console.log("embedding model loaded");
		}
		catch(e){
			console.log(e);
		}
		await Parser.init({
			locateFile: () => {
				const wasmPath = vscode.Uri.joinPath(context.extensionUri, 'parsers', 'tree-sitter.wasm').fsPath;
				//console.log('tree-sitter.wasm path:', wasmPath);
				
				return wasmPath;
			}
		});
		parser= new Parser();
		//load language and query 
		if(parser){
			try{
				const parserLangUri = vscode.Uri.joinPath(context.extensionUri,'parsers',languageMap['typescript']);
				const wasmBytes = await vscode.workspace.fs.readFile(parserLangUri);
				const loadLang = await Language.load(wasmBytes)
				const queryUri = vscode.Uri.joinPath(context.extensionUri, 'TreeQueries', 'typescript.scm');
				const queryContent = await vscode.workspace.fs.readFile(queryUri);
				const queryString = new TextDecoder().decode(queryContent);
				const query = new Query(loadLang,queryString)
				//const matches = query.captures(rootNode); 
				parser.setLanguage(loadLang)
				console.log('Congratulations, your extension "cursorathome" is now active!');
				//define commands
				const disposable = vscode.commands.registerCommand('cursorathome.helloWorld', () => {
					vscode.window.showInformationMessage('Hello World from CursorAtHome!');
				});
				const viewParse = vscode.commands.registerCommand('cursorathome.parseCurrentFile', () =>{
					if(parser){
						CreateTree(parser,query,context)

					}
					else {
						vscode.window.showErrorMessage('Tree-sitter parser not initialized.');
					}
				});
				const inputBox = vscode.commands.registerCommand('cursorathome.showinputbox', () => {
					vscode.window.showInputBox({ prompt: 'Enter your prompt:' }).then(value => {
						if (value) {
							vscode.window.showInformationMessage(`You entered: ${value}`);
						}
					});
				})
				context.subscriptions.push(disposable);
				context.subscriptions.push(viewParse);
				context.subscriptions.push(inputBox);
			}
			catch(e){
				console.error("Error setting up parser language:",e);
			}
		}
		else{
			console.error("parser is undefined")
		}
	}
	catch(e){
		console.error('tree-sitter.wasm not found:',e)
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function loadLangGrammar(context: vscode.ExtensionContext, langID:string, wasmFileName: string){
}
async function CreateTree(parserparam: Parser,query:Query,context: vscode.ExtensionContext){
	const editor = vscode.window.activeTextEditor;
	if(editor){
		const document = editor.document;
		const documentText = document.getText();
		const tree = parserparam.parse(documentText);
		if (tree) { 
			const matches = query.captures(tree.rootNode);
			const contentString = tree.rootNode.toString();
			const contentBytes = new TextEncoder().encode(contentString);
			console.log('Parsed active document:', contentString);
			await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(context.extensionUri,'src','tree'),contentBytes);
			var langId = document.languageId;
			const chunks:CodeChunk[] = [];	
			for (const match of matches) {
				const node = match.node;
				const captureName = match.name; 

				const chunkType = captureName.split('.')[1];

				const chunkContent = documentText.substring(node.startIndex, node.endIndex);

				let name: string | undefined;
				const nameCapture = query.captures(node).find(c => c.name === 'name');
				if (nameCapture) {
					name = nameCapture.node.text;
				} else {
					const nameNode = node.childForFieldName('name'); 
					if (nameNode) name = nameNode.text;
				}
				chunks.push({
					id: chunkId,
					type: chunkType,
					name: name,
					content: chunkContent,
					startLine: node.startPosition.row,
					endLine: node.endPosition.row,
					startByte: node.startIndex,
					endByte: node.endIndex,
					filePath: document.uri.fsPath,
					languageId: langId
				});
				chunkMap.set(chunkId,{
					id: chunkId,
					type: chunkType,
					name: name,
					content: chunkContent,
					startLine: node.startPosition.row,
					endLine: node.endPosition.row,
					startByte: node.startIndex,
					endByte: node.endIndex,
					filePath: document.uri.fsPath,
					languageId: langId
				})
				chunkId++;
			}
			console.log(`Found ${chunks.length} chunks:`, chunks);
			vscode.window.showInformationMessage(`Found ${chunks.length} code chunks in ${langId} file.`);
			EmbedAndStore(chunks);
		} else {
			console.error('Parsing failed: tree object is null.');
		}

	}
	else {
        console.log('No active text editor found.');
    }
	
}
async function EmbedAndStore(chunks:CodeChunk[]){
	let vectors: Float32Array[] = [];
	let curr = 0;
	for (const chunk of chunks) {
		const augmentedContent: string = `
		File: ${chunk.filePath}
		Function: ${chunk.name}
		Code:
		${chunk.content}
		`;
		//console.log(augmentedContent);
		const embedding = await getEmbedding(augmentedContent);
		vectors.push(new Float32Array(embedding));
		vectorDb.add(vectors[curr],chunk.id);
		curr++;
		//console.log(vectors[vectors.length-1]);
		//console.log(vectors[vectors.length-1].length);
	}
	//add to vectordb
	// for(const vector of vectors){
	// 	vectorDb.add(vector,chunkId);
	// }
	embedPrompts();
}
async function embedPrompts(){
	const promptVectors: Float32Array[] =[]
	for(const prompt of testPrompts){
		console.log(prompt);
		const embedding = await getEmbedding(prompt);
		promptVectors.push(new Float32Array(embedding));
		console.log(promptVectors[promptVectors.length-1])
	}
	testSearch(promptVectors);
}
async function testSearch(promptVectors: Float32Array[]){
	let curr = 0;
	for(const prompt of promptVectors){
		console.log("Prompt: ",testPrompts[curr]);
		vectorDb.search(prompt,10);
		curr++;
	}
}