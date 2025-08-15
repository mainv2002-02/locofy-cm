from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class FigmaFile(BaseModel):
    id: str # Figma file ID
    name: str # Figma file name
    image_url: Optional[str] = None # URL to the preview image of the file
    upload_timestamp: datetime = datetime.utcnow()
    # Add other file-level metadata as needed
