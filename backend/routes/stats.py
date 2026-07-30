from flask import Blueprint, jsonify
from services.history_service import history_service

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/statistics', methods=['GET'])
def get_statistics():
    stats = history_service.get_statistics()
    return jsonify({
        "success": True,
        "statistics": stats
    })
