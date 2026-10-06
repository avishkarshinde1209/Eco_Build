#!/usr/bin/env python3
"""
EcoBuild Smart - Desktop Application Launcher
Launches EcoBuild Smart in standalone application window mode (frameless, no browser chrome),
providing a genuine native desktop app experience on Windows.
"""

import sys
import os
import time
import socket
import subprocess
import webbrowser

PORT = 8000
APP_URL = f"http://localhost:{PORT}"

def is_server_running(host="127.0.0.1", port=PORT):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

def start_backend_server():
    if is_server_running():
        print(f"[Desktop App] Backend server is already running on port {PORT}.")
        return None

    print(f"[Desktop App] Starting EcoBuild Smart background server on port {PORT}...")
    server_script = os.path.join(os.path.dirname(__file__), "server.py")
    
    # Launch detached server process
    creationflags = 0
    if sys.platform == "win32":
        creationflags = subprocess.CREATE_NO_WINDOW | subprocess.DETACHED_PROCESS

    proc = subprocess.Popen(
        [sys.executable, server_script],
        cwd=os.path.dirname(__file__),
        creationflags=creationflags,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    # Wait for server to bind
    for _ in range(20):
        time.sleep(0.2)
        if is_server_running():
            print("[Desktop App] Backend server started successfully.")
            return proc

    print("[Desktop App] Warning: Server start wait timed out, attempting app launch anyway.")
    return proc

def find_standalone_browser():
    """
    Search for Microsoft Edge or Google Chrome to launch in --app mode
    """
    candidates = [
        # Microsoft Edge (standard on Windows 10/11)
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
        # Google Chrome
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        # Brave Browser
        r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
    ]

    for path in candidates:
        if os.path.exists(path):
            return path
    return None

def launch_desktop_window():
    start_backend_server()

    browser_bin = find_standalone_browser()
    if browser_bin:
        print(f"[Desktop App] Launching native standalone app window via: {os.path.basename(browser_bin)}")
        # --app flag opens the URL in an isolated frameless application window
        cmd = [
            browser_bin,
            f"--app={APP_URL}",
            "--window-size=1280,840",
            "--window-position=100,50",
            f"--app-id=ecobuild_smart_app"
        ]
        try:
            subprocess.Popen(cmd)
            print("[Desktop App] EcoBuild Smart is running in standalone desktop mode.")
            return
        except Exception as e:
            print(f"[Desktop App] Error launching standalone window: {e}")

    # Fallback to standard default browser if no Chromium browser found
    print("[Desktop App] Opening in default browser...")
    webbrowser.open(APP_URL)

if __name__ == "__main__":
    launch_desktop_window()
