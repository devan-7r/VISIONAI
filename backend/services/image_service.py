import os
import cv2
import numpy as np
from PIL import Image
from services.yolo_service import yolo_service
from services.history_service import history_service
from config import Config

class ImageService:
    def process_image(self, file_bytes, filename="uploaded_image.jpg"):
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return {"success": False, "error": "Invalid image format"}

        # Run YOLO Detection
        result = yolo_service.detect_objects(img)

        # Draw bounding boxes on annotated output image
        annotated_img = img.copy()
        for obj in result.get('objects', []):
            x, y, w, h = obj['bbox']
            cv2.rectangle(annotated_img, (x, y), (x + w, y + h), (45, 212, 191), 2)
            label = f"{obj['name']} {obj['confidence']}%"
            cv2.putText(annotated_img, label, (x, max(y - 10, 20)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (45, 212, 191), 2)

        output_filename = f"annotated_{filename}"
        output_path = os.path.join(Config.OUTPUTS_FOLDER, output_filename)
        cv2.imwrite(output_path, annotated_img)

        result['output_url'] = f"/outputs/{output_filename}"

        # Save to SQLite history
        history_service.add_history_entry("Image Detection", filename, result)

        return result

image_service = ImageService()
