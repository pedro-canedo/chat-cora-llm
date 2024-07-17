from fastapi import FastAPI, HTTPException
import aiohttp
import logging
import os

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MODEL_URL = os.getenv("MODEL_URL", "http://ollama:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")
HEADERS = {"Content-Type": "application/json"}

# Default payload options
DEFAULT_OPTIONS = {
    "num_keep": 5,
    "seed": 42,
    "num_predict": 100,
    "top_k": 20,
    "top_p": 0.9,
    "tfs_z": 0.5,
    "typical_p": 0.7,
    "repeat_last_n": 33,
    "temperature": 0.8,
    "repeat_penalty": 1.2,
    "presence_penalty": 1.5,
    "frequency_penalty": 1.0,
    "mirostat": 1,
    "mirostat_tau": 0.8,
    "mirostat_eta": 0.6,
    "penalize_newline": True,
    "numa": False,
    "num_ctx": 1024,
    "num_batch": 2,
    "num_gpu": 1,
    "main_gpu": 0,
    "low_vram": False,
    "f16_kv": True,
    "vocab_only": False,
    "use_mmap": True,
    "use_mlock": False,
    "num_thread": 8
}


@app.get("/")
async def read_root():
    return {"message": "Bem-vindo à API LLM"}


@app.post("/generate")
async def generate_text(prompt: str):
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": DEFAULT_OPTIONS
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(MODEL_URL, json=payload, headers=HEADERS) as response:
                if response.status != 200:
                    logger.error(
                        f"Error communicating with model API: {response.status} - {response.reason}")
                    raise HTTPException(
                        status_code=500, detail=f"Error communicating with model API: {response.status} - {response.reason}")
                return await response.json()
    except aiohttp.ClientError as e:
        logger.error(f"Network error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
