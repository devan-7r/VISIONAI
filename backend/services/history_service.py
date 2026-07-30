import json
from datetime import datetime
from database.db import get_db_connection

class HistoryService:
    def add_history_entry(self, source_type, filename, detection_result):
        conn = get_db_connection()
        cursor = conn.cursor()

        now = datetime.now()
        date_str = now.strftime('%Y-%m-%d')
        time_str = now.strftime('%H:%M:%S')

        objects = [obj['name'] for obj in detection_result.get('objects', [])]
        avg_conf = 0
        if objects:
            avg_conf = sum(obj['confidence'] for obj in detection_result['objects']) / len(objects)

        cursor.execute('''
            INSERT INTO detection_history (date, time, source_type, filename, object_count, objects_json, avg_confidence, processing_time_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            date_str,
            time_str,
            source_type,
            filename or 'live_capture.jpg',
            detection_result.get('object_count', 0),
            json.dumps(objects),
            round(avg_conf, 1),
            detection_result.get('processing_time_ms', 0)
        ))

        conn.commit()
        conn.close()

    def get_history(self, limit=50):
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, date, time, source_type, filename, object_count, objects_json, avg_confidence, processing_time_ms, created_at
            FROM detection_history
            ORDER BY id DESC
            LIMIT ?
        ''', (limit,))

        rows = cursor.fetchall()
        conn.close()

        history_list = []
        for r in rows:
            history_list.append({
                "id": r['id'],
                "date": r['date'],
                "time": r['time'],
                "type": r['source_type'],
                "filename": r['filename'],
                "object_count": r['object_count'],
                "objects": json.loads(r['objects_json']),
                "avg_confidence": r['avg_confidence'],
                "processing_time": f"{r['processing_time_ms']} ms",
                "created_at": r['created_at']
            })
        return history_list

    def clear_history(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM detection_history')
        conn.commit()
        conn.close()
        return True

    def get_statistics(self):
        conn = get_db_connection()
        cursor = conn.cursor()

        today_str = datetime.now().strftime('%Y-%m-%d')

        cursor.execute('SELECT COUNT(*) FROM detection_history WHERE date = ?', (today_str,))
        todays_detections = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM detection_history WHERE source_type LIKE '%Image%'")
        images_processed = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM detection_history WHERE source_type LIKE '%Video%'")
        videos_processed = cursor.fetchone()[0]

        cursor.execute("SELECT SUM(object_count) FROM detection_history")
        total_objects_row = cursor.fetchone()[0]
        total_objects = total_objects_row if total_objects_row else 0

        cursor.execute("SELECT AVG(avg_confidence) FROM detection_history")
        avg_conf_row = cursor.fetchone()[0]
        avg_confidence = round(avg_conf_row, 1) if avg_conf_row else 0.0

        conn.close()

        return {
            "todays_detections": todays_detections,
            "images_processed": images_processed,
            "videos_processed": videos_processed,
            "total_objects_detected": total_objects,
            "average_confidence": f"{avg_confidence}%"
        }

history_service = HistoryService()
