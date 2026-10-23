/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, Check, Code2, Copy, Download, FileCode, Info } from 'lucide-react';
import { SCHEDULER_JS_CODE } from '../utils/schedulerGenerator';

export const CodeWalkthrough: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fcfs' | 'sjf' | 'rr' | 'srtf' | 'setup' | 'finish'>('fcfs');
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    fcfs: {
      title: 'First-Come, First-Served (FCFS) Engine',
      functionName: 'runFCFS(bursts, arrivalTimes)',
      code: `function runFCFS(bursts, arrivalTimes = []) {
  const processes = makeProcesses(bursts, arrivalTimes);
  
  // จัดเรียงตามเวลาที่มาถึง (Arrival Time) ตามหลัก FIFO
  // หากมาถึงพร้อมกัน ให้ตัดสินด้วย Process ID (P1 -> P2)
  const order = [...processes].sort((a, b) => a.at - b.at || a.id - b.id);
  
  let time = 0;
  const timeline = [];
  
  for (const p of order) {
    // หากเวลาปัจจุบันยังมาไม่ถึง Arrival Time ให้ CPU ว่างรอ (Idle Time)
    if (time < p.at) {
      time = p.at;
    }
    
    p.st = time;        // Start Time คือเวลา ณ จุดที่โปรเซสเริ่มได้รับ CPU
    time += p.bt;       // CPU ทำงานต่อเนื่องจนเสร็จสิ้น (Non-preemptive)
    p.ct = time;        // Completion Time คือเวลาที่โปรเซสรันเสร็จสมบูรณ์
    p.remaining = 0;
    
    timeline.push({ 
      process: p.process, 
      start: p.st, 
      end: p.ct, 
      remaining: 0 
    });
  }
  
  return finish('FCFS', processes, timeline);
}`,
      highlights: [
        {
          label: '1. ลำดับการประมวลผลตามคิว (FIFO Queue Order)',
          desc: 'คัดเลือกโปรเซสตามเวลาที่มาถึง (a.at - b.at) โปรเซสที่มาก่อนจะได้รับ CPU ก่อน หากมาพร้อมกันจะตัดสินด้วย Process ID (P1 ก่อน P2)',
        },
        {
          label: '2. กลไก Non-preemptive',
          desc: 'ไม่มีการแทรกแซงหรือสลับบริบทกลางคัน โปรเซสที่ถือครอง CPU จะทำงานต่อเนื่องจนครบ Burst Time ทั้งหมด',
        },
        {
          label: '3. การหา Start Time & Completion Time',
          desc: 'Start Time (ST) คือเวลาที่ได้ CPU (ST = max(CurrentTime, AT)), และ Completion Time (CT) = ST + BT',
        },
      ],
    },
    sjf: {
      title: 'Shortest Job First (SJF Non-preemptive)',
      functionName: 'runSJF(bursts, arrivalTimes)',
      code: `function runSJF(bursts, arrivalTimes = []) {
  const processes = makeProcesses(bursts, arrivalTimes);
  const remaining = [...processes];
  let time = 0;
  const timeline = [];

  while (remaining.length > 0) {
    // กรองโปรเซสที่พร้อมทำงานแล้ว ณ เวลาปัจจุบัน (Ready Queue)
    const available = remaining.filter((p) => p.at <= time);
    
    if (available.length === 0) {
      // หากยังไม่มีโปรเซสใดมาถึง ขยับเวลาไปยังโปรเซสถัดไปที่จะมาถึง (Idle Time)
      time = Math.min(...remaining.map((p) => p.at));
      continue;
    }
    
    // จัดเรียงตาม Burst Time สั้นที่สุด (Tie-breaker: Arrival Time และ Process ID)
    available.sort((a, b) => a.bt - b.bt || a.at - b.at || a.id - b.id);
    const p = available[0];
    
    // นำโปรเซสที่ถูกเลือกออกจากรายการรอ
    const idx = remaining.indexOf(p);
    remaining.splice(idx, 1);

    p.st = time;        // Start Time
    time += p.bt;       // CPU รันต่อเนื่องจนเสร็จสิ้น (Non-preemptive)
    p.ct = time;        // Completion Time
    p.remaining = 0;
    
    timeline.push({ 
      process: p.process, 
      start: p.st, 
      end: p.ct, 
      remaining: 0 
    });
  }

  return finish('SJF', processes, timeline);
}`,
      highlights: [
        {
          label: '1. กฎการคัดเลือก (Selection Rule)',
          desc: 'คัดเลือกโปรเซสที่มี Burst Time สั้นที่สุดในกลุ่มที่มาถึงแล้ว หากสั้นเท่ากันจะตัดสินด้วย Arrival Time และ Process ID',
        },
        {
          label: '2. ความเหมาะสมทางทฤษฎี (Provably Optimal)',
          desc: 'อัลกอริทึมนี้ให้ค่า Average Waiting Time (AVG WT) ต่ำที่สุดเสมอเมื่อเทียบกับอัลกอริทึมแบบ Non-preemptive อื่นๆ',
        },
        {
          label: '3. ผลลัพธ์ในตาราง',
          desc: 'โปรแกรมจะแสดงตารางผลลัพธ์เรียงตาม P1..Pn เพื่อให้อาจารย์และผู้ใช้เปรียบเทียบง่าย โดยคำนวณ CT, TAT, WT ตามลำดับการรันจริง',
        },
      ],
    },
    rr: {
      title: 'Round Robin (RR) พร้อม Time Slicing & ST Tracking',
      functionName: 'runRoundRobin(bursts, arrivalTimes, quantum)',
      code: `function runRoundRobin(bursts, arrivalTimes = [], quantum = 2) {
  const q = positiveInteger(quantum, 'Time Quantum', LIMITS.quantum);
  const processes = makeProcesses(bursts, arrivalTimes);
  const remaining = [...processes];
  const queue = [];
  let time = 0;
  const timeline = [];

  while (queue.length > 0 || remaining.length > 0) {
    // นำโปรเซสที่เพิ่งมาถึงเข้าสู่ Ready Queue
    const arrived = remaining.filter((p) => p.at <= time);
    for (const p of arrived) {
      queue.push(p);
      remaining.splice(remaining.indexOf(p), 1);
    }

    if (queue.length === 0) {
      time = Math.min(...remaining.map((p) => p.at));
      continue;
    }

    const p = queue.shift();
    if (p.st === null) p.st = time; // บันทึก Start Time เฉพาะรอบแรก
    
    const slice = Math.min(p.remaining, q);
    const start = time;
    time += slice;
    p.remaining -= slice;
    
    timeline.push({ 
      process: p.process, 
      start, 
      end: time, 
      remaining: p.remaining 
    });

    // โปรเซสใหม่ที่มาถึงระหว่าง slice ปัจจุบันจะเข้าคิวก่อนโปรเซสที่ถูก preempt
    const newArrivals = remaining.filter((item) => item.at <= time);
    for (const item of newArrivals) {
      queue.push(item);
      remaining.splice(remaining.indexOf(item), 1);
    }

    if (p.remaining > 0) {
      queue.push(p); // ยังไม่เสร็จ วนกลับไปต่อท้ายคิว
    } else {
      p.ct = time;   // เสร็จสิ้นสมบูรณ์ บันทึก Completion Time
    }
  }

  return finish('RR', processes, timeline, q);
}`,
      highlights: [
        {
          label: '1. บันทึก ST รอบแรก (ST Tracking Rule)',
          desc: 'ตรวจสอบ if (p.st === null) p.st = time เพื่อให้ค่า Start Time ในตารางแสดงเวลาที่โปรเซสได้รับ CPU ครั้งแรกอย่างถูกต้อง',
        },
        {
          label: '2. การตัดแบ่งเวลา (Time Slice)',
          desc: 'ใช้ Math.min(p.remaining, q) เผื่อกรณีที่งานเหลือน้อยกว่าค่า Quantum จะไม่เสียเวลาโดยเปล่าประโยชน์',
        },
        {
          label: '3. ลำดับคิว FIFO แบบ Fair Share',
          desc: 'โปรเซสที่รันหมดโควตาแต่ยังไม่เสร็จ จะถูกส่งกลับไปต่อท้าย Ready Queue ทันที',
        },
      ],
    },
    srtf: {
      title: 'Shortest Remaining Time First (SRTF / Preemptive SJF)',
      functionName: 'runSRTF(bursts, arrivalTimes)',
      code: `function runSRTF(bursts, arrivalTimes = []) {
  const processes = makeProcesses(bursts, arrivalTimes);
  let time = 0;
  const timeline = [];
  let completed = 0;
  const n = processes.length;

  while (completed < n) {
    // คัดกรองโปรเซสที่มาถึงแล้วและยังมีงานเหลือ
    const available = processes.filter((p) => p.at <= time && p.remaining > 0);
    if (available.length === 0) {
      const future = processes.filter((p) => p.remaining > 0);
      if (future.length === 0) break;
      time = Math.min(...future.map((p) => p.at));
      continue;
    }
    
    // เลือกโปรเซสที่มี remaining burst time เหลือน้อยที่สุด (Preemptive selection)
    available.sort((a, b) => a.remaining - b.remaining || a.at - b.at || a.id - b.id);
    const p = available[0];

    if (p.st === null) p.st = time;
    const start = time;
    time += 1;
    p.remaining -= 1;

    // ยุบรวมช่วงเวลาต่อเนื่องของโปรเซสเดิมเพื่อลดชิ้นส่วน Gantt Chart
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
}`,
      highlights: [
        {
          label: '1. การตรวจสอบแบบ Preemptive ทุกช่วงเวลา',
          desc: 'ประเมิน Remaining Time ทุกหน่วยเวลา หากมีงานที่สั้นกว่าเข้ามาในระบบ จะเกิดการแย่งชิง CPU ทันที',
        },
        {
          label: '2. พฤติกรรมเมื่อ Arrival Time เท่ากันทั้งหมด',
          desc: 'หากทุกโปรเซสมาพร้อมกันที่ t=0 งานที่สั้นที่สุดจะถูกรันจนเสร็จโดยไม่มีงานใหม่ที่สั้นกว่ามาขัดจังหวะ ผลลัพธ์จึงตรงกับ SJF',
        },
        {
          label: '3. Timeline Merging',
          desc: 'รวมบล็อกเวลาที่รันติดต่อกันของโปรเซสเดียวกันให้เป็นแท่ง Gantt เดียวกันอย่างสวยงาม',
        },
      ],
    },
    setup: {
      title: 'Data Validation & Factory Functions',
      functionName: 'validateBursts & makeProcesses',
      code: `const LIMITS = {
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
}`,
      highlights: [
        {
          label: '1. การตรวจสอบประเภทข้อมูลเข้มงวด',
          desc: 'ป้องกันค่าติดลบ ค่าทศนิยม หรือค่า NaN ด้วย Regex และ Number.isSafeInteger()',
        },
        {
          label: '2. รองรับ Arrival Time (AT) และ Burst Time (BT)',
          desc: 'AT เป็นจำนวนเต็มบวกหรือ 0 (ค่าเริ่มต้น 0) และ BT เป็นจำนวนเต็มบวกตั้งแต่ 1 ขึ้นไป',
        },
        {
          label: '3. โครงสร้างข้อมูลมาตรฐาน',
          desc: 'สร้าง Process Object มี id, process, at, bt, st, ct, และ remaining สำหรับทุกขั้นตอนการจำลอง',
        },
      ],
    },
    finish: {
      title: 'Metrics Calculation & Finish Engine',
      functionName: 'finish(algorithm, processes, timeline, quantum)',
      code: `function finish(algorithm, processes, timeline, quantum = null) {
  let totalWT = 0;
  let totalTAT = 0;

  const rows = processes.map((p) => {
    const tat = p.ct - p.at; // Turnaround Time = CT - AT (ซึ่ง AT=0 -> TAT = CT)
    const wt = tat - p.bt;   // Waiting Time = TAT - BT
    totalWT += wt;
    totalTAT += tat;
    return {
      process: p.process,
      at: p.at,
      bt: p.bt,
      st: p.st,
      ct: p.ct,
      tat,
      wt,
    };
  });

  const n = processes.length;
  // ปัดทศนิยม 2 ตำแหน่งตามหลักคณิตศาสตร์
  const avgWT = Math.round((totalWT / n) * 100) / 100;
  const avgTAT = Math.round((totalTAT / n) * 100) / 100;

  return {
    algorithm,
    quantum,
    rows,
    timeline,
    avgWT,
    avgTAT,
    totalWT,
    totalTAT,
  };
}`,
      highlights: [
        {
          label: '1. สูตร Turnaround Time',
          desc: 'TAT = CT - AT = CT (เพราะ Arrival Time ของทุกโปรเซสมีค่าเท่ากับ 0 เสมอ)',
        },
        {
          label: '2. สูตร Waiting Time',
          desc: 'WT = TAT - BT (หรือ CT - BT)',
        },
        {
          label: '3. Average Waiting Time',
          desc: 'AVG WT = ผลรวมของ WT ทุกโปรเซส ÷ จำนวนโปรเซส (ปัดเศษทศนิยม 2 ตำแหน่ง)',
        },
      ],
    },
  };

  const current = codeSnippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSchedulerJs = () => {
    const blob = new Blob([SCHEDULER_JS_CODE], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scheduler.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Synchronize activeTab with URL hash or scroll targets
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'code-fcfs') setActiveTab('fcfs');
      else if (hash === 'code-sjf') setActiveTab('sjf');
      else if (hash === 'code-rr') setActiveTab('rr');
      else if (hash === 'code-srtf') setActiveTab('srtf');
      else if (hash === 'code-finish') setActiveTab('finish');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <section id="code-walkthrough" className="scroll-mt-20 py-12 border-t border-slate-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl font-mono mb-3">
            <span>ส่วนที่ 3 · ซอร์สโค้ดและกลไกเบื้องหลังการคำนวณ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Algorithm Implementation Walkthrough
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mt-2.5">
            ซอร์สโค้ดมาตรฐานจาก <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-sm sm:text-base">scheduler.js</code> ที่ใช้ขับเคลื่อนแบบจำลองในส่วนที่ 1 และรายงานผลทั้งหมด
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadSchedulerJs}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs"
            title="ดาวน์โหลด scheduler.js ทั้งไฟล์"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>ดาวน์โหลด scheduler.js</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-indigo-600" />}
            <span>{copied ? 'คัดลอกโค้ดแล้ว!' : 'คัดลอกส่วนนี้'}</span>
          </button>
        </div>
      </div>

      {/* Synchronized Notification Banner */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 mb-5 text-xs text-indigo-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>โค้ดชุดนี้ทำงานตรงกัน 100%:</strong> โค้ดที่แสดงด้านล่างคือซอร์สโค้ดเดียวกับที่ใช้คำนวณใน <strong>"ทดลองจัดสรรเวลา CPU"</strong> ด้านบน และรวมอยู่ในไฟล์ดาวน์โหลด Zip / Markdown
          </span>
        </div>
        <a
          href="#simulator"
          className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900 underline ml-auto"
        >
          <span>ไปที่ตัวจำลอง</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Tabs with sub-anchor IDs */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {(
          [
            { id: 'fcfs', anchorId: 'code-fcfs', label: '1. FCFS Engine' },
            { id: 'sjf', anchorId: 'code-sjf', label: '2. SJF Non-preemptive' },
            { id: 'rr', anchorId: 'code-rr', label: '3. Round Robin (RR)' },
            { id: 'srtf', anchorId: 'code-srtf', label: '4. SJF Preemptive (SRTF)' },
            { id: 'setup', anchorId: 'code-setup', label: '5. Validation & Factory' },
            { id: 'finish', anchorId: 'code-finish', label: '6. Finish & Metrics' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            id={tab.anchorId}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all scroll-mt-24 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Code & Explanation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Code View */}
        <div className="lg:col-span-8 bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col">
          <div className="px-5 py-3 bg-[#0A0F1D] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2 text-sky-400 font-semibold">
              <Code2 className="w-4 h-4" />
              <span>{current.functionName}</span>
            </span>
            <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded text-slate-300 font-mono">
              JavaScript (Vanilla)
            </span>
          </div>
          <div className="p-5 overflow-x-auto max-h-[500px] text-xs sm:text-sm font-mono text-slate-200 leading-relaxed select-all">
            <pre className="whitespace-pre">{current.code}</pre>
          </div>
        </div>

        {/* Highlights Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider font-mono">
            <Info className="w-4 h-4" />
            <span>หลักการทำงานและเกณฑ์สำคัญ</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{current.title}</h3>

          <div className="space-y-3">
            {current.highlights.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <div className="text-xs font-bold text-indigo-700 mb-1">{item.label}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>ผลลัพธ์คำนวณ: AT=0 ทุกโปรเซส</span>
            <a href="#simulator" className="text-indigo-600 hover:text-indigo-700 font-semibold underline">
              ทดลองรันจริง →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
