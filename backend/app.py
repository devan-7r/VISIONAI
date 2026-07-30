import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from database.db import init_db

# Import Blueprints
from routes.image import image_bp
from routes.video import video_bp
from routes.live import live_bp
from routes.history import history_bp
from routes.stats import stats_bp
from routes.mystery import mystery_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for React + Vite Frontend
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize SQLite DB
init_db()

# Register Blueprints
app.register_blueprint(image_bp)
app.register_blueprint(video_bp)
app.register_blueprint(live_bp)
app.register_blueprint(history_bp)
app.register_blueprint(stats_bp)
app.register_blueprint(mystery_bp)

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "VisionAI Object Detection Backend",
        "version": "2.4.0",
        "model": Config.YOLO_MODEL_NAME,
        "cors_enabled": True
    })

@app.route('/outputs/<path:filename>', methods=['GET'])
def serve_output_file(filename):
    return send_from_directory(Config.OUTPUTS_FOLDER, filename)

if __name__ == '__main__':
    print(f"VisionAI Backend Server starting on http://localhost:{Config.PORT}")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
