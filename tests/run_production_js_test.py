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

cmd = [
    browser_exe,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--virtual-time-budget=12000",
    "--dump-dom",
    "http://localhost:8000/tests/run_production_js_tests.html"
]

proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=45)
output = proc.stdout

start_marker = '<div id="test-results" style="display: none;">'
end_marker = '</div>'

if start_marker in output:
    json_text = output.split(start_marker)[1].split(end_marker)[0]
    json_text = json_text.replace("<br>", "\n").replace("&quot;", '"').replace("&amp;", "&")
    try:
        data = json.loads(json_text)
        print("============================================================")
        print(" PRODUCTION JS TEST RESULTS (CHROME RUNTIME)")
        print("============================================================")
        print(f"Status: {data.get('status')}")
        print(f"Total Tests Run: {data.get('total')}")
        print(f"Passed: {data.get('passed')}")
        print(f"Failed: {data.get('failed')}")
        print("------------------------------------------------------------")
        
        failed_tests = [r for r in data.get('results', []) if not r.get('pass')]
        if failed_tests:
            print("\nFAILED TESTS:")
            for f in failed_tests:
                print(f"  [FAIL] {f.get('name')}: {f.get('details')}")
            print("\n>>> TEST SUITE FAILED <<<")
            sys.exit(1)
        else:
            print(f">>> ALL {data.get('passed')} PRODUCTION JS TESTS PASSED PERFECTLY! <<<")
            sys.exit(0)
    except Exception as e:
        print("Could not parse JSON output:", e)
        print("Raw text snippet:", json_text[:500])
        sys.exit(1)
else:
    print("Could not find test-results div in browser DOM output.")
    if proc.stderr:
        print("Stderr:", proc.stderr[:500])
    sys.exit(1)
