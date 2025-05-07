from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    return AuthService(db).register(user_in)

@router.post("/login")
def login(user_in: UserCreate, db: Session = Depends(get_db)):
    token = AuthService(db).authenticate(user_in.email, user_in.password)
    if not token:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"access_token": token}
