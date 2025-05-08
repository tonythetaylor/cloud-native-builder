# backend/app/api/projects.py
from fastapi      import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps           import get_db, get_current_user
from app.models.user        import User
from app.services.project_service import ProjectService
from app.schemas.project    import ProjectCreate, ProjectOut

router = APIRouter(
    prefix="/projects",                       # ← here’s the missing piece
    tags=["projects"],
    dependencies=[Depends(get_current_user)], # enforce auth on *all* endpoints
    responses={401: {"description": "Unauthorized"}},
)

@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    proj_in:       ProjectCreate,
    db:            Session = Depends(get_db),
    current_user:  User    = Depends(get_current_user),
):
    return ProjectService(db).create(current_user.id, proj_in)

@router.get("", response_model=list[ProjectOut])
def list_projects(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    return ProjectService(db).list_by_owner(current_user.id)

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id:    int,
    proj_in:       ProjectCreate,
    db:             Session = Depends(get_db),
    current_user:   User    = Depends(get_current_user),
):
    updated = ProjectService(db).update(project_id, proj_in)
    if updated is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated