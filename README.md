# 🦊 PDF to Structured Data

Extract structured data from PDF documents using Google Gemini AI.

## Overview

This API service leverages Google's Gemini multimodal AI to extract structured data from PDF documents without requiring predefined schemas. Gemini can automatically analyze both text and visual elements in PDFs and extract them into structured JSON format.

Key features:
- Simple PDF upload and processing
- Dynamic data extraction without predefined schemas
- Uses Gemini's visual understanding capabilities
- Modern, user-friendly frontend interface

## Architecture

The application follows a simple design:

```
pdf-to-structured-data/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   └── pdf_routes.py    # API endpoints for PDF processing
│   ├── services/
│   │   └── gemini_service.py    # Gemini API integration
│   ├── utils/
│   │   └── file_utils.py        # File handling utilities
│   ├── config.py                # Configuration settings
│   └── main.py                  # FastAPI application entry point
├── frontend/
│   ├── index.html               # Frontend UI
│   ├── scripts.js               # Frontend JavaScript
│   └── README.md                # Frontend documentation
├── temp_uploads/                # Temporary storage for PDFs
├── requirements.txt
└── README.md
```

## How It Works

1. **Upload:** PDF documents are uploaded through the API or frontend
2. **Process:** PDF is sent to Gemini with a carefully crafted prompt
3. **Extract:** Gemini analyzes the document and extracts structured data
4. **Return:** Structured JSON data is returned to the client

## Installation

### Prerequisites

- Python 3.9+
- Google Gemini API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/SlyyCooper/pdf-to-structured-data.git
cd pdf-to-structured-data
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your Gemini API key:
```
GOOGLE_API_KEY=your_api_key_here
```

## Usage

### Starting the API

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

### Running the Frontend

Open `frontend/index.html` in a web browser, or serve it using a static file server.

For example, using Python's built-in HTTP server:

```bash
cd frontend
python -m http.server 8080
```

Then open http://localhost:8080 in your browser.

### API Endpoints

#### Upload a PDF
```
POST /api/v1/upload
```
- Request: Multipart form with file
- Response: JSON with file ID

#### Extract Data
```
POST /api/v1/extract/{file_id}
```
- Path Parameters:
  - `file_id`: ID of the uploaded file
- Request Body (optional):
  - `document_type`: Hint about the document type (optional)
- Response: JSON with extracted structured data

#### Health Check
```
GET /api/v1/health
```
- Response: API health status

## Examples

### 1. Upload a PDF

```bash
curl -X POST -F "file=@invoice.pdf" http://localhost:8000/api/v1/upload
```

Response:
```json
{
  "file_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6.pdf",
  "filename": "invoice.pdf",
  "size_bytes": 12345
}
```

### 2. Extract Data

```bash
curl -X POST -H "Content-Type: application/json" -d '{"document_type": "invoice"}' http://localhost:8000/api/v1/extract/3fa85f64-5717-4562-b3fc-2c963f66afa6.pdf
```

Response:
```json
{
  "document_type": "invoice",
  "vendor": {
    "name": "ACME Corp",
    "address": "123 Main St, Anytown, USA"
  },
  "invoice_number": "INV-12345",
  "date": "2023-06-01",
  "items": [
    {
      "description": "Product A",
      "quantity": 2,
      "unit_price": 49.99,
      "amount": 99.98
    }
  ],
  "subtotal": 99.98,
  "tax": 8.00,
  "total": 107.98
}
```

## Frontend

The application includes a modern, user-friendly frontend designed with an Apple-inspired aesthetic. Key features:

- Drag & drop PDF uploads
- Clear visual feedback during processing
- Formatted JSON display with syntax highlighting
- One-click copy to clipboard
- Responsive design for mobile and desktop

For more details, see the [Frontend README](frontend/README.md).

## License

[MIT License](LICENSE) 