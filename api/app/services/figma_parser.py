from typing import List
import requests
from fastapi import HTTPException
from app.models import FigmaProperties, FigmaElement, FigmaColor, FigmaFontStyle, FigmaFile
import re
from app.services.database import get_figma_elements_collection, get_figma_files_collection
from datetime import datetime

def extract_properties(node):
    parsed_fills = []
    if node.get("fills"):
        for fill in node["fills"]:
            if fill.get("type") == "SOLID" and fill.get("color"):
                parsed_fills.append(FigmaColor(**fill["color"]))
            # Handle other fill types (GRADIENT_LINEAR, etc.) if needed
    
    parsed_strokes = []
    if node.get("strokes"):
        for stroke in node["strokes"]:
            if stroke.get("type") == "SOLID" and stroke.get("color"):
                parsed_strokes.append(FigmaColor(**stroke["color"]))
            # Handle other stroke types if needed

    parsed_font_style = None
    if node.get("style") and node.get("type") == "TEXT":
        parsed_font_style = FigmaFontStyle(**node["style"])

    props = FigmaProperties(
        absoluteBoundingBox=node.get("absoluteBoundingBox"),
        fills=parsed_fills if parsed_fills else None,
        strokes=parsed_strokes if parsed_strokes else None,
        effects=node.get("effects"),
        text_content=node.get("characters"),
        font_style=parsed_font_style
    )
    return props

def parse_figma_file_data(figma_url: str, figma_token: str) -> List[FigmaElement]:
    match = re.search(r"figma.com/(file|design)/([a-zA-Z0-9]+)", figma_url)
    if not match:
        raise HTTPException(status_code=400, detail="Invalid Figma URL format. Could not extract file ID.")
    file_id = match.group(2)

    headers = {
        "X-Figma-Token": figma_token
    }

    try:
        response = requests.get(f"https://api.figma.com/v1/files/{file_id}", headers=headers)
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)
        figma_data = response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Figma API request failed: {e}")

    # Get the document node ID for image generation
    document_node_id = figma_data["document"]["id"]
    
    # Generate image URL for the document (or a specific page/frame)
    image_url = None
    try:
        image_response = requests.get(
            f"https://api.figma.com/v1/images/{file_id}/nodes?ids={document_node_id}&scale=1&format=png",
            headers=headers
        )
        image_response.raise_for_status()
        image_data = image_response.json()
        if "images" in image_data and document_node_id in image_data["images"]:
            image_url = image_data["images"][document_node_id]
    except requests.exceptions.RequestException as e:
        print(f"Warning: Could not generate image for Figma file: {e}") # Log warning, don't fail parsing

    # Create FigmaFile instance and save it
    figma_file_name = figma_data["name"] # Get file name from Figma API response
    figma_file_obj = FigmaFile(
        id=file_id,
        name=figma_file_name,
        image_url=image_url,
        upload_timestamp=datetime.utcnow()
    )
    figma_files_collection = get_figma_files_collection()
    figma_files_collection.insert_one(figma_file_obj.dict())


    extracted_data = []

    def traverse_nodes(nodes):
        for node in nodes:
            element_data = FigmaElement(
                id=node.get("id"),
                name=node.get("name"),
                type=node.get("type", "UNKNOWN"),
                properties=extract_properties(node),
                file_id=file_id # Assign file_id here
            )
            if node.get("type") == "INSTANCE":
                element_data.componentId = node.get("componentId")
            
            extracted_data.append(element_data)

            if "children" in node:
                traverse_nodes(node["children"])

    if "document" in figma_data and "children" in figma_data["document"]:
        traverse_nodes(figma_data["document"]["children"])

    if "components" in figma_data:
        for component_id, component_data in figma_data["components"].items():
            if not any(d.id == component_id for d in extracted_data):
                extracted_component = FigmaElement(
                    id=component_id,
                    name=component_data.get("name"),
                    type=component_data.get("type", "UNKNOWN"),
                    description=component_data.get("description"),
                    properties=extract_properties(component_data),
                    file_id=file_id # Assign file_id here
                )
                extracted_data.append(extracted_component)
    
    return extracted_data
