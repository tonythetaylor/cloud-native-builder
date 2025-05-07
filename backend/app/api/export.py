from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.project import Project
from pydantic import BaseModel
import io, zipfile, subprocess, os, pathlib, json, tempfile

router = APIRouter()

class ExportRequest(BaseModel):
    project_id: int


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/terraform")
def export_terraform(req: ExportRequest, db: Session = Depends(get_db)):
    # 1) Fetch the project config from the database
    project = db.query(Project).filter(Project.id == req.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    config = project.config  # your JSON blob

    # 2) Dump config to a temp JSON file
    tmp = tempfile.TemporaryDirectory()
    config_path = os.path.join(tmp.name, "config.json")
    with open(config_path, "w") as f:
        json.dump(config, f)

    # 3) Locate the CLI at the project root (three levels up)
    project_root = pathlib.Path(__file__).resolve().parents[3]
    cli_path     = project_root / "infra-generator" / "cli.py"

    out_dir = os.path.join(tmp.name, "out")
    os.makedirs(out_dir, exist_ok=True)

    # 4) Run the infra-generator CLI
    subprocess.run(
        ["python3", str(cli_path), "--config", config_path, "--output", out_dir],
        check=True,
        cwd=str(project_root)
    )

    # 5) Zip the generated files
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(out_dir):
            for f in files:
                full = os.path.join(root, f)
                rel  = os.path.relpath(full, out_dir)
                z.write(full, rel)
    buffer.seek(0)

    # 6) Stream back to the client
    return StreamingResponse(
        buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=project_{req.project_id}_terraform.zip"}
    )
