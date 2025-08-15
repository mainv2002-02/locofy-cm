from pydantic import BaseModel

class FigmaParseRequest(BaseModel):
    figma_url: str
    figma_token: str
