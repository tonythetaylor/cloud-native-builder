# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy your app code
COPY app ./app

# copy the infra-generator CLI alongside
COPY infra-generator /infra-generator

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]