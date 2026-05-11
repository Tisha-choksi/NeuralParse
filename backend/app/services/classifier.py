DOCUMENT_KEYWORDS = {
    "invoice": ["invoice", "tax invoice", "gst", "amount due", "invoice number"],
    "insurance_claim": ["claim", "policy", "insured", "diagnosis", "claim number"],
    "medical_bill": ["patient", "doctor", "treatment", "prescription", "medical"],
    "contract": ["agreement", "party", "clause", "effective date", "termination"],
    "bank_statement": ["statement", "account number", "debit", "credit", "balance"],
}


def classify_document(text: str) -> tuple[str, float]:
    normalized = text.lower()
    scores = {
        document_type: sum(1 for keyword in keywords if keyword in normalized)
        for document_type, keywords in DOCUMENT_KEYWORDS.items()
    }
    best_type = max(scores, key=scores.get)
    best_score = scores[best_type]

    if best_score == 0:
        return "unknown", 0.35

    confidence = min(0.55 + best_score * 0.12, 0.95)
    return best_type, confidence

