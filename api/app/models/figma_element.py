from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from .figma_properties import FigmaProperties

class FigmaElement(BaseModel):
    id: str
    name: Optional[str] = None
    type: str
    properties: FigmaProperties
    componentId: Optional[str] = None # Only for INSTANCE type
    description: Optional[str] = None
    file_id: str
