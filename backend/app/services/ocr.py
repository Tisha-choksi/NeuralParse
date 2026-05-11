from pathlib import Path

from docx import Document
from PIL import Image
from pypdf import PdfReader

IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp", ".webp"}


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

    if suffix in IMAGE_SUFFIXES or content_type.startswith("image/"):
        return extract_image_text(path)

    return f"Unsupported file type: {path.name}, content type: {content_type}"


def extract_image_text(path: Path) -> str:
    try:
        import pytesseract
    except ImportError:
        return "Image OCR dependency missing. Run: pip install pytesseract"

    try:
        image = Image.open(path)
        text = pytesseract.image_to_string(image)
    except pytesseract.TesseractNotFoundError:
        return (
            "Tesseract OCR is not installed or not available in PATH. "
            "Install it on Windows, then restart the FastAPI server."
        )
    except Exception as exc:
        return f"Image OCR failed for {path.name}: {exc}"

    cleaned = text.strip()
    if not cleaned:
        return f"Image OCR completed, but no readable text was detected in {path.name}."

    return cleaned
