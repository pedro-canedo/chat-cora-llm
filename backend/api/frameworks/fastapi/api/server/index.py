

from api.middleware.index import MiddlewareApi
from fastapi import FastAPI, HTTPException, Request
from dotenv import load_dotenv


class Api:
    def __init__(self):
        load_dotenv()
        self.app = FastAPI(title="PCO-SYSTEMS API LLM", version="1.0.0")

        self._init_middleware()
        self.middleware = None

    def _init_middleware(self):
        self.middleware = MiddlewareApi(self.app)
        self.app = self.middleware.app

    def get_app(self):
        return self.app

    def origins_allowed(self):
        return MiddlewareApi(self.app).origins


app = Api().app


@app.middleware("http")
async def validate_origin(request: Request, call_next):
    origin = request.headers.get("origin")
    if not origin:
        raise HTTPException(
            status_code=403, detail="Acesso negado ao domínio não permitido.")
    response = await call_next(request)
    return response
