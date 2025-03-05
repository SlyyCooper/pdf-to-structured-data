# PDF to Structured Data - Frontend

A clean, modern frontend for the PDF to Structured Data API.

## Overview

This frontend provides a user-friendly interface for uploading PDF documents and viewing the structured data extracted by the Google Gemini AI. The UI is designed with a clean, Apple-inspired aesthetic with focus on simplicity and usability.

## Features

- **Drag & Drop Upload**: Easily upload PDF files by dragging and dropping them onto the interface.
- **Visual Feedback**: Clear loading states and success/error messages provide feedback during processing.
- **JSON Viewer**: Extracted data is displayed in a formatted JSON viewer with syntax highlighting.
- **Copy to Clipboard**: One-click copying of the extracted JSON data.
- **Responsive Design**: Works on desktop and mobile devices.

## Setup

1. Place the `index.html` and `scripts.js` files in a directory served by a web server.
2. Make sure the backend API is running at `http://localhost:8000` (or update the `API_CONFIG.BASE_URL` in `scripts.js` to match your API location).
3. Open the frontend in a web browser.

## Usage

1. **Upload a PDF**:
   - Click the upload area or drag and drop a PDF file onto it.
   - The file will be automatically uploaded and processed.

2. **View Results**:
   - Once processing is complete, the structured data will be displayed in JSON format.
   - Use the "Copy JSON" button to copy the data to the clipboard.

3. **Upload Another PDF**:
   - Click the "New File" button to upload and process another PDF.

## Customization

- **API Endpoint**: Update the `API_CONFIG` object in `scripts.js` to point to your API.
- **Styling**: Modify the CSS variables in the `:root` selector to change the color scheme.
- **File Size Limit**: Change the maximum file size check in the `uploadPDF` function (currently set to 10MB). 