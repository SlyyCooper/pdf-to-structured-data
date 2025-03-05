"""
app/services/gemini_service.py
Service for interacting with the Google Gemini API for PDF processing.
"""
import json
import base64
from typing import Dict, Any, Optional

import google.generativeai as genai
from app.config import settings

class GeminiService:
    """Service for interacting with the Google Gemini API."""
    
    def __init__(self):
        """Initialize the Gemini service with API key from settings."""
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            generation_config={
                "max_output_tokens": settings.GEMINI_MAX_OUTPUT_TOKENS,
                "response_mime_type": "application/json",
            }
        )
    
    def extract_structured_data(self, pdf_bytes: bytes, document_type: Optional[str] = None) -> Dict[Any, Any]:
        """
        Extract structured data from a PDF using Gemini API.
        
        Args:
            pdf_bytes: Raw PDF file bytes
            document_type: Optional hint about the document type (invoice, receipt, etc.)
            
        Returns:
            Dict: Extracted structured data as a JSON object
            
        Raises:
            Exception: If extraction fails
        """
        try:
            # Convert PDF bytes to base64 for Gemini API
            content_b64 = base64.b64encode(pdf_bytes).decode("utf-8")
            
            # Create prompt based on document type
            prompt = "Given this PDF document, extract all relevant structured data into a clean JSON format."
            if document_type:
                prompt += f" This is a {document_type} document."
            
            prompt += " Identify all key information such as headers, tables, form fields, and other structured content. Return only valid JSON."
            
            # Prepare request
            contents = [
                {"role": "user", "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": "application/pdf", "data": content_b64}}
                ]}
            ]
            
            # Send request to Gemini
            response = self.model.generate_content(contents=contents)
            
            # Parse JSON response
            result = json.loads(response.text)
            return result
            
        except Exception as e:
            # Return error as JSON
            return {
                "error": "Failed to extract data from PDF",
                "detail": str(e)
            }
    
    def check_health(self) -> Dict[str, Any]:
        """
        Check if the Gemini API is accessible.
        
        Returns:
            Dict: Health status information
        """
        try:
            # Simple test prompt to check API connectivity
            response = self.model.generate_content("Test connection")
            return {
                "status": "healthy",
                "gemini_api_accessible": True
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "gemini_api_accessible": False,
                "error": str(e)
            }
