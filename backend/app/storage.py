import json
from datetime import datetime
from pathlib import Path

from app.config import settings
from app.models import DocumentRecord

DB_PATH = settings.data_dir / "documents.json"


def _read_all() -> list[dict]:
    if not DB_PATH.exists():
        return []
    return json.loads(DB_PATH.read_text(encoding="utf-8"))


def _write_all(records: list[dict]) -> None:
    DB_PATH.write_text(json.dumps(records, indent=2, default=str), encoding="utf-8")


def list_documents() -> list[DocumentRecord]:
    return [DocumentRecord.model_validate(record) for record in _read_all()]


def get_document(document_id: str) -> DocumentRecord | None:
    for document in list_documents():
        if document.id == document_id:
            return document
    return None


def save_document(document: DocumentRecord) -> DocumentRecord:
    document.updated_at = datetime.utcnow()
    records = _read_all()
    records = [record for record in records if record["id"] != document.id]
    records.append(document.model_dump(mode="json"))
    _write_all(records)
    return document


def save_upload(filename: str, content: bytes) -> Path:
    safe_name = filename.replace("/", "_").replace("\\", "_")
    path = settings.upload_dir / safe_name
    path.write_bytes(content)
    return path

