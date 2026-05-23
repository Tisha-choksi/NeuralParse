# NeuralParse — System Overview

## Backend System Design

**Stack:** FastAPI (Python 3.x) + Next.js 15 frontend

The backend is organized into a **service-oriented** architecture:

```
backend/app/
├── main.py          # FastAPI entry point, CORS, router mounts
├── config.py        # Pydantic settings (data/upload dirs)
├── models.py        # Pydantic schemas (DocumentRecord, ExtractedField, etc.)
├── storage.py       # JSON file persistence layer
├── routers/
│   ├── documents.py # CRUD, upload, chat endpoints
│   └── analytics.py # Aggregation endpoint
└── services/
    ├── ocr.py       # Text extraction (PDF, DOCX, images via Tesseract)
    ├── classifier.py# Keyword-based document type classification
    ├── extractor.py # Regex-based field extraction
    ├── validator.py # Validation + confidence scoring
    └── pipeline.py  # Orchestrates the ETL pipeline
```

---

## Database Currently Used

**JSON file-based persistence** — `backend/data/documents.json` is the only storage. No ORM, no SQL, no migrations.

The `docker-compose.yml` provisions **PostgreSQL 16**, **Qdrant** (vector DB), and **MinIO** (S3 storage), but the Python code does **not** connect to any of them yet — they are provisioned for future use.

---

## App Flow

```
Upload (POST /documents/upload)
  -> Save file to disk (uploads/)
  -> Synchronous ETL pipeline runs inline:
       OCR(text extraction) -> Classification -> Field Extraction -> Validation -> Confidence Scoring -> Status Assignment -> Summarization
  -> Persist to documents.json
  -> Return DocumentRecord JSON

View (GET /documents, GET /documents/{id})
  -> Read documents.json, filter/sort

Review (POST /documents/{id}/approve|reject, PATCH /documents/{id}/fields/{field_name})
  -> Update in-memory dict, write back to documents.json

Chat (POST /documents/{id}/chat)
  -> Simple keyword matching in question text — mock only

Analytics (GET /analytics)
  -> Python-side aggregation: status counts, type counts, avg confidence
```

**No auth, no background workers, no queues.** Everything is synchronous and single-threaded per request.

---

## ETL Pipeline (services/pipeline.py)

| Stage | Module | Method |
|-------|--------|--------|
| **Extract** | `ocr.py` | PDF via `pypdf`, DOCX via `python-docx`, images via `pytesseract` |
| **Classify** | `classifier.py` | Keyword heuristic matching → 5 types (invoice, insurance_claim, medical_bill, contract, bank_statement) |
| **Extract Fields** | `extractor.py` | Regex patterns (invoice#, claim#, GST, amount, dates, vendor, patient) |
| **Validate** | `validator.py` | Required field checks per type + low-confidence flags |
| **Score** | `validator.py` | `(classify_conf + avg_field_conf)/2 - issues*0.08`, clamped to 0.05–min(1, raw) |
| **Status** | `pipeline.py` | Auto-approved if confidence >= 0.9 and zero issues, else `needs_review` |
| **Summarize** | `pipeline.py` | First 320 chars of raw text |

---

## Key Observations

- **MVP/Prototype stage** — README explicitly calls it an MVP with 5 next steps (replace mocks, add real DB, add vector search, add auth, background processing)
- **No concurrency control** — `storage.py` does read-all/write-all on every operation
- **Chat is a mock** — keyword matching only; Qdrant is provisioned but unused
- **No error/retry handling** in the pipeline — if OCR fails mid-stage, the document is stuck
- **Hardcoded audit actor** (`"reviewer"`) — no real user identity

---

## What a User Can Do on the Website

1. **Upload a document** (invoice, insurance claim, medical bill, contract, or bank statement) via the home page upload form
2. **View the document list** — see all uploaded docs with their status (processing, needs_review, approved, rejected)
3. **Review & correct** documents flagged as `needs_review` — approve, reject, or fix extracted fields
4. **Chat with a document** — ask questions about its contents (keyword-based mock)
5. **View analytics** — see pipeline stats: status breakdown, document type distribution, average confidence scores

## Purpose / Use Case

This is an **enterprise document intelligence MVP** — it automates extracting structured data from unstructured business documents. The target use case is:

- **Accounts payable** — automatically parse invoices, extract amounts, vendor names, invoice numbers
- **Insurance/healthcare claims processing** — extract claim numbers, patient names, diagnosis codes from medical bills and insurance forms
- **Contract management** — extract parties, dates, clauses from legal agreements
- **Bank statement processing** — extract transactions, balances, account numbers

A human reviewer then validates the AI-extracted data, correcting any errors before it flows downstream (e.g., into an ERP or accounting system). The pipeline saves hours of manual data entry.
