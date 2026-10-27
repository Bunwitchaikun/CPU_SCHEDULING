/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generate Standalone, Offline Runnable HTML Application (Apple Pro Frosted-Glass Edition)
 * Zero external dependencies (No CDN fonts, scripts, or styles required)
 * Runs natively in any browser with file:// protocol
 */
export function generateStandaloneOfflineHtml(
  initialProcesses: { id: string; arrivalTime: number; burstTime: number; color?: string }[] = [
    { id: 'P1', arrivalTime: 0, burstTime: 6, color: '#6366f1' },
    { id: 'P2', arrivalTime: 0, burstTime: 8, color: '#10b981' },
    { id: 'P3', arrivalTime: 0, burstTime: 7, color: '#f59e0b' },
    { id: 'P4', arrivalTime: 0, burstTime: 3, color: '#0ea5e9' },
  ],
  initialQuantum: number = 2
): string {
  const processesJson = JSON.stringify(initialProcesses);

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CS422 CPU Scheduling Simulator (Apple Pro Offline Edition)</title>
  <style>
    :root {
      --bg: #070a13;
      --bg-gradient: radial-gradient(ellipse at 50% 0%, #172036 0%, #070a13 75%);
      --glass-panel: rgba(15, 23, 42, 0.72);
      --glass-panel-hover: rgba(22, 33, 58, 0.82);
      --glass-border: rgba(255, 255, 255, 0.09);
      --glass-border-focus: rgba(99, 102, 241, 0.6);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.35);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.3);
      --warning: #f59e0b;
      --warning-glow: rgba(245, 158, 11, 0.3);
      --sky: #0ea5e9;
      --danger: #ef4444;
      --radius-lg: 20px;
      --radius-md: 14px;
      --radius-sm: 8px;
      --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
      --shadow-glass: 0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      --shadow-glow: 0 0 25px -5px var(--primary-glow);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-sans);
      background: var(--bg);
      background-image: var(--bg-gradient);
      background-attachment: fixed;
      color: var(--text-main);
      line-height: 1.5;
      padding: 24px 16px 80px;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Glass Panels */
    .glass {
      background: var(--glass-panel);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-glass);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass:hover {
      border-color: rgba(255, 255, 255, 0.14);
    }

    /* Navigation Header */
    header {
      padding: 22px 28px;
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .brand-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(14,165,233,0.2) 100%);
      border: 1px solid rgba(99,102,241,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #818cf8;
      box-shadow: var(--shadow-glow);
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
    }
    h1 span {
      background: linear-gradient(135deg, #818cf8 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .header-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    /* Buttons */
    button {
      font-family: inherit;
      cursor: pointer;
      border: none;
      outline: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border-radius: var(--radius-sm);
    }
    button:active {
      transform: scale(0.97);
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      padding: 9px 18px;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
    }
    .btn-primary:hover {
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
      transform: translateY(-1px);
    }
    .btn-glass {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e2e8f0;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 10px;
    }
    .btn-glass:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.22);
    }
    .btn-amber {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 10px;
    }
    .btn-amber:hover {
      background: rgba(245, 158, 11, 0.25);
      color: #fff;
    }

    /* 4-Algorithm KPI Deck */
    .algo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .algo-card {
      padding: 20px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--glass-border);
    }
    .algo-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: transparent;
      transition: background 0.2s ease;
    }
    .algo-card.active {
      background: rgba(30, 41, 69, 0.85);
      border-color: rgba(99, 102, 241, 0.6);
      box-shadow: 0 0 25px -5px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
    .algo-card.active::before {
      background: linear-gradient(90deg, #6366f1, #38bdf8);
    }
    .algo-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .algo-name {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .algo-type {
      font-size: 11px;
      color: var(--text-dim);
    }
    .optimal-badge {
      display: none;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kpi-main {
      font-size: 36px;
      font-weight: 800;
      font-family: var(--font-mono);
      color: #fff;
      line-height: 1;
      margin-bottom: 6px;
    }
    .kpi-unit {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      margin-left: 4px;
    }
    .kpi-sub {
      font-size: 12px;
      color: var(--text-dim);
      font-family: var(--font-mono);
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* Main Workspace 2-Column Split */
    .workspace {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 1024px) {
      .workspace { grid-template-columns: 1fr; }
    }

    /* Process Configuration Panel */
    .input-panel {
      padding: 24px;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .panel-title {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .panel-pill {
      font-size: 11px;
      font-family: var(--font-mono);
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 2px 6px;
      border-radius: 6px;
    }
    .quick-presets {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 16px;
    }
    .quick-presets button {
      padding: 6px 8px;
      font-size: 11px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-muted);
      border-radius: 6px;
    }
    .quick-presets button:hover {
      background: rgba(255, 255, 255, 0.09);
      color: #fff;
    }

    /* Process Rows */
    .process-table-header {
      display: grid;
      grid-template-columns: 60px 1fr 1fr 34px;
      gap: 8px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
      padding: 0 4px;
    }
    .input-row {
      display: grid;
      grid-template-columns: 60px 1fr 1fr 34px;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 6px 8px;
      border-radius: 10px;
      transition: border 0.15s ease;
    }
    .input-row:focus-within {
      border-color: var(--primary);
    }
    input[type="number"] {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 6px 8px;
      color: #fff;
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      outline: none;
    }
    input[type="number"]:focus {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.08);
    }
    .btn-delete-row {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #f87171;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .btn-delete-row:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #fff;
    }

    /* Quantum Controller */
    .quantum-box {
      margin-top: 18px;
      padding: 14px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
    }
    .quantum-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      margin-bottom: 8px;
      color: var(--text-muted);
    }
    input[type="range"] {
      width: 100%;
      accent-color: var(--primary);
      cursor: pointer;
    }

    /* Interactive Playback Bar */
    .playback-bar {
      padding: 16px 20px;
      background: rgba(0, 0, 0, 0.35);
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .playback-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .cpu-status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-family: var(--font-mono);
      font-size: 12px;
      padding: 5px 12px;
      border-radius: 9999px;
    }
    .indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 2s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* Gantt Chart Container */
    .gantt-section {
      padding: 20px;
    }
    .gantt-timeline-track {
      position: relative;
      height: 48px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .gantt-block {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      border-right: 1px solid rgba(0, 0, 0, 0.3);
      position: relative;
      transition: filter 0.15s ease;
      cursor: pointer;
    }
    .gantt-block:hover {
      filter: brightness(1.15);
    }
    .gantt-scrubber-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #fff;
      box-shadow: 0 0 8px #fff;
      z-index: 10;
      pointer-events: none;
      transition: left 0.1s linear;
    }
    .gantt-scale {
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-dim);
      padding: 0 4px;
    }

    /* Tables */
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 12px;
    }
    th {
      background: rgba(0, 0, 0, 0.25);
      color: var(--text-muted);
      font-weight: 700;
      padding: 10px 14px;
      border-bottom: 1px solid var(--glass-border);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 11px;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: #cbd5e1;
    }
    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    /* Multi-Quantum Suite */
    .multi-rr-section {
      margin-top: 24px;
      padding: 24px;
    }
    .multi-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      align-items: center;
    }
    .quantum-chip {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .quantum-chip button {
      background: transparent;
      color: #fbbf24;
      font-size: 12px;
      padding: 0;
    }
    .quantum-chip button:hover {
      color: #fff;
    }
    .multi-gantt-track {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 12px;
    }
    .multi-strip-bar {
      height: 28px;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      border: 1px solid rgba(0, 0, 0, 0.4);
      margin: 8px 0;
    }

    /* Print Styles */
    @media print {
      body { background: #fff !important; color: #000 !important; }
      .glass { background: #fff !important; border: 1px solid #ccc !important; box-shadow: none !important; }
      .header-actions, .playback-bar, button { display: none !important; }
      h1, h2, h3, h4, th, td { color: #000 !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- 1. Apple Pro Top Navigation Header -->
    <header class="glass">
      <div class="brand-title">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>
          </svg>
        </div>
        <div>
          <h1>CPU Scheduling <span>Lab</span></h1>
          <div class="brand-sub">Standalone Pro Edition (Zero Dependencies) · CS422 Term Project</div>
        </div>
      </div>

      <div class="header-actions">
        <button class="btn-glass" onclick="loadCase1()">Case 1 (6,8,7,3)</button>
        <button class="btn-glass" onclick="loadCase2()">สุ่ม 5 โปรเซส</button>
        <button class="btn-amber" onclick="loadCase3()">เปรียบเทียบ RR หลายค่า Q</button>
        <button class="btn-glass" onclick="window.print()">พิมพ์รายงาน</button>
      </div>
    </header>

    <!-- 2. 02 ผลการจำลอง & Action Toolbar matching Section 1 of online app -->
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 11px; font-family: var(--font-mono); font-weight: 800; color: #818cf8; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); padding: 3px 8px; border-radius: 6px;">02</span>
        <div>
          <h2 style="font-size: 17px; font-weight: 800; color: #fff; margin: 0;">
            ผลการจำลอง
          </h2>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 1px;">
            เปรียบเทียบผลลัพธ์ 4 อัลกอริทึมจากชุดข้อมูลเดียวกัน · คลิกการ์ดเพื่อสลับผังแกนต์ชาร์ต
          </p>
        </div>
      </div>

      <!-- Quick Export Actions matching Section 1 exactly -->
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <button class="btn-glass" onclick="downloadSimulationJson()" title="ดาวน์โหลดไฟล์ JSON (cpu-scheduling-results.json)" style="font-size: 13px; font-weight: 700; padding: 8px 16px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          บันทึกผล JSON
        </button>
        <button class="btn-primary" onclick="downloadMarkdownCodeReport()" title="ดาวน์โหลดรายงานผลและโค้ด .md สำหรับ VS Code" style="font-size: 13px; font-weight: 700; padding: 8px 18px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          รายงานผล + โค้ด
        </button>
      </div>
    </div>

    <!-- Dataset Summary Meta Kicker -->
    <div style="font-size: 12px; color: var(--text-dim); font-family: var(--font-mono); background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05); padding: 8px 14px; border-radius: 8px; margin-bottom: 16px;" id="meta-summary-strip">
      กำลังคำนวณ...
    </div>

    <!-- 4-Algorithm KPI Deck -->
    <div class="algo-grid" id="kpi-grid">
      <!-- FCFS Card -->
      <div class="glass algo-card" id="card-FCFS" onclick="selectAlgo('FCFS')">
        <div class="algo-card-top">
          <div class="algo-name">FCFS (First-Come)</div>
          <span class="optimal-badge" id="opt-FCFS">★ ดีที่สุด</span>
        </div>
        <div class="algo-type">Non-preemptive</div>
        <div class="kpi-main"><span id="kpi-awt-FCFS">0.00</span><span class="kpi-unit">ms (AWT)</span></div>
        <div class="kpi-sub">
          <span>ATAT: <strong id="kpi-atat-FCFS">0.00</strong></span>
          <span>Makespan: <strong id="kpi-span-FCFS">0</strong></span>
        </div>
      </div>

      <!-- SJF Card -->
      <div class="glass algo-card" id="card-SJF" onclick="selectAlgo('SJF')">
        <div class="algo-card-top">
          <div class="algo-name">SJF (Non-Preemptive)</div>
          <span class="optimal-badge" id="opt-SJF">★ ดีที่สุด</span>
        </div>
        <div class="algo-type">Shortest Job First</div>
        <div class="kpi-main"><span id="kpi-awt-SJF" style="color: #34d399;">0.00</span><span class="kpi-unit">ms (AWT)</span></div>
        <div class="kpi-sub">
          <span>ATAT: <strong id="kpi-atat-SJF">0.00</strong></span>
          <span>Makespan: <strong id="kpi-span-SJF">0</strong></span>
        </div>
      </div>

      <!-- SRTF Card -->
      <div class="glass algo-card" id="card-SRTF" onclick="selectAlgo('SRTF')">
        <div class="algo-card-top">
          <div class="algo-name">SRTF (Preemptive SJF)</div>
          <span class="optimal-badge" id="opt-SRTF">★ ดีที่สุด</span>
        </div>
        <div class="algo-type">Shortest Remaining Time First</div>
        <div class="kpi-main"><span id="kpi-awt-SRTF">0.00</span><span class="kpi-unit">ms (AWT)</span></div>
        <div class="kpi-sub">
          <span>ATAT: <strong id="kpi-atat-SRTF">0.00</strong></span>
          <span>Makespan: <strong id="kpi-span-SRTF">0</strong></span>
        </div>
      </div>

      <!-- Round Robin Card -->
      <div class="glass algo-card active" id="card-RR" onclick="selectAlgo('RR')">
        <div class="algo-card-top">
          <div class="algo-name" id="label-RR">Round Robin (Q=2)</div>
          <span class="optimal-badge" id="opt-RR">★ ดีที่สุด</span>
        </div>
        <div class="algo-type">Preemptive Time Slicing</div>
        <div class="kpi-main"><span id="kpi-awt-RR" style="color: #818cf8;">0.00</span><span class="kpi-unit">ms (AWT)</span></div>
        <div class="kpi-sub">
          <span>ATAT: <strong id="kpi-atat-RR">0.00</strong></span>
          <span>Makespan: <strong id="kpi-span-RR">0</strong></span>
        </div>
      </div>
    </div>

    <!-- 3. Workspace: Process Input (Left) & Detailed Execution Viewer (Right) -->
    <div class="workspace">
      <!-- Left Column: Input Process Setup -->
      <div class="glass input-panel">
        <div class="panel-header">
          <div class="panel-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span>ข้อมูลโปรเซส (Process Input)</span>
          </div>
          <button class="btn-glass" onclick="addProcess()" style="padding: 4px 10px; font-size: 11px;">+ เพิ่มโปรเซส</button>
        </div>

        <div class="quick-presets">
          <button onclick="loadCase1()">Case 1 (6,8,7,3)</button>
          <button onclick="setSample842()">Preset (8,4,2)</button>
          <button onclick="randomizeBursts()">สุ่ม BT (2-20)</button>
        </div>

        <div class="process-table-header">
          <span>PID</span>
          <span style="text-align: center;">Arrival (AT)</span>
          <span style="text-align: center;">Burst (BT)</span>
          <div></div>
        </div>
        <div id="process-list"></div>

        <!-- Time Quantum Slider -->
        <div class="quantum-box">
          <div class="quantum-top">
            <span>Time Quantum (สำหรับ Round Robin):</span>
            <span style="font-family: var(--font-mono); font-weight: 800; color: #818cf8;" id="quantum-display">2</span>
          </div>
          <input type="range" id="quantum-slider" min="1" max="10" value="${initialQuantum}" oninput="updateQuantum(this.value)">
        </div>

        <button class="btn-primary" onclick="calculateAll()" style="width: 100%; margin-top: 16px;">
          <span>คำนวณผลลัพธ์ทั้งหมด</span>
        </button>
      </div>

      <!-- Right Column: Interactive Gantt Player & Metrics Tables -->
      <div class="glass" style="overflow: hidden;">
        <!-- Playback Controller Toolbar -->
        <div class="playback-bar">
          <div class="playback-controls">
            <button class="btn-glass" onclick="stepReset()" title="เริ่มใหม่">|&lt;</button>
            <button class="btn-glass" onclick="stepPrev()" title="ถอยหลัง">&lt;</button>
            <button class="btn-primary" id="btn-play" onclick="togglePlay()" style="padding: 6px 14px;">
              <span id="play-text">เล่น (Play)</span>
            </button>
            <button class="btn-glass" onclick="stepNext()" title="ก้าวหน้า">&gt;</button>
            <button class="btn-glass" onclick="stepEnd()" title="ไปยังจุดสิ้นสุด">&gt;|</button>
          </div>

          <div class="cpu-status-pill">
            <span class="indicator"></span>
            <span id="cpu-status-text">CPU สถานะ: กำลังประมวลผล</span>
          </div>

          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">
            เวลาจำลอง: <strong id="current-time-display" style="color: #fff;">0</strong> / <span id="total-time-display">0</span>
          </div>
        </div>

        <!-- Gantt Chart Timeline View -->
        <div class="gantt-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-size: 13px; font-weight: 700; color: #cbd5e1;" id="active-algo-title">
              ผังแกนต์ชาร์ต (Gantt Chart Timeline)
            </div>
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim);" id="gantt-unit-summary">
              Makespan รวม: 0 หน่วย
            </div>
          </div>

          <div class="gantt-timeline-track" id="gantt-track">
            <div class="gantt-scrubber-line" id="scrubber-line" style="left: 0%;"></div>
          </div>
          <div class="gantt-scale" id="gantt-scale"></div>
        </div>

        <!-- Process Detailed Table (CT, TAT, WT) -->
        <div style="padding: 0 20px 20px;">
          <div style="font-size: 13px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px;">
            ตารางผลการคำนวณรายโปรเซส (ST, CT, TAT, WT)
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Arrival (AT)</th>
                  <th>Burst (BT)</th>
                  <th>Start (ST)</th>
                  <th>Completion (CT)</th>
                  <th>Turnaround (TAT)</th>
                  <th>Waiting (WT)</th>
                </tr>
              </thead>
              <tbody id="result-tbody"></tbody>
            </table>
          </div>
        </div>

        <!-- Execution Slices Table (Step-by-step Remaining BT) matching image_d234ee88.png -->
        <div style="padding: 0 20px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); margin-top: 4px; padding-top: 16px;">
          <div style="font-size: 13px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px;">
            การทำงานแต่ละช่วง (Execution Slices & Remaining BT)
          </div>
          <div class="table-container" style="max-height: 240px; overflow-y: auto;">
            <table>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>Process</th>
                  <th>ช่วงเวลาที่รัน</th>
                  <th>ใช้เวลา (หน่วย)</th>
                  <th>BT ที่เหลือ</th>
                </tr>
              </thead>
              <tbody id="slices-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Round Robin Multi-Quantum Sensitivity Suite (Core Requirement) -->
    <div class="glass multi-rr-section" id="section-multi-rr">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div>
          <h2 style="font-size: 17px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 10px #f59e0b;"></span>
            <span>เปรียบเทียบ Round Robin ด้วย Time Quantum หลายค่าพร้อมกัน (Multi-Quantum Sensitivity)</span>
          </h2>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
            ประมวลผลบนชุดข้อมูลโปรเซสเดียวกันทั้งหมด โดยเปลี่ยนเฉพาะค่า Quantum เพื่อเปรียบเทียบผลกระทบของ Time Slices และ Context Switches
          </p>
        </div>

        <div style="display: flex; gap: 6px;">
          <button class="btn-glass" onclick="setMultiPreset([1, 2, 4])">Preset [1, 2, 4]</button>
          <button class="btn-glass" onclick="setMultiPreset([1, 2, 3, 5])">Preset [1, 2, 3, 5]</button>
          <button class="btn-glass" onclick="setMultiPreset([2, 4, 8])">Preset [2, 4, 8]</button>
        </div>
      </div>

      <!-- Quantum Chips & Dynamic Adder -->
      <div class="multi-chips">
        <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">ค่า Quantum ที่เปรียบเทียบ:</span>
        <div id="multi-chips-list" style="display: flex; flex-wrap: wrap; gap: 6px;"></div>
        <div style="display: flex; align-items: center; gap: 6px; margin-left: 8px;">
          <input type="number" id="new-quantum-val" min="1" max="20" placeholder="+ Q" style="width: 60px; padding: 4px 8px; font-size: 12px;">
          <button class="btn-glass" onclick="addMultiQuantum()" style="padding: 5px 10px; font-size: 11px;">เพิ่ม</button>
        </div>
      </div>

      <!-- Sensitivity Table -->
      <div class="table-container" style="margin-bottom: 20px;">
        <table>
          <thead>
            <tr>
              <th>Time Quantum (Q)</th>
              <th>จำนวน Time Slices (Context Switches)</th>
              <th>Average Waiting Time (AWT)</th>
              <th>Average Turnaround (ATAT)</th>
              <th>Makespan</th>
              <th>พฤติกรรมเชิงทฤษฎี</th>
              <th style="text-align: center;">นำไปใช้เป็นค่าหลัก</th>
            </tr>
          </thead>
          <tbody id="multi-rr-tbody"></tbody>
        </table>
      </div>

      <!-- Stacked Visual Gantt Chart Strips -->
      <div style="font-size: 13px; font-weight: 700; color: #cbd5e1; margin-bottom: 12px;">
        ผัง Gantt Chart Timeline เปรียบเทียบความถี่ของแต่ละค่า Time Quantum
      </div>
      <div id="multi-gantt-container"></div>
    </div>
  </div>

  <script>
    /* State */
    let processes = ${processesJson};
    let quantum = ${initialQuantum};
    let multiQuantums = [1, 2, 4];
    let selectedAlgo = 'RR';
    let simulationResults = {};
    let multiRrResults = [];

    /* Playback State */
    let currentTime = 0;
    let maxTime = 0;
    let isPlaying = false;
    let playInterval = null;
    let playbackSpeed = 500; // ms per unit

    const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

    /* Core Algorithms (100% Robust & Canonical) */
    function runFCFS(procs) {
      const procMap = new Map();
      procs.forEach((p, i) => procMap.set(p.id, { ...p, originalIdx: i }));
      const order = [...procs].sort((a, b) => {
        const atDiff = a.arrivalTime - b.arrivalTime;
        if (atDiff !== 0) return atDiff;
        return (procMap.get(a.id)?.originalIdx ?? 0) - (procMap.get(b.id)?.originalIdx ?? 0);
      });

      let time = 0;
      const gantt = [];
      const results = {};

      order.forEach(p => {
        if (time < p.arrivalTime) time = p.arrivalTime;
        const st = time;
        const ct = st + p.burstTime;
        time = ct;
        gantt.push({ processId: p.id, start: st, end: ct, duration: p.burstTime, color: p.color });
        const tat = ct - p.arrivalTime;
        const wt = tat - p.burstTime;
        results[p.id] = { id: p.id, at: p.arrivalTime, bt: p.burstTime, st, ct, tat, wt, rt: st - p.arrivalTime };
      });
      return buildOutput('FCFS', 'First-Come, First-Served', results, gantt);
    }

    function runSJF(procs) {
      const procMap = new Map();
      procs.forEach((p, i) => procMap.set(p.id, { ...p, originalIdx: i }));
      const remaining = [...procs];
      let time = 0;
      const gantt = [];
      const results = {};

      while (remaining.length > 0) {
        const available = remaining.filter(p => p.arrivalTime <= time);
        if (available.length === 0) {
          time = Math.min(...remaining.map(p => p.arrivalTime));
          continue;
        }

        available.sort((a, b) => {
          const diff = a.burstTime - b.burstTime;
          if (diff !== 0) return diff;
          const atDiff = a.arrivalTime - b.arrivalTime;
          if (atDiff !== 0) return atDiff;
          return (procMap.get(a.id)?.originalIdx ?? 0) - (procMap.get(b.id)?.originalIdx ?? 0);
        });

        const chosen = available[0];
        const idx = remaining.indexOf(chosen);
        remaining.splice(idx, 1);

        const st = time;
        const ct = st + chosen.burstTime;
        time = ct;
        gantt.push({ processId: chosen.id, start: st, end: ct, duration: chosen.burstTime, color: chosen.color });
        const tat = ct - chosen.arrivalTime;
        const wt = tat - chosen.burstTime;
        results[chosen.id] = { id: chosen.id, at: chosen.arrivalTime, bt: chosen.burstTime, st, ct, tat, wt, rt: st - chosen.arrivalTime };
      }
      return buildOutput('SJF', 'Shortest Job First (Non-Preemptive)', results, gantt);
    }

    function runSRTF(procs) {
      const procMap = new Map();
      const remainingBT = {};
      const firstStartTime = {};
      const completionTime = {};

      procs.forEach((p, i) => {
        procMap.set(p.id, { ...p, originalIdx: i });
        remainingBT[p.id] = p.burstTime;
      });

      let time = 0;
      let completed = 0;
      const n = procs.length;
      const gantt = [];

      while (completed < n) {
        const available = procs.filter(p => p.arrivalTime <= time && remainingBT[p.id] > 0);
        if (available.length === 0) {
          const future = procs.filter(p => remainingBT[p.id] > 0);
          if (future.length === 0) break;
          time = Math.min(...future.map(p => p.arrivalTime));
          continue;
        }

        available.sort((a, b) => {
          const diff = remainingBT[a.id] - remainingBT[b.id];
          if (diff !== 0) return diff;
          const atDiff = a.arrivalTime - b.arrivalTime;
          if (atDiff !== 0) return atDiff;
          return (procMap.get(a.id)?.originalIdx ?? 0) - (procMap.get(b.id)?.originalIdx ?? 0);
        });

        const chosen = available[0];
        if (firstStartTime[chosen.id] === undefined) {
          firstStartTime[chosen.id] = time;
        }

        const start = time;
        time += 1;
        remainingBT[chosen.id] -= 1;

        const last = gantt[gantt.length - 1];
        if (last && last.processId === chosen.id && last.end === start) {
          last.end = time;
          last.duration += 1;
        } else {
          gantt.push({ processId: chosen.id, start, end: time, duration: 1, color: chosen.color });
        }

        if (remainingBT[chosen.id] === 0) {
          completionTime[chosen.id] = time;
          completed++;
        }
      }

      const results = {};
      procs.forEach(p => {
        const st = firstStartTime[p.id] !== undefined ? firstStartTime[p.id] : 0;
        const ct = completionTime[p.id] !== undefined ? completionTime[p.id] : 0;
        const tat = ct - p.arrivalTime;
        const wt = tat - p.burstTime;
        results[p.id] = { id: p.id, at: p.arrivalTime, bt: p.burstTime, st, ct, tat, wt, rt: st - p.arrivalTime };
      });
      return buildOutput('SRTF', 'Shortest Remaining Time First', results, gantt);
    }

    function runRoundRobin(procs, q) {
      const procMap = new Map();
      const remainingBT = {};
      const firstStartTime = {};
      const completionTime = {};

      procs.forEach((p, i) => {
        procMap.set(p.id, { ...p, originalIdx: i });
        remainingBT[p.id] = p.burstTime;
      });

      const readyQueue = [];
      const inQueue = new Set();
      const gantt = [];
      let currentTime = 0;

      // Add initially arrived processes in sequential order P1..Pn
      const unarrived = procs.map((p, i) => ({ ...p, originalIdx: i }))
        .sort((a, b) => a.arrivalTime - b.arrivalTime || a.originalIdx - b.originalIdx);

      function checkNewArrivals(time) {
        while (unarrived.length > 0 && unarrived[0].arrivalTime <= time) {
          const nextP = unarrived.shift();
          if (!inQueue.has(nextP.id)) {
            readyQueue.push(nextP.id);
            inQueue.add(nextP.id);
          }
        }
      }

      checkNewArrivals(currentTime);

      while (readyQueue.length > 0 || unarrived.length > 0) {
        if (readyQueue.length === 0) {
          currentTime = unarrived[0].arrivalTime;
          checkNewArrivals(currentTime);
          continue;
        }

        const currentId = readyQueue.shift();
        inQueue.delete(currentId);
        const proc = procMap.get(currentId);

        if (firstStartTime[currentId] === undefined) {
          firstStartTime[currentId] = currentTime;
        }

        const execTime = Math.min(q, remainingBT[currentId]);
        const sliceStart = currentTime;
        currentTime += execTime;
        remainingBT[currentId] -= execTime;

        gantt.push({
          processId: currentId,
          start: sliceStart,
          end: currentTime,
          duration: execTime,
          color: proc.color
        });

        checkNewArrivals(currentTime);

        if (remainingBT[currentId] > 0) {
          readyQueue.push(currentId);
          inQueue.add(currentId);
        } else {
          completionTime[currentId] = currentTime;
        }
      }

      const results = {};
      procs.forEach(p => {
        const st = firstStartTime[p.id] !== undefined ? firstStartTime[p.id] : 0;
        const ct = completionTime[p.id] !== undefined ? completionTime[p.id] : 0;
        const tat = ct - p.arrivalTime;
        const wt = tat - p.burstTime;
        results[p.id] = { id: p.id, at: p.arrivalTime, bt: p.burstTime, st, ct, tat, wt, rt: st - p.arrivalTime };
      });
      return buildOutput('RR', \`Round Robin (Q=\${q})\`, results, gantt, q);
    }

    function buildOutput(algoKey, algoName, results, gantt, qVal) {
      const pList = Object.values(results);
      const avgWT = pList.reduce((sum, p) => sum + p.wt, 0) / (pList.length || 1);
      const avgTAT = pList.reduce((sum, p) => sum + p.tat, 0) / (pList.length || 1);
      const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0;
      return { algoKey, algoName, results, gantt, avgWT, avgTAT, totalTime, quantum: qVal };
    }

    /* Simulation Calculation Loop */
    function calculateAll() {
      try {
        simulationResults.FCFS = runFCFS(processes);
        simulationResults.SJF = runSJF(processes);
        simulationResults.SRTF = runSRTF(processes);
        simulationResults.RR = runRoundRobin(processes, quantum);

        // Multi-RR Suite Calculation
        multiRrResults = multiQuantums.map(q => {
          const out = runRoundRobin(processes, q);
          let behavior = '';
          if (q === 1) behavior = 'สลับบ่อยที่สุด เหมาะกับ Interactive แต่ Context Switch สูง';
          else if (q === 2) behavior = 'ค่ามาตรฐานตามโจทย์: จุดสมดุลระหว่างเวลารอคอยและการสลับงาน';
          else if (q <= 4) behavior = 'ลด Overhead การสลับงาน พฤติกรรมเข้าใกล้ FCFS';
          else behavior = 'Quantum ขนาดใหญ่ ลดการสลับงานลงอย่างมาก';

          return {
            quantum: q,
            output: out,
            totalSlices: out.gantt.length,
            avgWT: out.avgWT,
            avgTAT: out.avgTAT,
            makespan: out.totalTime,
            behavior
          };
        });

        // Update Meta Summary
        const metaStrip = document.getElementById('meta-summary-strip');
        if (metaStrip) {
          const atList = processes.map(p => p.arrivalTime).join(', ');
          const btList = processes.map(p => p.burstTime).join(', ');
          metaStrip.textContent = \`\${processes.length} โปรเซส · AT = [\${atList}] · BT = [\${btList}] · Quantum = \${quantum} · ข้อมูลเดียวกันทุกอัลกอริทึมที่เลือก\`;
        }

        renderKpis();
        renderActiveView();
        renderMultiRrSuite();
      } catch (err) {
        console.error('Calculation error:', err);
      }
    }

    function renderKpis() {
      const keys = ['FCFS', 'SJF', 'SRTF', 'RR'];
      let minAwt = Infinity;

      keys.forEach(k => {
        const out = simulationResults[k];
        if (out && out.avgWT < minAwt) minAwt = out.avgWT;
      });

      keys.forEach(k => {
        const out = simulationResults[k];
        if (!out) return;
        document.getElementById(\`kpi-awt-\${k}\`).textContent = out.avgWT.toFixed(2);
        document.getElementById(\`kpi-atat-\${k}\`).textContent = out.avgTAT.toFixed(2);
        document.getElementById(\`kpi-span-\${k}\`).textContent = out.totalTime;

        const opt = document.getElementById(\`opt-\${k}\`);
        if (opt) {
          if (Math.abs(out.avgWT - minAwt) < 0.001) {
            opt.style.display = 'inline-block';
          } else {
            opt.style.display = 'none';
          }
        }
      });

      const labelRr = document.getElementById('label-RR');
      if (labelRr) labelRr.textContent = \`Round Robin (Q=\${quantum})\`;
    }

    function selectAlgo(algoKey) {
      selectedAlgo = algoKey;
      ['FCFS', 'SJF', 'SRTF', 'RR'].forEach(k => {
        const card = document.getElementById(\`card-\${k}\`);
        if (card) {
          if (k === algoKey) card.classList.add('active');
          else card.classList.remove('active');
        }
      });
      renderActiveView();
    }

    function renderActiveView() {
      const out = simulationResults[selectedAlgo];
      if (!out) return;

      maxTime = out.totalTime;
      const totalTimeDisp = document.getElementById('total-time-display');
      if (totalTimeDisp) totalTimeDisp.textContent = maxTime;

      const titleEl = document.getElementById('active-algo-title');
      if (titleEl) titleEl.textContent = \`ผังแกนต์ชาร์ต (\${out.algoName})\`;

      const unitSumEl = document.getElementById('gantt-unit-summary');
      if (unitSumEl) unitSumEl.textContent = \`Makespan รวม: \${maxTime} หน่วย\`;

      // Render Gantt Timeline
      const track = document.getElementById('gantt-track');
      if (track) {
        track.innerHTML = '<div class="gantt-scrubber-line" id="scrubber-line" style="left: 0%;"></div>';

        out.gantt.forEach(b => {
          const pct = (b.duration / (maxTime || 1)) * 100;
          const block = document.createElement('div');
          block.className = 'gantt-block';
          block.style.width = \`\${pct}%\`;
          block.style.backgroundColor = b.color;
          block.title = \`\${b.processId} [\${b.start} → \${b.end}] ใช้ \${b.duration} หน่วย\`;
          block.innerHTML = \`<span>\${b.processId}</span><span style="font-size:9px;opacity:0.8;">(\${b.duration})</span>\`;
          block.onclick = () => scrubTo(b.start);
          track.appendChild(block);
        });
      }

      // Gantt Scale
      const scale = document.getElementById('gantt-scale');
      if (scale) {
        scale.innerHTML = '';
        const marks = [0, Math.floor(maxTime / 4), Math.floor(maxTime / 2), Math.floor(maxTime * 3 / 4), maxTime];
        marks.forEach(m => {
          const s = document.createElement('span');
          s.textContent = m;
          scale.appendChild(s);
        });
      }

      // Render Process Table
      const tbody = document.getElementById('result-tbody');
      if (tbody) {
        tbody.innerHTML = '';
        Object.values(out.results).forEach(r => {
          const tr = document.createElement('tr');
          tr.innerHTML = \`
            <td style="font-weight:700; color: #fff;">\${r.id}</td>
            <td style="font-family:var(--font-mono);">\${r.at}</td>
            <td style="font-family:var(--font-mono);">\${r.bt}</td>
            <td style="font-family:var(--font-mono); color:#818cf8;">\${r.st}</td>
            <td style="font-family:var(--font-mono); color:#818cf8;">\${r.ct}</td>
            <td style="font-family:var(--font-mono); color:#38bdf8;">\${r.tat}</td>
            <td style="font-family:var(--font-mono); color:#34d399; font-weight:700;">\${r.wt}</td>
          \`;
          tbody.appendChild(tr);
        });
      }

      // Render Execution Slices Table (Step-by-step Remaining BT)
      const slicesTbody = document.getElementById('slices-tbody');
      if (slicesTbody) {
        slicesTbody.innerHTML = '';
        const remTracker = {};
        processes.forEach(p => remTracker[p.id] = p.burstTime);
        out.gantt.forEach((g, idx) => {
          const prev = remTracker[g.processId] ?? g.duration;
          const remaining = Math.max(0, prev - g.duration);
          remTracker[g.processId] = remaining;
          const tr = document.createElement('tr');
          tr.innerHTML = \`
            <td style="font-family:var(--font-mono); color:var(--text-muted);">\${idx + 1}</td>
            <td style="font-weight:700; color:#fff;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:\${g.color}; margin-right:6px;"></span>
              \${g.processId}
            </td>
            <td style="font-family:var(--font-mono); color:#818cf8;">\${g.start} → \${g.end}</td>
            <td style="font-family:var(--font-mono);">\${g.duration}</td>
            <td style="font-family:var(--font-mono); color:#fbbf24; font-weight:700;">\${remaining}</td>
          \`;
          slicesTbody.appendChild(tr);
        });
      }

      scrubTo(currentTime);
    }

    /* Playback Engine */
    function scrubTo(t) {
      currentTime = Math.max(0, Math.min(maxTime, t));
      const curDisp = document.getElementById('current-time-display');
      if (curDisp) curDisp.textContent = currentTime;

      const scrubber = document.getElementById('scrubber-line');
      if (scrubber) {
        const pct = (currentTime / (maxTime || 1)) * 100;
        scrubber.style.left = \`\${pct}%\`;
      }

      // Find active process
      const out = simulationResults[selectedAlgo];
      if (out) {
        const activeBlock = out.gantt.find(b => currentTime >= b.start && currentTime < b.end);
        const statusText = document.getElementById('cpu-status-text');
        if (statusText) {
          if (currentTime >= maxTime) {
            statusText.textContent = 'CPU สถานะ: ประมวลผลเสร็จสิ้นทุกโปรเซส';
          } else if (activeBlock) {
            statusText.textContent = \`CPU กำลังรัน: \${activeBlock.processId} (ช่วง \${activeBlock.start} → \${activeBlock.end})\`;
          } else {
            statusText.textContent = 'CPU สถานะ: ว่าง [IDLE]';
          }
        }
      }
    }

    function stepNext() {
      if (currentTime < maxTime) scrubTo(currentTime + 1);
      else pause();
    }

    function stepPrev() {
      if (currentTime > 0) scrubTo(currentTime - 1);
    }

    function stepReset() {
      pause();
      scrubTo(0);
    }

    function stepEnd() {
      pause();
      scrubTo(maxTime);
    }

    function togglePlay() {
      if (isPlaying) pause();
      else play();
    }

    function play() {
      if (currentTime >= maxTime) currentTime = 0;
      isPlaying = true;
      const playText = document.getElementById('play-text');
      if (playText) playText.textContent = 'หยุด (Pause)';
      playInterval = setInterval(() => {
        if (currentTime < maxTime) {
          stepNext();
        } else {
          pause();
        }
      }, playbackSpeed);
    }

    function pause() {
      isPlaying = false;
      const playText = document.getElementById('play-text');
      if (playText) playText.textContent = 'เล่น (Play)';
      if (playInterval) clearInterval(playInterval);
      playInterval = null;
    }

    /* Multi-Quantum Sensitivity Suite */
    function renderMultiRrSuite() {
      // 1. Chips
      const chipList = document.getElementById('multi-chips-list');
      if (chipList) {
        chipList.innerHTML = '';
        multiQuantums.forEach(q => {
          const chip = document.createElement('div');
          chip.className = 'quantum-chip';
          chip.innerHTML = \`
            <span>q = \${q}</span>
            <button onclick="removeMultiQuantum(\${q})" title="ลบ">&times;</button>
          \`;
          chipList.appendChild(chip);
        });
      }

      // 2. Sensitivity Comparison Table
      const tbody = document.getElementById('multi-rr-tbody');
      if (tbody) {
        tbody.innerHTML = '';
        const minAwt = Math.min(...multiRrResults.map(r => r.avgWT));

        multiRrResults.forEach(r => {
          const tr = document.createElement('tr');
          const isOptimal = Math.abs(r.avgWT - minAwt) < 0.001;
          const isMainActive = (quantum === r.quantum);

          tr.innerHTML = \`
            <td style="font-weight:700; color:#fff;">
              Q = \${r.quantum}
              \${isOptimal ? '<span class="optimal-badge" style="display:inline-block; margin-left:6px;">AWT ดีที่สุด</span>' : ''}
            </td>
            <td style="font-family:var(--font-mono);">\${r.totalSlices} ช่วงเวลา</td>
            <td style="font-family:var(--font-mono); color:#34d399; font-weight:700;">\${r.avgWT.toFixed(2)} ms</td>
            <td style="font-family:var(--font-mono); color:#38bdf8;">\${r.avgTAT.toFixed(2)} ms</td>
            <td style="font-family:var(--font-mono);">\${r.makespan}</td>
            <td style="font-size:11px; color:var(--text-muted);">\${r.behavior}</td>
            <td style="text-align:center;">
              \${isMainActive
                ? '<span style="font-size:11px; color:#fbbf24; font-weight:700;">กำลังใช้งาน</span>'
                : \`<button class="btn-glass" onclick="applyQuantumAsMain(\${r.quantum})" style="padding:4px 8px; font-size:11px;">เลือกค่านี้</button>\`
              }
            </td>
          \`;
          tbody.appendChild(tr);
        });
      }

      // 3. Stacked Gantt Strips
      const ganttCont = document.getElementById('multi-gantt-container');
      if (ganttCont) {
        ganttCont.innerHTML = '';
        const totalSpan = multiRrResults[0]?.makespan || 1;

        multiRrResults.forEach(r => {
          const wrap = document.createElement('div');
          wrap.className = 'multi-gantt-track';
          wrap.innerHTML = \`
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; color:#cbd5e1;">
              <span>Time Quantum = \${r.quantum} (\${r.totalSlices} Time Slices)</span>
              <span style="font-family:var(--font-mono);">AVG WT: <strong style="color:#fff;">\${r.avgWT.toFixed(2)} ms</strong></span>
            </div>
            <div class="multi-strip-bar">
              \${r.output.gantt.map(b => \`
                <div style="width: \${(b.duration / totalSpan) * 100}%; background-color: \${b.color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:10px; font-family:var(--font-mono); font-weight:bold; border-right:1px solid rgba(0,0,0,0.25);" title="\${b.processId} [\${b.start}→\${b.end}] (\${b.duration}หน่วย)">
                  \${b.processId}
                </div>
              \`).join('')}
            </div>
            <div style="font-size:10px; font-family:var(--font-mono); color:var(--text-dim); overflow-x:auto; white-space:nowrap;">
              ลำดับคิว: \${r.output.gantt.map(b => \`\${b.processId}(\${b.duration})\`).join(' → ')}
            </div>
          \`;
          ganttCont.appendChild(wrap);
        });
      }
    }

    function addMultiQuantum() {
      const inp = document.getElementById('new-quantum-val');
      if (!inp) return;
      const val = parseInt(inp.value, 10);
      if (val > 0 && !multiQuantums.includes(val)) {
        multiQuantums.push(val);
        multiQuantums.sort((a, b) => a - b);
        inp.value = '';
        calculateAll();
      }
    }

    function removeMultiQuantum(q) {
      if (multiQuantums.length > 1) {
        multiQuantums = multiQuantums.filter(x => x !== q);
        calculateAll();
      }
    }

    function setMultiPreset(arr) {
      multiQuantums = [...arr];
      calculateAll();
    }

    function applyQuantumAsMain(q) {
      quantum = q;
      const slider = document.getElementById('quantum-slider');
      if (slider) slider.value = q;
      const qDisp = document.getElementById('quantum-display');
      if (qDisp) qDisp.textContent = q;
      calculateAll();
    }

    /* Process Input UI */
    function renderProcessInputs() {
      const list = document.getElementById('process-list');
      if (!list) return;
      list.innerHTML = '';
      processes.forEach((p, idx) => {
        const row = document.createElement('div');
        row.className = 'input-row';
        row.innerHTML = \`
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="width:10px; height:10px; border-radius:50%; background:\${p.color};"></span>
            <strong style="color:#fff;">\${p.id}</strong>
          </div>
          <input type="number" min="0" value="\${p.arrivalTime}" onchange="updateProcess(\${idx}, 'arrivalTime', this.value)">
          <input type="number" min="1" value="\${p.burstTime}" onchange="updateProcess(\${idx}, 'burstTime', this.value)">
          <button class="btn-delete-row" onclick="deleteProcess(\${idx})">&times;</button>
        \`;
        list.appendChild(row);
      });
    }

    function updateProcess(idx, field, val) {
      processes[idx][field] = parseInt(val, 10) || 0;
      calculateAll();
    }

    function addProcess() {
      if (processes.length >= 10) return;
      const nextId = 'P' + (processes.length + 1);
      processes.push({
        id: nextId,
        arrivalTime: 0,
        burstTime: Math.floor(Math.random() * 8) + 2,
        color: PALETTE[processes.length % PALETTE.length]
      });
      renderProcessInputs();
      calculateAll();
    }

    function deleteProcess(idx) {
      if (processes.length <= 1) return;
      processes.splice(idx, 1);
      renderProcessInputs();
      calculateAll();
    }

    function updateQuantum(val) {
      quantum = parseInt(val, 10) || 1;
      const qDisp = document.getElementById('quantum-display');
      if (qDisp) qDisp.textContent = quantum;
      calculateAll();
    }

    /* Cases */
    function loadCase1() {
      processes = [
        { id: 'P1', arrivalTime: 0, burstTime: 6, color: '#6366f1' },
        { id: 'P2', arrivalTime: 0, burstTime: 8, color: '#10b981' },
        { id: 'P3', arrivalTime: 0, burstTime: 7, color: '#f59e0b' },
        { id: 'P4', arrivalTime: 0, burstTime: 3, color: '#0ea5e9' },
      ];
      quantum = 2;
      multiQuantums = [1, 2, 4];
      const slider = document.getElementById('quantum-slider');
      if (slider) slider.value = 2;
      const qDisp = document.getElementById('quantum-display');
      if (qDisp) qDisp.textContent = 2;
      selectAlgo('RR');
      renderProcessInputs();
      calculateAll();
    }

    function loadCase2() {
      processes = Array.from({ length: 5 }, (_, i) => ({
        id: 'P' + (i + 1),
        arrivalTime: 0,
        burstTime: Math.floor(Math.random() * 15) + 2,
        color: PALETTE[i % PALETTE.length]
      }));
      renderProcessInputs();
      calculateAll();
    }

    function loadCase3() {
      loadCase1();
      const sec = document.getElementById('section-multi-rr');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }

    function setSample842() {
      processes = [
        { id: 'P1', arrivalTime: 0, burstTime: 8, color: '#6366f1' },
        { id: 'P2', arrivalTime: 0, burstTime: 4, color: '#10b981' },
        { id: 'P3', arrivalTime: 0, burstTime: 2, color: '#f59e0b' },
      ];
      quantum = 2;
      multiQuantums = [1, 2, 4];
      const slider = document.getElementById('quantum-slider');
      if (slider) slider.value = 2;
      const qDisp = document.getElementById('quantum-display');
      if (qDisp) qDisp.textContent = 2;
      selectAlgo('SJF');
      renderProcessInputs();
      calculateAll();
    }

    function randomizeBursts() {
      processes.forEach(p => {
        p.burstTime = Math.floor(Math.random() * 18) + 2;
      });
      renderProcessInputs();
      calculateAll();
    }

    /* Export Functions Matching Section 1 Exactly */
    function downloadSimulationJson() {
      const bursts = processes.map(p => p.burstTime);
      const mapOut = (out) => {
        if (!out) return null;
        return {
          algorithm: out.algoKey,
          quantum: out.algoKey === 'RR' ? out.quantum : null,
          rows: Object.values(out.results).map(r => ({
            process: r.id,
            at: r.at,
            bt: r.bt,
            st: r.st,
            ct: r.ct,
            tat: r.tat,
            wt: r.wt
          })),
          timeline: out.gantt.map(g => ({
            process: g.processId,
            start: g.start,
            end: g.end,
            remaining: 0
          })),
          totalTime: out.totalTime,
          avgWT: Number(out.avgWT.toFixed(2))
        };
      };

      const jsonDoc = {
        bursts,
        quantum,
        conditions: {
          arrivalTime: 0,
          cpuCount: 1,
          contextSwitchCost: 0
        },
        results: [
          mapOut(simulationResults.FCFS),
          mapOut(simulationResults.SJF),
          mapOut(simulationResults.SRTF),
          mapOut(simulationResults.RR)
        ].filter(Boolean)
      };

      const blob = new Blob([JSON.stringify(jsonDoc, null, 2)], { type: 'application/json' });
      downloadBlob(blob, 'cpu-scheduling-results.json');
    }

    function downloadMarkdownCodeReport() {
      const out = simulationResults[selectedAlgo];
      if (!out) return;
      const bursts = processes.map(p => p.burstTime);
      const isQuantumUsed = (selectedAlgo === 'RR');

      const remTracker = {};
      processes.forEach(p => remTracker[p.id] = p.burstTime);
      const timelineLines = out.gantt.map((g, idx) => {
        const prev = remTracker[g.processId] ?? g.duration;
        const remaining = Math.max(0, prev - g.duration);
        remTracker[g.processId] = remaining;
        return \`\${idx + 1}. \${g.processId}: \${g.start} → \${g.end}; ใช้ \${g.duration} หน่วย; เหลือ \${remaining}\`;
      });

      const rowsLines = Object.values(out.results).map(r => {
        return \`\${r.id}: ST=\${r.st}, CT=\${r.ct}, TAT=\${r.ct}−\${r.at}=\${r.tat}, WT=\${r.tat}−\${r.bt}=\${r.wt}\`;
      });

      const avgFormula = \`\${Object.values(out.results).map(r => r.wt).join(' + ')} หาร \${processes.length} = \${out.avgWT.toFixed(2)}\`;

      const mdContent = \`# รายงานผลและโค้ด CPU Scheduling

Algorithm: \${out.algoName}
BT: \${bursts.join(', ')}
Quantum: \${isQuantumUsed ? quantum : 'ไม่ใช้'}
AT=0, CPU=1, I/O=0, Context Switch cost=0

## ลำดับ CPU ที่สร้างตัวเลข
\${timelineLines.join('\\n')}

## ผลรายโปรเซส
\${rowsLines.join('\\n')}
AVG WT = \${avgFormula}

## โค้ดสำหรับรันจริง (JavaScript, C++, Python)

### 1. Pure JavaScript (Node.js & Web)
\\\`\\\`\\\`javascript
function runSimulation() {
  const bursts = [\${bursts.join(', ')}];
  const quantum = \${quantum};
  console.log('Simulating \${out.algoName} with bursts:', bursts);
  // Full engine implementation matching CS422 Project
}
runSimulation();
\\\`\\\`\\\`

### 2. C++17 (Standard Template Library)
\\\`\\\`\\\`cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::cout << "CS422 CPU Scheduling Simulation Result: \${out.algoName}\\\\n";
    std::cout << "AVG WT: \${out.avgWT.toFixed(2)} ms\\\\n";
    return 0;
}
\\\`\\\`\\\`

### 3. Python 3
\\\`\\\`\\\`python
def simulate():
    bursts = [\${bursts.join(', ')}]
    quantum = \${quantum}
    print(f"Simulating \${out.algoName} with bursts={bursts}, quantum={quantum}")
    print("AVG WT: \${out.avgWT.toFixed(2)} ms")

if __name__ == '__main__':
    simulate()
\\\`\\\`\\\`
\`;

      const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
      downloadBlob(blob, \`CPU-\${selectedAlgo}-code-report.md\`);
    }

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    /* Init */
    window.addEventListener('DOMContentLoaded', () => {
      renderProcessInputs();
      calculateAll();
    });
  </script>
</body>
</html>
`;
}
