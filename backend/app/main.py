from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api import auth, projects, export

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Allow your frontend origin; you can also use ["*"] for all origins
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=prefix + "/auth")
app.include_router(projects.router, prefix=prefix + "/projects")
app.include_router(export.router, prefix=prefix + "/export")

@app.get("/")
def root():
    return {"message": "Cloud Native Builder API"}