from flask import Blueprint, request, jsonify
from services.camera_service import camera_service

live_bp = Blueprint('live', __name__)

@live_bp.route('/detect/live', methods=['POST'])
def detect_live():
    if request.is_json:
        data = request.get_json()
        image_data = data.get('image') or data.get('frame')
        if not image_data:
            return jsonify({"success": False, "error": "No image data payload"}), 400
        result = camera_service.process_frame(image_data)
        return jsonify(result)

    if 'image' in request.files or 'file' in request.files:
        file = request.files.get('image') or request.files.get('file')
        file_bytes = file.read()
        result = camera_service.process_frame(file_bytes)
        return jsonify(result)

    return jsonify({"success": False, "error": "Invalid request format"}), 400
