import os
from flask import Blueprint, request, jsonify
from services.video_service import video_service
from config import Config

video_bp = Blueprint('video', __name__)

@video_bp.route('/detect/video', methods=['POST'])
def detect_video():
    if 'video' not in request.files and 'file' not in request.files:
        return jsonify({"success": False, "error": "No video file provided"}), 400

    file = request.files.get('video') or request.files.get('file')
    filename = file.filename or 'uploaded_video.mp4'

    save_path = os.path.join(Config.UPLOADS_FOLDER, filename)
    file.save(save_path)

    result = video_service.process_video(save_path, filename)
    return jsonify(result)
