from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "NeuralParse"
    data_dir: Path = Path("data")
    upload_dir: Path = Path("uploads")


settings = Settings()
settings.data_dir.mkdir(parents=True, exist_ok=True)
settings.upload_dir.mkdir(parents=True, exist_ok=True)

