/**
 * EcoBuild Smart — Install App Modal
 * Lets anyone install EcoBuild on PC (PWA) or scan a QR code to open
 * on Android / iOS. Fetches live LAN URL from /api/network-info.
 *
 * Usage:
 *   window.InstallModal.show()
 *   window.InstallModal.close()
 */

window.InstallModal = (() => {
  let activeTab = 'links';   // 'links' | 'howto'
  let networkInfo = null;    // Cached from /api/network-info

  /* ─────────────────────────────────────────────
     Fetch network info once
  ───────────────────────────────────────────── */
  async function fetchNetworkInfo() {
    if (networkInfo) return networkInfo;
    try {
      const r = await fetch('/api/network-info');
      if (r.ok) networkInfo = await r.json();
    } catch (_) { /* offline — use fallback */ }
    if (!networkInfo) {
      networkInfo = {
        localhost_url: 'http://localhost:8000',
        lan_url: window.location.href.split('/').slice(0, 3).join('/'),
        lan_ip: window.location.hostname,
        port: 8000
      };
    }
    return networkInfo;
  }

  /* ─────────────────────────────────────────────
     QR code generator (pure JS — no library needed)
     Uses the free QR endpoint from api.qrserver.com
  ───────────────────────────────────────────── */
  function buildQrSrc(text, size = 200) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=000000&bgcolor=ffffff&margin=8`;
  }

  /* ─────────────────────────────────────────────
     Modal HTML
  ───────────────────────────────────────────── */
  function modalHTML(info) {
    const lanUrl  = info.lan_url;
    const localUrl = info.localhost_url;
    const qrSrc   = buildQrSrc(lanUrl, 200);

    const linksTab = activeTab === 'links' ? 'tab-active' : 'tab-inactive';
    const howtoTab = activeTab === 'howto'  ? 'tab-active' : 'tab-inactive';

    return /* html */`
    <div id="install-modal-overlay"
         onclick="if(event.target===this)window.InstallModal.close()"
         style="position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px">

      <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,0.28);overflow:hidden;display:flex;flex-direction:column;max-height:92vh">

        <!-- ── HEADER ── -->
        <div style="background:linear-gradient(135deg,#0f2419 0%,#133622 60%,#1a4a2e 100%);padding:20px 22px 16px;color:#fff;position:relative">
          <div style="display:flex;align-items:flex-start;gap:12px">
            <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;box-shadow:0 4px 16px rgba(34,197,94,0.35)">📥</div>
            <div style="flex:1">
              <h2 style="margin:0 0 3px;font-size:15px;font-weight:800;letter-spacing:-0.3px">Download &amp; Install EcoBuild App</h2>
              <p style="margin:0;font-size:11px;color:#86efac;font-weight:500">Universal package works in any browser &amp; on any PC or phone</p>
            </div>
            <button onclick="window.InstallModal.close()" style="background:rgba(255,255,255,0.08);border:none;color:#94a3b8;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s"
              onmouseover="this.style.background='rgba(255,255,255,0.15)'"
              onmouseout="this.style.background='rgba(255,255,255,0.08)'">✕</button>
          </div>

          <!-- Tabs -->
          <div style="display:flex;gap:6px;margin-top:14px">
            <button onclick="window.InstallModal._tab('links')" style="${activeTab==='links'?'background:#22c55e;color:#0f2419;font-weight:700':'background:rgba(255,255,255,0.08);color:#d1fae5;font-weight:600'};border:none;padding:7px 16px;border-radius:8px;font-size:11.5px;cursor:pointer;transition:all 0.2s">
              ⬇️ Direct Download &amp; Links
            </button>
            <button onclick="window.InstallModal._tab('howto')" style="${activeTab==='howto'?'background:#22c55e;color:#0f2419;font-weight:700':'background:rgba(255,255,255,0.08);color:#d1fae5;font-weight:600'};border:none;padding:7px 16px;border-radius:8px;font-size:11.5px;cursor:pointer;transition:all 0.2s">
              ❓ How to Run After Downloading
            </button>
          </div>
        </div>

        <!-- ── CONTENT ── -->
        <div style="overflow-y:auto;flex:1">

          ${activeTab === 'links' ? `
          <!-- LINKS TAB -->
          <div style="padding:20px 22px;display:flex;flex-direction:column;gap:18px">

            <!-- 1. UNIVERSAL DIRECT DOWNLOAD HERO (WORKS IN ANY BROWSER ON ANY PC) -->
            <div style="background:linear-gradient(135deg,#071e12 0%,#0f331f 100%);border:2px solid #22c55e;border-radius:16px;padding:16px 18px;color:#fff;box-shadow:0 8px 24px rgba(22,101,52,0.2)">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
                <span style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#86efac">Universal Download (Any PC &amp; Browser)</span>
                <span style="font-size:10px;background:#22c55e;color:#052e16;padding:2px 8px;border-radius:20px;font-weight:800">100% Offline Ready</span>
              </div>
              <h3 style="margin:0 0 4px;font-size:14px;font-weight:800">Download Complete EcoBuild App Package</h3>
              <p style="margin:0 0 12px;font-size:11px;color:#bbf7d0;line-height:1.45">Download the complete standalone application (.ZIP). Works on any Windows PC, Mac, or Linux machine with any browser (Chrome, Edge, Firefox, Safari, Brave).</p>
              
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <a href="/api/download-app" download="EcoBuildSmart_App.zip" style="flex:1;min-width:180px;background:#22c55e;color:#052e16;padding:12px 18px;border-radius:12px;font-size:12.5px;font-weight:800;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 12px rgba(34,197,94,0.35);transition:all 0.2s"
                   onmouseover="this.style.background='#4ade80'"
                   onmouseout="this.style.background='#22c55e'">
                  <span style="font-size:16px">⬇️</span> <span>Download App (.ZIP)</span>
                </a>
                <button onclick="window.InstallModal._copy(window.location.origin + '/api/download-app', 'zip-copied')" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:12px;padding:11px 14px;color:#fff;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s"
                  onmouseover="this.style.background='rgba(255,255,255,0.2)'"
                  onmouseout="this.style.background='rgba(255,255,255,0.12)'">
                  <span id="zip-copied">📋 Copy Link</span>
                </button>
              </div>
              <div style="margin-top:10px;font-size:10px;color:#86efac">
                📦 File size: <strong>~630 KB</strong> • Includes complete source, botanical DB, calculations, and 1-click offline launcher.
              </div>
            </div>

            <!-- 2. QUICK STANDALONE LAUNCHERS -->
            <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:14px;padding:14px 16px">
              <div style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:8px">⚡ Quick Windows Launchers</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <a href="/LaunchApp.bat" download style="flex:1;min-width:130px;background:#fff;color:#1e293b;border:1.5px solid #cbd5e1;padding:9px 12px;border-radius:10px;font-size:11px;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:6px;justify-content:center;transition:all 0.2s"
                   onmouseover="this.style.background='#f1f5f9'"
                   onmouseout="this.style.background='#fff'">
                  <span>▶️</span> <span>Download LaunchApp.bat</span>
                </a>
                <a href="/Install_EcoBuild_Smart.bat" download style="flex:1;min-width:130px;background:#fff;color:#1e293b;border:1.5px solid #cbd5e1;padding:9px 12px;border-radius:10px;font-size:11px;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:6px;justify-content:center;transition:all 0.2s"
                   onmouseover="this.style.background='#f1f5f9'"
                   onmouseout="this.style.background='#fff'">
                  <span>📌</span> <span>Download Desktop Installer</span>
                </a>
              </div>
            </div>

            <!-- 3. MOBILE SETUP & QR CODE (ANY PHONE) -->
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
                <div>
                  <div style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:2px">📱 Mobile Phone Setup (Android &amp; iPhone)</div>
                  <p style="margin:0;font-size:11px;color:#94a3b8">Scan QR code to open or download app on your phone</p>
                </div>
                <span style="font-size:10px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:3px 10px;border-radius:20px;font-weight:700">Mobile Ready</span>
              </div>

              <div style="display:flex;gap:16px;align-items:center">
                <!-- QR -->
                <div id="install-qr-container" style="flex-shrink:0;background:#fff;border:2px solid #e2e8f0;border-radius:16px;padding:10px;box-shadow:0 2px 12px rgba(0,0,0,0.07)">
                  <img src="${qrSrc}" alt="QR Code for EcoBuild" width="160" height="160"
                       style="display:block;border-radius:8px"
                       onerror="var el=document.getElementById('install-qr-container');if(el)el.innerHTML='<div style=\\'width:160px;height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:#f8fafc;border-radius:8px\\'><span style=\\'font-size:28px\\'>📡</span><span style=\\'font-size:10px;color:#94a3b8;text-align:center\\'>Scan QR code on<br>local network</span></div>';">
                </div>

                <!-- Instructions alongside QR -->
                <div style="flex:1;font-size:11.5px;color:#475569;line-height:1.65">
                  <div style="font-weight:700;color:#1e293b;margin-bottom:6px">Open on Phone:</div>
                  <div style="display:flex;flex-direction:column;gap:6px">
                    <div style="display:flex;align-items:flex-start;gap:8px">
                      <span style="width:18px;height:18px;border-radius:50%;background:#0f2419;color:#22c55e;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">1</span>
                      <span>Scan QR code with your phone camera</span>
                    </div>
                    <div style="display:flex;align-items:flex-start;gap:8px">
                      <span style="width:18px;height:18px;border-radius:50%;background:#0f2419;color:#22c55e;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">2</span>
                      <span>Or enter URL in Chrome / Safari:</span>
                    </div>
                    <div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:5px 8px;font-family:monospace;font-size:11px;font-weight:700;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${lanUrl}</div>
                  </div>
                  <div style="margin-top:8px;padding:6px 8px;background:#f0fdf4;border-radius:8px;border-left:3px solid #22c55e;font-size:10px;color:#166534;font-weight:600">
                    ✅ Phone &amp; PC must be on the <strong>same Wi-Fi</strong> network
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div style="height:1px;background:#f1f5f9"></div>

            <!-- 4. LOCAL DESKTOP APP MODE -->
            <div>
              <div style="font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#64748b;margin-bottom:8px">💻 Local PC Standalone Window</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button onclick="window.InstallModal._pwaInstall()" style="flex:1;min-width:140px;background:#0f172a;color:#fff;border:none;padding:10px 14px;border-radius:10px;font-size:11.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;justify-content:center;transition:all 0.2s"
                  onmouseover="this.style.background='#1e293b'"
                  onmouseout="this.style.background='#0f172a'">
                  <span>🖥️</span> <span>Install as Browser App</span>
                </button>
                <a href="${localUrl}" target="_blank" style="flex:1;min-width:130px;background:#f8fafc;color:#475569;border:1.5px solid #e2e8f0;padding:10px 14px;border-radius:10px;font-size:11.5px;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:6px;justify-content:center;transition:all 0.2s"
                  onmouseover="this.style.background='#f1f5f9'"
                  onmouseout="this.style.background='#f8fafc'">
                  <span>🌐</span> <span>Open in Tab</span>
                </a>
              </div>
            </div>

          </div>
          ` : `
          <!-- HOW TO DOWNLOAD TAB -->
          <div style="padding:20px 22px;display:flex;flex-direction:column;gap:16px">

            <!-- 1. Running on ANY PC -->
            <div style="border:1.5px solid #e2e8f0;border-radius:14px;overflow:hidden">
              <div style="background:#f8fafc;padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:10px">
                <span style="font-size:20px">💻</span>
                <div>
                  <div style="font-size:12px;font-weight:800;color:#1e293b">Running on Any PC (Windows / Mac / Linux)</div>
                  <div style="font-size:10.5px;color:#64748b">Works in any browser without installation</div>
                </div>
              </div>
              <div style="padding:14px 16px">
                <ol style="margin:0;padding-left:18px;font-size:12px;color:#475569;line-height:1.8;display:flex;flex-direction:column;gap:4px">
                  <li>Click <strong>"Download App (.ZIP)"</strong> to download the package</li>
                  <li>Right-click the downloaded <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">EcoBuildSmart_App.zip</code> and select <strong>"Extract All"</strong></li>
                  <li><strong>On Windows:</strong> Double-click <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">LaunchApp.bat</code> to start automatically</li>
                  <li><strong>On any PC / Mac:</strong> Double-click <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">index.html</code> to open directly in any browser!</li>
                </ol>
                <div style="margin-top:10px;padding:8px 12px;background:#f0fdf4;border-radius:8px;border-left:3px solid #22c55e;font-size:11px;color:#166534">
                  ✅ Works 100% offline — all calculations, botanical databases, and UI components run locally.
                </div>
              </div>
            </div>

            <!-- 2. Android Phone -->
            <div style="border:1.5px solid #e2e8f0;border-radius:14px;overflow:hidden">
              <div style="background:#f8fafc;padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:10px">
                <span style="font-size:20px">🤖</span>
                <div>
                  <div style="font-size:12px;font-weight:800;color:#1e293b">Install on Android Phone</div>
                  <div style="font-size:10.5px;color:#64748b">Chrome for Android</div>
                </div>
              </div>
              <div style="padding:14px 16px">
                <ol style="margin:0;padding-left:18px;font-size:12px;color:#475569;line-height:1.8;display:flex;flex-direction:column;gap:4px">
                  <li>Connect phone to the <strong>same Wi-Fi</strong> as the host computer</li>
                  <li>Scan the QR code or enter <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">${info.lan_url}</code> in Chrome</li>
                  <li>Tap the <strong>⋮ menu</strong> (top right) &rarr; tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></li>
                  <li>Tap <strong>"Add"</strong> to confirm</li>
                </ol>
                <div style="margin-top:10px;padding:8px 12px;background:#f0fdf4;border-radius:8px;border-left:3px solid #22c55e;font-size:11px;color:#166534">
                  ✅ The app icon will appear on your phone home screen and open in full-screen mode.
                </div>
              </div>
            </div>

            <!-- 3. iPhone / iPad -->
            <div style="border:1.5px solid #e2e8f0;border-radius:14px;overflow:hidden">
              <div style="background:#f8fafc;padding:12px 16px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:10px">
                <span style="font-size:20px">🍎</span>
                <div>
                  <div style="font-size:12px;font-weight:800;color:#1e293b">Install on iPhone / iPad</div>
                  <div style="font-size:10.5px;color:#64748b">Safari Browser</div>
                </div>
              </div>
              <div style="padding:14px 16px">
                <ol style="margin:0;padding-left:18px;font-size:12px;color:#475569;line-height:1.8;display:flex;flex-direction:column;gap:4px">
                  <li>Connect to the <strong>same Wi-Fi</strong> as the host computer</li>
                  <li>Scan the QR code or open <code style="background:#f1f5f9;padding:1px 5px;border-radius:4px">${info.lan_url}</code> in <strong>Safari</strong></li>
                  <li>Tap the <strong>Share button</strong> (square with arrow &uarr;)</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong> &rarr; tap <strong>"Add"</strong></li>
                </ol>
              </div>
            </div>

          </div>
          `}
        </div>

        <!-- ── FOOTER ── -->
        <div style="padding:12px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:7px">
            <span style="width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0"></span>
            <span style="font-size:11px;font-weight:700;color:#166534">Works 100% Offline with Local Storage</span>
          </div>
          <button onclick="window.InstallModal.close()" style="background:#1e293b;color:#fff;border:none;padding:7px 18px;border-radius:9px;font-size:11.5px;font-weight:700;cursor:pointer;transition:background 0.2s"
            onmouseover="this.style.background='#334155'"
            onmouseout="this.style.background='#1e293b'">Close</button>
        </div>

      </div>
    </div>`;
  }

  /* ─────────────────────────────────────────────
     Public API
  ───────────────────────────────────────────── */
  return {
    async show() {
      const info = await fetchNetworkInfo();
      const container = document.getElementById('install-modal-container');
      if (!container) return;
      activeTab = 'links';
      container.innerHTML = modalHTML(info);
    },

    close() {
      const container = document.getElementById('install-modal-container');
      if (container) container.innerHTML = '';
    },

    async _tab(tab) {
      activeTab = tab;
      const info = await fetchNetworkInfo();
      const container = document.getElementById('install-modal-container');
      if (container) container.innerHTML = modalHTML(info);
    },

    _copy(text, spanId) {
      navigator.clipboard.writeText(text).then(() => {
        const el = document.getElementById(spanId);
        if (!el) return;
        const orig = el.textContent;
        el.textContent = '✅ Copied!';
        setTimeout(() => { el.textContent = orig; }, 2000);
      }).catch(() => {
        /* fallback for older browsers */
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const el = document.getElementById(spanId);
        if (el) { const orig = el.textContent; el.textContent = '✅ Copied!'; setTimeout(() => { el.textContent = orig; }, 2000); }
      });
    },

    _pwaInstall() {
      const deferred = window.deferredPrompt;
      if (deferred) {
        deferred.prompt();
        deferred.userChoice.then(({ outcome }) => {
          console.log('[InstallModal] PWA install outcome:', outcome);
          window.deferredPrompt = null;
        });
      } else {
        // Show a helpful message based on browser
        alert(
          'To install EcoBuild as a Desktop App:\n\n' +
          '① In Chrome/Edge: look for the ⊕ install icon in the address bar\n' +
          '② Or: open the browser menu (⋮) → "Install EcoBuild"\n' +
          '③ Or: double-click EcoBuildSmart.bat on your Desktop\n\n' +
          'If none of the above appear, the app is already installed or\n' +
          'your browser does not support PWA installation.'
        );
      }
    }
  };
})();
