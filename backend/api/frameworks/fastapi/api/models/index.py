from pydantic import BaseModel
from typing import Optional


class ModelOptions(BaseModel):
    temperature: Optional[float] = None
