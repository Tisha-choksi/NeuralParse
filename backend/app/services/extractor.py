import re

from app.models import ExtractedField


FIELD_PATTERNS = {
    "invoice_number": r"(?:invoice\s*(?:number|no\.?)\s*[:#-]?\s*)([A-Z0-9-]+)",
    "claim_number": r"(?:claim\s*(?:number|no\.?)\s*[:#-]?\s*)([A-Z0-9-]+)",
    "gst_number": r"(?:gst(?:in)?\s*[:#-]?\s*)([A-Z0-9]{10,20})",
    "amount": r"(?:total|amount due|grand total|claim amount)\s*[:#-]?\s*(?:rs\.?|inr|\$)?\s*([0-9,]+(?:\.[0-9]{2})?)",
    "date": r"(?:date|invoice date|bill date)\s*[:#-]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})",
    "due_date": r"(?:due date|payment due)\s*[:#-]?\s*([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4})",
    "vendor_name": r"(?:vendor|supplier|billed by)\s*[:#-]?\s*([A-Za-z0-9 &.,-]+)",
    "patient_name": r"(?:patient name|patient)\s*[:#-]?\s*([A-Za-z .-]+)",
}


def extract_fields(text: str, document_type: str) -> list[ExtractedField]:
    fields: list[ExtractedField] = []

    for field_name, pattern in FIELD_PATTERNS.items():
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            fields.append(
                ExtractedField(
                    name=field_name,
                    value=match.group(1).strip(),
                    confidence=0.86,
                )
            )

    if not fields:
        fields.append(
            ExtractedField(
                name="document_summary",
                value=text[:280] or f"No readable text found for {document_type}.",
                confidence=0.42,
            )
        )

    return fields

