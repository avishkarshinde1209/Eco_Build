#!/usr/bin/env python3
"""
EcoBuild Smart - Windows Application Installer
Installs EcoBuild Smart on Windows:
1. Creates Desktop Shortcut ("EcoBuild Smart") with custom icon
2. Creates Start Menu Shortcut under Programs
3. Sets up silent background launch with automated server detection
4. Ensures offline standalone window mode
"""

import sys
import os
import subprocess

APP_DIR = os.path.abspath(os.path.dirname(__file__))
APP_NAME = "EcoBuild Smart"
ICON_PATH = os.path.join(APP_DIR, "icons", "ecobuild.ico")
VBS_LAUNCHER = os.path.join(APP_DIR, "launch_app.vbs")
BAT_LAUNCHER = os.path.join(APP_DIR, "EcoBuildSmart.bat")
DESCRIPTION = "EcoBuild Smart - Dynamic Environmental Impact Assessment & Green Infrastructure Planner"

def get_desktop_dir():
    # Standard user desktop
    user_profile = os.environ.get("USERPROFILE", os.path.expanduser("~"))
    desktop = os.path.join(user_profile, "Desktop")
    if os.path.exists(desktop):
        return desktop
    return os.path.expanduser("~/Desktop")

def get_start_menu_dir():
    appdata = os.environ.get("APPDATA")
    if appdata:
        programs = os.path.join(appdata, "Microsoft", "Windows", "Start Menu", "Programs")
        if os.path.exists(programs):
            return programs
    return None

def create_windows_shortcut(shortcut_path, target_path, arguments, working_dir, icon_path, description):
    """
    Creates a .lnk shortcut using Windows PowerShell COM Object WScript.Shell
    """
    ps_script = f'''
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("{shortcut_path}")
    $Shortcut.TargetPath = "{target_path}"
    $Shortcut.Arguments = '{arguments}'
    $Shortcut.WorkingDirectory = "{working_dir}"
    $Shortcut.IconLocation = "{icon_path},0"
    $Shortcut.Description = "{description}"
    $Shortcut.Save()
    '''
    
    res = subprocess.run(
        ["powershell", "-NoProfile", "-Command", ps_script],
        capture_output=True,
        text=True
    )
    if res.returncode == 0:
        return True, shortcut_path
    else:
        return False, res.stderr

def install():
    print("============================================================")
    print("  Installing EcoBuild Smart Standalone Application")
    print("============================================================")

    # 1. Verify/Generate Icon
    if not os.path.exists(ICON_PATH):
        print("[Installer] Generating icon file...")
        icon_script = os.path.join(APP_DIR, "create_icon.py")
        subprocess.run([sys.executable, icon_script], check=True)

    # Launcher target: wscript.exe running launch_app.vbs silently
    wscript_path = os.path.join(os.environ.get("SYSTEMROOT", r"C:\Windows"), "System32", "wscript.exe")
    if not os.path.exists(wscript_path):
        wscript_path = "wscript.exe"

    vbs_arg = f'"{VBS_LAUNCHER}"'

    installed_locations = []

    # 2. Create Desktop Shortcut
    desktop_dir = get_desktop_dir()
    if desktop_dir and os.path.exists(desktop_dir):
        desktop_shortcut = os.path.join(desktop_dir, f"{APP_NAME}.lnk")
        success, out = create_windows_shortcut(
            desktop_shortcut,
            wscript_path,
            vbs_arg,
            APP_DIR,
            ICON_PATH,
            DESCRIPTION
        )
        if success:
            print(f"[OK] Desktop Shortcut Created:")
            print(f"     -> {desktop_shortcut}")
            installed_locations.append(desktop_shortcut)
        else:
            print(f"[Warning] Failed to create desktop shortcut: {out}")

    # 3. Create Start Menu Shortcut
    start_menu_dir = get_start_menu_dir()
    if start_menu_dir and os.path.exists(start_menu_dir):
        start_shortcut = os.path.join(start_menu_dir, f"{APP_NAME}.lnk")
        success, out = create_windows_shortcut(
            start_shortcut,
            wscript_path,
            vbs_arg,
            APP_DIR,
            ICON_PATH,
            DESCRIPTION
        )
        if success:
            print(f"[OK] Start Menu Shortcut Created:")
            print(f"     -> {start_shortcut}")
            installed_locations.append(start_shortcut)
        else:
            print(f"[Warning] Failed to create Start Menu shortcut: {out}")

    print("\n============================================================")
    print("  Installation Complete!")
    print("============================================================")
    print("  The application is now installed on your Windows PC:")
    print("  - Double-click the 'EcoBuild Smart' icon on your Desktop")
    print("  - Or search for 'EcoBuild Smart' in your Windows Start Menu")
    print("  - Runs as an isolated standalone application with no URL bar")
    print("============================================================")

    return True

if __name__ == "__main__":
    install()
