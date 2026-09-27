from pydantic import BaseModel
from typing import Literal

class SemanticSearchOutputModel(BaseModel):
    movieIds: list[int]
    response: str