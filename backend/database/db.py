import sqlite3
import json
from datetime import datetime
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table 1: Detection History Log
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detection_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            source_type TEXT NOT NULL,
            filename TEXT,
            object_count INTEGER NOT NULL,
            objects_json TEXT NOT NULL,
            avg_confidence REAL NOT NULL,
            processing_time_ms INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Table 2: Mystery Challenge Leaderboard
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS challenge_leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT DEFAULT 'Hunter',
            score INTEGER NOT NULL,
            streak INTEGER NOT NULL,
            target_object TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print("VisionAI DB: SQLite tables initialized successfully")

if __name__ == '__main__':
    init_db()
