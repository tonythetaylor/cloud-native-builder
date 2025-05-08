# app/services/auth_service.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, email: str, password: str) -> User:
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate(self, email: str, password: str) -> str | None:
        user = self.db.query(User).filter_by(email=email).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        # here we issue the token
        return create_access_token(subject=str(user.id))