FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-lock.txt .

RUN pip install --no-cache-dir --only-binary :all: --require-hashes -r requirements-lock.txt

COPY main.py .
COPY routers/ ./routers/
COPY schemas/ ./schemas/

RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:socket_app", "--host", "0.0.0.0", "--port", "8000"]