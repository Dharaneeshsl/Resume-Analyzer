import os
import json
from typing import Dict, Any, Optional, Set

import google.generativeai as genai


def get_gemini_model() -> Optional[genai.GenerativeModel]:
    """
    Return a Gemini model instance if GEMINI_API_KEY is set, otherwise None.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    return genai.GenerativeModel(model_name)


def _simple_keyword_extract(text: str, candidates: Set[str]) -> list:
    lower = text.lower()
    return sorted({w for w in candidates if w.lower() in lower})


def _fallback_analyze(resume_text: str) -> Dict[str, Any]:
    """
    Local heuristic analysis used when Gemini is not available or fails.
    """
    words = resume_text.split()
    length = len(words)

    skill_candidates = {
        "Python", "JavaScript", "TypeScript", "React", "Node.js",
        "FastAPI", "Django", "Flask", "Java", "C++", "SQL", "MongoDB",
        "PostgreSQL", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
        "Machine Learning", "Data Science", "HTML", "CSS", "Tailwind CSS"
    }

    project_keywords = {"project", "built", "developed", "created", "implemented"}

    skills = _simple_keyword_extract(resume_text, skill_candidates)

    lines = [ln.strip() for ln in resume_text.splitlines() if ln.strip()]
    projects = [ln for ln in lines if any(k in ln.lower() for k in project_keywords)]
    projects = projects[:5]

    unique_words = {w.strip(".,;:()").lower() for w in words if len(w) > 3}
    keywords = sorted(list(unique_words))[:20]

    if length < 100:
        score = 5.0
    elif length < 250:
        score = 7.0
    elif length < 600:
        score = 8.5
    else:
        score = 9.0

    base_summary = (
        "Motivated professional with experience in software development and problem solving. "
        "Comfortable working across modern web technologies and collaborating in teams."
    )

    suggestions = {
        "skills": "Highlight your strongest technical skills in a dedicated Skills section and group them by category (languages, frameworks, tools).",
        "projects": "Add 2–4 projects with clear technologies used and 1–2 bullet points each describing impact or results.",
        "experience": "Use action verbs (built, implemented, optimized) and quantify impact where possible (e.g. improved load time by 30%).",
        "formatting": "Keep formatting consistent with clear headings, bullet points, and enough whitespace for readability."
    }

    return {
        "skills": skills,
        "projects": projects,
        "keywords": keywords,
        "suggestions": suggestions,
        "resume_score": score,
        "professional_summary": base_summary,
    }


def analyze_resume(resume_text: str) -> Dict[str, Any]:
    """
    Analyze resume text and return structured data.
    Prefer Gemini; if not configured or if it errors, fall back to local heuristics.
    """
    model = get_gemini_model()
    if model is None:
        return _fallback_analyze(resume_text)

    system_prompt = (
        "You are an expert technical recruiter and resume reviewer. "
        "Analyze resumes for technology jobs and respond in JSON only."
    )

    user_prompt = f"""
Analyze the following resume text and provide a detailed, structured analysis.

RESUME TEXT:
\"\"\"{resume_text}\"\"\"

Return a JSON object with the following exact structure and keys:

{{
  "skills": ["list", "of", "skills"],
  "projects": ["brief project 1 description", "project 2 description"],
  "keywords": ["important", "keywords"],
  "suggestions": {{
    "skills": "short paragraph with suggestions for skills section",
    "projects": "short paragraph with suggestions for projects section",
    "experience": "short paragraph with suggestions for experience section",
    "formatting": "short paragraph with suggestions for formatting"
  }},
  "resume_score": 0-10 (number, decimals allowed),
  "professional_summary": "a strong 2-line professional summary"
}}

Guidelines:
- Resume score is from 0 to 10 (float allowed), considering skills clarity, action verbs, project impact, formatting, and relevant keywords.
- The professional_summary MUST be at most 2 lines but impactful.
- Respond with a JSON object only, no extra text.
"""

    try:
        response = model.generate_content(
            [{"role": "user", "parts": [system_prompt + "\n\n" + user_prompt]}],
            generation_config={
                "temperature": 0.3,
            },
        )
        content = response.text.strip()
        return json.loads(content)
    except Exception:
        # If Gemini call fails for any reason, fall back so the app still works.
        return _fallback_analyze(resume_text)


def _fallback_compare_with_jd(resume_text: str, job_title: str, job_description: str) -> Dict[str, Any]:
    """
    Simple local JD comparison when Gemini is not available or fails.
    """
    def tokenize(text: str) -> Set[str]:
        return {
            w.strip(".,;:()").lower()
            for w in text.split()
            if len(w.strip(".,;:()")) > 3
        }

    resume_tokens = tokenize(resume_text)
    jd_tokens = tokenize(job_description)

    matching = sorted(list(resume_tokens & jd_tokens))
    missing = sorted(list(jd_tokens - resume_tokens))[:30]

    if jd_tokens:
        alignment = (len(matching) / len(jd_tokens)) * 100.0
    else:
        alignment = 0.0

    title_part = f" for the role '{job_title}'" if job_title.strip() else ""
    notes = (
        f"The resume has a basic overlap with the job description{title_part}. "
        "Focus on adding more of the missing keywords and skills directly into your experience and projects sections."
    )

    return {
        "matching_skills": matching[:30],
        "missing_skills": missing,
        "alignment_score": round(alignment, 1),
        "notes": notes,
    }


def compare_with_jd(resume_text: str, job_title: str, job_description: str) -> Dict[str, Any]:
    """
    Compare resume with job description.
    Prefer Gemini; if not configured or if it errors, fall back to local comparison.
    """
    model = get_gemini_model()
    if model is None:
        return _fallback_compare_with_jd(resume_text, job_title, job_description)

    system_prompt = (
        "You are an expert recruiter. Compare a candidate resume to a job description "
        "and respond in JSON only."
    )

    user_prompt = f"""
You will compare a candidate resume with a job description.

JOB TITLE:
\"\"\"{job_title}\"\"\"

JOB DESCRIPTION:
\"\"\"{job_description}\"\"\"

RESUME TEXT:
\"\"\"{resume_text}\"\"\"

Return a JSON object with EXACTLY the following structure:

{{
  "matching_skills": ["skill 1", "skill 2"],
  "missing_skills": ["missing skill 1", "missing skill 2"],
  "alignment_score": 0-100 (number, represents percent alignment),
  "notes": "short paragraph describing overall alignment in simple language"
}}

Guidelines:
- matching_skills: only skills clearly present in the resume.
- missing_skills: skills emphasized in the JD but not clearly in the resume.
- alignment_score: realistic percentage between 0 and 100.
- Respond with a JSON object only, no extra text.
"""

    try:
        response = model.generate_content(
            [{"role": "user", "parts": [system_prompt + "\n\n" + user_prompt]}],
            generation_config={
                "temperature": 0.3,
            },
        )
        content = response.text.strip()
        return json.loads(content)
    except Exception:
        return _fallback_compare_with_jd(resume_text, job_title, job_description)

