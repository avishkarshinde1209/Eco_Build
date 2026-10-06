#!/usr/bin/env python3
"""
EcoBuild Smart - Uninstaller
Removes Desktop and Start Menu shortcuts.
"""

import os

user_profile = os.environ.get("USERPROFILE", os.path.expanduser("~"))
desktop_shortcut = os.path.join(user_profile, "Desktop", "EcoBuild Smart.lnk")

appdata = os.environ.get("APPDATA")
start_shortcut = os.path.join(appdata, "Microsoft", "Windows", "Start Menu", "Programs", "EcoBuild Smart.lnk") if appdata else None

removed = 0
for path in [desktop_shortcut, start_shortcut]:
    if path and os.path.exists(path):
        try:
            os.remove(path)
            print(f"[OK] Removed shortcut: {path}")
            removed += 1
        except Exception as e:
            print(f"[Error] Failed to remove {path}: {e}")

if removed > 0:
    print("[EcoBuild Smart] Application shortcuts uninstalled successfully.")
else:
    print("[EcoBuild Smart] No installed shortcuts found.")
