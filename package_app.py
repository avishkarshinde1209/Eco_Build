import os, zipfile

APP_DIR = os.path.abspath(os.path.dirname(__file__))
OUTPUT_ZIP = os.path.join(APP_DIR, "EcoBuildSmart_App.zip")

EXCLUDE_DIRS = {".git", ".system_generated", "scratch", ".user_uploaded", "__pycache__", ".agents", "brain"}
EXCLUDE_EXTS = {".pyc", ".exe", ".zip"}

with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(APP_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]
        
        for file in files:
            if file == "EcoBuildSmart_App.zip" or file.startswith("."):
                continue
            _, ext = os.path.splitext(file)
            if ext.lower() in EXCLUDE_EXTS:
                continue
                
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, APP_DIR)
            zipf.write(full_path, rel_path)

size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
print(f"Created clean {OUTPUT_ZIP} successfully! Size: {size_mb:.2f} MB ({os.path.getsize(OUTPUT_ZIP):,} bytes)")
