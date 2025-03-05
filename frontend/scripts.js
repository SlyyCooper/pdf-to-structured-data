/**
 * scripts.js
 * Handles PDF uploads and interactions with the PDF to Structured Data API.
 */

// API endpoint configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  UPLOAD_ENDPOINT: '/api/v1/upload',
  EXTRACT_ENDPOINT: '/api/v1/extract',
  HEALTH_ENDPOINT: '/api/v1/health'
};

// DOM elements
const elements = {
  fileInput: document.getElementById('fileInput'),
  uploadContainer: document.getElementById('uploadContainer'),
  uploadLoading: document.getElementById('uploadLoading'),
  uploadError: document.getElementById('uploadError'),
  uploadErrorText: document.getElementById('uploadErrorText'),
  resultContainer: document.getElementById('resultContainer'),
  fileName: document.getElementById('fileName'),
  fileSize: document.getElementById('fileSize'),
  extractLoading: document.getElementById('extractLoading'),
  jsonOutput: document.getElementById('jsonOutput'),
  extractError: document.getElementById('extractError'),
  extractErrorText: document.getElementById('extractErrorText'),
  extractSuccess: document.getElementById('extractSuccess'),
  newFileButton: document.getElementById('newFileButton'),
  copyButton: document.getElementById('copyButton')
};

// Current file state
let currentState = {
  fileId: null,
  fileName: null,
  fileSize: null
};

/**
 * Format file size in a human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Pretty format JSON for display
 * @param {object} json - JSON object
 * @returns {string} - Formatted JSON string
 */
function formatJSON(json) {
  return JSON.stringify(json, null, 2);
}

/**
 * Show an error message
 * @param {string} message - Error message to display
 * @param {string} type - Error type ('upload' or 'extract')
 */
function showError(message, type = 'upload') {
  const errorElement = type === 'upload' ? elements.uploadError : elements.extractError;
  const errorTextElement = type === 'upload' ? elements.uploadErrorText : elements.extractErrorText;
  
  errorTextElement.textContent = message;
  errorElement.style.display = 'flex';
  
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 8000);
}

/**
 * Upload a PDF file to the API
 * @param {File} file - PDF file to upload
 * @returns {Promise}
 */
async function uploadPDF(file) {
  // Check file type
  if (!file.type || file.type !== 'application/pdf') {
    throw new Error('Please select a valid PDF file');
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds the 10MB limit');
  }
  
  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  
  // Show loading state
  elements.uploadContainer.style.display = 'none';
  elements.uploadLoading.style.display = 'block';
  elements.uploadError.style.display = 'none';
  
  try {
    // Send the request
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.UPLOAD_ENDPOINT}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      let errorMsg = 'Failed to upload file';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorMsg;
      } catch (e) {
        // Use default error message
      }
      throw new Error(errorMsg);
    }
    
    // Parse response
    const result = await response.json();
    
    // Update current state
    currentState.fileId = result.file_id;
    currentState.fileName = file.name;
    currentState.fileSize = file.size;
    
    // Hide loading, show success
    elements.uploadLoading.style.display = 'none';
    
    // Update UI with file info
    elements.fileName.textContent = file.name;
    elements.fileSize.textContent = formatFileSize(file.size);
    
    // Proceed to extraction
    extractData();
    
  } catch (error) {
    // Hide loading, show error
    elements.uploadLoading.style.display = 'none';
    elements.uploadContainer.style.display = 'flex';
    showError(error.message, 'upload');
  }
}

/**
 * Extract structured data from the uploaded PDF
 */
async function extractData() {
  if (!currentState.fileId) {
    showError('No file has been uploaded', 'extract');
    return;
  }
  
  // Show loading state
  elements.extractLoading.style.display = 'block';
  elements.extractError.style.display = 'none';
  elements.extractSuccess.style.display = 'none';
  elements.resultContainer.style.display = 'block';
  
  try {
    // Send the extraction request
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.EXTRACT_ENDPOINT}/${currentState.fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!response.ok) {
      let errorMsg = 'Failed to extract data';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorData.error || errorMsg;
      } catch (e) {
        // Use default error message
      }
      throw new Error(errorMsg);
    }
    
    // Parse response
    const result = await response.json();
    
    // Update UI with result
    elements.jsonOutput.textContent = formatJSON(result);
    elements.extractSuccess.style.display = 'flex';
    
  } catch (error) {
    // Show error
    showError(error.message, 'extract');
    
  } finally {
    // Hide loading
    elements.extractLoading.style.display = 'none';
  }
}

/**
 * Check API health
 */
async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.HEALTH_ENDPOINT}`);
    if (!response.ok) {
      console.warn('API health check failed. The API might be down or unreachable.');
    }
  } catch (error) {
    console.warn('Could not connect to the API. Please ensure the API server is running.');
  }
}

/**
 * Reset the app to upload a new file
 */
function resetApp() {
  // Reset state
  currentState.fileId = null;
  currentState.fileName = null;
  currentState.fileSize = null;
  
  // Reset UI
  elements.resultContainer.style.display = 'none';
  elements.uploadContainer.style.display = 'flex';
  elements.uploadLoading.style.display = 'none';
  elements.uploadError.style.display = 'none';
  elements.extractLoading.style.display = 'none';
  elements.extractError.style.display = 'none';
  elements.extractSuccess.style.display = 'none';
  elements.jsonOutput.textContent = '// JSON output will appear here';
  
  // Reset file input
  elements.fileInput.value = '';
}

/**
 * Copy JSON to clipboard
 */
function copyToClipboard() {
  const jsonText = elements.jsonOutput.textContent;
  
  navigator.clipboard.writeText(jsonText).then(() => {
    // Change button text temporarily
    elements.copyButton.textContent = 'Copied!';
    setTimeout(() => {
      elements.copyButton.textContent = 'Copy JSON';
    }, 2000);
  }).catch(() => {
    showError('Failed to copy to clipboard', 'extract');
  });
}

/**
 * Initialize the application
 */
function initApp() {
  // Check API health on load
  checkAPIHealth();
  
  // File input change event
  elements.fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadPDF(file);
    }
  });
  
  // New file button click event
  elements.newFileButton.addEventListener('click', resetApp);
  
  // Copy button click event
  elements.copyButton.addEventListener('click', copyToClipboard);
  
  // Drag and drop support
  const dropArea = elements.uploadContainer;
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
      dropArea.classList.add('highlight');
    }, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
      dropArea.classList.remove('highlight');
    }, false);
  });
  
  dropArea.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadPDF(file);
    }
  }, false);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 