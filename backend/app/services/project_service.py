from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate

class ProjectService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, owner_id: int, proj_in: ProjectCreate) -> Project:
        proj = Project(owner_id=owner_id, name=proj_in.name, config=proj_in.config)
        self.db.add(proj)
        self.db.commit()
        self.db.refresh(proj)
        return proj

    def list_by_owner(self, owner_id: int):
        return self.db.query(Project).filter(Project.owner_id == owner_id).all()
