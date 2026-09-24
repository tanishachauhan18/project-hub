import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'projecthub-secret-key-super-secure-2026'
    
    # Priority: Environment variable -> SQLite for zero-config fallback -> MySQL if configured
    # e.g., DATABASE_URL = 'mysql+pymysql://root:password@localhost/projecthub_db'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f"sqlite:///{os.path.join(BASE_DIR, 'projecthub.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MAX_CONTENT_LENGTH = 32 * 1024 * 1024  # 32 MB upload limit
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'pptx', 'zip', 'tar', 'gz', 'py', 'js', 'html', 'css', 'json', 'txt', 'png', 'jpg', 'jpeg', 'md'}

    # App Branding & Settings
    APP_NAME = "ProjectHub"
    APP_VERSION = "2.0"
    ACADEMIC_YEAR = "2025 - 2026"
