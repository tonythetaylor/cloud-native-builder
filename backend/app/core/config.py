from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "cloudbuilder"
    POSTGRES_HOST: str = "localhost"       # ← default for local
    POSTGRES_PORT: int = 5432

    SQLALCHEMY_DATABASE_URI: str = (
        f"postgresql://{POSTGRES_USER}:"
        f"{POSTGRES_PASSWORD}@"
        f"{POSTGRES_HOST}:"
        f"{POSTGRES_PORT}/"
        f"{POSTGRES_DB}"
    )
    
    PROJECT_NAME: str = "Cloud Native Builder API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str
    ACCESS_TOKEN_ALGORITHM: str = "HS256"
    ALGORITHM: str = "HS256"
    
    class Config:
        env_file = ".env"

settings = Settings()
