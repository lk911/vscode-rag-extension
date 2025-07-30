// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { create } from 'domain';
import { createTracing } from 'trace_events';
import * as vscode from 'vscode';
import { Parser, Language } from 'web-tree-sitter';
let parser: Parser | undefined;
// Parser.init().then(() => { parser = new Parser });
const loadedLanguages: Map<string,Language> = new Map();
const languageMap:{ [key:string]:string} = {
	'typescript': 'tree-sitter-typescript.wasm'
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	console.log('Extension "wehavecursorathome" is starting activation...');
	try{
		const wasmUri = vscode.Uri.joinPath(context.extensionUri, 'parsers', 'tree-sitter.wasm');
        console.log('Trying to read:', wasmUri.fsPath);
        try {
            const wasmBytes = await vscode.workspace.fs.readFile(wasmUri);
            console.log('Successfully read tree-sitter.wasm, bytes length:', wasmBytes.length);
        } catch (e) {
            console.error('Error reading tree-sitter.wasm:', e);
        }
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
		if(parser){
			try{
				const parserLangUri = vscode.Uri.joinPath(context.extensionUri,'parsers',languageMap['typescript']);
				const wasmBytes = await vscode.workspace.fs.readFile(parserLangUri)
				const loadLang = await Language.load(wasmBytes)
				parser.setLanguage(loadLang)
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
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "wehavecursorathome" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('wehavecursorathome.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from WeHaveCursorAtHome!');
	});
	const viewParse = vscode.commands.registerCommand('wehavecursorathome.parseCurrentFile', () =>
	{
		if(parser){
			CreateTree(parser)
		}
		else {
            vscode.window.showErrorMessage('Tree-sitter parser not initialized.');
        }
	}
	)

	context.subscriptions.push(disposable);
	context.subscriptions.push(viewParse);
}

// This method is called when your extension is deactivated
export function deactivate() {}


function CreateTree(parserparam: Parser){
	const editor = vscode.window.activeTextEditor;
	if(editor){
		const document: vscode.TextDocument = editor.document;
		const documentText = document.getText();
		const tree = parserparam.parse(documentText);
		if (tree) { // Defensive check, though tree-sitter almost always returns a Tree object
			console.log('Parsed active document:', tree.rootNode.toString());
		} else {
			console.error('Parsing failed: tree object is null.');
		}
	}
	else {
        console.log('No active text editor found.');
    }
}