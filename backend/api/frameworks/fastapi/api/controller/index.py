from logging import Logger
from models.index import ModelOptions
from settings.constants import HEADERS, MODEL_NAME, MODEL_URL, OPTIONS
from fastapi import APIRouter, Query, WebSocket, Depends, HTTPException, Request
from fastapi import APIRouter, FastAPI
import aiohttp
from fastapi.responses import StreamingResponse


router = APIRouter()
logger = Logger('CONTROLLER')


@router.get("/")
async def read_root():
    return {"message": "Api is Running", "model": MODEL_NAME, "options": OPTIONS, "is ready": True}


@router.post("/generate")
async def generate_text(request: Request, prompt: str):
    global OPTIONS
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": True,
        "options": OPTIONS
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


@router.post("/set_options")
async def set_options(new_options: ModelOptions):
    global options
    for key, value in new_options.dict(exclude_unset=True).items():
        options[key] = value
    logger.info(f"Options updated: {options}")
    return {"message": "Options updated", "options": options}
