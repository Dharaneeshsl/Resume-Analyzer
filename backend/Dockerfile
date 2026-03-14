FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

# Expose FastAPI port
EXPOSE 8000

# GEMINI_API_KEY and GEMINI_MODEL are passed at runtime via environment

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

