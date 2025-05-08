# app/api/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session         import get_db
from app.services.auth_service import AuthService
from app.schemas.token      import Token  # Pydantic model with access_token & token_type
from app.core.security      import create_access_token
from app.core.config        import settings

router = APIRouter(tags=["auth"])

@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
)
def register(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db:        Session                 = Depends(get_db),
):
    # Create the user
    user = AuthService(db).register(
        email=form_data.username,
        password=form_data.password,
    )

    # Issue a JWT immediately
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        subject=str(user.id),
        expires_delta=access_token_expires,
    )
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db:        Session                 = Depends(get_db),
):
    """
    Expects form fields:
      - username: user’s email
      - password: their password
    """
    jwt = AuthService(db).authenticate(
        email=form_data.username,
        password=form_data.password,
    )
    if not jwt:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": jwt, "token_type": "bearer"}