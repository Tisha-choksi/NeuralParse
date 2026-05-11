from pathlib import Path

from docx import Document
from pypdf import PdfReader


def extract_text(file_path: str, content_type: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        reader = PdfReader(str(path))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages).strip()

    if suffix == ".docx":
        doc = Document(str(path))
        return "\n".join(paragraph.text for paragraph in doc.paragraphs).strip()

    if suffix in {".txt", ".csv"}:
        return path.read_text(encoding="utf-8", errors="ignore")

    return (
        "Image OCR placeholder. Add Tesseract or PaddleOCR here to process scanned "
        f"documents. File: {path.name}, content type: {content_type}"
    )

