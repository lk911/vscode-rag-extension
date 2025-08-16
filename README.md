# CursorAtHome

A powerful VS Code extension that provides **RAG (Retrieval-Augmented Generation) capabilities** for code assistance using **local LLMs** and **self-hosted infrastructure**. Like Cursor and Copilot but completely free, open source, and running on your own machine.

## 🚀 Features

### **RAG-Powered Code Understanding**
- **Semantic Code Search**: Find relevant code snippets using natural language queries
- **Intelligent Code Chunking**: Automatically parses and indexes your codebase for efficient retrieval

### **Local AI Processing**
- **Self-hosted Embeddings**: Uses local ONNX models for code embedding generation
- **Vector Database**: HNSW-based vector similarity search for fast code retrieval
- **Privacy-First**: All processing happens locally - no data sent to external services

### **Advanced Code Parsing**
- **Tree-sitter Integration**: Precise syntax tree parsing for accurate code understanding
- **Structured Queries**: Custom query patterns for different programming languages
- **Context-Aware Retrieval**: Understands code structure, functions, classes, and relationships

### **VS Code Integration**
- **Seamless Workflow**: Integrated commands and features within VS Code
- **Real-time Indexing**: Automatically updates code index as you work
- **Smart Suggestions**: Context-aware code recommendations based on your codebase


## 📋 Requirements

### **System Requirements**
- VS Code 1.102.0 or higher
- Node.js 20.x or higher
- Sufficient RAM for local AI models (recommended: 8GB+)

### **Dependencies**
The extension automatically handles all required dependencies:
- **ONNX Runtime**: For local model inference
- **Tree-sitter**: For precise code parsing
- **HNSW**: For efficient vector similarity search
- **Transformers.js**: For local embedding generation

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/cursorathome.git
   cd cursorathome
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run compile
   ```

4. **Install in VS Code**:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "Extensions: Install from VSIX"
   - Select the built `.vsix` file from the `dist` folder

## 🎯 Usage

### **Basic Commands**

The extension provides several commands accessible via the Command Palette (`Ctrl+Shift+P`):

- **`cursorathome.parseCurrentFile`**: Parse and index the currently open file
- **`cursorathome.showinputbox`**: Interactive input for code queries



## ⚙️ Configuration

### **Extension Settings**
