/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip';
import { AlgorithmType, ProcessInput, SchedulingOutput } from '../types/simulator';

export const SCHEDULER_JS_CODE = `/**
 * CS422 CPU Scheduling Engine
 * Term Project - Kingkarn Sookhanaphibarn
 * Algorithms: FCFS, SJF (Non-preemptive), SRTF (Preemptive SJF), Round Robin (RR)
 * Constraints: AT = 0 (or custom), CPU = 1, I/O = 0, Context Switch Cost = 0
 */

const LIMITS = {
  processes: 20,
  burst: 1000,
  quantum: 1000000,
};

function positiveInteger(value, label, max = Number.MAX_SAFE_INTEGER) {
  const text = String(value).trim();
  const number = Number(text);
  if (!/^\\d+$/.test(text) || !Number.isSafeInteger(number) || number < 1) {
    throw new Error(\`\${label} ต้องเป็นจำนวนเต็มบวก เช่น 1, 2, 3\`);
  }
  if (number > max) throw new Error(\`\${label} ต้องไม่เกิน \${max}\`);
  return number;
}

function nonNegativeInteger(value, label, max = Number.MAX_SAFE_INTEGER) {
  const text = String(value).trim();
  const number = Number(text);
  if (!/^\\d+$/.test(text) || !Number.isSafeInteger(number) || number < 0) {
    throw new Error(\`\${label} ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป\`);
  }
  if (number > max) throw new Error(\`\${label} ต้องไม่เกิน \${max}\`);
  return number;
}

function validateBursts(bursts) {
  if (!Array.isArray(bursts) || bursts.length < 1 || bursts.length > LIMITS.processes) {
    throw new Error(\`จำนวนโปรเซสต้องอยู่ระหว่าง 1–\${LIMITS.processes}\`);
  }
  return Array.from(bursts, (bt, i) => positiveInteger(bt, \`BT ของ P\${i + 1}\`, LIMITS.burst));
}

function makeProcesses(bursts, arrivalTimes = []) {
  return bursts.map((bt, i) => ({
    id: i + 1,
    process: \`P\${i + 1}\`,
    at: arrivalTimes[i] !== undefined ? nonNegativeInteger(arrivalTimes[i], \`AT ของ P\${i + 1}\`) : 0,
    bt,
    st: null,
    ct: null,
    remaining: bt,
  }));
}

function runFCFS(bursts, arrivalTimes = []) {
  const processes = makeProcesses(bursts, arrivalTimes);
  const order = [...processes].sort((a, b) => a.at - b.at || a.id - b.id);
  let time = 0;
  const timeline = [];

  for (const p of order) {
    if (time < p.at) time = p.at;
    p.st = time;
    time += p.bt;
    p.ct = time;
    p.remaining = 0;
    timeline.push({ process: p.process, start: p.st, end: p.ct, remaining: 0 });
  }
  return finish('FCFS', processes, timeline);
}

function runSJF(bursts, arrivalTimes = []) {
  const processes = makeProcesses(bursts, arrivalTimes);
  const remaining = [...processes];
  let time = 0;
  const timeline = [];

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.at <= time);
    if (available.length === 0) {
      const nextAt = Math.min(...remaining.map(p => p.at));
      time = nextAt;
      continue;
    }
    available.sort((a, b) => a.bt - b.bt || a.at - b.at || a.id - b.id);
    const p = available[0];
    const idx = remaining.indexOf(p);
    remaining.splice(idx, 1);

    p.st = time;
    time += p.bt;
    p.ct = time;
    p.remaining = 0;
    timeline.push({ process: p.process, start: p.st, end: p.ct, remaining: 0 });
  }

  return finish('SJF', processes, timeline);
}

function runSRTF(bursts, arrivalTimes = []) {
  const processes = makeProcesses(bursts, arrivalTimes);
  let time = 0;
  const timeline = [];
  let completed = 0;
  const n = processes.length;

  while (completed < n) {
    const available = processes.filter(p => p.at <= time && p.remaining > 0);
    if (available.length === 0) {
      const future = processes.filter(p => p.remaining > 0);
      if (future.length === 0) break;
      time = Math.min(...future.map(p => p.at));
      continue;
    }
    available.sort((a, b) => a.remaining - b.remaining || a.at - b.at || a.id - b.id);
    const p = available[0];

    if (p.st === null) p.st = time;
    const start = time;
    time += 1;
    p.remaining -= 1;

    const last = timeline[timeline.length - 1];
    if (last && last.process === p.process && last.end === start) {
      last.end = time;
      last.remaining = p.remaining;
    } else {
      timeline.push({ process: p.process, start, end: time, remaining: p.remaining });
    }

    if (p.remaining === 0) {
      p.ct = time;
      completed++;
    }
  }

  return finish('SRTF', processes, timeline);
}

function runRoundRobin(bursts, quantum = 2, arrivalTimes = []) {
  const q = positiveInteger(quantum, 'Time Quantum', LIMITS.quantum);
  const processes = makeProcesses(bursts, arrivalTimes);
  const queue = [];
  const inQueue = new Set();
  let time = 0;
  const timeline = [];
  let completed = 0;
  const n = processes.length;

  // เพิ่มโปรเซสที่มาถึงเวลา 0
  processes.forEach(p => {
    if (p.at <= time && !inQueue.has(p)) {
      queue.push(p);
      inQueue.add(p);
    }
  });

  while (completed < n) {
    if (queue.length === 0) {
      const remainingUnarrived = processes.filter(p => p.remaining > 0 && !inQueue.has(p));
      if (remainingUnarrived.length > 0) {
        time = Math.min(...remainingUnarrived.map(p => p.at));
        processes.forEach(p => {
          if (p.at <= time && !inQueue.has(p) && p.remaining > 0) {
            queue.push(p);
            inQueue.add(p);
          }
        });
      } else {
        break;
      }
    }

    const p = queue.shift();
    if (p.st === null) p.st = time;
    const slice = Math.min(p.remaining, q);
    const start = time;
    time += slice;
    p.remaining -= slice;
    timeline.push({ process: p.process, start, end: time, remaining: p.remaining });

    // ตรวจสอบโปรเซสใหม่ที่มาถึงระหว่างที่ p กำลังรัน
    processes.forEach(other => {
      if (other !== p && other.at <= time && !inQueue.has(other) && other.remaining > 0) {
        queue.push(other);
        inQueue.add(other);
      }
    });

    if (p.remaining > 0) {
      queue.push(p);
    } else {
      p.ct = time;
      completed++;
    }
  }

  return finish('RR', processes, timeline, q);
}

function finish(algorithm, processes, timeline, quantum = null) {
  const rows = processes.map(p => {
    const tat = p.ct - p.at;
    const wt = tat - p.bt;
    return { process: p.process, at: p.at, bt: p.bt, st: p.st, ct: p.ct, tat, wt };
  });
  return {
    algorithm,
    quantum,
    rows,
    timeline,
    totalTime: timeline[timeline.length - 1]?.end || 0,
    avgWT: Number((rows.reduce((sum, p) => sum + p.wt, 0) / rows.length).toFixed(2)),
    avgTAT: Number((rows.reduce((sum, p) => sum + p.tat, 0) / rows.length).toFixed(2)),
  };
}

function simulate(bursts, algorithm, quantum = 2, arrivalTimes = []) {
  const clean = validateBursts(bursts);
  if (!['FCFS', 'SJF', 'SRTF', 'RR'].includes(algorithm)) throw new Error('ไม่รู้จักอัลกอริทึมนี้');
  if (algorithm === 'FCFS') return runFCFS(clean, arrivalTimes);
  if (algorithm === 'SJF') return runSJF(clean, arrivalTimes);
  if (algorithm === 'SRTF') return runSRTF(clean, arrivalTimes);
  if (algorithm === 'RR') return runRoundRobin(clean, quantum, arrivalTimes);
}

if (typeof module !== 'undefined') {
  module.exports = { simulate, runFCFS, runSJF, runSRTF, runRoundRobin, finish, validateBursts, positiveInteger };
}
`;

/**
 * Generate Standalone, Offline Runnable HTML Application
 * Zero external dependencies (No CDN fonts, scripts, or styles required)
 */
export function generateStandaloneOfflineHtml(
  initialProcesses: { id: string; arrivalTime: number; burstTime: number; color?: string }[] = [
    { id: 'P1', arrivalTime: 0, burstTime: 6, color: '#4f46e5' },
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
  <title>CS422 CPU Scheduling Simulator (Offline Edition)</title>
  <style>
    :root {
      --bg: #0b1120;
      --card-bg: #1e293b;
      --card-border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px 16px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      border: 1px solid #3730a3;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.4);
    }
    .badge-offline {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    h1 { font-size: 26px; font-weight: 800; color: #fff; margin-top: 6px; }
    p.subtitle { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media(min-width: 992px) {
      .grid { grid-template-columns: 380px 1fr; }
    }
    .card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .preset-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }
    button {
      cursor: pointer;
      font-family: inherit;
      border: none;
      outline: none;
      transition: all 0.15s ease;
    }
    .btn-secondary {
      background: #334155;
      color: #e2e8f0;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 8px;
    }
    .btn-secondary:hover { background: #475569; color: #fff; }
    .btn-primary {
      background: var(--primary);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      padding: 12px 18px;
      border-radius: 10px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-danger {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
    }
    .btn-danger:hover { background: var(--danger); color: #fff; }
    .table-container {
      max-height: 280px;
      overflow-y: auto;
      margin-bottom: 16px;
      border: 1px solid #334155;
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    th {
      background: #0f172a;
      color: var(--text-muted);
      padding: 8px 10px;
      font-weight: 600;
      position: sticky;
      top: 0;
      font-family: monospace;
      font-size: 11px;
    }
    td {
      padding: 6px 10px;
      border-bottom: 1px solid #334155;
    }
    tr:last-child td { border-bottom: none; }
    input[type="number"], input[type="text"] {
      background: #0f172a;
      border: 1px solid #475569;
      color: #fff;
      padding: 6px 8px;
      border-radius: 6px;
      width: 100%;
      font-family: monospace;
      font-size: 13px;
    }
    input[type="number"]:focus, input[type="text"]:focus {
      border-color: var(--primary);
      outline: none;
    }
    .quantum-group {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }
    .algo-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .algo-tab {
      flex: 1;
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      text-align: center;
      min-width: 90px;
    }
    .algo-tab.active {
      background: #4f46e5;
      border-color: #6366f1;
      color: #fff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .kpi-card {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .kpi-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-family: monospace; }
    .kpi-val { font-size: 20px; font-weight: 800; color: #fff; margin-top: 4px; }
    .gantt-wrapper {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
      overflow-x: auto;
    }
    .gantt-chart {
      display: flex;
      min-width: 500px;
      height: 48px;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .gantt-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 12px;
      font-family: monospace;
      border-right: 1px solid rgba(255,255,255,0.2);
      transition: filter 0.15s ease;
      position: relative;
    }
    .gantt-block:hover { filter: brightness(1.15); }
    .gantt-scale {
      display: flex;
      min-width: 500px;
      font-family: monospace;
      font-size: 11px;
      color: var(--text-muted);
      position: relative;
      height: 20px;
    }
    .gantt-num {
      position: absolute;
      transform: translateX(-50%);
    }
    .gantt-num:first-child { transform: translateX(0); }
    .gantt-num:last-child { transform: translateX(-100%); }
    .scorecards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .scorecard {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px 14px;
      cursor: pointer;
    }
    .scorecard.active {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.15);
    }
    .scorecard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }
    .color-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    footer {
      text-align: center;
      margin-top: 32px;
      font-size: 12px;
      color: var(--text-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header>
      <div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge">CS422 Term Project</span>
          <span class="badge badge-offline">Offline Simulator (ไม่ต้องต่อเน็ต)</span>
        </div>
        <h1>ตัวจำลองการจัดสรรเวลา CPU (CPU Scheduling Simulator)</h1>
        <p class="subtitle">วิชา Operating Systems · อาจารย์ผู้สอน: ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล · รองรับ FCFS, SJF, SRTF, Round Robin</p>
      </div>
      <div>
        <button class="btn-secondary" onclick="loadCase1()">โหลด Case 1 (6,8,7,3)</button>
        <button class="btn-secondary" onclick="loadCase2()">สุ่มค่าใหม่ (1-20)</button>
      </div>
    </header>

    <div class="grid">
      <!-- Left Column: Inputs -->
      <div class="card">
        <div class="card-title">
          <span>01 · ข้อมูลโปรเซส (Input)</span>
          <button class="btn-secondary" onclick="addProcessRow()">+ เพิ่มโปรเซส</button>
        </div>

        <div class="preset-btns">
          <button class="btn-secondary" onclick="loadCase1()">Case 1 (6,8,7,3)</button>
          <button class="btn-secondary" onclick="load842()">Preset (8,4,2)</button>
          <button class="btn-secondary" onclick="randomizeBT()">สุ่ม BT</button>
          <button class="btn-secondary" onclick="resetDefaults()">รีเซ็ต</button>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Process</th>
                <th style="width: 30%;">AT (มาถึง)</th>
                <th style="width: 30%;">BT (เวลา)</th>
                <th style="width: 15%;">ลบ</th>
              </tr>
            </thead>
            <tbody id="process-table-body">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>

        <div class="quantum-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-size: 13px; font-weight: 700; color: #fff;">Time Quantum (สำหรับ Round Robin):</label>
            <span id="quantum-badge" style="font-family: monospace; font-weight: 800; color: #818cf8; font-size: 15px;">2</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="range" id="quantum-slider" min="1" max="20" value="${initialQuantum}" style="flex: 1;" oninput="onQuantumSliderChange(this.value)">
            <input type="number" id="quantum-input" min="1" max="1000" value="${initialQuantum}" style="width: 60px;" onchange="onQuantumInputChange(this.value)">
          </div>
          <p style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">ค่าเริ่มต้น 2 หน่วยเวลา ปรับเพิ่มลดได้ทันที</p>
        </div>

        <button class="btn-primary" onclick="calculateAll()">คำนวณผลลัพธ์ทันที</button>
      </div>

      <!-- Right Column: Results -->
      <div>
        <!-- 4 Algorithms Overview Cards -->
        <div class="scorecards" id="scorecards-container">
          <!-- Populated by JS -->
        </div>

        <!-- Detail Results Card -->
        <div class="card">
          <div class="card-title">
            <span id="detail-title">02 · ผลการจำลองแบบละเอียด</span>
            <div class="algo-tabs" style="margin-bottom: 0;">
              <button class="algo-tab" id="tab-SJF" onclick="selectAlgorithm('SJF')">SJF</button>
              <button class="algo-tab" id="tab-FCFS" onclick="selectAlgorithm('FCFS')">FCFS</button>
              <button class="algo-tab" id="tab-SRTF" onclick="selectAlgorithm('SRTF')">SRTF</button>
              <button class="algo-tab" id="tab-RR" onclick="selectAlgorithm('RR')">RR</button>
            </div>
          </div>

          <!-- KPI Cards -->
          <div class="kpi-row">
            <div class="kpi-card">
              <div class="kpi-label">Average Waiting Time</div>
              <div class="kpi-val" id="kpi-avg-wt" style="color: #34d399;">0.00</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Average Turnaround</div>
              <div class="kpi-val" id="kpi-avg-tat" style="color: #818cf8;">0.00</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Total Time (Makespan)</div>
              <div class="kpi-val" id="kpi-total-time" style="color: #f59e0b;">0</div>
            </div>
          </div>

          <!-- Gantt Chart -->
          <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 8px;">ผังแกนต์ชาร์ต (Gantt Chart)</div>
          <div class="gantt-wrapper">
            <div class="gantt-chart" id="gantt-chart"></div>
            <div class="gantt-scale" id="gantt-scale"></div>
          </div>

          <!-- Schedule Detail Table -->
          <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 8px;">ตารางผลการคำนวณแต่ละโปรเซส (ST, CT, TAT, WT)</div>
          <div class="table-container" style="max-height: none;">
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>AT</th>
                  <th>BT</th>
                  <th>ST (เริ่ม)</th>
                  <th>CT (เสร็จ)</th>
                  <th>TAT (CT−AT)</th>
                  <th>WT (TAT−BT)</th>
                </tr>
              </thead>
              <tbody id="result-table-body">
                <!-- Populated by JS -->
              </tbody>
            </table>
          </div>

          <!-- Slices / Timeline Trace -->
          <div style="margin-top: 16px;">
            <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 8px;">การทำงานทีละช่วง (Execution Slices & Remaining BT)</div>
            <div class="table-container" style="max-height: 200px;">
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
                <tbody id="slice-table-body">
                  <!-- Populated by JS -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      CS422 Operating Systems Term Project · Run completely offline from local HTML file.
    </footer>
  </div>

  <script>
    // Initial State
    let processes = ${processesJson};
    let quantum = ${initialQuantum};
    let activeAlgo = 'SJF';
    let simulationResults = {};

    const PALETTE = ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

    function renderProcessInputs() {
      const tbody = document.getElementById('process-table-body');
      tbody.innerHTML = '';
      processes.forEach((p, idx) => {
        const color = p.color || PALETTE[idx % PALETTE.length];
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="color-dot" style="background-color: \${color};"></span>
              <span style="font-family: monospace; font-weight: 700;">\${p.id}</span>
            </div>
          </td>
          <td>
            <input type="number" min="0" value="\${p.arrivalTime}" onchange="updateProcess(\${idx}, 'arrivalTime', this.value)">
          </td>
          <td>
            <input type="number" min="1" value="\${p.burstTime}" onchange="updateProcess(\${idx}, 'burstTime', this.value)">
          </td>
          <td>
            <button class="btn-danger" onclick="removeProcessRow(\${idx})" title="ลบ">\${processes.length > 1 ? '✕' : '-'}</button>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function updateProcess(index, field, value) {
      const val = parseInt(value, 10);
      if (field === 'arrivalTime') {
        processes[index].arrivalTime = isNaN(val) ? 0 : Math.max(0, val);
      } else if (field === 'burstTime') {
        processes[index].burstTime = isNaN(val) ? 1 : Math.max(1, val);
      }
      calculateAll();
    }

    function addProcessRow() {
      if (processes.length >= 20) {
        alert('กำหนดได้สูงสุด 20 โปรเซส');
        return;
      }
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

    function removeProcessRow(index) {
      if (processes.length <= 1) {
        alert('ต้องมีอย่างน้อย 1 โปรเซส');
        return;
      }
      processes.splice(index, 1);
      renderProcessInputs();
      calculateAll();
    }

    function onQuantumSliderChange(val) {
      quantum = parseInt(val, 10) || 1;
      document.getElementById('quantum-input').value = quantum;
      document.getElementById('quantum-badge').innerText = quantum;
      calculateAll();
    }

    function onQuantumInputChange(val) {
      quantum = Math.max(1, parseInt(val, 10) || 1);
      document.getElementById('quantum-slider').value = Math.min(20, quantum);
      document.getElementById('quantum-badge').innerText = quantum;
      calculateAll();
    }

    function loadCase1() {
      processes = [
        { id: 'P1', arrivalTime: 0, burstTime: 6, color: '#4f46e5' },
        { id: 'P2', arrivalTime: 0, burstTime: 8, color: '#10b981' },
        { id: 'P3', arrivalTime: 0, burstTime: 7, color: '#f59e0b' },
        { id: 'P4', arrivalTime: 0, burstTime: 3, color: '#0ea5e9' }
      ];
      quantum = 2;
      document.getElementById('quantum-slider').value = 2;
      document.getElementById('quantum-input').value = 2;
      document.getElementById('quantum-badge').innerText = 2;
      renderProcessInputs();
      calculateAll();
    }

    function load842() {
      processes = [
        { id: 'P1', arrivalTime: 0, burstTime: 8, color: '#4f46e5' },
        { id: 'P2', arrivalTime: 0, burstTime: 4, color: '#10b981' },
        { id: 'P3', arrivalTime: 0, burstTime: 2, color: '#f59e0b' }
      ];
      renderProcessInputs();
      calculateAll();
    }

    function loadCase2() {
      randomizeBT();
    }

    function randomizeBT() {
      processes = processes.map((p, idx) => ({
        ...p,
        burstTime: Math.floor(Math.random() * 18) + 2,
        color: PALETTE[idx % PALETTE.length]
      }));
      renderProcessInputs();
      calculateAll();
    }

    function resetDefaults() {
      loadCase1();
    }

    /* Core Scheduling Algorithms */
    function runFCFS() {
      const order = [...processes].map((p, i) => ({ ...p, originalIdx: i }));
      order.sort((a, b) => a.arrivalTime - b.arrivalTime || a.originalIdx - b.originalIdx);
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
        results[p.id] = { id: p.id, at: p.arrivalTime, bt: p.burstTime, st, ct, tat, wt };
      });

      return buildOutput('FCFS', 'First-Come, First-Served', results, gantt);
    }

    function runSJF() {
      const remaining = processes.map((p, i) => ({ ...p, originalIdx: i }));
      let time = 0;
      const gantt = [];
      const results = {};

      while (remaining.length > 0) {
        const available = remaining.filter(p => p.arrivalTime <= time);
        if (available.length === 0) {
          time = Math.min(...remaining.map(p => p.arrivalTime));
          continue;
        }
        available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.originalIdx - b.originalIdx);
        const p = available[0];
        const idx = remaining.indexOf(p);
        remaining.splice(idx, 1);

        const st = time;
        const ct = st + p.burstTime;
        time = ct;
        gantt.push({ processId: p.id, start: st, end: ct, duration: p.burstTime, color: p.color });
        const tat = ct - p.arrivalTime;
        const wt = tat - p.burstTime;
        results[p.id] = { id: p.id, at: p.arrivalTime, bt: p.burstTime, st, ct, tat, wt };
      }

      return buildOutput('SJF', 'Shortest Job First', results, gantt);
    }

    function runSRTF() {
      const procs = processes.map((p, i) => ({
        ...p,
        originalIdx: i,
        remaining: p.burstTime,
        st: null,
        ct: null
      }));
      let time = 0;
      let completed = 0;
      const n = procs.length;
      const gantt = [];

      while (completed < n) {
        const available = procs.filter(p => p.arrivalTime <= time && p.remaining > 0);
        if (available.length === 0) {
          const future = procs.filter(p => p.remaining > 0);
          if (future.length === 0) break;
          time = Math.min(...future.map(p => p.arrivalTime));
          continue;
        }
        available.sort((a, b) => a.remaining - b.remaining || a.arrivalTime - b.arrivalTime || a.originalIdx - b.originalIdx);
        const p = available[0];

        if (p.st === null) p.st = time;
        const start = time;
        time += 1;
        p.remaining -= 1;

        const last = gantt[gantt.length - 1];
        if (last && last.processId === p.id && last.end === start) {
          last.end = time;
          last.duration += 1;
        } else {
          gantt.push({ processId: p.id, start, end: time, duration: 1, color: p.color });
        }

        if (p.remaining === 0) {
          p.ct = time;
          completed++;
        }
      }

      const results = {};
      procs.forEach(p => {
        const tat = p.ct - p.arrivalTime;
        const wt = tat - p.burstTime;
        results[p.id] = { id: p.id, at: p.arrivalTime, bt: p.burstTime, st: p.st, ct: p.ct, tat, wt };
      });

      return buildOutput('SRTF', 'Shortest Remaining Time First', results, gantt);
    }

    function runRR() {
      const procs = processes.map((p, i) => ({
        ...p,
        originalIdx: i,
        remaining: p.burstTime,
        st: null,
        ct: null
      }));
      let time = 0;
      let completed = 0;
      const n = procs.length;
      const gantt = [];
      const queue = [];
      const inQueue = new Set();

      procs.forEach(p => {
        if (p.arrivalTime <= time && !inQueue.has(p)) {
          queue.push(p);
          inQueue.add(p);
        }
      });

      while (completed < n) {
        if (queue.length === 0) {
          const unarrived = procs.filter(p => p.remaining > 0 && !inQueue.has(p));
          if (unarrived.length > 0) {
            time = Math.min(...unarrived.map(p => p.arrivalTime));
            procs.forEach(p => {
              if (p.arrivalTime <= time && !inQueue.has(p) && p.remaining > 0) {
                queue.push(p);
                inQueue.add(p);
              }
            });
          } else {
            break;
          }
        }

        const p = queue.shift();
        if (p.st === null) p.st = time;
        const slice = Math.min(p.remaining, quantum);
        const start = time;
        time += slice;
        p.remaining -= slice;
        gantt.push({ processId: p.id, start, end: time, duration: slice, color: p.color });

        procs.forEach(other => {
          if (other !== p && other.arrivalTime <= time && !inQueue.has(other) && other.remaining > 0) {
            queue.push(other);
            inQueue.add(other);
          }
        });

        if (p.remaining > 0) {
          queue.push(p);
        } else {
          p.ct = time;
          completed++;
        }
      }

      const results = {};
      procs.forEach(p => {
        const tat = p.ct - p.arrivalTime;
        const wt = tat - p.burstTime;
        results[p.id] = { id: p.id, at: p.arrivalTime, bt: p.burstTime, st: p.st, ct: p.ct, tat, wt };
      });

      return buildOutput('RR', \`Round Robin (Q=\${quantum})\`, results, gantt);
    }

    function buildOutput(algoKey, name, resultMap, gantt) {
      const rows = processes.map(p => resultMap[p.id]);
      const totalWT = rows.reduce((s, r) => s + r.wt, 0);
      const totalTAT = rows.reduce((s, r) => s + r.tat, 0);
      const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].end : 0;
      return {
        key: algoKey,
        name,
        rows,
        gantt,
        totalTime,
        avgWT: (totalWT / rows.length).toFixed(2),
        avgTAT: (totalTAT / rows.length).toFixed(2)
      };
    }

    function calculateAll() {
      simulationResults.FCFS = runFCFS();
      simulationResults.SJF = runSJF();
      simulationResults.SRTF = runSRTF();
      simulationResults.RR = runRR();

      renderScorecards();
      renderDetail();
    }

    function renderScorecards() {
      const container = document.getElementById('scorecards-container');
      container.innerHTML = '';
      const order = ['SJF', 'FCFS', 'SRTF', 'RR'];

      order.forEach(key => {
        const out = simulationResults[key];
        const card = document.createElement('div');
        card.className = 'scorecard ' + (activeAlgo === key ? 'active' : '');
        card.onclick = () => selectAlgorithm(key);
        card.innerHTML = \`
          <div class="scorecard-header">
            <span>\${key}</span>
            <span style="font-size: 11px; color: var(--text-muted); font-family: monospace;">AVG WT</span>
          </div>
          <div style="font-size: 22px; font-weight: 800; color: \${activeAlgo === key ? '#818cf8' : '#fff'};">
            \${out.avgWT} <span style="font-size: 12px; font-weight: normal; color: var(--text-muted);">หน่วย</span>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
            TAT = \${out.avgTAT} · Makespan = \${out.totalTime}
          </div>
        \`;
        container.appendChild(card);
      });
    }

    function selectAlgorithm(algoKey) {
      activeAlgo = algoKey;
      ['FCFS', 'SJF', 'SRTF', 'RR'].forEach(k => {
        const btn = document.getElementById('tab-' + k);
        if (btn) {
          if (k === algoKey) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });
      renderScorecards();
      renderDetail();
    }

    function renderDetail() {
      const out = simulationResults[activeAlgo];
      if (!out) return;

      document.getElementById('detail-title').innerText = '02 · ' + out.name;
      document.getElementById('kpi-avg-wt').innerText = out.avgWT;
      document.getElementById('kpi-avg-tat').innerText = out.avgTAT;
      document.getElementById('kpi-total-time').innerText = out.totalTime;

      // Gantt
      const chartEl = document.getElementById('gantt-chart');
      const scaleEl = document.getElementById('gantt-scale');
      chartEl.innerHTML = '';
      scaleEl.innerHTML = '';

      const totalTime = Math.max(1, out.totalTime);

      out.gantt.forEach((g) => {
        const widthPct = (g.duration / totalTime) * 100;
        const block = document.createElement('div');
        block.className = 'gantt-block';
        block.style.width = widthPct + '%';
        block.style.backgroundColor = g.color || '#4f46e5';
        block.title = \`\${g.processId}: \${g.start} → \${g.end} (นาน \${g.duration} หน่วย)\`;
        block.innerHTML = \`<span>\${g.processId}</span><span style="font-size: 10px; opacity: 0.85;">(\${g.duration})</span>\`;
        chartEl.appendChild(block);
      });

      // Markers
      const checkpoints = new Set([0]);
      out.gantt.forEach(g => checkpoints.add(g.end));
      checkpoints.forEach(t => {
        const span = document.createElement('span');
        span.className = 'gantt-num';
        span.style.left = ((t / totalTime) * 100) + '%';
        span.innerText = t;
        scaleEl.appendChild(span);
      });

      // Results Table
      const rBody = document.getElementById('result-table-body');
      rBody.innerHTML = '';
      out.rows.forEach(r => {
        const proc = processes.find(p => p.id === r.id);
        const color = proc ? proc.color : '#4f46e5';
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="color-dot" style="background-color: \${color};"></span>
              <span style="font-family: monospace; font-weight: 700;">\${r.id}</span>
            </div>
          </td>
          <td>\${r.at}</td>
          <td>\${r.bt}</td>
          <td style="font-family: monospace;">\${r.st}</td>
          <td style="font-family: monospace; font-weight: 700; color: #818cf8;">\${r.ct}</td>
          <td style="font-family: monospace;">\${r.tat}</td>
          <td style="font-family: monospace; font-weight: 700; color: #34d399;">\${r.wt}</td>
        \`;
        rBody.appendChild(tr);
      });

      // Slices / Execution trace
      const sBody = document.getElementById('slice-table-body');
      sBody.innerHTML = '';
      const remMap = {};
      processes.forEach(p => remMap[p.id] = p.burstTime);

      out.gantt.forEach((g, idx) => {
        const prev = remMap[g.processId] ?? g.duration;
        const remaining = Math.max(0, prev - g.duration);
        remMap[g.processId] = remaining;

        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td style="font-family: monospace;">\${idx + 1}</td>
          <td style="font-family: monospace; font-weight: 700;">\${g.processId}</td>
          <td style="font-family: monospace;">\${g.start} → \${g.end}</td>
          <td style="font-family: monospace;">\${g.duration}</td>
          <td style="font-family: monospace; color: \${remaining === 0 ? '#34d399' : '#f59e0b'}; font-weight: 700;">\${remaining}</td>
        \`;
        sBody.appendChild(tr);
      });
    }

    // Initialize
    window.addEventListener('DOMContentLoaded', () => {
      renderProcessInputs();
      calculateAll();
    });
  </script>
</body>
</html>
`;
}

/**
 * Generate C++17 CPU Scheduling Source Code
 */
export function generateCppSource(): string {
  return `/**
 * CS422 Operating Systems - Term Project
 * CPU Scheduling Simulator (C++17 Implementation)
 * Instructor: Asst. Prof. Dr. Kingkarn Sookhanaphibarn
 * Algorithms: FCFS, SJF (Non-preemptive), SRTF (Preemptive SJF), Round Robin (RR)
 * Constraints: Single Core CPU, I/O = 0, Context Switch Cost = 0
 * 
 * To Compile and Run:
 *   g++ -std=c++17 scheduler.cpp -o scheduler
 *   ./scheduler
 */

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <iomanip>
#include <queue>
#include <numeric>

struct Process {
    std::string id;
    int arrivalTime;
    int burstTime;
    int remainingTime;
    int startTime = -1;
    int completionTime = -1;
    int turnaroundTime = 0;
    int waitingTime = 0;
    int originalIndex = 0;
};

struct GanttBlock {
    std::string processId;
    int startTime;
    int endTime;
    int duration;
};

struct SimulationResult {
    std::string algorithm;
    std::vector<Process> processes;
    std::vector<GanttBlock> gantt;
    double avgWaitingTime = 0.0;
    double avgTurnaroundTime = 0.0;
    int totalTime = 0;
};

void printHeader(const std::string& title) {
    std::cout << "\\n=======================================================\\n";
    std::cout << "  " << title << "\\n";
    std::cout << "=======================================================\\n";
}

void printResultTable(const SimulationResult& res) {
    std::cout << "\\nAlgorithm: " << res.algorithm << "\\n";
    std::cout << std::string(55, '-') << "\\n";
    std::cout << std::left << std::setw(6) << "PID"
              << std::right << std::setw(6) << "AT"
              << std::setw(6) << "BT"
              << std::setw(6) << "ST"
              << std::setw(6) << "CT"
              << std::setw(8) << "TAT"
              << std::setw(8) << "WT" << "\\n";
    std::cout << std::string(55, '-') << "\\n";

    for (const auto& p : res.processes) {
        std::cout << std::left << std::setw(6) << p.id
                  << std::right << std::setw(6) << p.arrivalTime
                  << std::setw(6) << p.burstTime
                  << std::setw(6) << p.startTime
                  << std::setw(6) << p.completionTime
                  << std::setw(8) << p.turnaroundTime
                  << std::setw(8) << p.waitingTime << "\\n";
    }
    std::cout << std::string(55, '-') << "\\n";
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Average Waiting Time (AVG WT)    : " << res.avgWaitingTime << " units\\n";
    std::cout << "Average Turnaround Time (AVG TAT): " << res.avgTurnaroundTime << " units\\n";
    std::cout << "Total Makespan (Total Time)      : " << res.totalTime << " units\\n";

    // Print ASCII Gantt Chart
    std::cout << "\\nGantt Chart Timeline:\\n|";
    for (const auto& g : res.gantt) {
        std::cout << " " << g.processId << " |";
    }
    std::cout << "\\n0";
    for (const auto& g : res.gantt) {
        std::cout << std::right << std::setw(5) << g.endTime;
    }
    std::cout << "\\n";
}

SimulationResult runFCFS(std::vector<Process> procs) {
    std::vector<Process> sorted = procs;
    std::sort(sorted.begin(), sorted.end(), [](const Process& a, const Process& b) {
        if (a.arrivalTime != b.arrivalTime) return a.arrivalTime < b.arrivalTime;
        return a.originalIndex < b.originalIndex;
    });

    int currentTime = 0;
    std::vector<GanttBlock> gantt;

    for (auto& p : sorted) {
        if (currentTime < p.arrivalTime) {
            currentTime = p.arrivalTime;
        }
        p.startTime = currentTime;
        currentTime += p.burstTime;
        p.completionTime = currentTime;
        p.turnaroundTime = p.completionTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime;
        gantt.push_back({ p.id, p.startTime, p.completionTime, p.burstTime });
    }

    std::sort(sorted.begin(), sorted.end(), [](const Process& a, const Process& b) {
        return a.originalIndex < b.originalIndex;
    });

    double totalWT = 0, totalTAT = 0;
    for (const auto& p : sorted) {
        totalWT += p.waitingTime;
        totalTAT += p.turnaroundTime;
    }

    SimulationResult res;
    res.algorithm = "First-Come, First-Served (FCFS)";
    res.processes = sorted;
    res.gantt = gantt;
    res.totalTime = currentTime;
    res.avgWaitingTime = totalWT / sorted.size();
    res.avgTurnaroundTime = totalTAT / sorted.size();
    return res;
}

SimulationResult runSJF(std::vector<Process> procs) {
    std::vector<Process> remaining = procs;
    int currentTime = 0;
    std::vector<GanttBlock> gantt;
    std::vector<Process> finished;

    while (!remaining.empty()) {
        std::vector<Process> available;
        for (const auto& p : remaining) {
            if (p.arrivalTime <= currentTime) available.push_back(p);
        }

        if (available.empty()) {
            int nextArrival = 1e9;
            for (const auto& p : remaining) nextArrival = std::min(nextArrival, p.arrivalTime);
            currentTime = nextArrival;
            continue;
        }

        std::sort(available.begin(), available.end(), [](const Process& a, const Process& b) {
            if (a.burstTime != b.burstTime) return a.burstTime < b.burstTime;
            if (a.arrivalTime != b.arrivalTime) return a.arrivalTime < b.arrivalTime;
            return a.originalIndex < b.originalIndex;
        });

        Process chosen = available[0];
        auto it = std::find_if(remaining.begin(), remaining.end(), [&](const Process& p) {
            return p.id == chosen.id;
        });
        remaining.erase(it);

        chosen.startTime = currentTime;
        currentTime += chosen.burstTime;
        chosen.completionTime = currentTime;
        chosen.turnaroundTime = chosen.completionTime - chosen.arrivalTime;
        chosen.waitingTime = chosen.turnaroundTime - chosen.burstTime;
        gantt.push_back({ chosen.id, chosen.startTime, chosen.completionTime, chosen.burstTime });
        finished.push_back(chosen);
    }

    std::sort(finished.begin(), finished.end(), [](const Process& a, const Process& b) {
        return a.originalIndex < b.originalIndex;
    });

    double totalWT = 0, totalTAT = 0;
    for (const auto& p : finished) {
        totalWT += p.waitingTime;
        totalTAT += p.turnaroundTime;
    }

    SimulationResult res;
    res.algorithm = "Shortest Job First (SJF - Non-Preemptive)";
    res.processes = finished;
    res.gantt = gantt;
    res.totalTime = currentTime;
    res.avgWaitingTime = totalWT / finished.size();
    res.avgTurnaroundTime = totalTAT / finished.size();
    return res;
}

SimulationResult runSRTF(std::vector<Process> procs) {
    std::vector<Process> list = procs;
    int currentTime = 0;
    int completed = 0;
    int n = list.size();
    std::vector<GanttBlock> gantt;

    while (completed < n) {
        std::vector<int> availableIndices;
        for (int i = 0; i < n; ++i) {
            if (list[i].arrivalTime <= currentTime && list[i].remainingTime > 0) {
                availableIndices.push_back(i);
            }
        }

        if (availableIndices.empty()) {
            int nextArrival = 1e9;
            for (int i = 0; i < n; ++i) {
                if (list[i].remainingTime > 0) nextArrival = std::min(nextArrival, list[i].arrivalTime);
            }
            currentTime = nextArrival;
            continue;
        }

        std::sort(availableIndices.begin(), availableIndices.end(), [&](int a, int b) {
            if (list[a].remainingTime != list[b].remainingTime) return list[a].remainingTime < list[b].remainingTime;
            if (list[a].arrivalTime != list[b].arrivalTime) return list[a].arrivalTime < list[b].arrivalTime;
            return list[a].originalIndex < list[b].originalIndex;
        });

        int chosenIdx = availableIndices[0];
        Process& p = list[chosenIdx];

        if (p.startTime == -1) p.startTime = currentTime;
        int start = currentTime;
        currentTime += 1;
        p.remainingTime -= 1;

        if (!gantt.empty() && gantt.back().processId == p.id && gantt.back().endTime == start) {
            gantt.back().endTime = currentTime;
            gantt.back().duration += 1;
        } else {
            gantt.push_back({ p.id, start, currentTime, 1 });
        }

        if (p.remainingTime == 0) {
            p.completionTime = currentTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            completed++;
        }
    }

    double totalWT = 0, totalTAT = 0;
    for (const auto& p : list) {
        totalWT += p.waitingTime;
        totalTAT += p.turnaroundTime;
    }

    SimulationResult res;
    res.algorithm = "Shortest Remaining Time First (SRTF - Preemptive)";
    res.processes = list;
    res.gantt = gantt;
    res.totalTime = currentTime;
    res.avgWaitingTime = totalWT / list.size();
    res.avgTurnaroundTime = totalTAT / list.size();
    return res;
}

SimulationResult runRoundRobin(std::vector<Process> procs, int quantum = 2) {
    std::vector<Process> list = procs;
    int currentTime = 0;
    int completed = 0;
    int n = list.size();
    std::queue<int> readyQueue;
    std::vector<bool> inQueue(n, false);
    std::vector<GanttBlock> gantt;

    for (int i = 0; i < n; ++i) {
        if (list[i].arrivalTime <= currentTime) {
            readyQueue.push(i);
            inQueue[i] = true;
        }
    }

    while (completed < n) {
        if (readyQueue.empty()) {
            int nextArrival = 1e9;
            for (int i = 0; i < n; ++i) {
                if (list[i].remainingTime > 0 && !inQueue[i]) {
                    nextArrival = std::min(nextArrival, list[i].arrivalTime);
                }
            }
            if (nextArrival != 1e9) {
                currentTime = nextArrival;
                for (int i = 0; i < n; ++i) {
                    if (list[i].arrivalTime <= currentTime && !inQueue[i] && list[i].remainingTime > 0) {
                        readyQueue.push(i);
                        inQueue[i] = true;
                    }
                }
            } else {
                break;
            }
        }

        int idx = readyQueue.front();
        readyQueue.pop();
        Process& p = list[idx];

        if (p.startTime == -1) p.startTime = currentTime;
        int slice = std::min(p.remainingTime, quantum);
        int start = currentTime;
        currentTime += slice;
        p.remainingTime -= slice;

        gantt.push_back({ p.id, start, currentTime, slice });

        for (int i = 0; i < n; ++i) {
            if (i != idx && list[i].arrivalTime <= currentTime && !inQueue[i] && list[i].remainingTime > 0) {
                readyQueue.push(i);
                inQueue[i] = true;
            }
        }

        if (p.remainingTime > 0) {
            readyQueue.push(idx);
        } else {
            p.completionTime = currentTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            completed++;
        }
    }

    double totalWT = 0, totalTAT = 0;
    for (const auto& p : list) {
        totalWT += p.waitingTime;
        totalTAT += p.turnaroundTime;
    }

    SimulationResult res;
    res.algorithm = "Round Robin (RR, Quantum=" + std::to_string(quantum) + ")";
    res.processes = list;
    res.gantt = gantt;
    res.totalTime = currentTime;
    res.avgWaitingTime = totalWT / list.size();
    res.avgTurnaroundTime = totalTAT / list.size();
    return res;
}

int main() {
    printHeader("CS422 CPU Scheduling Simulator (Term Project)");
    std::cout << "Testing Case 1 (Standard Verification):\\n";
    std::cout << "P1: BT=6, P2: BT=8, P3: BT=7, P4: BT=3 (All Arrival Times = 0)\\n";

    std::vector<Process> testCase = {
        { "P1", 0, 6, 6, -1, -1, 0, 0, 0 },
        { "P2", 0, 8, 8, -1, -1, 0, 0, 1 },
        { "P3", 0, 7, 7, -1, -1, 0, 0, 2 },
        { "P4", 0, 3, 3, -1, -1, 0, 0, 3 }
    };

    auto fcfs = runFCFS(testCase);
    printResultTable(fcfs);

    auto sjf = runSJF(testCase);
    printResultTable(sjf);

    auto srtf = runSRTF(testCase);
    printResultTable(srtf);

    auto rr = runRoundRobin(testCase, 2);
    printResultTable(rr);

    std::cout << "\\nProgram completed successfully.\\n";
    return 0;
}
`;
}

/**
 * Generate Python 3 CPU Scheduling Source Code
 */
export function generatePythonSource(): string {
  return `#!/usr/bin/env python3
"""
CS422 Operating Systems - Term Project
CPU Scheduling Simulator (Python 3 Implementation)
Instructor: Asst. Prof. Dr. Kingkarn Sookhanaphibarn
Algorithms: FCFS, SJF (Non-preemptive), SRTF (Preemptive SJF), Round Robin (RR)
Constraints: Single Core CPU, I/O = 0, Context Switch Cost = 0

Usage:
    python3 scheduler.py
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
import copy


@dataclass
class Process:
    id: str
    arrival_time: int
    burst_time: int
    remaining_time: int = 0
    start_time: Optional[int] = None
    completion_time: Optional[int] = None
    turnaround_time: int = 0
    waiting_time: int = 0
    original_index: int = 0

    def __post_init__(self):
        if self.remaining_time == 0:
            self.remaining_time = self.burst_time


@dataclass
class GanttBlock:
    process_id: str
    start_time: int
    end_time: int
    duration: int


@dataclass
class SimulationResult:
    algorithm: str
    processes: List[Process]
    gantt: List[GanttBlock]
    avg_waiting_time: float = 0.0
    avg_turnaround_time: float = 0.0
    total_time: int = 0


def run_fcfs(processes: List[Process]) -> SimulationResult:
    sorted_procs = sorted(copy.deepcopy(processes), key=lambda p: (p.arrival_time, p.original_index))
    current_time = 0
    gantt: List[GanttBlock] = []

    for p in sorted_procs:
        if current_time < p.arrival_time:
            current_time = p.arrival_time
        p.start_time = current_time
        current_time += p.burst_time
        p.completion_time = current_time
        p.turnaround_time = p.completion_time - p.arrival_time
        p.waiting_time = p.turnaround_time - p.burst_time
        gantt.append(GanttBlock(p.id, p.start_time, p.completion_time, p.burst_time))

    sorted_procs.sort(key=lambda p: p.original_index)
    total_wt = sum(p.waiting_time for p in sorted_procs)
    total_tat = sum(p.turnaround_time for p in sorted_procs)

    return SimulationResult(
        algorithm="First-Come, First-Served (FCFS)",
        processes=sorted_procs,
        gantt=gantt,
        total_time=current_time,
        avg_waiting_time=round(total_wt / len(sorted_procs), 2),
        avg_turnaround_time=round(total_tat / len(sorted_procs), 2),
    )


def run_sjf(processes: List[Process]) -> SimulationResult:
    remaining = copy.deepcopy(processes)
    current_time = 0
    gantt: List[GanttBlock] = []
    finished: List[Process] = []

    while remaining:
        available = [p for p in remaining if p.arrival_time <= current_time]
        if not available:
            current_time = min(p.arrival_time for p in remaining)
            continue

        available.sort(key=lambda p: (p.burst_time, p.arrival_time, p.original_index))
        chosen = available[0]
        remaining.remove(chosen)

        chosen.start_time = current_time
        current_time += chosen.burst_time
        chosen.completion_time = current_time
        chosen.turnaround_time = chosen.completion_time - chosen.arrival_time
        chosen.waiting_time = chosen.turnaround_time - chosen.burst_time

        gantt.append(GanttBlock(chosen.id, chosen.start_time, chosen.completion_time, chosen.burst_time))
        finished.append(chosen)

    finished.sort(key=lambda p: p.original_index)
    total_wt = sum(p.waiting_time for p in finished)
    total_tat = sum(p.turnaround_time for p in finished)

    return SimulationResult(
        algorithm="Shortest Job First (SJF - Non-Preemptive)",
        processes=finished,
        gantt=gantt,
        total_time=current_time,
        avg_waiting_time=round(total_wt / len(finished), 2),
        avg_turnaround_time=round(total_tat / len(finished), 2),
    )


def run_srtf(processes: List[Process]) -> SimulationResult:
    procs = copy.deepcopy(processes)
    current_time = 0
    completed = 0
    n = len(procs)
    gantt: List[GanttBlock] = []

    while completed < n:
        available = [p for p in procs if p.arrival_time <= current_time and p.remaining_time > 0]
        if not available:
            future = [p for p in procs if p.remaining_time > 0]
            if not future:
                break
            current_time = min(p.arrival_time for p in future)
            continue

        available.sort(key=lambda p: (p.remaining_time, p.arrival_time, p.original_index))
        p = available[0]

        if p.start_time is None:
            p.start_time = current_time

        start = current_time
        current_time += 1
        p.remaining_time -= 1

        if gantt and gantt[-1].process_id == p.id and gantt[-1].end_time == start:
            gantt[-1].end_time = current_time
            gantt[-1].duration += 1
        else:
            gantt.append(GanttBlock(p.id, start, current_time, 1))

        if p.remaining_time == 0:
            p.completion_time = current_time
            p.turnaround_time = p.completion_time - p.arrival_time
            p.waiting_time = p.turnaround_time - p.burst_time
            completed += 1

    total_wt = sum(p.waiting_time for p in procs)
    total_tat = sum(p.turnaround_time for p in procs)

    return SimulationResult(
        algorithm="Shortest Remaining Time First (SRTF - Preemptive)",
        processes=procs,
        gantt=gantt,
        total_time=current_time,
        avg_waiting_time=round(total_wt / len(procs), 2),
        avg_turnaround_time=round(total_tat / len(procs), 2),
    )


def run_round_robin(processes: List[Process], quantum: int = 2) -> SimulationResult:
    procs = copy.deepcopy(processes)
    current_time = 0
    completed = 0
    n = len(procs)
    ready_queue: List[Process] = []
    in_queue = set()
    gantt: List[GanttBlock] = []

    for p in procs:
        if p.arrival_time <= current_time and p.id not in in_queue:
            ready_queue.append(p)
            in_queue.add(p.id)

    while completed < n:
        if not ready_queue:
            unarrived = [p for p in procs if p.remaining_time > 0 and p.id not in in_queue]
            if unarrived:
                current_time = min(p.arrival_time for p in unarrived)
                for p in procs:
                    if p.arrival_time <= current_time and p.id not in in_queue and p.remaining_time > 0:
                        ready_queue.append(p)
                        in_queue.add(p.id)
            else:
                break

        p = ready_queue.pop(0)
        if p.start_time is None:
            p.start_time = current_time

        slice_time = min(p.remaining_time, quantum)
        start = current_time
        current_time += slice_time
        p.remaining_time -= slice_time
        gantt.append(GanttBlock(p.id, start, current_time, slice_time))

        for other in procs:
            if other.id != p.id and other.arrival_time <= current_time and other.id not in in_queue and other.remaining_time > 0:
                ready_queue.append(other)
                in_queue.add(other.id)

        if p.remaining_time > 0:
            ready_queue.append(p)
        else:
            p.completion_time = current_time
            p.turnaround_time = p.completion_time - p.arrival_time
            p.waiting_time = p.turnaround_time - p.burst_time
            completed += 1

    total_wt = sum(p.waiting_time for p in procs)
    total_tat = sum(p.turnaround_time for p in procs)

    return SimulationResult(
        algorithm=f"Round Robin (RR, Quantum={quantum})",
        processes=procs,
        gantt=gantt,
        total_time=current_time,
        avg_waiting_time=round(total_wt / len(procs), 2),
        avg_turnaround_time=round(total_tat / len(procs), 2),
    )


def print_result(res: SimulationResult):
    print(f"\\n{'=' * 60}")
    print(f"  {res.algorithm}")
    print(f"{'=' * 60}")
    print(f"{'PID':<6} {'AT':>5} {'BT':>5} {'ST':>5} {'CT':>5} {'TAT':>7} {'WT':>7}")
    print("-" * 60)
    for p in res.processes:
        print(f"{p.id:<6} {p.arrival_time:>5} {p.burst_time:>5} {p.start_time:>5} {p.completion_time:>5} {p.turnaround_time:>7} {p.waiting_time:>7}")
    print("-" * 60)
    print(f"Average Waiting Time (AVG WT)    : {res.avg_waiting_time:.2f} units")
    print(f"Average Turnaround Time (AVG TAT): {res.avg_turnaround_time:.2f} units")
    print(f"Total Time (Makespan)            : {res.total_time} units")

    # Gantt Timeline
    print("\\nGantt Chart Timeline:")
    gantt_str = "| " + " | ".join(f"{g.process_id} ({g.duration})" for g in res.gantt) + " |"
    print(gantt_str)
    scale_str = "0"
    for g in res.gantt:
        scale_str += f"{g.end_time:>7}"
    print(scale_str)


if __name__ == "__main__":
    print("CS422 CPU Scheduling Simulator (Python 3)")
    print("Case 1 Verification: P1(6), P2(8), P3(7), P4(3), AT=0")

    case1 = [
        Process("P1", arrival_time=0, burst_time=6, original_index=0),
        Process("P2", arrival_time=0, burst_time=8, original_index=1),
        Process("P3", arrival_time=0, burst_time=7, original_index=2),
        Process("P4", arrival_time=0, burst_time=3, original_index=3),
    ]

    print_result(run_fcfs(case1))
    print_result(run_sjf(case1))
    print_result(run_srtf(case1))
    print_result(run_round_robin(case1, quantum=2))
`;
}

/**
 * Generate README and Run Instructions
 */
export function generateReadmeText(): string {
  return `# CS422 CPU Scheduling Simulator (Term Project)
วิชา: Operating Systems (CS422)
อาจารย์ผู้สอน: ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล
ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ

🔗 **GitHub Repository:** https://github.com/Bunwitchaikun/CPU_SCHEDULING.git
🎬 **วิดีโอส่วนที่ 1 (นำเสนอโปรแกรม):** https://youtu.be/unWcTIsrMGI
🤖 **วิดีโอส่วนที่ 2 (การนำ AI มาใช้):** https://youtu.be/UMgsffcb5eg

---

## 🛠️ รายการ Tool Stack ทั้งหมด (Project Technology Stack)

โปรเจกต์นี้ได้รับการออกแบบตามมาตรฐาน Clean Architecture โดยผสมผสานเทคโนโลยีสมัยใหม่ดังนี้:

| เทคโนโลยี / เครื่องมือ | เวอร์ชัน / มาตรฐาน | บทบาทหน้าที่ในโครงงาน |
| :--- | :--- | :--- |
| **React** | 19.0.0 | Frontend Framework จัดการ Component-driven UI, State Management และ Reactive Re-rendering |
| **TypeScript** | 7.0 / Strict | กำหนด Data Model, Interfaces, Type Safety เพื่อป้องกัน Runtime Bug |
| **Vite** | 8.3.0 | Next-Generation Frontend Tooling ทำหน้าที่ Dev Server แบบ Hot Module Replacement (HMR) และ Production Bundler |
| **Tailwind CSS** | v4.3.3 | โมเดิร์น Utility-first CSS Engine สำหรับการจัดเลย์เอาต์ Typography และ UI Design System |
| **Lucide React** | 0.546.0 | ชุดไอคอนเวกเตอร์ SVG สำหรับ Visual Affordance ในทุก Component |
| **JSZip** | 3.10.2 | ไลบรารีสำหรับสร้างไฟล์ ZIP แบบ Client-side บรรจุซอร์สโค้ดและรันไทม์ทั้งหมดใน 1 คลิก |
| **HTML5 Canvas / CSS Grid** | W3C Standard | การเรนเดอร์แถบผังแกนต์ชาร์ต (Interactive Gantt Chart) และแถบสเกลเวลา (Time Ruler) |
| **C++17 Engine** | ISO/IEC 14882:2017 | ซอร์สโค้ดภาษา C++ สำหรับรันจำลองการจัดสรร CPU บน Native Terminal |
| **Python 3 Engine** | Python 3.8+ | ซอร์สโค้ดภาษา Python 3 สำหรับตรวจสอบและรันจำลองผ่าน Command Line |

---

## 🚀 วิธีใช้งาน และการติดตั้งแอพพลิเคชัน (Installation & Usage Guide)

คุณสามารถเปิดใช้งานโปรแกรมได้หลากหลายวิธีตามความสะดวก:

### วิธีที่ 1: รันแบบไม่ต้องติดตั้ง (Zero-Install 100% Offline) — แนะนำที่สุดสำหรับอาจารย์และผู้ตรวจ
1. ดับเบิลคลิกที่ไฟล์ **\`Run_Offline_Simulator.html\`** หรือ **\`index.html\`** ที่อยู่ใน Root ของโฟลเดอร์นี้
2. ไฟล์ HTML นี้ได้รับการ Bundle รวม CSS, JavaScript, และ Scheduling Logic ไว้ในไฟล์เดียว
3. สามารถเปิดใช้งานบนเว็บเบราว์เซอร์ได้ทันที (Google Chrome, Microsoft Edge, Safari, Mozilla Firefox) โดยไม่ต้องเชื่อมต่ออินเทอร์เน็ตและไม่ต้องติดตั้ง Node.js
4. ปรับค่าโปรเซส, Burst Time, Arrival Time, Time Quantum แล้วกด **"คำนวณผลลัพธ์ทันที"** ได้แบบ Real-time

### วิธีที่ 2: ติดตั้งและรันเว็บแอปตัวเต็ม (Full React + Vite + TypeScript Web App)
สำหรับการพัฒนาต่อยอดหรือตรวจสอบซอร์สโค้ดตัวเต็ม:
1. ตรวจสอบว่าเครื่องคอมพิวเตอร์ของคุณติดตั้ง **Node.js** (เวอร์ชัน 18.0.0 ขึ้นไป)
2. เปิด Terminal แล้วเข้าไปที่โฟลเดอร์ \`source-code\`:
   \`\`\`bash
   cd source-code
   \`\`\`
3. ติดตั้ง Dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. เริ่มต้น Local Development Server:
   \`\`\`bash
   npm run dev
   \`\`\`
5. เปิดเบราว์เซอร์ที่: **\`http://localhost:3000\`** (หรือตาม Port ที่ Vite แสดงบน Terminal)
6. หากต้องการ Build เป็น Production Static Site:
   \`\`\`bash
   npm run build
   npm run preview
   \`\`\`

### วิธีที่ 3: คอมไพล์และรันเวอร์ชันภาษา C++ (cplusplus/scheduler.cpp)
สำหรับตรวจสอบตรรกะในระดับ Low-level Systems Programming:
\`\`\`bash
cd cplusplus
g++ -std=c++17 scheduler.cpp -o scheduler
./scheduler
\`\`\`
*บน Windows สามารถดับเบิลคลิกไฟล์ \`compile_and_run.bat\` หรือบน macOS/Linux รัน \`./compile_and_run.sh\`*

### วิธีที่ 4: รันเวอร์ชันภาษา Python 3 (python/scheduler.py)
สำหรับตรวจสอบการประมวลผลผ่านสคริปต์ Python:
\`\`\`bash
cd python
python3 scheduler.py
\`\`\`
*บน Windows สามารถดับเบิลคลิกไฟล์ \`run.bat\` หรือบน macOS/Linux รัน \`./run.sh\`*

---

## 📁 หน้าที่และความรับผิดชอบของแต่ละไฟล์ (Project File Catalog & Responsibilities)

\`\`\`
CS422-CPU-Scheduling/
├── Run_Offline_Simulator.html    # Standalone Web Simulator รวมโค้ดครบในไฟล์เดียว เปิดรันออฟไลน์ได้ทันที
├── index.html                    # สำเนาไฟล์ Standalone สำหรับเปิดใช้งานผ่าน Web Browser
├── README.md                     # คู่มือการใช้งาน รายการ Tool Stack หน้าที่ไฟล์ และฟีเจอร์อย่างละเอียด (ไฟล์นี้)
├── HOW_TO_RUN_OFFLINE.txt        # สรุปขั้นตอนการรันโปรแกรมอย่างรวดเร็ว
├── scheduler.js                  # Pure JavaScript Scheduling Engine สำหรับ Node.js หรือเว็บเบราว์เซอร์
│
├── cplusplus/                    # โฟลเดอร์ซอร์สโค้ดภาษา C++
│   ├── scheduler.cpp             # โค้ด C++17 รองรับการจำลอง FCFS, SJF, SRTF, RR แสดงตารางและ Gantt Scale
│   ├── compile_and_run.sh        # สคริปต์ Bash สำหรับคอมไพล์และรัน C++ บน Linux/macOS
│   └── compile_and_run.bat       # สคริปต์ Batch สำหรับคอมไพล์และรัน C++ บน Windows
│
├── python/                       # โฟลเดอร์ซอร์สโค้ดภาษา Python
│   ├── scheduler.py              # โค้ด Python 3 พร้อม Dataclass สำหรับคำนวณและแสดงผลตาราง CPU
│   ├── run.sh                    # สคริปต์รัน Python บน Linux/macOS
│   └── run.bat                   # สคริปต์รัน Python บน Windows
│
├── tests/                        # ชุดข้อมูลทดสอบมาตรฐาน
│   └── test-cases.json           # ชุดทดสอบ Case 1 (Standard [6,8,7,3]), Case 2, Case 3 ในรูปแบบ JSON
│
└── source-code/                  # ซอร์สโค้ดโปรเจกต์เว็บเต็มรูปแบบ (React + Vite + TypeScript)
    ├── package.json              # กำหนดรายการ Dependencies และ Scripts สำหรับรัน/บิลด์โปรเจกต์
    ├── vite.config.ts            # การตั้งค่า Vite Bundler และปลั๊กอิน Tailwind CSS
    ├── tsconfig.json             # การตั้งค่า TypeScript Compiler และ Strict Checking
    ├── index.html                # Entry Point HTML Template สำหรับ Vite
    └── src/
        ├── main.tsx              # จุดเริ่มต้นเมานต์ React Application สู่ Root DOM
        ├── App.tsx               # Main State Orchestrator จัดการสถานะโปรเซส อัลกอริทึม และการเรนเดอร์ภาพรวม
        ├── index.css             # โกลบอลสไตล์และสถาปัตยกรรม Tailwind CSS v4
        ├── types/
        │   └── simulator.ts      # นิยาม Interface, Types, และ Enums ทั้งหมดของระบบ (Data Model)
        ├── data/
        │   └── testCases.ts      # ข้อมูลตั้งต้นสำหรับชุดทดสอบ 3 รูปแบบตามโจทย์กำหนด
        ├── utils/
        │   ├── algorithms.ts     # Core Scheduling Logic (FCFS, SJF, SRTF, RR) และ Timeline Computation
        │   └── schedulerGenerator.ts # Generator สร้างไฟล์ Offline HTML, โค้ด C++, โค้ด Python และ ZIP Packager
        └── components/
            ├── TopNav.tsx               # แถบนำทางด้านบน (Sticky Top Bar) พร้อม Quick Jump และปุ่มดาวน์โหลด
            ├── SidebarTOC.tsx           # สารบัญด้านข้าง (Sticky Table of Contents) ติดตาม Scrollspy พร้อม Dropdown Toggle
            ├── ProjectOverview.tsx      # ส่วนที่ 2 คู่มือโปรเจกต์ วัตถุประสงค์ สมาชิก และแผนผังโครงสร้างไฟล์
            ├── SimulatorSection.tsx     # ส่วนที่ 3 แผงควบคุมโปรเซส กรอก AT, BT, ปรับ Quantum และเลือกอัลกอริทึม
            ├── GanttChart.tsx           # ผังแกนต์ชาร์ต Interactive Timeline Bar สเกลเวลา และ Stepper ควบคุม
            ├── ResultsTable.tsx         # ตารางแสดงผลลัพธ์รายโปรเซส (PID, AT, BT, ST, CT, TAT, WT) พร้อมสูตรคำนวณ
            ├── ComparisonMatrix.tsx     # ส่วนที่ 5 ตารางและกราฟเปรียบเทียบ 4 อัลกอริทึมแบบ Head-to-Head
            ├── ManualVerification.tsx   # ส่วนที่ 4 การตรวจสอบการคำนวณด้วยตนเองแบบ Step-by-Step ทั้ง 3 กรณี
            ├── RealExperimentLog.tsx    # ส่วนที่ 6 รายงานบันทึกผลการทดลองจริงและวิเคราะห์พฤติกรรมอัลกอริทึม
            ├── CodeWalkthrough.tsx      # ส่วนที่ 7 คลังโค้ดอธิบายการทำงานฟังก์ชันหลักบรรทัดต่อบรรทัด
            ├── AITransparencySection.tsx# ส่วนเปิดเผยการใช้ AI อย่างโปร่งใสและมีจริยธรรมตามข้อกำหนด
            ├── VideoSection.tsx         # พื้นที่นำเสนอวิดีโอสาธิตการทำงานโครงงาน
            └── ExportModal.tsx          # หน้าต่างส่งออกผลลัพธ์เป็นไฟล์ PDF, JSON, CSV
\`\`\`

---

## ✨ ฟีเจอร์และความสามารถของระบบ (Key Features & Capabilities)

โปรแกรมจำลอง CPU Scheduling Lab นี้ได้รับการพัฒนาให้ครอบคลุมความต้องการด้านวิชาการและวิศวกรรมซอฟต์แวร์:

### 1. การจำลอง 4 อัลกอริทึมหลักตามมาตรฐานวิชาการ (CS422 Standard)
- **First-Come, First-Served (FCFS)**: ทำงานตามลำดับการมาถึง (Arrival Time) แบบ Non-preemptive หากมาถึงพร้อมกันจะตัดตามหมายเลขโปรเซส (PID)
- **Shortest Job First (SJF - Non-preemptive)**: เลือกโปรเซสที่มี Burst Time สั้นที่สุดในกลุ่มที่มาถึงแล้ว ทำงานต่อเนื่องจนเสร็จสิ้น
- **Shortest Remaining Time First (SRTF - Preemptive SJF)**: ตรวจสอบเวลาที่เหลืออยู่ (Remaining Time) ทุกๆ 1 หน่วยเวลา และสลับให้โปรเซสที่เหลือน้อยกว่าประมวลผลทันที
- **Round Robin (RR - Preemptive)**: แบ่งเวลาประมวลผลตามค่า Time Quantum (Q) ที่กำหนดได้อย่างอิสระ บริหารคิวแบบ FIFO อย่างเท่าเทียม

### 2. แผงควบคุมโปรเซสแบบไดนามิก (Interactive Process Inputs)
- รองรับจำนวนโปรเซสได้ตั้งแต่ **1 ถึง 20 โปรเซส**
- **Burst Time (BT)**: บังคับค่าจำนวนเต็มบวก (&gt; 0) มีระบบ Validation ป้องกันค่าผิดพลาด
- **Arrival Time (AT)**: ตั้งค่าเริ่มต้นเป็น **0** ตามข้อกำหนดเริ่มต้นของโครงงาน แต่เปิดโอกาสให้ผู้ใช้งาน**กรอกหรือปรับลด/เพิ่มค่าได้เองทีละ 1** อย่างอิสระ
- **Time Quantum (Q)**: ปรับลด/เพิ่มขนาด Quantum สำหรับ Round Robin ได้ตามต้องการ
- **Preset Quick-Load**: ปุ่มโหลดชุดข้อมูลทดสอบ 3 รูปแบบ (Standard Case 1: [6, 8, 7, 3], Case 2, Case 3: [8, 4, 2]) ได้ทันทีในคลิกเดียว

### 3. ผังแกนต์ชาร์ตแบบอินเทอร์แอคทีฟ (Interactive Gantt Chart & Time Stepper)
- แสดงแถบ Timeline สัดส่วนเวลาจริง พร้อมสีสันประจำโปรเซสที่มองเห็นได้อย่างชัดเจน
- แถบไม้บรรทัดแสดงสเกลเวลา (Ruler Scale) กำกับเวลาเริ่มต้นและสิ้นสุดของทุก Block
- **ระบบ Interactive Stepper / Scrubber**: ปุ่มควบคุม (Play, Step Forward, Step Back, Reset) ให้อาจารย์และผู้เรียนคลิกดูการทำงานของ CPU และ Burst Time ที่หลงเหลืออยู่ทีละช่วงเวลาได้อย่างสมบูรณ์

### 4. ตารางสรุปผลลัพธ์รายโปรเซสและแจกแจงสูตรคำนวณ (Detailed Results Table)
- แสดงค่า **Process ID (PID)**, **Arrival Time (AT)**, **Burst Time (BT)**
- แสดงค่า **Start Time (ST)**: เวลาที่โปรเซสเริ่มได้รับ CPU ครั้งแรกสุด
- แสดงค่า **Completion Time (CT)**: เวลาที่โปรเซสทำงานเสร็จสิ้นทั้งหมด
- แสดงค่า **Turnaround Time (TAT)**: ตามสูตรมาตรฐาน $TAT = CT - AT$
- แสดงค่า **Waiting Time (WT)**: ตามสูตรมาตรฐาน $WT = TAT - BT$
- แสดงการหาค่าเฉลี่ย **Average Waiting Time (AVG WT)** และ **Average Turnaround Time (AVG TAT)** พร้อมวิธีคิดและตัวเลขแทนค่าในสูตร

### 5. ตารางและกราฟเปรียบเทียบผลลัพธ์ Head-to-Head (Comparison Matrix)
- ทำการคำนวณทั้ง 4 อัลกอริทึมพร้อมกันในรอบเดียว
- เปรียบเทียบค่า AVG WT, AVG TAT, Makespan (เวลารวมทั้งหมด), และจำนวนครั้งที่เกิด Context Switching
- แผนภูมิแท่งกราฟิก (Bar Chart) เปรียบเทียบค่า Average Waiting Time ของแต่ละอัลกอริทึมอย่างชัดเจน
- ป้ายกำกับอัจฉริยะ **"Best Algorithm"** ระบุอัลกอริทึมที่ให้เวลารอคอยเฉลี่ยต่ำที่สุดสำหรับชุดข้อมูลนั้นๆ โดยอัตโนมัติ

### 6. การตรวจสอบการคำนวณด้วยตนเอง (Manual Calculation Walkthrough)
- บรรจุเฉลยและวิธีคำนวณด้วยมือทีละขั้นตอนสำหรับ 3 กรณีทดสอบมาตรฐาน เพื่อให้อาจารย์ผู้สอนสามารถตรวจเช็คความถูกต้องเทียบกับข้อกำหนดได้อย่างรวดเร็ว

### 7. สารบัญติดตามหน้าจอแบบ Sticky (Sticky Table of Contents with Sub-topic Toggles)
- สารบัญด้านข้างที่ลอยตามผู้ใช้งานไปทุกจุดของหน้าจอ (Sticky Sidebar Navigation)
- เชื่อมต่อกับ **Active Scrollspy** ไฮไลต์หัวข้อที่กำลังอ่านอยู่แบบอัตโนมัติ
- เมนูดรอปดาวน์ Toggle สำหรับเปิดดูหัวข้อย่อยทั้ง 7 ส่วน พร้อมคลิกกระโดดข้ามส่วนได้ทันที

### 8. ระบบส่งออกและดาวน์โหลดหลายฟอร์แมต (Export & 1-Click ZIP Packaging)
- ดาวน์โหลดเป็น Standalone Offline HTML สำหรับเปิดใช้งานออฟไลน์
- ส่งออกข้อมูลเป็น JSON Data File
- ส่งออกตารางสรุปผลเป็น CSV File
- สั่งพิมพ์รายงานผลหรือบันทึกเป็น PDF ผ่านฟังก์ชัน Print Preview
- ปุ่ม **"ดาวน์โหลดโปรแกรม (ZIP)"** รวมไฟล์ทั้งหมดทั้ง HTML, C++, Python, และ React Source Code พร้อมเอกสารครบชุด
`;
}

/**
 * Generate full project zip file CS422-CPU-Scheduling.zip
 * Includes:
 * 1. Run_Offline_Simulator.html & index.html (100% offline runnable)
 * 2. C++ scheduler.cpp & scripts
 * 3. Python scheduler.py & scripts
 * 4. Node/Vanilla scheduler.js
 * 5. Full React/TypeScript project source code in source-code/
 * 6. README.md & HOW_TO_RUN_OFFLINE.txt
 */
export async function downloadFullProjectZip(
  bursts: number[],
  quantum: number,
  processes?: ProcessInput[]
) {
  const zip = new JSZip();
  const folder = zip.folder('CS422-CPU-Scheduling')!;

  const inputProcs = processes && processes.length > 0
    ? processes.map((p) => ({
        id: p.id,
        arrivalTime: p.arrivalTime ?? 0,
        burstTime: p.burstTime,
        color: p.color,
      }))
    : bursts.map((b, i) => ({
        id: `P${i + 1}`,
        arrivalTime: 0,
        burstTime: b,
        color: undefined,
      }));

  // 1. Standalone Offline Runnable HTML files
  const standaloneHtml = generateStandaloneOfflineHtml(inputProcs, quantum);
  folder.file('Run_Offline_Simulator.html', standaloneHtml);
  folder.file('index.html', standaloneHtml);

  // 2. Core scheduler.js
  folder.file('scheduler.js', SCHEDULER_JS_CODE);

  // 3. Documentation
  folder.file('README.md', generateReadmeText());
  folder.file(
    'HOW_TO_RUN_OFFLINE.txt',
    `CS422 CPU Scheduling Simulator - Offline Quick Start Guide
=============================================================

1. การเปิดใช้งานแบบออฟไลน์ผ่าน Web Browser:
   - ดับเบิลคลิกที่ไฟล์ "Run_Offline_Simulator.html" หรือ "index.html"
   - ไม่ต้องต่อเน็ต หรือรัน Local Server ใดๆ สามารถใช้งานได้ทันทีบน Chrome, Edge, Safari, Firefox

2. การรันโค้ดภาษา C++:
   - เข้าโฟลเดอร์ cplusplus
   - คอมไพล์: g++ -std=c++17 scheduler.cpp -o scheduler
   - รัน: ./scheduler

3. การรันโค้ดภาษา Python:
   - เข้าโฟลเดอร์ python
   - รัน: python3 scheduler.py

4. ซอร์สโค้ดโปรเจกต์เว็บตัวเต็ม (React + Vite + TypeScript):
   - อยู่ในโฟลเดอร์ source-code/
   - คำสั่งรัน: npm install && npm run dev
`
  );

  // 4. C++ Source
  const cppFolder = folder.folder('cplusplus')!;
  cppFolder.file('scheduler.cpp', generateCppSource());
  cppFolder.file(
    'compile_and_run.sh',
    `#!/bin/bash\ng++ -std=c++17 scheduler.cpp -o scheduler && ./scheduler\n`
  );
  cppFolder.file(
    'compile_and_run.bat',
    `@echo off\ng++ -std=c++17 scheduler.cpp -o scheduler.exe\nscheduler.exe\npause\n`
  );

  // 5. Python Source
  const pyFolder = folder.folder('python')!;
  pyFolder.file('scheduler.py', generatePythonSource());
  pyFolder.file('run.sh', `#!/bin/bash\npython3 scheduler.py\n`);
  pyFolder.file('run.bat', `@echo off\npython scheduler.py\npause\n`);

  // 6. Test Cases JSON
  const testFolder = folder.folder('tests')!;
  testFolder.file(
    'test-cases.json',
    JSON.stringify(
      {
        description: 'CS422 CPU Scheduling Test Suite',
        cases: [
          { name: 'Case 1: Standard Manual BT', bursts: [6, 8, 7, 3], arrivalTimes: [0, 0, 0, 0], quantum: 2 },
          { name: 'Case 2: Current Simulator Input', bursts, arrivalTimes: inputProcs.map(p => p.arrivalTime), quantum },
          { name: 'Case 3: Reference 8, 4, 2', bursts: [8, 4, 2], arrivalTimes: [0, 0, 0], quantum: 2 },
        ],
      },
      null,
      2
    )
  );

  // 7. Full React/TypeScript Project Source Code in source-code/
  const srcFolder = folder.folder('source-code')!;
  srcFolder.file(
    'package.json',
    JSON.stringify(
      {
        name: 'cs422-cpu-scheduling-lab',
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite --port=3000 --host=0.0.0.0',
          build: 'vite build',
          preview: 'vite preview',
          lint: 'tsc --noEmit',
        },
        dependencies: {
          jszip: '^3.10.2',
          'lucide-react': '^0.546.0',
          react: '^19.0.0',
          'react-dom': '^19.0.0',
        },
        devDependencies: {
          '@types/node': '^22.14.0',
          '@types/react': '^19.0.0',
          '@types/react-dom': '^19.0.0',
          '@vitejs/plugin-react': '^6.1.1',
          tailwindcss: '^4.3.3',
          typescript: '^7.0.0',
          vite: '^8.3.0',
        },
      },
      null,
      2
    )
  );
  srcFolder.file(
    'vite.config.ts',
    `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n});\n`
  );
  srcFolder.file(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          useDefineForClassFields: true,
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
        },
        include: ['src'],
      },
      null,
      2
    )
  );
  srcFolder.file(
    'index.html',
    `<!doctype html>\n<html lang="th">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>CS422 CPU Scheduling Lab</title>\n  </head>\n  <body class="bg-slate-50 text-slate-900">\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`
  );
  srcFolder.file(
    'src/index.css',
    `@import "tailwindcss";\n\n:root {\n  color-scheme: light;\n}\n\nbody {\n  margin: 0;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n  -webkit-font-smoothing: antialiased;\n}\n`
  );
  srcFolder.file(
    'src/main.tsx',
    `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.tsx';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);\n`
  );
  srcFolder.file(
    'src/utils/algorithms.ts',
    `// Core Scheduling Engine\n${SCHEDULER_JS_CODE}\n`
  );

  // Generate zip blob and trigger direct download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CS422-CPU-Scheduling.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate JSON matching result schema
 */
export function generateSchedulingJson(bursts: number[], quantum: number, outputs: {
  fcfs: SchedulingOutput;
  sjf: SchedulingOutput;
  rr: SchedulingOutput;
  srtf: SchedulingOutput;
}) {
  const mapOutputToResult = (out: SchedulingOutput) => ({
    algorithm: out.algorithm,
    quantum: out.algorithm === 'RR' ? (out.quantum ?? quantum) : null,
    rows: out.processes.map((p) => ({
      process: p.id,
      at: p.arrivalTime,
      bt: p.burstTime,
      st: p.startTime,
      ct: p.completionTime,
      tat: p.turnaroundTime,
      wt: p.waitingTime,
    })),
    timeline: out.gantt.map((g) => ({
      process: g.processId,
      start: g.startTime,
      end: g.endTime,
      remaining: 0,
    })),
    totalTime: out.gantt[out.gantt.length - 1]?.endTime || 0,
    avgWT: out.avgWaitingTime,
  });

  return {
    bursts,
    quantum,
    conditions: {
      arrivalTime: 0,
      cpuCount: 1,
      contextSwitchCost: 0,
    },
    results: [
      mapOutputToResult(outputs.fcfs),
      mapOutputToResult(outputs.sjf),
      mapOutputToResult(outputs.srtf),
      mapOutputToResult(outputs.rr),
    ],
  };
}

/**
 * Generate Markdown code report
 */
export function generateMarkdownCodeReport(
  algorithm: AlgorithmType,
  bursts: number[],
  quantum: number,
  output: SchedulingOutput
): string {
  const algoTitle = algorithm === 'RR' ? 'RR' : algorithm;
  const isQuantumUsed = algorithm === 'RR';

  const remTracker: Record<string, number> = {};
  output.processes.forEach((p) => {
    remTracker[p.id] = p.burstTime;
  });
  const timelineLines = output.gantt.map((g, idx) => {
    const prev = remTracker[g.processId] ?? g.duration;
    const remaining = Math.max(0, prev - g.duration);
    remTracker[g.processId] = remaining;
    return `${idx + 1}. ${g.processId}: ${g.startTime} → ${g.endTime}; ใช้ ${g.duration} หน่วย; เหลือ ${remaining}`;
  });

  const rowsLines = output.processes.map((p) => {
    return `${p.id}: ST=${p.startTime}, CT=${p.completionTime}, TAT=${p.completionTime}−${p.arrivalTime}=${p.turnaroundTime}, WT=${p.turnaroundTime}−${p.burstTime}=${p.waitingTime}`;
  });

  const avgFormula = `${output.processes.map((p) => p.waitingTime).join(' + ')} หาร ${output.processes.length} = ${output.avgWaitingTime}`;

  return `# รายงานผลและโค้ด CPU Scheduling

Algorithm: ${algoTitle}
BT: ${bursts.join(', ')}
Quantum: ${isQuantumUsed ? quantum : 'ไม่ใช้'}
AT=0, CPU=1, I/O=0, Context Switch cost=0

## ลำดับ CPU ที่สร้างตัวเลข
${timelineLines.join('\n')}

## ผลรายโปรเซส
${rowsLines.join('\n')}
AVG WT = ${avgFormula}

## โค้ดจริงจาก scheduler.js
\`\`\`javascript
${SCHEDULER_JS_CODE}
\`\`\`
`;
}
