from pymongo import MongoClient
from app.config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.get_database("figma_data")
figma_elements_collection = db.get_collection("figma_elements")
figma_files_collection = db.get_collection("figma_files")

# Dependency functions for FastAPI
def get_figma_elements_collection():
    return figma_elements_collection

def get_figma_files_collection():
    return figma_files_collection
