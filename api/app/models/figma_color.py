from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class FigmaColor(BaseModel):
    r: float
    g: float
    b: float
    a: float
