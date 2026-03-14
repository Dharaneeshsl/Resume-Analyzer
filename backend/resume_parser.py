from typing import Optional
import pdfplumber
from fastapi import UploadFile


def extract_text_from_pdf(file: UploadFile) -> Optional[str]:
    """
    Extract text from an uploaded PDF using pdfplumber.
    """
    try:
        with pdfplumber.open(file.file) as pdf:
            pages_text = []
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                pages_text.append(page_text)
        full_text = "\n".join(pages_text).strip()
        return full_text
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None
    finally:
        try:
            file.file.seek(0)
        except Exception:
            pass

