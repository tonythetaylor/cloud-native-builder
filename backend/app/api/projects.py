from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreate, ProjectOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProjectOut)
def create_project(proj_in: ProjectCreate, db: Session = Depends(get_db)):
    owner_id = 1  # TODO: replace with actual user from token
    return ProjectService(db).create(owner_id, proj_in)

@router.get("/", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    owner_id = 1
    return ProjectService(db).list_by_owner(owner_id)
