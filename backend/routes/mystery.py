import random
from flask import Blueprint, request, jsonify
from services.camera_service import camera_service

mystery_bp = Blueprint('mystery', __name__)

CHALLENGE_OBJECTS = ['person', 'cell phone', 'cup', 'bottle', 'laptop', 'chair', 'book', 'mouse', 'keyboard']

@mystery_bp.route('/challenge', methods=['GET'])
@mystery_bp.route('/challenge/start', methods=['POST'])
def start_challenge():
    target = random.choice(CHALLENGE_OBJECTS)
    return jsonify({
        "success": True,
        "target_object": target,
        "time_limit_seconds": 20,
        "message": f"Find a '{target.upper()}' and present it to your camera!"
    })

@mystery_bp.route('/challenge/verify', methods=['POST'])
def verify_challenge():
    data = request.get_json() if request.is_json else {}
    target_object = data.get('target_object')
    image_data = data.get('image')

    if not target_object or not image_data:
        return jsonify({"success": False, "verified": False, "error": "Missing target object or image"}), 400

    detection = camera_service.process_frame(image_data)
    detected_names = [obj['name'].lower() for obj in detection.get('objects', [])]

    verified = target_object.lower() in detected_names

    return jsonify({
        "success": True,
        "verified": verified,
        "target_object": target_object,
        "detected_objects": detected_names,
        "score_earned": 150 if verified else 0
    })
