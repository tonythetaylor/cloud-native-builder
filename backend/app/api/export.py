from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.project import Project
from pydantic import BaseModel
import io, zipfile, subprocess, os, pathlib, json, tempfile, sys

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
    # 1) Fetch project
    project = db.query(Project).filter(Project.id == req.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # 2) Write config.json
    tmp = tempfile.TemporaryDirectory()
    config_path = os.path.join(tmp.name, "config.json")
    with open(config_path, "w") as f:
        json.dump(project.config, f)

    # 3) Locate CLI
    project_root = pathlib.Path(__file__).resolve().parents[3]
    cli_path     = project_root / "infra-generator" / "cli.py"
    if not cli_path.exists():
        raise HTTPException(500, f"CLI not found at {cli_path}")

    # 4) Run CLI, capturing stderr
    out_dir = tmp.name + "/out"
    os.makedirs(out_dir, exist_ok=True)

    try:
        proc = subprocess.run(
            [sys.executable, str(cli_path), "--config", config_path, "--output", out_dir],
            cwd=str(project_root),
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        # Return the stderr so you can debug inside the browser
        raise HTTPException(
            status_code=500,
            detail={
                "msg": "infra-generator failed",
                "exit_code": e.returncode,
                "stderr": e.stderr,
                "stdout": e.stdout,
            }
        )

    # 5) Zip & stream back
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(out_dir):
            for f in files:
                full = os.path.join(root, f)
                rel  = os.path.relpath(full, out_dir)
                z.write(full, rel)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=project_{req.project_id}_terraform.zip"}
    )