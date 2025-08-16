from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class FigmaFontStyle(BaseModel):
    fontFamily: Optional[str] = None
    fontPostScriptName: Optional[str] = None
    fontSize: Optional[float] = None
    fontWeight: Optional[int] = None
    textAutoResize: Optional[str] = None
    textAlignHorizontal: Optional[str] = None
    textAlignVertical: Optional[str] = None
    letterSpacing: Optional[float] = None
    lineHeightPx: Optional[float] = None
    lineHeightPercent: Optional[float] = None
    lineHeightUnit: Optional[str] = None
