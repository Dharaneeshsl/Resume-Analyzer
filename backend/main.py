from typing import List, Dict
import os
import time

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from resume_parser import extract_text_from_pdf
from analyzer import analyze_resume, compare_with_jd

app = FastAPI(title="AI Resume Analyzer", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE_MB = float(os.getenv("MAX_FILE_SIZE_MB", "5"))
MAX_FILE_BYTES = int(MAX_FILE_SIZE_MB * 1024 * 1024)

# Very simple in‑memory rate limiter (per process).
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS_PER_MIN", "30"))
RATE_LIMIT_WINDOW_SEC = 60
_rate_limit_store: Dict[str, list] = {}


def rate_limiter(request: Request):
  """
  Per‑IP rate limiting using an in‑memory sliding window.
  For real multi‑instance production, back this with Redis instead.
  """
  client_ip = request.client.host if request.client else "unknown"

  now = time.time()
  window_start = now - RATE_LIMIT_WINDOW_SEC
  history = _rate_limit_store.get(client_ip, [])
  # Drop old entries
  history = [ts for ts in history if ts >= window_start]

  if len(history) >= RATE_LIMIT_REQUESTS:
    raise HTTPException(
      status_code=429,
      detail="Too many requests from this IP. Please wait a moment and try again.",
    )

  history.append(now)
  _rate_limit_store[client_ip] = history


def enforce_file_limits(file: UploadFile):
  """
  Enforce basic file safeguards: size limit and placeholder virus scan hook.
  """
  # Size check (works with SpooledTemporaryFile)
  current_pos = file.file.tell()
  file.file.seek(0, os.SEEK_END)
  size_bytes = file.file.tell()
  file.file.seek(current_pos, os.SEEK_SET)

  if size_bytes > MAX_FILE_BYTES:
    raise HTTPException(
      status_code=400,
      detail=f"File too large. Max allowed size is {MAX_FILE_SIZE_MB} MB.",
    )

  # Placeholder for virus scanning – integrate ClamAV or another scanner here.
  # Example design:
  #  - Save to a temp path
  #  - Run `clamscan` or use a library
  #  - Raise HTTPException(400/422) if infected
  # For now we just assume clean to keep this template lightweight.


class ResumeAnalysisResponse(BaseModel):
    skills: List[str]
    projects: List[str]
    keywords: List[str]
    suggestions: dict
    resume_score: float
    professional_summary: str
    raw_text: str


class JDCompareRequest(BaseModel):
    resume_text: str
    job_title: str
    job_description: str


class JDCompareResponse(BaseModel):
    matching_skills: List[str]
    missing_skills: List[str]
    alignment_score: float
    notes: str


@app.get("/")
def root():
    return {"message": "AI Resume Analyzer API is running"}


@app.post("/upload_resume", response_model=ResumeAnalysisResponse)
async def upload_resume(
  file: UploadFile = File(...),
  _=Depends(rate_limiter),
):
    # Accept common PDF content types and also fall back to filename check
    allowed_types = {"application/pdf", "application/octet-stream"}
    if file.content_type not in allowed_types and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    enforce_file_limits(file)

    text = extract_text_from_pdf(file)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

    try:
        analysis = analyze_resume(text)
    except RuntimeError as exc:
        # Surface configuration issues (like missing GEMINI_API_KEY) clearly to the client
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    skills = analysis.get("skills") or []
    projects = analysis.get("projects") or []
    keywords = analysis.get("keywords") or []
    suggestions = analysis.get("suggestions") or {}
    resume_score = float(analysis.get("resume_score", 0.0))
    professional_summary = analysis.get("professional_summary") or ""

    return ResumeAnalysisResponse(
        skills=skills,
        projects=projects,
        keywords=keywords,
        suggestions=suggestions,
        resume_score=resume_score,
        professional_summary=professional_summary,
        raw_text=text,
    )


@app.post("/compare_jd", response_model=JDCompareResponse)
async def compare_jd(
  payload: JDCompareRequest,
  _=Depends(rate_limiter),
):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required.")
    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    try:
        result = compare_with_jd(
            resume_text=payload.resume_text,
            job_title=payload.job_title,
            job_description=payload.job_description,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    matching_skills = result.get("matching_skills") or []
    missing_skills = result.get("missing_skills") or []
    alignment_score = float(result.get("alignment_score", 0.0))
    notes = result.get("notes") or ""

    return JDCompareResponse(
        matching_skills=matching_skills,
        missing_skills=missing_skills,
        alignment_score=alignment_score,
        notes=notes,
    )

