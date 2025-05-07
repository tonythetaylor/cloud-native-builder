from pydantic import BaseModel, ConfigDict
from typing import Any

class ProjectCreate(BaseModel):
    name: str
    config: Any

class ProjectOut(BaseModel):
    id: int
    name: str
    config: Any
    owner_id: int

    model_config = ConfigDict(from_attributes=True)