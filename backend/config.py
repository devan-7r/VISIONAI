import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'visionai-studio-super-secret-key-2026')
    PORT = int(os.environ.get('PORT', 5000))
    DEBUG = True
    
    # Folders
    UPLOADS_FOLDER = os.path.join(BASE_DIR, 'uploads')
    OUTPUTS_FOLDER = os.path.join(BASE_DIR, 'outputs')
    DATABASE_PATH = os.path.join(BASE_DIR, 'database', 'visionai.db')
    MODELS_FOLDER = os.path.join(BASE_DIR, 'models')
    
    # YOLO Config
    YOLO_MODEL_NAME = os.environ.get('YOLO_MODEL', 'yolov8n.pt') # yolov8n or yolo11n
    CONFIDENCE_THRESHOLD = 0.4
    
    # Allowed Extensions
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'bmp'}
    ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024 # 100 MB max upload limit

os.makedirs(Config.UPLOADS_FOLDER, exist_ok=True)
os.makedirs(Config.OUTPUTS_FOLDER, exist_ok=True)
os.makedirs(Config.MODELS_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(Config.DATABASE_PATH), exist_ok=True)
