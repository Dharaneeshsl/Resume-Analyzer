## AI Resume Analyzer

AI Resume Analyzer is a hackathon-ready web application that helps candidates optimize their resumes using AI.  
Users upload a PDF resume, and the system:

- Extracts skills, projects, and keywords
- Computes a resume score out of 10
- Provides section-wise suggestions for improvement
- Generates an AI-powered 2-line professional summary
- Compares the resume with a specific Job Description (JD) and highlights missing skills

---

### Features

- **PDF Resume Upload**: Upload any PDF resume for instant analysis.
- **Resume Text Extraction**: Robust text extraction using `pdfplumber`.
- **AI Resume Analysis (OpenAI)**:
  - Extracted skills, projects, and important keywords
  - AI-generated 2‑line professional summary
  - Section-wise suggestions (Skills, Projects, Experience, Formatting)
- **Resume Score**:
  - Overall score out of 10 with progress bar visualization
- **Job Description Comparison**:
  - Paste a JD and optional job title
  - See matching skills, missing skills, and an alignment score (0–100)
- **Modern Dashboard UI**:
  - Upload view
  - Resume Analysis Dashboard
  - JD Comparison panel

---

### Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: FastAPI, pdfplumber, Pydantic
- **AI**: Google Gemini (via `google-generativeai`) with local heuristic fallback
- **Language**: Python (backend), JavaScript/React (frontend)

---

### Project Structure

```text
resume-analyzer/
  backend/
    main.py
    analyzer.py
    resume_parser.py
    requirements.txt
  frontend/
    index.html
    vite.config.js
    package.json
    postcss.config.cjs
    tailwind.config.cjs
    src/
      main.jsx
      App.jsx
      index.css
      components/
        Upload.jsx
        ScoreCard.jsx
        Suggestions.jsx
        Skills.jsx
        JDComparison.jsx
      pages/
        Home.jsx
        Dashboard.jsx
  README.md
```

---

### Installation & Setup

#### 1. Clone the repository

```bash
git clone <your-repo-url> resume-analyzer
cd resume-analyzer
```

#### 2. Backend setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env` and set your Gemini key:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.0-flash
```

Run the backend:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

Key endpoints:

- `POST /upload_resume` – upload & analyze resume (PDF form file)
- `POST /compare_jd` – compare resume text with job description

#### 3. Frontend setup (React + Vite + Tailwind)

Open a new terminal:

```bash
cd ../frontend
npm install
```

Create a `.env` file (optional) if API is not on default URL:

```env
VITE_API_BASE=http://localhost:8000
```

Start the dev server:

```bash
npm start
```

Open `http://localhost:5173` in your browser.

---

### Usage

1. **Upload Resume**
   - Go to the main page.
   - Upload your PDF resume and click **Analyze Resume**.
2. **View Dashboard**
   - See your **Resume Score** out of 10 with a progress bar.
   - View **Extracted Skills**, **Projects**, and **Keywords**.
   - Read **section-wise suggestions** for Skills, Projects, Experience, and Formatting.
   - Copy the **AI-generated 2‑line professional summary** into your resume.
3. **Compare with Job Description**
   - Paste a job description and optional job title.
   - Click **Compare with JD**.
   - Review **Matching Skills**, **Missing Skills**, and the **Alignment Score** (0–100).

---

### Demo Video (Placeholder)

Insert a link to your demo video here:

https://drive.google.com/drive/folders/194OfvGjpAf6U1uPNp-kByOHVat6HdNHx

---



### Notes

- This project is designed for hackathon/demo use. For production and future works:
  - Add authentication and rate limiting
  - Improve error handling and logging
  - Persist analysis results in a database
  - Harden prompts and add validation for all AI outputs

