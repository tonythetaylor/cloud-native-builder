from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
import subprocess

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/terraform")
def export_terraform(db: Session = Depends(get_db)):
    try:
        # Example: call your infra-generator CLI
        subprocess.run(["python3", "../infra-generator/cli.py", "--output", "./out"], check=True)
        return {"status": "success", "path": "/out/terraform"}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=str(e))
