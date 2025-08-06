// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Parser, Language, Node,Query } from 'web-tree-sitter';
import { initializeEmbeddingModel,getEmbedding } from './embedding';
import { CodeChunk } from './codeChunk';
let parser: Parser | undefined;
// const loadedLanguages: Map<string,Language> = new Map();
const languageQueries: Map<string,Query> = new Map();
const languageMap:{ [key:string]:string} = {
	'typescript': 'tree-sitter-typescript.wasm',
	'javsacript': 'tree-sitter-javascript.wasm'
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Extension "cursorathome" is starting activation...');
	try{
		const wasmUri = vscode.Uri.joinPath(context.extensionUri, 'parsers', 'tree-sitter.wasm');
        console.log('Trying to read:', wasmUri.fsPath);
        // try {
        //     const wasmBytes = await vscode.workspace.fs.readFile(wasmUri);
        //     console.log('Successfully read tree-sitter.wasm, bytes length:', wasmBytes.length);
        // } catch (e) {
        //     console.error('Error reading tree-sitter.wasm:', e);
        // }
		
		initializeEmbeddingModel().then(() => {
			console.log('Model initialized and ready!');
			// Now you can safely register commands and use getEmbedding
		}).catch(err => {
			console.error('Failed to initialize the embedding model:', err);
		});
		await Parser.init({
			locateFile: () => {
				// This is where web-tree-sitter looks for its own core `tree-sitter.wasm` file.
				// If you put `tree-sitter.wasm` in your `parsers` folder, this path is correct.
				const wasmPath = vscode.Uri.joinPath(context.extensionUri, 'parsers', 'tree-sitter.wasm').fsPath;
				console.log('tree-sitter.wasm path:', wasmPath);
				
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
				const viewParse = vscode.commands.registerCommand('cursorathome.parseCurrentFile', () =>
					{
						if(parser){
							CreateTree(parser,query,context)

						}
						else {
							vscode.window.showErrorMessage('Tree-sitter parser not initialized.');
						}
					});
				context.subscriptions.push(disposable);
				context.subscriptions.push(viewParse);
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
				const captureName = match.name; // e.g., 'chunk.function', 'chunk.class'

				// You can derive chunk type from captureName (e.g., 'function', 'class')
				const chunkType = captureName.split('.')[1];

				const chunkContent = documentText.substring(node.startIndex, node.endIndex);

				// --- Extract name using another query or direct child lookup ---
				let name: string | undefined;
				// If you define specific name queries like (function_declaration name: (identifier) @name)
				const nameCapture = query.captures(node).find(c => c.name === 'name');
				if (nameCapture) {
					name = nameCapture.node.text;
				} else {
					// Fallback for languages where 'name' isn't a direct field or no query exists
					const nameNode = node.childForFieldName('name'); // Common field name
					if (nameNode) name = nameNode.text;
				}
				// --- End name extraction ---

				chunks.push({
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
			}
			console.log(`Found ${chunks.length} chunks:`, chunks);
			vscode.window.showInformationMessage(`Found ${chunks.length} code chunks in ${langId} file.`);
			let vectors: number[][]=[];
			for (const chunk of chunks){
				const augmentedContent:string = `
				File: ${chunk.filePath}
				Function: ${chunk.name}
				Code:
				${chunk.content}
				`;
				vectors.push(await getEmbedding(augmentedContent))
				console.log(vectors[vectors.length-1]);
			}
		} else {
			console.error('Parsing failed: tree object is null.');
		}
	}
	else {
        console.log('No active text editor found.');
    }
	
}
