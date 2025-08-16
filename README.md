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

### **Code Indexing**

1. **Automatic Indexing**: The extension automatically indexes your codebase on startup
2. **Manual Parsing**: Use the parse command to manually index specific files
3. **Real-time Updates**: Code changes are automatically reflected in the index

### **Querying Your Codebase**

The extension uses natural language queries to find relevant code:

- "How do I add a new product to the catalog?"
- "Show me the Product class implementation"
- "How are async operations handled in this code?"
- "What is the structure of the FilterOptions interface?"

## ⚙️ Configuration

### **Extension Settings**

The extension can be configured through VS Code settings:

```json
{
  "cursorathome.enable": true,
  "cursorathome.embeddingModel": "jinaai/jina-embeddings-v2-base-code",
  "cursorathome.vectorDimensions": 768,
  "cursorathome.maxIndexSize": 10000
}
```

### **Model Configuration**

- **Embedding Model**: Uses Jina AI's code-optimized embeddings
- **Vector Dimensions**: 768-dimensional embeddings for optimal performance
- **Quantization**: 8-bit quantized models for memory efficiency

## 🏗️ Architecture

### **Core Components**

1. **Code Parser**: Tree-sitter based parsing for multiple languages
2. **Embedding Engine**: Local ONNX-based text-to-vector conversion
3. **Vector Database**: HNSW index for fast similarity search
4. **Query Engine**: Natural language to code retrieval system

### **Data Flow**

```
Code Files → Tree-sitter Parsing → Code Chunks → Embedding Generation → Vector Storage → Similarity Search → Results
```

### **Performance Optimizations**

- **Lazy Loading**: Models and parsers loaded on-demand
- **Vector Indexing**: Efficient HNSW algorithm for similarity search
- **Memory Management**: Automatic index resizing and optimization
- **Caching**: Intelligent caching of parsed results and embeddings

## 🔍 How It Works

### **1. Code Parsing**
- Uses tree-sitter to create abstract syntax trees
- Extracts meaningful code chunks (functions, classes, methods)
- Maintains context and relationships between code elements

### **2. Semantic Embedding**
- Converts code chunks to high-dimensional vectors
- Uses local ONNX models for privacy and performance
- Optimized for code-specific semantic understanding

### **3. Vector Search**
- Stores embeddings in HNSW vector database
- Enables fast similarity search across codebase
- Supports natural language queries

### **4. Intelligent Retrieval**
- Ranks results by semantic similarity
- Provides context-aware code suggestions
- Integrates seamlessly with VS Code workflow

## 🚧 Known Issues

- **Initial Load Time**: First-time model loading may take several seconds
- **Memory Usage**: Large codebases may require significant RAM
- **Language Support**: Some advanced language features may have limited support

## 📝 Release Notes

### **0.0.1** (Current)
- Initial release with core RAG functionality
- Support for 18+ programming languages
- Local embedding generation and vector search
- Basic VS Code integration

### **Planned Features**
- Enhanced natural language querying
- Code generation capabilities
- Improved performance optimizations
- Extended language support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and standards
- Testing requirements
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Tree-sitter**: For robust code parsing
- **ONNX Runtime**: For local model inference
- **HNSW**: For efficient vector similarity search
- **Jina AI**: For code-optimized embedding models

## 📞 Support

- **Issues**: Report bugs and feature requests on GitHub
- **Discussions**: Join community discussions for help and ideas
- **Documentation**: Check our wiki for detailed guides

---

**Enjoy coding with CursorAtHome!** 🎉

*Like Cursor, but yours to own and control.*
