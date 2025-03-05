"""
app/config.py
Configuration settings for the PDF to Structured Data application.
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API settings
    API_TITLE: str = "PDF to Structured Data API"
    API_DESCRIPTION: str = "Extract structured data from PDFs using Google Gemini AI"
    API_VERSION: str = "1.0.0"
    
    # Google API settings
    GOOGLE_API_KEY: str
    
    # Gemini model settings
    GEMINI_MODEL: str = "gemini-2.0-flash"
    GEMINI_MAX_OUTPUT_TOKENS: int = 2048
    
    # File upload settings
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "temp_uploads")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Initialize settings
settings = Settings() 