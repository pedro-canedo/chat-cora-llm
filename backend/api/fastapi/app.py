from fastapi import FastAPI, HTTPException, Request
import aiohttp
import logging
import os
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default configuration
MODEL_URL = os.getenv("MODEL_URL", "http://ollama:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")
HEADERS = {"Content-Type": "application/json"}

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

options = DEFAULT_OPTIONS.copy()


class ModelOptions(BaseModel):
    num_keep: Optional[int] = None
    seed: Optional[int] = None
    num_predict: Optional[int] = None
    top_k: Optional[int] = None
    top_p: Optional[float] = None
    tfs_z: Optional[float] = None
    typical_p: Optional[float] = None
    repeat_last_n: Optional[int] = None
    temperature: Optional[float] = None
    repeat_penalty: Optional[float] = None
    presence_penalty: Optional[float] = None
    frequency_penalty: Optional[float] = None
    mirostat: Optional[int] = None
    mirostat_tau: Optional[float] = None
    mirostat_eta: Optional[float] = None
    penalize_newline: Optional[bool] = None
    numa: Optional[bool] = None
    num_ctx: Optional[int] = None
    num_batch: Optional[int] = None
    num_gpu: Optional[int] = None
    main_gpu: Optional[int] = None
    low_vram: Optional[bool] = None
    f16_kv: Optional[bool] = None
    vocab_only: Optional[bool] = None
    use_mmap: Optional[bool] = None
    use_mlock: Optional[bool] = None
    num_thread: Optional[int] = None


@app.get("/")
async def read_root():
    return {"message": "Bem-vindo à API LLM"}


@app.post("/generate")
async def generate_text(request: Request, prompt: str):
    global options
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": True,
        "options": options
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(MODEL_URL, json=payload, headers=HEADERS) as response:
                if response.status != 200:
                    logger.error(
                        f"Error communicating with model API: {response.status} - {response.reason}")
                    raise HTTPException(
                        status_code=500, detail=f"Error communicating with model API: {response.status} - {response.reason}")

                async def stream_response():
                    async for line in response.content:
                        yield line
                return stream_response()
    except aiohttp.ClientError as e:
        logger.error(f"Network error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Unexpected error: {str(e)}")


@app.post("/set_options")
async def set_options(new_options: ModelOptions):
    global options
    for key, value in new_options.dict(exclude_unset=True).items():
        options[key] = value
    logger.info(f"Options updated: {options}")
    return {"message": "Options updated", "options": options}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
