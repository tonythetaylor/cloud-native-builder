from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api import auth, projects, export

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)
app.router.redirect_slashes = False
# Allow your frontend origin; you can also use ["*"] for all origins
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000", "https://localhost"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=prefix + "/auth")
app.include_router(projects.router, prefix=prefix)
app.include_router(export.router, prefix=prefix + "/export")


@app.get("/health",  tags=["health"])
def health_check():
    return {"status": "ok"}
  
@app.get("/")
def root():
    return {"message": "Cloud Native Builder API"}