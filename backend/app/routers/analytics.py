from collections import Counter

from fastapi import APIRouter

from app.storage import list_documents

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("")
def analytics() -> dict:
    documents = list_documents()
    status_counts = Counter(document.status for document in documents)
    type_counts = Counter(document.document_type for document in documents)
    average_confidence = 0

    if documents:
        average_confidence = round(
            sum(document.confidence_score for document in documents) / len(documents),
            2,
        )

    return {
        "total_documents": len(documents),
        "status_counts": status_counts,
        "type_counts": type_counts,
        "average_confidence": average_confidence,
        "needs_review": status_counts.get("needs_review", 0),
    }

