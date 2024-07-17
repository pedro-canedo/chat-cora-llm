from fastapi import FastAPI, HTTPException, Request
import aiohttp
import logging
import os
from pydantic import BaseModel
from typing import Optional
from fastapi.responses import StreamingResponse

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default configuration
MODEL_URL = os.getenv("MODEL_URL", "http://ollama:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")
HEADERS = {"Content-Type": "application/json"}

DEFAULT_OPTIONS = {

    "temperature": 0.5,
}

options = DEFAULT_OPTIONS.copy()


class ModelOptions(BaseModel):
    temperature: Optional[float] = None


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

    async def stream_response():
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(MODEL_URL, json=payload, headers=HEADERS) as response:
                    if response.status != 200:
                        logger.error(
                            f"Error communicating with model API: {response.status} - {response.reason}")
                        raise HTTPException(
                            status_code=500, detail=f"Error communicating with model API: {response.status} - {response.reason}")

                    async for line in response.content:
                        yield line.decode('utf-8')
        except aiohttp.ClientConnectionError as e:
            logger.error(f"Client connection error: {str(e)}")
            yield "Connection closed by server\n"
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            yield "An unexpected error occurred\n"

    return StreamingResponse(stream_response(), media_type="text/event-stream")


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
