import os


MODEL_URL = os.getenv("MODEL_URL", "http://ollama:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")
HEADERS = {"Content-Type": "application/json"}

DEFAULT_OPTIONS = {

    "temperature": 0.5,
}

OPTIONS = DEFAULT_OPTIONS.copy()
