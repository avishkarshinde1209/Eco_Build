/**
 * EcoBuild Smart — EIA Results View
 * Renders the statutory EIA results matrix produced by environmentalCalculator.js.
 * Regulatory references rendered here:
 *   MoEFCC EIA Notification 2006 | CPCB NAAQS 2009 | CEA v20 | NBC 2016 Part 11
 */

window.EIAResultsView = {
  activeTab: 'all',

  filterTab(tabId) {
    this.activeTab = tabId;
    const p = window.App?.currentProject;
    const c = window.App?.calculations;
    const e = window.App?.environmentalData;
    this.render(p, c, e);
  },

  copyTransmittalSummary() {
    const eia = window.App?.calculations?.eia_results;
    if (!eia) return;
    const scr = eia.screening || {};
    const kpi = eia.key_results || [];
    const txt = [
      'STATUTORY EIA TRANSMITTAL — EcoBuild Smart',
      `Project: ${eia.project_name}`,
      `Location: ${eia.location.city}, ${eia.location.state} (${eia.location.coordinates})`,
      `Screening Category: ${scr.category}`,
      `Appraisal Authority: ${scr.authority}`,
      `Appraisal Type: ${scr.appraisal_type}`,
      `Statutory Verdict: ${scr.statutory_verdict}`,
      `EcoBuild Score: ${scr.composite_score}/100 (${scr.performance_tier})`,
      '',
      'KEY FINDINGS:',
      ...kpi.map((k, i) => `  ${i + 1}. ${k.label}: ${k.net_result}`),
      '',
      `Generated: ${new Date(eia.generated_at).toLocaleString()}`,
      'System: EcoBuild Smart | MoEFCC EIA Notification 2006 | CEA v20'
    ].join('\n');
    navigator.clipboard?.writeText(txt).then(() =>
      window.App?.showNotification?.('EIA transmittal copied to clipboard.', 'success')
    );
  },

  exportEIAJson() {
    const eia = window.App?.calculations?.eia_results || {};
    const proj = window.App?.currentProject || {};
    const blob = new Blob([JSON.stringify({ eia_results: eia, project: proj,
      exported_at: new Date().toISOString(), standard: 'MoEFCC EIA Notification 2006' }, null, 2)],
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EIA_${(proj.name || 'Assessment').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    window.App?.showNotification?.('EIA JSON exported.', 'success');
  },

  render(project, calculations, environmentalData) {
    const container = document.getElementById('eiaresults-view');
    if (!container) return;

    const proj = project      || window.App?.currentProject    || {};
    const calc = calculations || window.App?.calculations       || {};
    const env  = environmentalData || window.App?.environmentalData || {};

    let eia = calc.eia_results;
    if (!eia && window.EnvironmentalCalculator) {
      calc.eia_results = window.EnvironmentalCalculator.generateEIAResults(proj, calc, env);
      eia = calc.eia_results;
    }

    if (!eia) {
      container.innerHTML = `
        <div class="crystal-glass-card p-8 text-center max-w-lg mx-auto my-12">
          <div class="text-4xl mb-3">⚠️</div>
          <h3 class="text-base font-bold text-stone-800">EIA data unavailable</h3>
          <p class="text-xs text-stone-500 mt-1">Complete the project inputs and run the assessment to generate EIA results.</p>
          <button onclick="window.App.recalculateProject()"
            class="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold">
            Run Assessment
          </button>
        </div>`;
      return;
    }

    const scr = eia.screening   || {};
    const kpi = eia.key_results || [];
    const dom = eia.domains     || [];
    const filteredDomains = this.activeTab === 'all'
      ? dom : dom.filter(d => d.domain_id === this.activeTab);

    // ── Badge colour helper ───────────────────────────────────────────────
    const statusBadge = status => {
      const s = status || '';
      if (/Compliant|ZLD|Met|Circular|Diverted|Verified|Reduced|Displaced|Solar|Low-Carbon/i.test(s))
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      if (/Deficit|Missing|Not/i.test(s))
        return 'bg-red-100 text-red-800 border-red-200';
      return 'bg-teal-100 text-teal-800 border-teal-200';
    };

    container.innerHTML = `
      <div class="space-y-7 max-w-7xl mx-auto pb-16 font-sans text-stone-800">

        <!-- ① HEADER BANNER -->
        <div class="crystal-glass-card p-6 sm:p-7 border-t-4 border-emerald-700 relative overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            <div class="lg:col-span-8 space-y-3">
              <!-- Badges -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border
                  ${scr.category_badge || 'bg-sky-100 text-sky-800 border-sky-300'}">
                  🏛️ ${scr.category}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border
                  ${scr.statutory_verdict?.includes('EXEMPT') ? 'bg-sky-950 text-sky-200 border-sky-700' : 'bg-amber-950 text-amber-200 border-amber-800'}">
                  ● ${scr.statutory_verdict}
                </span>
                <span class="text-xs text-stone-500">
                  📍 ${eia.location.city}, ${eia.location.state} — ${eia.location.coordinates}
                </span>
              </div>

              <!-- Title -->
              <h1 class="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif leading-tight">
                ${eia.project_name} — EIA Results
              </h1>

              <!-- Key metadata strip -->
              <div class="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-stone-500 pt-1 border-t border-stone-200/60">
                <div>Authority: <strong class="text-stone-800">${scr.authority}</strong></div>
                <div>GFA: <strong class="text-stone-800">${(scr.total_gfa_m2 || 0).toLocaleString()} m²</strong></div>
                <div>Plot: <strong class="text-stone-800">${(scr.plot_area_m2 || 0).toLocaleString()} m²</strong></div>
                <div>Appraisal: <strong class="text-emerald-700">${scr.appraisal_type}</strong></div>
              </div>
            </div>

            <!-- Score dial + actions -->
            <div class="lg:col-span-4 flex flex-col gap-4 lg:border-l lg:border-stone-200/50 lg:pl-6 items-start lg:items-end">
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Sustainability Score</span>
                  <div class="text-sm font-bold ${scr.composite_score >= 70 ? 'text-emerald-700' : 'text-amber-700'} mt-0.5">
                    ${scr.performance_tier}
                  </div>
                  <div class="text-[10px] text-stone-400">MoEFCC / NBC 2016</div>
                </div>
                <div class="w-18 h-18 flex flex-col items-center justify-center rounded-2xl border-4
                  ${scr.composite_score >= 70 ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-amber-500 bg-amber-50 text-amber-800'}
                  font-serif font-black shadow-sm shrink-0" style="width:72px;height:72px;">
                  <span class="text-2xl leading-none">${scr.composite_score}</span>
                  <span class="text-[9px] font-sans font-semibold text-stone-400 mt-0.5">/100</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <button onclick="window.EIAResultsView.copyTransmittalSummary()"
                  class="px-3 py-1.5 rounded-xl crystal-3d-pill text-stone-700 hover:text-stone-900 text-xs font-bold flex items-center gap-1">
                  📋 Copy Summary
                </button>
                <button onclick="window.EIAResultsView.exportEIAJson()"
                  class="px-3 py-1.5 rounded-xl crystal-3d-pill text-stone-700 hover:text-stone-900 text-xs font-bold flex items-center gap-1">
                  💾 Export JSON
                </button>
                <button onclick="window.App.switchView('report')"
                  class="px-3.5 py-1.5 rounded-xl crystal-3d-button text-white text-xs font-bold flex items-center gap-1">
                  📄 Full Report →
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- ② 6 KPI SUMMARY CARDS (Before → After Construction → After Assessment) -->
        <div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 px-1 flex items-center gap-2">
            📋 3-Stage Environmental Lifecycle — Before | After Construction | After Assessment
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            ${kpi.map(k => `
              <div class="crystal-glass-card p-4 rounded-2xl space-y-3 hover:border-emerald-400/50 transition">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-stone-200/60 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">${k.icon}</span>
                    <span class="text-xs font-bold text-stone-900">${k.label}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${k.badge_class} border">${k.status}</span>
                </div>
                <!-- 3 Stages -->
                <div class="space-y-1.5 text-[11px]">
                  <div class="flex items-start justify-between gap-2 p-2 rounded-lg bg-stone-100 border border-stone-200/70">
                    <span class="font-semibold text-stone-500 shrink-0">⏮️ Before:</span>
                    <span class="font-mono text-right text-stone-700">${k.before || k.before_construction || '—'}</span>
                  </div>
                  <div class="flex items-start justify-between gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200/60">
                    <span class="font-semibold text-amber-700 shrink-0">🏗️ After Construction:</span>
                    <span class="font-mono text-right text-stone-800">${k.after_construction || '—'}</span>
                  </div>
                  <div class="flex items-start justify-between gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 font-semibold">
                    <span class="text-emerald-700 shrink-0">✅ After Assessment:</span>
                    <span class="font-mono text-right text-emerald-900">${k.after_assessment || '—'}</span>
                  </div>
                </div>
                <!-- Net benefit -->
                <div class="flex items-center justify-between border-t border-stone-200/50 pt-1.5">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">Net Result</span>
                  <span class="text-sm font-black text-emerald-800 font-serif">${k.net_result || k.value}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ③ DOMAIN FILTER TABS -->
        <div class="crystal-glass-card p-2 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          ${[
            ['all',                '🌐', 'All 6 Domains'],
            ['land_soil',          '🏞️', 'Land & Topsoil'],
            ['water_hydrology',    '💧', 'Water & STP'],
            ['air_microclimate',   '💨', 'Air & Microclimate'],
            ['energy_carbon',      '☀️', 'Energy & Carbon'],
            ['waste_circularity',  '♻️', 'Waste'],
            ['ecology_biodiversity','🌱', 'Ecology'],
          ].map(([id, icon, label]) => `
            <button onclick="window.EIAResultsView.filterTab('${id}')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition
              ${this.activeTab === id ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:bg-stone-100'}">
              ${icon} ${label}
            </button>
          `).join('')}
        </div>

        <!-- ④ DOMAIN TABLES -->
        <div class="space-y-5">
          ${filteredDomains.map(d => `
            <div class="crystal-glass-card overflow-hidden">
              <!-- Domain header -->
              <div class="bg-gradient-to-r from-stone-900 to-[#123C32] text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 class="text-sm font-bold font-serif text-white">${d.domain_name}</h3>
                  <div class="text-[10px] text-emerald-300 font-mono mt-0.5">Ref: ${d.standard_ref}</div>
                </div>
                <span class="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  MoEFCC Form-1A Schedule
                </span>
              </div>

              <!-- Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr class="bg-stone-50 text-stone-600 font-bold uppercase text-[9px] tracking-wider border-b border-stone-200">
                      <th class="p-3 pl-4 min-w-[180px]">Parameter & Standard</th>
                      <th class="p-3 bg-stone-100 border-r border-stone-200 min-w-[160px]">
                        ⏮️ Before Construction
                        <span class="block font-normal text-[8px] text-stone-400 normal-case">site baseline</span>
                      </th>
                      <th class="p-3 bg-amber-50 border-r border-amber-100 min-w-[180px]">
                        🏗️ After Construction
                        <span class="block font-normal text-[8px] text-amber-700 normal-case">unmitigated load</span>
                      </th>
                      <th class="p-3 bg-emerald-50 border-r border-emerald-100 min-w-[200px]">
                        ✅ After Assessment
                        <span class="block font-normal text-[8px] text-emerald-700 normal-case">mitigated outcome</span>
                      </th>
                      <th class="p-3 min-w-[150px] text-emerald-800">📈 Net Result</th>
                      <th class="p-3 pr-4 text-right min-w-[110px]">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100 text-stone-700">
                    ${d.parameters.map((p, i) => `
                      <tr class="${i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'} hover:bg-emerald-50/20 transition">
                        <td class="p-3 pl-4">
                          <div class="font-semibold text-stone-900 text-xs">${p.name}</div>
                          <span class="text-[9px] font-mono text-stone-400 block mt-0.5">${p.standard_code || d.standard_ref}</span>
                        </td>
                        <td class="p-3 font-mono text-stone-600 bg-stone-50/40 border-r border-stone-100">
                          ${p.before || p.before_construction || '—'}
                        </td>
                        <td class="p-3 font-mono text-stone-800 bg-amber-50/30 border-r border-amber-100">
                          ${p.after_construction || '—'}
                        </td>
                        <td class="p-3 font-mono font-semibold text-emerald-900 bg-emerald-50/50 border-r border-emerald-100">
                          ${p.after_assessment || '—'}
                        </td>
                        <td class="p-3 text-stone-700 font-medium">
                          ${p.net_result || '—'}
                        </td>
                        <td class="p-3 pr-4 text-right">
                          <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(p.status)}">
                            ● ${p.status || '—'}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- ⑤ STATUTORY SIGN-OFF BLOCK -->
        <div class="crystal-glass-card p-6 sm:p-7 bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/80">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-8 space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span class="font-bold text-xs uppercase tracking-wider text-emerald-800">Appraisal Decision</span>
              </div>
              <h3 class="text-lg font-black text-stone-900 font-serif">Environmental Clearance Eligibility</h3>
              <p class="text-xs text-stone-500 leading-relaxed">
                This assessment conforms to MoEFCC EIA Notification 2006 (Schedule Item 8), CPCB NAAQS 2009,
                CPHEEO Sewerage Manual 2019, CEA CO₂ Baseline v20 (0.727 kg CO₂/kWh), and NBC 2016 Part 11.
                Formal clearance must be obtained from the designated competent authority.
              </p>
              <div class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-600 pt-1">
                <div>✔ <strong>ZLD</strong> — SBR/MBBR tertiary STP</div>
                <div>✔ <strong>3:1 Compensatory</strong> tree planting</div>
                <div>✔ <strong>C&D Circularity</strong> — RCA reuse</div>
                <div>✔ <strong>Rooftop Solar PV</strong> — grid offset</div>
              </div>
            </div>
            <div class="md:col-span-4 bg-white p-5 rounded-2xl border-2 border-emerald-500/60 shadow-sm text-center space-y-1.5">
              <div class="text-[9px] font-bold uppercase tracking-wider text-stone-400">Engineering Sign-Off</div>
              <div class="font-serif font-bold text-stone-900 text-sm">Lead Environmental Assessor</div>
              <div class="text-[11px] text-emerald-700 font-semibold">Chartered Environmental Engineer</div>
              <div class="text-[9px] text-stone-400 font-mono border-t border-stone-200 pt-1.5 mt-1">
                EcoBuild Smart — Automated EIA Engine<br>
                PARIVESH 2.0 Audit Spec V3.4
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }
};
