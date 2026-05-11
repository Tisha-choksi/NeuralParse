from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models import ChatRequest, ChatResponse, DocumentRecord, DocumentStatus, FieldUpdate
from app.services.pipeline import process_document
from app.storage import get_document, list_documents, save_document, save_upload

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentRecord)
async def upload_document(file: UploadFile = File(...)) -> DocumentRecord:
    content = await file.read()
    file_path = save_upload(file.filename or "document", content)

    document = DocumentRecord(
        filename=file.filename or file_path.name,
        content_type=file.content_type or "application/octet-stream",
        file_path=str(file_path),
    )
    processed = process_document(document)
    return save_document(processed)


@router.get("", response_model=list[DocumentRecord])
def documents() -> list[DocumentRecord]:
    return sorted(list_documents(), key=lambda item: item.created_at, reverse=True)


@router.get("/{document_id}", response_model=DocumentRecord)
def document_detail(document_id: str) -> DocumentRecord:
    document = get_document(document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.patch("/{document_id}/fields/{field_name}", response_model=DocumentRecord)
def update_field(document_id: str, field_name: str, payload: FieldUpdate) -> DocumentRecord:
    document = document_detail(document_id)
    for field in document.fields:
        if field.name == field_name:
            field.value = payload.value
            field.approved = payload.approved
            document.audit_history.append({"actor": "reviewer", "action": "updated_field", "field": field_name})
            return save_document(document)

    raise HTTPException(status_code=404, detail="Field not found")


@router.post("/{document_id}/approve", response_model=DocumentRecord)
def approve_document(document_id: str) -> DocumentRecord:
    document = document_detail(document_id)
    document.status = DocumentStatus.APPROVED
    document.audit_history.append({"actor": "reviewer", "action": "approved_document"})
    return save_document(document)


@router.post("/{document_id}/reject", response_model=DocumentRecord)
def reject_document(document_id: str) -> DocumentRecord:
    document = document_detail(document_id)
    document.status = DocumentStatus.REJECTED
    document.audit_history.append({"actor": "reviewer", "action": "rejected_document"})
    return save_document(document)


@router.post("/{document_id}/chat", response_model=ChatResponse)
def chat_with_document(document_id: str, payload: ChatRequest) -> ChatResponse:
    document = document_detail(document_id)
    question = payload.question.lower()

    matching_fields = [
        f"{field.name}: {field.value}"
        for field in document.fields
        if field.name.replace("_", " ") in question or field.name in question
    ]

    if matching_fields:
        answer = "I found these relevant extracted fields: " + "; ".join(matching_fields)
    else:
        answer = f"This {document.document_type} appears to contain: {document.summary}"

    return ChatResponse(answer=answer, citations=[document.filename])

