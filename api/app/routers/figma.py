from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends

from app.schemas import FigmaParseRequest
from app.models import FigmaElement, FigmaFile # Import FigmaFile
from app.services.database import get_figma_elements_collection, get_figma_files_collection # Updated import
from app.services.figma_parser import parse_figma_file_data

router = APIRouter()



@router.post("/parse-figma")
async def parse_figma_file(request: FigmaParseRequest, elements_collection=Depends(get_figma_elements_collection)):
    extracted_data = parse_figma_file_data(request.figma_url, request.figma_token)
    
    try:
        if extracted_data:
            result = elements_collection.insert_many([element.dict() for element in extracted_data])
            return {"message": "Figma data parsed and saved successfully", "inserted_ids": [str(id) for id in result.inserted_ids]}
        else:
            return {"message": "No components or instances found to save."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/figma-elements", response_model=List[FigmaElement])
async def get_all_figma_elements(file_id: Optional[str] = None, elements_collection=Depends(get_figma_elements_collection)):
    query = {}
    if file_id:
        query["file_id"] = file_id
    elements = []
    for doc in elements_collection.find(query):
        doc["_id"] = str(doc["_id"])
        elements.append(FigmaElement(**doc))
    return elements

@router.get("/figma-elements/{element_id}", response_model=FigmaElement)
async def get_figma_element_by_id(element_id: str, file_id: Optional[str] = None, elements_collection=Depends(get_figma_elements_collection)):
    query = {"id": element_id}
    if file_id:
        query["file_id"] = file_id
    element = elements_collection.find_one(query)
    if element:
        element["_id"] = str(element["_id"])
        return FigmaElement(**element)
    raise HTTPException(status_code=404, detail="Figma element not found")

@router.delete("/figma-elements/{element_id}")
async def delete_figma_element(element_id: str, file_id: Optional[str] = None, elements_collection=Depends(get_figma_elements_collection)):
    query = {"id": element_id}
    if file_id:
        query["file_id"] = file_id
    result = elements_collection.delete_one(query)
    if result.deleted_count == 1:
        return {"message": f"Figma element with ID {element_id} deleted successfully"}
    raise HTTPException(status_code=404, detail=f"Figma element with ID {element_id} not found")

# New endpoints for FigmaFile management
@router.get("/figma-files", response_model=List[FigmaFile])
async def get_all_figma_files(files_collection=Depends(get_figma_files_collection)):
    files = []
    for doc in files_collection.find({}):
        doc["_id"] = str(doc["_id"])
        files.append(FigmaFile(**doc))
    return files

@router.get("/figma-files/{file_id}", response_model=FigmaFile)
async def get_figma_file_by_id(file_id: str, files_collection=Depends(get_figma_files_collection)):
    file_data = files_collection.find_one({"id": file_id})
    if file_data:
        file_data["_id"] = str(file_data["_id"])
        return FigmaFile(**file_data)
    raise HTTPException(status_code=404, detail="Figma file not found")

@router.delete("/figma-files/{file_id}")
async def delete_figma_file(file_id: str, files_collection=Depends(get_figma_files_collection), elements_collection=Depends(get_figma_elements_collection)):
    # Delete the FigmaFile entry
    file_delete_result = files_collection.delete_one({"id": file_id})
    
    # Delete all associated FigmaElements
    elements_delete_result = elements_collection.delete_many({"file_id": file_id})

    if file_delete_result.deleted_count == 1:
        return {"message": f"Figma file {file_id} and {elements_delete_result.deleted_count} associated elements deleted successfully"}
    raise HTTPException(status_code=404, detail=f"Figma file {file_id} not found")