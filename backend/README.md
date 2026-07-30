# VisionAI Backend Server

Production-ready Python Flask backend server for the **VisionAI Object Detection Web Application**. Features Ultralytics YOLO / OpenCV object detection inference, SQLite history tracking, CORS support for React + Vite frontend, and REST APIs.

---

## 🛠️ Tech Stack & Requirements
- **Python**: 3.8+
- **Framework**: Flask
- **Machine Learning**: Ultralytics YOLOv8 / YOLO11, OpenCV, NumPy, Pillow
- **Database**: SQLite3 (`database/visionai.db`)
- **CORS**: Flask-CORS

---

## 🚀 Quick Start & Installation

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Backend Server
```bash
python app.py
```
The server will start on **`http://localhost:5000`**.

---

## 📡 REST API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` or `/health` | `GET` | Health status check |
| `/detect/image` or `/api/detect` | `POST` | Upload image for YOLO detection |
| `/detect/video` | `POST` | Upload video for frame-by-frame processing |
| `/detect/live` | `POST` | Process webcam frame buffer / base64 image |
| `/history` | `GET` | Fetch detection history entries from SQLite DB |
| `/history` | `DELETE` | Clear all stored history records |
| `/statistics` | `GET` | Retrieve aggregated detection statistics |
| `/challenge` or `/challenge/start` | `GET/POST` | Get mystery object challenge target |
| `/challenge/verify` | `POST` | Verify target object detection from webcam frame |

---

## 📤 Sample API Response Format (`POST /detect/image`)

```json
{
  "success": true,
  "objects": [
    {
      "name": "person",
      "confidence": 98.5,
      "bbox": [120, 40, 350, 480]
    },
    {
      "name": "car",
      "confidence": 92.1,
      "bbox": [320, 180, 240, 140]
    }
  ],
  "processing_time": "34 ms",
  "processing_time_ms": 34,
  "object_count": 2,
  "output_url": "/outputs/annotated_uploaded.jpg"
}
```

---

## 🔗 Connecting with React Frontend
In the VisionAI Studio frontend:
1. Click **Settings** in the top navigation bar.
2. Under **Inference Engine Mode**, select **Flask + YOLO API**.
3. Verify endpoint is set to `http://localhost:5000/api/detect`.
