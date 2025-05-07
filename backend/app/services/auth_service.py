from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.schemas.user import UserCreate

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, user_in: UserCreate) -> User:
        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password)
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate(self, email: str, password: str):
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return create_access_token({"sub": user.email})
