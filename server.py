#!/usr/bin/env python3
"""
EcoBuild Smart - Backend API & Server Layer
Uses standard Python library (no external pip dependencies needed).
Provides REST endpoints for environmental data caching, geocoding proxy,
project storage (SQLite database), and serves static frontend assets.
"""

import sys
import os
import json
import sqlite3
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8000
DB_FILE = os.path.join(os.path.dirname(__file__), "ecobuild.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    # Projects table
    c.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            building_type TEXT,
            city TEXT,
            state TEXT,
            data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Environmental Cache table
    c.execute('''
        CREATE TABLE IF NOT EXISTS environmental_cache (
            cache_key TEXT PRIMARY KEY,
            endpoint TEXT,
            response_json TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
    print("[EcoBuild DB] Initialized SQLite database successfully at:", DB_FILE)

class EcoBuildRequestHandler(SimpleHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # Universal Download Endpoints (Works in any browser & on any PC)
        if path in ("/download", "/download-app", "/api/download-app", "/EcoBuildSmart_App.zip"):
            self.serve_zip_download()
            return

        if path in ("/LaunchApp.bat", "/Install_EcoBuild_Smart.bat"):
            self.serve_bat_download(path.strip("/"))
            return

        # API Endpoints
        if path.startswith("/api/"):
            self.handle_api_get(path, query)
            return

        # Fallback to standard static file server
        super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == "/api/projects":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                project_data = json.loads(post_data.decode('utf-8'))
                proj_id = project_data.get("id") or f"proj_{int(urllib.parse.time.time())}"
                name = project_data.get("name", "Untitled Project")
                b_type = project_data.get("building_type", "Residential")
                loc = project_data.get("location", {})
                city = loc.get("city", "")
                state = loc.get("state", "")

                conn = sqlite3.connect(DB_FILE)
                c = conn.cursor()
                c.execute('''
                    INSERT OR REPLACE INTO projects (id, name, building_type, city, state, data, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ''', (proj_id, name, b_type, city, state, json.dumps(project_data)))
                conn.commit()
                conn.close()

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "id": proj_id, "message": "Project saved successfully."}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

    def handle_api_get(self, path, query):
        if path == "/api/projects":
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute("SELECT id, name, building_type, city, state, updated_at FROM projects ORDER BY updated_at DESC")
            rows = c.fetchall()
            conn.close()
            projects = [{"id": r[0], "name": r[1], "building_type": r[2], "city": r[3], "state": r[4], "updated_at": r[5]} for r in rows]
            self.send_json_response(200, {"projects": projects})
            return

        if path.startswith("/api/projects/"):
            proj_id = path.replace("/api/projects/", "")
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute("SELECT data FROM projects WHERE id = ?", (proj_id,))
            row = c.fetchone()
            conn.close()
            if row:
                self.send_json_response(200, json.loads(row[0]))
            else:
                self.send_json_response(404, {"error": "Project not found"})
            return

        if path == "/api/download-app":
            self.serve_zip_download()
            return

        if path == "/api/network-info":
            import socket
            def get_local_lan_ip():
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                try:
                    s.connect(('8.8.8.8', 80))
                    ip = s.getsockname()[0]
                except Exception:
                    ip = '127.0.0.1'
                finally:
                    s.close()
                return ip
            lan_ip = get_local_lan_ip()
            self.send_json_response(200, {
                "localhost_url": f"http://localhost:{PORT}",
                "lan_url": f"http://{lan_ip}:{PORT}",
                "lan_ip": lan_ip,
                "port": PORT,
                "download_url": f"http://{lan_ip}:{PORT}/api/download-app",
                "zip_name": "EcoBuildSmart_App.zip"
            })
            return

        if path == "/api/environmental/proxy":
            # Safe external proxy to prevent CORS blocks
            target_url = query.get("url", [None])[0]
            if not target_url:
                self.send_json_response(400, {"error": "Missing url parameter"})
                return

            try:
                req = urllib.request.Request(
                    target_url,
                    headers={'User-Agent': 'EcoBuild-Smart-Academic/2.5'}
                )
                with urllib.request.urlopen(req, timeout=10) as response:
                    raw_data = response.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_cors_headers()
                    self.end_headers()
                    self.wfile.write(raw_data)
            except Exception as e:
                self.send_json_response(502, {"error": f"Upstream API failure: {str(e)}"})
            return

        if path == "/api/health":
            self.send_json_response(200, {
                "status": "healthy",
                "app": "EcoBuild Smart",
                "version": "2.5.0",
                "database": "sqlite3",
                "python_version": sys.version
            })
            return

        self.send_json_response(404, {"error": "API route not found"})

    def serve_zip_download(self):
        zip_path = os.path.join(os.path.dirname(__file__), "EcoBuildSmart_App.zip")
        if not os.path.exists(zip_path):
            try:
                import package_app
            except Exception as e:
                print(f"[EcoBuild Server] Error packaging app: {e}")
        if os.path.exists(zip_path):
            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header("Content-Disposition", 'attachment; filename="EcoBuildSmart_App.zip"')
            self.send_header("Content-Length", str(os.path.getsize(zip_path)))
            self.send_cors_headers()
            self.end_headers()
            with open(zip_path, "rb") as f:
                self.wfile.write(f.read())
        else:
            self.send_json_response(404, {"error": "Application package not found"})

    def serve_bat_download(self, filename):
        file_path = os.path.join(os.path.dirname(__file__), filename)
        if os.path.exists(file_path):
            self.send_response(200)
            self.send_header("Content-Type", "application/x-bat")
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
            self.send_header("Content-Length", str(os.path.getsize(file_path)))
            self.send_cors_headers()
            self.end_headers()
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())
        else:
            self.send_json_response(404, {"error": f"File {filename} not found"})

    def send_json_response(self, code, data):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

def run_server():
    init_db()
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, EcoBuildRequestHandler)
    print(f"============================================================")
    print(f"  EcoBuild Smart — Academic Web Application & API Server")
    print(f"  Server URL: http://localhost:{PORT}")
    print(f"  Demonstration Case: Kolhapur, Maharashtra (Pre-loaded)")
    print(f"  To stop the server, press Ctrl+C")
    print(f"============================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[EcoBuild Smart] Server stopped.")

if __name__ == "__main__":
    run_server()
