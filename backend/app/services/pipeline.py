from app.models import DocumentRecord, DocumentStatus
from app.services.classifier import classify_document
from app.services.extractor import extract_fields
from app.services.ocr import extract_text
from app.services.validator import calculate_confidence, validate_fields


def process_document(document: DocumentRecord) -> DocumentRecord:
    raw_text = extract_text(document.file_path, document.content_type)
    document_type, classification_confidence = classify_document(raw_text)
    fields = extract_fields(raw_text, document_type)
    validation_issues = validate_fields(document_type, fields)
    confidence_score = calculate_confidence(classification_confidence, fields, len(validation_issues))

    document.raw_text = raw_text
    document.document_type = document_type
    document.fields = fields
    document.validation_issues = validation_issues
    document.confidence_score = confidence_score
    document.status = DocumentStatus.APPROVED if confidence_score >= 0.9 and not validation_issues else DocumentStatus.NEEDS_REVIEW
    document.summary = summarize_document(raw_text, document_type)
    document.audit_history.append(
        {
            "actor": "system",
            "action": "processed_document",
            "status": document.status,
            "confidence_score": confidence_score,
        }
    )
    return document


def summarize_document(text: str, document_type: str) -> str:
    cleaned = " ".join(text.split())
    if not cleaned:
        return f"{document_type} uploaded, but no readable text was extracted."
    return cleaned[:320]

