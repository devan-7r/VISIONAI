from flask import Blueprint, request, jsonify
from services.image_service import image_service

image_bp = Blueprint('image', __name__)

@image_bp.route('/detect/image', methods=['POST'])
@image_bp.route('/api/detect', methods=['POST'])
def detect_image():
    if 'image' not in request.files and 'file' not in request.files:
        return jsonify({"success": False, "error": "No image file provided in request"}), 400

    file = request.files.get('image') or request.files.get('file')
    filename = file.filename or 'uploaded.jpg'
    file_bytes = file.read()

    result = image_service.process_image(file_bytes, filename)
    return jsonify(result)
