from llama_cpp import Llama

# Load the model
# Replace "path/to/your/model.gguf" with the actual path to your downloaded model file
llm = Llama(
    model_path="./models/llama-2-7b-chat.Q4_K_M.gguf",
    n_ctx=2048,  # Max context window size (tokens)
    n_threads=4, # Number of CPU threads to use
    n_gpu_layers=-1 # Uncomment to offload all layers to GPU (if GPU acceleration is set up)
)

# Provide a prompt and generate a response
prompt = "Q: Name the planets in the solar system? A:"
output = llm(
    prompt,
    max_tokens=256,  # Maximum number of tokens to generate
    temperature=0.7, # Controls creativity (0.0-1.0, lower is more deterministic)
    top_p=0.9,       # Nucleus sampling (higher values consider more diverse tokens)
    echo=True,       # Whether to echo the prompt in the output
    stop=["Q:", "\n"] # Stop generation when these strings are encountered
)

print(output["choices"][0]["text"].strip())