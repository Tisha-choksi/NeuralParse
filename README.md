# NeuralParse

Enterprise document intelligence MVP for classifying documents, extracting structured fields, validating results, routing low-confidence cases to human review, and chatting with processed documents.

## What is included

- FastAPI backend with document upload, processing, review, analytics, and chat endpoints
- Next.js frontend with upload, document list, review, analytics, and chat screens
- Mock OCR/classification/extraction services that can be replaced with Tesseract, PaddleOCR, LayoutLMv3, LangGraph, and LLM calls
- Local JSON persistence so the project runs before adding PostgreSQL

## Workflow

```text
Upload document
  -> OCR / text extraction
  -> Document classification
  -> Field extraction
  -> Validation + anomaly checks
  -> Confidence scoring
  -> Human review or auto-approval
  -> Export / chat
```

## Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend URL: `http://localhost:8000`

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

## Next implementation steps

1. Replace mock OCR in `backend/app/services/ocr.py` with Tesseract/PaddleOCR.
2. Replace heuristic classification in `backend/app/services/classifier.py` with LayoutLMv3 or a transformer classifier.
3. Replace mock extraction in `backend/app/services/extractor.py` with LLM structured extraction.
4. Add LangGraph orchestration around the pipeline in `backend/app/services/pipeline.py`.
5. Move local JSON persistence to PostgreSQL and add Chroma/Qdrant for document chat.

