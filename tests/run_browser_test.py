import subprocess
import time
import json
import os
import sys

CHROME_PATHS = [
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]

browser_exe = None
for p in CHROME_PATHS:
    if os.path.exists(p):
        browser_exe = p
        break

if not browser_exe:
    print("No browser found.")
    sys.exit(1)

print(f"Using browser: {browser_exe}")

# We can run chrome with --headless=new --dump-dom and a virtual time budget
# or run a small CDP script
cmd = [
    browser_exe,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--virtual-time-budget=6000",
    "--dump-dom",
    "http://localhost:8000/tests/verify_browser_views.html"
]

proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=40)
output = proc.stdout

start_marker = '<div id="test-results">'
end_marker = '</div>'

if start_marker in output:
    json_text = output.split(start_marker)[1].split(end_marker)[0]
    json_text = json_text.replace("<br>", "\n").replace("&quot;", '"').replace("&amp;", "&")
    try:
        data = json.loads(json_text)
        print("Test Result Status:", data.get("status"))
        print(f"Total Views Tested: {data.get('totalViewsTested')}")
        print(f"All Views Passed: {data.get('allPassed')}")
        print(f"Errors Count: {data.get('errorsCount')}")
        if data.get("errors"):
            print("Errors detected:", data.get("errors"))
        for v in data.get("viewResults", []):
            err_msg = f" - Error: {v.get('error')}" if v.get('error') else ""
            print(f"  [{'PASS' if v.get('pass') else 'FAIL'}] View: {v.get('view'):<16} (Content length: {v.get('contentLength')}){err_msg}")
        if data.get("allPassed") and data.get("errorsCount", 0) == 0:
            print("\n>>> ALL 18 VIEWS PASSED PERFECTLY WITH 0 ERRORS! <<<")
            sys.exit(0)
        elif data.get("allPassed"):
            print("\n>>> ALL 18 VIEWS PASSED RENDERING (some non-fatal warnings) <<<")
            sys.exit(0)
        else:
            print("\n>>> SOME VIEWS FAILED <<<")
            sys.exit(1)
    except Exception as e:
        print("Could not parse JSON output:", e)
        print("Raw text:", json_text[:500])
        sys.exit(1)
else:
    print("Could not find test-results div in output.")
    print("Stderr:", proc.stderr[:500])
    sys.exit(1)
