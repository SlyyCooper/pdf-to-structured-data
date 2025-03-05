"""
app/utils/file_utils.py
Utility functions for file handling in the PDF to Structured Data application.
"""

import os
import shutil
from typing import Optional


def ensure_dir_exists(directory: str) -> None:
    """
    Ensure that a directory exists, creating it if necessary.
    
    Args:
        directory: Path to the directory
    """
    os.makedirs(directory, exist_ok=True)
    

def delete_file(file_path: str) -> bool:
    """
    Delete a file if it exists.
    
    Args:
        file_path: Path to the file to delete
        
    Returns:
        bool: True if file was deleted, False if file did not exist
    """
    if os.path.exists(file_path):
        os.remove(file_path)
        return True
    return False

def read_file_bytes(file_path: str) -> Optional[bytes]:
    """
    Read a file and return its contents as bytes.
    
    Args:
        file_path: Path to the file to read
        
    Returns:
        Optional[bytes]: File contents as bytes, or None if file does not exist
    """
    if not os.path.exists(file_path):
        return None
        
    with open(file_path, "rb") as f:
        return f.read()
