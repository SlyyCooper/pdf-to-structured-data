"""
main.py
Project-level entry point for the PDF to Structured Data application.
This script simplifies running the application from the project root.
"""

import os
import uvicorn
from app.config import settings

if __name__ == "__main__":
    # Create the upload directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Run the application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
