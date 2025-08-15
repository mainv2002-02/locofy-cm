from typing import List
import requests
from fastapi import HTTPException
from app.models import FigmaProperties, FigmaElement, FigmaColor, FigmaFontStyle
import re

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

    extracted_data = []

    def traverse_nodes(nodes):
        for node in nodes:
            element_data = FigmaElement(
                id=node.get("id"),
                name=node.get("name"),
                type=node.get("type", "UNKNOWN"),
                properties=extract_properties(node)
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
                    properties=extract_properties(component_data)
                )
                extracted_data.append(extracted_component)
    
    return extracted_data
