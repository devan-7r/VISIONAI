import base64
import cv2
import numpy as np
from services.yolo_service import yolo_service

class CameraService:
    def process_frame(self, frame_bytes_or_base64):
        try:
            if isinstance(frame_bytes_or_base64, str):
                if ',' in frame_bytes_or_base64:
                    frame_bytes_or_base64 = frame_bytes_or_base64.split(',')[1]
                frame_bytes = base64.b64decode(frame_bytes_or_base64)
            else:
                frame_bytes = frame_bytes_or_base64

            nparr = np.frombuffer(frame_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return {"success": False, "error": "Invalid frame buffer"}

            result = yolo_service.detect_objects(img)
            return result
        except Exception as e:
            return {"success": False, "error": str(e)}

camera_service = CameraService()
