from app.models import ExtractedField, ValidationIssue

REQUIRED_FIELDS = {
    "invoice": ["invoice_number", "amount", "vendor_name"],
    "insurance_claim": ["claim_number", "amount", "patient_name"],
    "medical_bill": ["patient_name", "amount", "date"],
}


def validate_fields(document_type: str, fields: list[ExtractedField]) -> list[ValidationIssue]:
    field_names = {field.name for field in fields}
    issues: list[ValidationIssue] = []

    for required in REQUIRED_FIELDS.get(document_type, []):
        if required not in field_names:
            issues.append(
                ValidationIssue(
                    field=required,
                    severity="medium",
                    message=f"Required field '{required}' was not detected.",
                )
            )

    for field in fields:
        if field.confidence < 0.7:
            issues.append(
                ValidationIssue(
                    field=field.name,
                    severity="low",
                    message="Low confidence extraction needs human review.",
                )
            )

    return issues


def calculate_confidence(classification_confidence: float, fields: list[ExtractedField], issue_count: int) -> float:
    if not fields:
        return 0.2

    field_confidence = sum(field.confidence for field in fields) / len(fields)
    penalty = min(issue_count * 0.08, 0.35)
    return round(max((classification_confidence + field_confidence) / 2 - penalty, 0.05), 2)

