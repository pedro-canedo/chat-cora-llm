from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

ORIGINS = [
    "*"
]


class MiddlewareApi:
    def __init__(self, app: FastAPI):
        self.app = app
        self.origins = ORIGINS

        self.origins.append("http://localhost:3000")
        self.origins.append("http://localhost:5173")
        self.origins.append("https://chatgpt.com")

        self._add_cors_middleware()

    def _add_cors_middleware(self):
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
