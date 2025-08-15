from pymongo import MongoClient
from app.config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.get_database("figma_data")
collection = db.get_collection("figma_elements")

def get_collection():
    return collection
