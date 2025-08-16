from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import figma

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3006",
    "http://127.0.0.1:3006",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(figma.router, prefix="/api/v1")