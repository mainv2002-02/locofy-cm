from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.schemas import FigmaParseRequest
from app.models import FigmaElement
from app.services.database import get_collection
from app.services.figma_parser import parse_figma_file_data

router = APIRouter()



@router.post("/parse-figma")
async def parse_figma_file(request: FigmaParseRequest, collection=Depends(get_collection)):
    extracted_data = parse_figma_file_data(request.figma_url, request.figma_token)
    
    try:
        if extracted_data:
            result = collection.insert_many([element.dict() for element in extracted_data])
            return {"message": "Figma data parsed and saved successfully", "inserted_ids": [str(id) for id in result.inserted_ids]}
        else:
            return {"message": "No components or instances found to save."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
'''
@router.get("/figma-elements", response_model=List[FigmaElement])
async def get_all_figma_elements(collection=Depends(get_collection)):
    elements = []
    for doc in collection.find({}):
        doc["_id"] = str(doc["_id"])
        elements.append(FigmaElement(**doc))
    return elements

@router.get("/figma-elements/{element_id}", response_model=FigmaElement)
async def get_figma_element_by_id(element_id: str, collection=Depends(get_collection)):
    element = collection.find_one({"id": element_id})
    if element:
        element["_id"] = str(element["_id"])
        return FigmaElement(**element)
    raise HTTPException(status_code=404, detail="Figma element not found")

@router.delete("/figma-elements/{element_id}")
async def delete_figma_element(element_id: str, collection=Depends(get_collection)):
    result = collection.delete_one({"id": element_id})
    if result.deleted_count == 1:
        return {"message": f"Figma element with ID {element_id} deleted successfully"}
    raise HTTPException(status_code=404, detail=f"Figma element with ID {element_id} not found")
'''