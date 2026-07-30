from flask import Blueprint, jsonify
from services.history_service import history_service

history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
def get_history():
    history_data = history_service.get_history()
    return jsonify({
        "success": True,
        "history": history_data,
        "count": len(history_data)
    })

@history_bp.route('/history', methods=['DELETE'])
def clear_history():
    history_service.clear_history()
    return jsonify({
        "success": True,
        "message": "Detection history cleared successfully"
    })
