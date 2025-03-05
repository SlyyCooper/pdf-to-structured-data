"""
app/api/routes/pdf_routes.py
API routes for PDF upload and data extraction.
"""
import os
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.config import settings
from app.services.gemini_service import GeminiService
from app.utils.file_utils import ensure_dir_exists, read_file_bytes

router = APIRouter()
gemini_service = GeminiService()

class ExtractRequest(BaseModel):
    """Request model for data extraction."""
    document_type: Optional[str] = None

@router.get("/health")
async def health_check():
    """Check the health of the API and Gemini service."""
    health_status = gemini_service.check_health()
    return health_status

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file for processing.
    
    Args:
        file: The PDF file to upload
    
    Returns:
        JSON response with file ID and metadata
    """
    try:
        # Check if file is a PDF
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400, 
                detail="Only PDF files are accepted"
            )
        
        # Generate a unique file ID
        file_id = f"{uuid.uuid4()}.pdf"
        
        # Ensure upload directory exists
        ensure_dir_exists(settings.UPLOAD_DIR)
        
        # Save the file
        file_path = os.path.join(settings.UPLOAD_DIR, file_id)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
            file_size = len(content)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "size_bytes": file_size
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading file: {str(e)}"
        )

@router.post("/extract/{file_id}")
async def extract_data(
    file_id: str,
    extract_request: Optional[ExtractRequest] = None
):
    """
    Extract structured data from a previously uploaded PDF.
    
    Args:
        file_id: ID of the uploaded PDF file
        extract_request: Optional extraction configuration
    
    Returns:
        JSON response with extracted structured data
    """
    # Default empty request if none provided
    if extract_request is None:
        extract_request = ExtractRequest()
    
    # Check if file exists
    file_path = os.path.join(settings.UPLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail=f"File with ID {file_id} not found"
        )
    
    try:
        # Read the PDF file
        pdf_bytes = read_file_bytes(file_path)
        if not pdf_bytes:
            raise HTTPException(
                status_code=500,
                detail="Error reading PDF file"
            )
        
        # Extract data using Gemini service
        result = gemini_service.extract_structured_data(
            pdf_bytes=pdf_bytes,
            document_type=extract_request.document_type
        )
        
        # Check for extraction errors
        if "error" in result:
            return JSONResponse(
                status_code=500,
                content=result
            )
        
        return result
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Failed to extract data",
                "detail": str(e)
            }
        )
