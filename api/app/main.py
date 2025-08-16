from typing import Union
from fastapi import FastAPI
from app.routers import figma

app = FastAPI()

# Include routers
app.include_router(figma.router, prefix="/api/v1")
