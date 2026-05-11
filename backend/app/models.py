from datetime import datetime
from enum import Enum
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field


class DocumentStatus(str, Enum):
    PROCESSING = "processing"
    NEEDS_REVIEW = "needs_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class ExtractedField(BaseModel):
    name: str
    value: str
    confidence: float = Field(ge=0, le=1)
    source: str = "ai"
    approved: bool = False


class ValidationIssue(BaseModel):
    field: str
    severity: str
    message: str


class DocumentRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    filename: str
    content_type: str
    file_path: str
    document_type: str = "unknown"
    status: DocumentStatus = DocumentStatus.PROCESSING
    raw_text: str = ""
    summary: str = ""
    confidence_score: float = 0
    fields: list[ExtractedField] = Field(default_factory=list)
    validation_issues: list[ValidationIssue] = Field(default_factory=list)
    audit_history: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class FieldUpdate(BaseModel):
    value: str
    approved: bool = True


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    citations: list[str] = Field(default_factory=list)

