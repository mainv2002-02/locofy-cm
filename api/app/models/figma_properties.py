from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from .figma_font_style import FigmaFontStyle
from .figma_color import FigmaColor

class FigmaProperties(BaseModel):
    absoluteBoundingBox: Optional[Dict[str, Any]] = None
    fills: Optional[List[FigmaColor]] = None
    strokes: Optional[List[FigmaColor]] = None
    effects: Optional[List[Dict[str, Any]]] = None
    text_content: Optional[str] = None
    font_style: Optional[FigmaFontStyle] = None
    # Add more properties as needed based on Figma API documentation
