/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Dices,
  Download,
  FileCode,
  FileText,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  Code2,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { AlgorithmType, ProcessInput, SchedulingOutput } from '../types/simulator';
import {
  getProcessColor,
  runAllAlgorithms,
  runRoundRobin,
} from '../utils/algorithms';
import {
  generateSchedulingJson,
  generateMarkdownCodeReport,
} from '../utils/schedulerGenerator';
import { GanttChart } from './GanttChart';
import { ResultsTable } from './ResultsTable';

interface SimulatorSectionProps {
  onExportRequest: (
    processes: ProcessInput[],
    outputs: {
      fcfs: SchedulingOutput;
      sjf: SchedulingOutput;
      rr: SchedulingOutput;
      srtf: SchedulingOutput;
    },
    quantum: number
  ) => void;
  externalLoadCase?: 'case1' | 'case2' | 'case3' | null;
  onClearExternalLoadCase?: () => void;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  onExportRequest,
  externalLoadCase,
  onClearExternalLoadCase,
}) => {
  // Process State (Default to 3 processes matching reference image: 8, 4, 2)
  const [processCountInput, setProcessCountInput] = useState<number>(3);
  const [processes, setProcesses] = useState<ProcessInput[]>([
    { id: 'P1', burstTime: 8, arrivalTime: 0, color: '#6366F1' },
    { id: 'P2', burstTime: 4, arrivalTime: 0, color: '#10B981' },
    { id: 'P3', burstTime: 2, arrivalTime: 0, color: '#F59E0B' },
  ]);
  const [quantum, setQuantum] = useState<number>(2);
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('SJF');
  const [algoFilter, setAlgoFilter] = useState<'all' | AlgorithmType>('all');
  const [showConditions, setShowConditions] = useState<boolean>(false);
  const [showCodeBehind, setShowCodeBehind] = useState<boolean>(true);
  const [showSliceTable, setShowSliceTable] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Multi-Quantum Comparison State (เปรียบเทียบ Round Robin ด้วยค่า Q หลายค่า)
  const [multiQuantums, setMultiQuantums] = useState<number[]>([1, 2, 4]);
  const [newQuantumInput, setNewQuantumInput] = useState<string>('');

  // Simulation Outputs
  const [allOutputs, setAllOutputs] = useState<{
    fcfs: SchedulingOutput;
    sjf: SchedulingOutput;
    rr: SchedulingOutput;
    srtf: SchedulingOutput;
  } | null>(null);

  // Compute on mount
  useEffect(() => {
    runCalculation(processes, quantum);
  }, []);

  // Handle external test cases
  useEffect(() => {
    if (!externalLoadCase) return;

    if (externalLoadCase === 'case1') {
      const case1Data: ProcessInput[] = [
        { id: 'P1', burstTime: 6, arrivalTime: 0, color: '#6366F1' },
        { id: 'P2', burstTime: 8, arrivalTime: 0, color: '#10B981' },
        { id: 'P3', burstTime: 7, arrivalTime: 0, color: '#F59E0B' },
        { id: 'P4', burstTime: 3, arrivalTime: 0, color: '#0EA5E9' },
      ];
      setProcessCountInput(4);
      setProcesses(case1Data);
      setQuantum(2);
      setSelectedAlgo('SJF');
      runCalculation(case1Data, 2);
    } else if (externalLoadCase === 'case2') {
      handleCreateRowsWithRandom(5);
    } else if (externalLoadCase === 'case3') {
      // Case 3: Set identical workload [6, 8, 7, 3], multi-quantums [1, 2, 4], algorithm RR
      const case3Data: ProcessInput[] = [
        { id: 'P1', burstTime: 6, arrivalTime: 0, color: '#6366F1' },
        { id: 'P2', burstTime: 8, arrivalTime: 0, color: '#10B981' },
        { id: 'P3', burstTime: 7, arrivalTime: 0, color: '#F59E0B' },
        { id: 'P4', burstTime: 3, arrivalTime: 0, color: '#0EA5E9' },
      ];
      setProcessCountInput(4);
      setProcesses(case3Data);
      setQuantum(2);
      setMultiQuantums([1, 2, 4]);
      setSelectedAlgo('RR');
      runCalculation(case3Data, 2);

      // Scroll to Multi-Quantum comparison section at the end of Section 1
      setTimeout(() => {
        const el = document.getElementById('sim-multi-rr');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }

    if (onClearExternalLoadCase) {
      onClearExternalLoadCase();
    }
  }, [externalLoadCase]);

  // Create rows based on input count
  const handleApplyProcessCount = () => {
    const count = Math.max(1, Math.min(20, Math.floor(processCountInput) || 1));
    const newProcs: ProcessInput[] = [];
    for (let i = 0; i < count; i++) {
      newProcs.push({
        id: `P${i + 1}`,
        burstTime: Math.floor(Math.random() * 8) + 2,
        arrivalTime: 0,
        color: getProcessColor(i),
      });
    }
    setProcesses(newProcs);
    runCalculation(newProcs, quantum);
  };

  const handleCreateRowsWithRandom = (count: number) => {
    setProcessCountInput(count);
    const newProcs: ProcessInput[] = [];
    for (let i = 0; i < count; i++) {
      newProcs.push({
        id: `P${i + 1}`,
        burstTime: Math.floor(Math.random() * 12) + 2,
        arrivalTime: 0,
        color: getProcessColor(i),
      });
    }
    setProcesses(newProcs);
    runCalculation(newProcs, quantum);
  };

  // Quick preset: 8, 4, 2 (from user mockup)
  const handleLoadExample842 = () => {
    const ex: ProcessInput[] = [
      { id: 'P1', burstTime: 8, arrivalTime: 0, color: '#6366F1' },
      { id: 'P2', burstTime: 4, arrivalTime: 0, color: '#10B981' },
      { id: 'P3', burstTime: 2, arrivalTime: 0, color: '#F59E0B' },
    ];
    setProcessCountInput(3);
    setProcesses(ex);
    setQuantum(2);
    setSelectedAlgo('SJF');
    runCalculation(ex, 2);
  };

  // Quick preset: Case 1 (6, 8, 7, 3)
  const handleLoadExampleCase1 = () => {
    const ex: ProcessInput[] = [
      { id: 'P1', burstTime: 6, arrivalTime: 0, color: '#6366F1' },
      { id: 'P2', burstTime: 8, arrivalTime: 0, color: '#10B981' },
      { id: 'P3', burstTime: 7, arrivalTime: 0, color: '#F59E0B' },
      { id: 'P4', burstTime: 3, arrivalTime: 0, color: '#0EA5E9' },
    ];
    setProcessCountInput(4);
    setProcesses(ex);
    setQuantum(2);
    setSelectedAlgo('SJF');
    runCalculation(ex, 2);
  };

  // Randomize BT
  const handleRandomizeBT = () => {
    const updated = processes.map((p, idx) => ({
      ...p,
      burstTime: Math.floor(Math.random() * 18) + 2, // 2-20
      color: getProcessColor(idx),
    }));
    setProcesses(updated);
    runCalculation(updated, quantum);
  };

  // Input changes
  const handleBurstTimeChange = (id: string, val: string) => {
    const num = parseInt(val, 10);
    setProcesses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, burstTime: isNaN(num) ? 0 : num } : p))
    );
  };

  const handleArrivalTimeChange = (id: string, val: string) => {
    const num = parseInt(val, 10);
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, arrivalTime: isNaN(num) ? 0 : Math.max(0, num) }
          : p
      )
    );
  };

  // Main calculation
  const runCalculation = (procs = processes, q = quantum) => {
    const errors: string[] = [];

    if (procs.length === 0) {
      errors.push('กรุณาระบุจำนวนโปรเซสอย่างน้อย 1 รายการ');
    }

    if (q <= 0 || !Number.isInteger(q)) {
      errors.push('Time Quantum ต้องเป็นจำนวนเต็มบวกที่มากกว่า 0');
    }

    procs.forEach((p) => {
      if (p.arrivalTime < 0 || !Number.isInteger(p.arrivalTime)) {
        errors.push(`โปรเซส ${p.id}: Arrival Time ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป`);
      }
      if (p.burstTime <= 0 || !Number.isInteger(p.burstTime)) {
        errors.push(`โปรเซส ${p.id}: Burst Time ต้องเป็นจำนวนเต็มบวก (> 0)`);
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    const outputs = runAllAlgorithms(procs, q);
    setAllOutputs(outputs);
    if (onExportRequest) {
      onExportRequest(procs, outputs, q);
    }
  };

  // Current active output to display in SCHEDULE DETAIL
  const activeDetailOutput = allOutputs
    ? selectedAlgo === 'FCFS'
      ? allOutputs.fcfs
      : selectedAlgo === 'SJF'
      ? allOutputs.sjf
      : selectedAlgo === 'RR'
      ? allOutputs.rr
      : allOutputs.srtf
    : null;

  const allArrivalTimesZero = processes.every((p) => p.arrivalTime === 0);

  // Compute detailed step-by-step slices with exact remaining burst time matching image_29c0267b.png
  const executionSlices = useMemo(() => {
    if (!activeDetailOutput) return [];
    const remTracker: Record<string, number> = {};
    processes.forEach((p) => {
      remTracker[p.id] = p.burstTime;
    });

    return activeDetailOutput.gantt.map((g, idx) => {
      const prev = remTracker[g.processId] ?? g.duration;
      const remaining = Math.max(0, prev - g.duration);
      remTracker[g.processId] = remaining;
      return {
        step: idx + 1,
        processId: g.processId,
        start: g.startTime,
        end: g.endTime,
        usedCpu: g.duration,
        remaining,
        color: g.color,
      };
    });
  }, [activeDetailOutput, processes]);

  // Multi-Quantum Comparison Calculation (เปรียบเทียบ Round Robin ด้วยค่า Q หลายค่าพร้อมกัน)
  const multiRrResults = useMemo(() => {
    return multiQuantums.map((q) => {
      const output = runRoundRobin(processes, q);
      const totalSlices = output.gantt.length;
      const makespan = output.gantt[output.gantt.length - 1]?.endTime || 0;

      let behaviorDesc = '';
      if (q === 1) {
        behaviorDesc = 'การสลับงานสูงสุด (High Overhead) ตอบสนองเร็วแบบ Time-sharing แต่มีสลับ Context บ่อยที่สุด';
      } else if (q === 2) {
        behaviorDesc = 'ค่ามาตรฐานตามโจทย์: จุดสมดุลที่ดีระหว่าง Response Time และจำนวนช่วงเวลาการสลับงาน';
      } else if (q <= 4) {
        behaviorDesc = 'จำนวนสลับงานลดลงอย่างชัดเจน โปรเซสทำงานต่อเนื่องได้นานขึ้น';
      } else {
        behaviorDesc = 'Quantum ขนาดใหญ่ พฤติกรรมเริ่มเข้าใกล้ FCFS (ลดการสลับงานลง)';
      }

      return {
        quantum: q,
        output,
        totalSlices,
        avgWaitingTime: output.avgWaitingTime,
        avgTurnaroundTime: output.avgTurnaroundTime,
        makespan,
        behaviorDesc,
      };
    });
  }, [processes, multiQuantums]);

  const lowestMultiAwt = useMemo(() => {
    if (multiRrResults.length === 0) return 0;
    return Math.min(...multiRrResults.map((r) => r.avgWaitingTime));
  }, [multiRrResults]);

  const handleAddQuantum = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(newQuantumInput.trim(), 10);
    if (!isNaN(val) && val > 0 && val <= 1000) {
      if (!multiQuantums.includes(val)) {
        setMultiQuantums((prev) => [...prev, val].sort((a, b) => a - b));
      }
      setNewQuantumInput('');
    }
  };

  const handleRemoveQuantum = (qToRemove: number) => {
    if (multiQuantums.length <= 1) return;
    setMultiQuantums((prev) => prev.filter((q) => q !== qToRemove));
  };

  const handleSelectQuantumAsMain = (q: number) => {
    setQuantum(q);
    setSelectedAlgo('RR');
    runCalculation(processes, q);
  };

  // Download JSON matching /public/assets/aistudio/cpu-scheduling-results_b5542cde.json exactly
  const handleDownloadJson = () => {
    if (!allOutputs) return;
    const bursts = processes.map((p) => p.burstTime);
    const jsonObject = generateSchedulingJson(bursts, quantum, allOutputs);
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cpu-scheduling-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download Markdown Report matching /public/assets/aistudio/CPU-SJF-code-report_5cff79b6.md exactly
  const handleDownloadMarkdown = () => {
    if (!allOutputs || !activeDetailOutput) return;
    const bursts = processes.map((p) => p.burstTime);
    const mdContent = generateMarkdownCodeReport(selectedAlgo, bursts, quantum, activeDetailOutput);
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CPU-${selectedAlgo}-code-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const algoMeta = {
    FCFS: {
      name: 'FCFS · First-Come, First-Served',
      badge: 'Non-preemptive',
      desc: 'จัดลำดับโปรเซสตามลำดับที่มาถึงระบบ (P1 ถึง Pn) และรันต่อเนื่องจนเสร็จสมบูรณ์',
    },
    SJF: {
      name: 'SJF · Shortest Job First',
      badge: 'Non-preemptive',
      desc: 'เลือก Burst Time น้อยที่สุดก่อน ถ้าเท่ากันใช้ลำดับ P1 ถึง Pn และทำจนเสร็จ',
    },
    SRTF: {
      name: 'SRTF · Shortest Remaining Time First',
      badge: 'Preemptive SJF',
      desc: 'ตรวจสอบโปรเซสที่มาถึงแล้วและมีเวลาทำงานที่เหลือสั้นที่สุดเสมอ',
    },
    RR: {
      name: `Round Robin · Time Slicing (Q=${quantum})`,
      badge: `Preemptive (Q=${quantum})`,
      desc: 'แบ่งเวลา CPU เท่าๆ กันตาม Time Quantum โดยโปรเซสที่ยังไม่เสร็จจะวนกลับไปต่อท้ายคิว FIFO',
    },
  };

  return (
    <section id="simulator" className="scroll-mt-20 pt-8 pb-16">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl font-mono mb-3">
          <span>ส่วนที่ 1 · ตัวจำลองการจัดสรรเวลา CPU (Interactive Sandbox)</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              ทดลองจัดสรรเวลา CPU
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mt-2 leading-relaxed">
              เปรียบเทียบลำดับการทำงานและเวลารอ จากโปรเซสชุดเดียวกัน
            </p>
          </div>
        </div>

        {/* Top Info Strip */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 font-medium border-b border-slate-200/80 pb-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-slate-800 font-bold">01 CPU</span>
            <span>·</span>
            <span className="text-slate-800 font-semibold">กำหนด AT ของแต่ละโปรเซสได้</span>
            <span>·</span>
            <span className="text-slate-800 font-semibold">P1–Pn ลำดับเริ่มต้น</span>
          </div>
          <div className="text-slate-400 text-xs">
            ไม่คิด I/O และ Context Switch overhead ในการคำนวณพื้นฐาน
          </div>
        </div>
      </div>

      {/* Main 2-Column Split matching image_af6bd418.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ====================================================================
            LEFT COLUMN: 01 ข้อมูลโปรเซส (INPUT)
            ==================================================================== */}
        <div id="sim-config" className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs scroll-mt-24">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                01
              </span>
              <h2 className="text-base font-bold text-slate-900">
                ข้อมูลโปรเซส
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">
              INPUT
            </span>
          </div>

          {/* Process count input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              จำนวนโปรเซส <span className="font-normal text-slate-400 font-mono">1–20</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={20}
                value={processCountInput}
                onChange={(e) => setProcessCountInput(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleApplyProcessCount}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
              >
                สร้างแถว
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              สร้างแถวใหม่จะรีเซ็ตและสุ่มค่า Burst Time
            </p>
          </div>

          {/* Burst Time List Header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Burst Time <span className="font-normal text-slate-400 font-mono">(1–1,000)</span>
            </span>
            <button
              type="button"
              onClick={handleRandomizeBT}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              สุ่มค่า 1–20
            </button>
          </div>

          {/* Process Table Header */}
          <div className="grid grid-cols-[64px_58px_minmax(74px,1fr)] items-center gap-1.5 text-[11px] font-mono text-slate-400 font-semibold px-1.5 py-1 mb-1 border-b border-slate-100">
            <span>Process</span>
            <span className="text-center">AT</span>
            <span className="text-right">BT</span>
          </div>

          {/* Process Rows */}
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1 mb-4">
            {processes.map((proc, idx) => (
              <div
                key={proc.id}
                className="grid grid-cols-[64px_58px_minmax(74px,1fr)] items-center gap-1.5 p-1.5 rounded-lg bg-slate-50/70 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
              >
                <div className="min-w-0 flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-xs shrink-0"
                    style={{ backgroundColor: proc.color }}
                  />
                  <span className="text-xs font-bold text-slate-800 font-mono">{proc.id}</span>
                </div>
                <input
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  aria-label={`Arrival Time ของ ${proc.id}`}
                  value={proc.arrivalTime}
                  onChange={(e) => handleArrivalTimeChange(proc.id, e.target.value)}
                  className="w-full min-w-0 text-center px-1 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
                />
                <div className="min-w-0">
                  <input
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    aria-label={`Burst Time ของ ${proc.id}`}
                    value={proc.burstTime}
                    onChange={(e) => handleBurstTimeChange(proc.id, e.target.value)}
                    className="w-full min-w-0 text-right px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick preset buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={handleLoadExample842}
              className="py-1.5 px-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors text-center"
            >
              ใช้ตัวอย่าง 8, 4, 2
            </button>
            <button
              type="button"
              onClick={handleLoadExampleCase1}
              className="py-1.5 px-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors text-center"
            >
              ใช้ Case 1: 6, 8, 7, 3
            </button>
          </div>

          {/* Algorithm selection dropdown */}
          <div className="mb-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              อัลกอริทึม
            </label>
            <select
              value={algoFilter}
              onChange={(e) => {
                const val = e.target.value as 'all' | AlgorithmType;
                setAlgoFilter(val);
                if (val !== 'all') {
                  setSelectedAlgo(val);
                }
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="all">เปรียบเทียบทั้งหมด</option>
              <option value="FCFS">FCFS (First-Come, First-Served)</option>
              <option value="SJF">SJF (Shortest Job First - Non-preemptive)</option>
              <option value="SRTF">SRTF (SJF Preemptive)</option>
              <option value="RR">Round Robin (RR)</option>
            </select>
          </div>

          {/* Time Quantum input */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Time Quantum สำหรับ RR
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={quantum}
              onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              ค่าเริ่มต้น 2 · จำนวนเต็มบวก &gt; 0
            </p>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>กรุณาตรวจสอบข้อมูล:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Big Primary Action Button */}
          <button
            type="button"
            onClick={() => runCalculation()}
            className="w-full py-3 px-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>คำนวณผลลัพธ์</span>
          </button>

          {/* Conditions Accordion matching image */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowConditions(!showConditions)}
              className="w-full flex items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span>เงื่อนไขของแบบจำลอง</span>
              {showConditions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showConditions && (
              <div className="mt-2 text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 font-mono">
                <div>• Arrival Time (AT) กำหนดได้ตั้งแต่ 0 ขึ้นไป</div>
                <div>• ถ้า AT เท่ากัน ใช้ P1 ถึง Pn เป็นลำดับตัดสิน</div>
                <div>• TAT = CT - AT</div>
                <div>• WT = TAT - BT</div>
                <div>• AVG WT = ผลรวม WT ÷ จำนวนโปรเซส</div>
              </div>
            )}
          </div>
        </div>

        {/* ====================================================================
            RIGHT COLUMN: 02 ผลการจำลอง (RESULTS)
            ==================================================================== */}
        <div id="sim-controls" className="lg:col-span-8 space-y-5 scroll-mt-24">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                02
              </span>
              <h2 className="text-lg font-bold text-slate-900">ผลการจำลอง</h2>
            </div>

            {/* Quick Export Actions matching image_4d7bfe6f.png */}
            {allOutputs && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
                  title="ดาวน์โหลดไฟล์ JSON (cpu-scheduling-results.json)"
                >
                  บันทึกผล JSON
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
                  title="ดาวน์โหลดรายงานผลและโค้ด .md สำหรับ VS Code"
                >
                  รายงานผล + โค้ด
                </button>
              </div>
            )}
          </div>

          {/* Dataset Summary Meta Kicker */}
          <div className="text-xs text-slate-500 font-mono bg-slate-100/70 border border-slate-200/70 px-3 py-1.5 rounded-lg">
            {processes.length} โปรเซส · AT = [{processes.map((p) => p.arrivalTime).join(', ')}] · BT = [{processes.map((p) => p.burstTime).join(', ')}] · Quantum = {quantum} · ข้อมูลเดียวกันทุกอัลกอริทึมที่เลือก
          </div>

          {/* The 4 Algorithm Scorecards in a neat row matching image_af6bd418.png */}
          {allOutputs && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: FCFS */}
              <button
                type="button"
                onClick={() => setSelectedAlgo('FCFS')}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  selectedAlgo === 'FCFS'
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">FCFS</div>
                <div className="text-[11px] text-slate-400">Non-preemptive</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
                  {allOutputs.fcfs.avgWaitingTime}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">AVG WT · หน่วยเวลา</div>
              </button>

              {/* Card 2: SJF */}
              <button
                type="button"
                onClick={() => setSelectedAlgo('SJF')}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  selectedAlgo === 'SJF'
                    ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">SJF</div>
                <div className="text-[11px] text-slate-400">Non-preemptive</div>
                <div className="text-2xl font-bold font-mono text-emerald-600 mt-2 tabular-nums">
                  {allOutputs.sjf.avgWaitingTime}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">AVG WT · หน่วยเวลา</div>
              </button>

              {/* Card 3: SRTF */}
              <button
                type="button"
                onClick={() => setSelectedAlgo('SRTF')}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  selectedAlgo === 'SRTF'
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">SRTF</div>
                <div className="text-[11px] text-slate-400">Preemptive SJF</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
                  {allOutputs.srtf.avgWaitingTime}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">AVG WT · หน่วยเวลา</div>
              </button>

              {/* Card 4: Round Robin */}
              <button
                type="button"
                onClick={() => setSelectedAlgo('RR')}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  selectedAlgo === 'RR'
                    ? 'bg-white border-amber-600 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">Round Robin</div>
                <div className="text-[11px] text-slate-400">Quantum = {quantum}</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
                  {allOutputs.rr.avgWaitingTime}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">AVG WT · หน่วยเวลา</div>
              </button>
            </div>
          )}

          {/* Theoretical Notice Banner matching image_af6bd418.png */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl px-4 py-2.5 text-xs text-indigo-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>ข้อสังเกต:</strong>{' '}
              {allArrivalTimesZero
                ? 'SJF และ SRTF ได้ผลเหมือนกันเมื่อทุกโปรเซสมาถึงพร้อมกันที่ AT = 0'
                : 'เมื่อ Arrival Time ต่างกัน SRTF สามารถแทรกโปรเซสที่เพิ่งมาถึงและมีเวลาคงเหลือน้อยกว่าได้'}
            </span>
          </div>

          {/* ====================================================================
              SCHEDULE DETAIL CARD (matching image_af6bd418.png)
              ==================================================================== */}
          {activeDetailOutput && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    SCHEDULE DETAIL
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {algoMeta[selectedAlgo].name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {algoMeta[selectedAlgo].desc}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                  {algoMeta[selectedAlgo].badge}
                </span>
              </div>

              {/* 1. Gantt Chart (No horizontal scroll!) */}
              <div id="sim-gantt" className="scroll-mt-24">
                <GanttChart
                  blocks={activeDetailOutput.gantt}
                  totalTime={
                    activeDetailOutput.gantt[activeDetailOutput.gantt.length - 1]?.endTime || 0
                  }
                  algorithmName={activeDetailOutput.algorithmName}
                />
              </div>

              {/* 2. Results Table (No horizontal scroll!) */}
              <div id="sim-detail" className="scroll-mt-24">
                <ResultsTable
                  processes={activeDetailOutput.processes}
                  avgWaitingTime={activeDetailOutput.avgWaitingTime}
                  avgTurnaroundTime={activeDetailOutput.avgTurnaroundTime}
                  algorithmName={activeDetailOutput.algorithmName}
                />
              </div>

              {/* 3. แสดงโค้ดเบื้องหลังในการได้มาซึ่งคำตอบ (สอดคล้องกับรายงานและ Section 3) */}
              <div id="sim-code-behind" className="border-t border-slate-200/90 pt-5 scroll-mt-24">
                <button
                  type="button"
                  onClick={() => setShowCodeBehind(!showCodeBehind)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        แสดงโค้ดเบื้องหลังในการได้มาซึ่งคำตอบ ({selectedAlgo})
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        ดูขั้นตอนการได้มาซึ่งตัวเลข ST, CT, TAT, WT และซอร์สโค้ดจริงจาก scheduler.js
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                    <span>{showCodeBehind ? 'ซ่อนโค้ด' : 'แสดงโค้ด'}</span>
                    {showCodeBehind ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showCodeBehind && (
                  <div className="mt-4 space-y-4 animate-in fade-in duration-200">
                    {/* ตารางดูการทำงานทีละช่วงและ BT ที่เหลือ (matching image_29c0267b.png) */}
                    <div id="sim-slices" className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 scroll-mt-24">
                      <button
                        type="button"
                        onClick={() => setShowSliceTable(!showSliceTable)}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm sm:text-base cursor-pointer select-none transition-colors"
                      >
                        <span className="text-xs text-indigo-600">
                          {showSliceTable ? '▾' : '▸'}
                        </span>
                        <span>ดูการทำงานทีละช่วงและ BT ที่เหลือ</span>
                      </button>

                      {showSliceTable && (
                        <div className="space-y-2.5">
                          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-white">
                            <div className="max-h-[340px] overflow-y-auto">
                              <table className="w-full text-left border-collapse text-sm">
                                <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-slate-200/90 text-xs font-semibold text-slate-500">
                                  <tr>
                                    <th className="py-3 px-4 text-center w-20">ครั้ง</th>
                                    <th className="py-3 px-4 text-center">Process</th>
                                    <th className="py-3 px-4 text-center">เริ่ม</th>
                                    <th className="py-3 px-4 text-center">จบ</th>
                                    <th className="py-3 px-4 text-center">ใช้ CPU</th>
                                    <th className="py-3 px-4 text-center">BT เหลือ</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-mono text-xs sm:text-sm text-slate-700">
                                  {executionSlices.map((slice) => (
                                    <tr key={slice.step} className="hover:bg-slate-50/70 transition-colors">
                                      <td className="py-3 px-4 text-center font-bold text-slate-900 font-sans">
                                        {slice.step}
                                      </td>
                                      <td className="py-3 px-4 text-center font-semibold text-slate-900 font-sans">
                                        <span className="inline-flex items-center gap-1.5 justify-center">
                                          <span
                                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                                            style={{ backgroundColor: slice.color }}
                                          />
                                          <span>{slice.processId}</span>
                                        </span>
                                      </td>
                                      <td className="py-3 px-4 text-center tabular-nums">{slice.start}</td>
                                      <td className="py-3 px-4 text-center tabular-nums">{slice.end}</td>
                                      <td className="py-3 px-4 text-center tabular-nums">{slice.usedCpu}</td>
                                      <td className="py-3 px-4 text-center tabular-nums font-bold text-slate-900">
                                        {slice.remaining}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 font-sans pt-1">
                            แสดงช่วงเดียวกับหน้าของลำดับ CPU ด้านบน
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ผลรายโปรเซส */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">
                        ## ผลรายโปรเซส (Mathematical Formulas)
                      </div>
                      <div className="space-y-1 font-mono text-xs sm:text-sm text-slate-700">
                        {activeDetailOutput.processes.map((p) => (
                          <div key={p.id}>
                            <strong className="text-slate-900 font-bold">{p.id}:</strong> ST={p.startTime}, CT={p.completionTime}, TAT={p.completionTime}−{p.arrivalTime}={p.turnaroundTime}, WT={p.turnaroundTime}−{p.burstTime}={p.waitingTime}
                          </div>
                        ))}
                        <div className="pt-2 mt-2 border-t border-slate-200 text-indigo-700 font-bold">
                          AVG WT = {activeDetailOutput.processes.map((p) => p.waitingTime).join(' + ')} หาร {activeDetailOutput.processes.length} = {activeDetailOutput.avgWaitingTime}
                        </div>
                      </div>
                    </div>

                    {/* ซอร์สโค้ดฟังก์ชันจริง */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                      <div className="px-4 py-2.5 bg-[#0A0F1D] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span className="text-sky-400 font-semibold flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          <span>โค้ดจริงจาก scheduler.js ({selectedAlgo === 'RR' ? 'runRoundRobin' : selectedAlgo === 'SRTF' ? 'runSRTF' : 'runNonPreemptive'})</span>
                        </span>
                        <a href="#code-walkthrough" className="text-indigo-400 hover:text-indigo-300 underline font-sans text-xs">
                          ดูโค้ดทุกฟังก์ชันในส่วนที่ 3 →
                        </a>
                      </div>
                      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed select-all">
                        {selectedAlgo === 'RR'
                          ? `function runRoundRobin(bursts, quantum = 2) {
  const q = positiveInteger(quantum, 'Time Quantum', LIMITS.quantum);
  const processes = makeProcesses(bursts);
  const queue = [...processes];
  let time = 0;
  const timeline = [];

  while (queue.length > 0) {
    const p = queue.shift();
    if (p.st === null) p.st = time;
    const slice = Math.min(p.remaining, q);
    const start = time;
    time += slice;
    p.remaining -= slice;
    timeline.push({ process: p.process, start, end: time, remaining: p.remaining });

    if (p.remaining > 0) {
      queue.push(p);
    } else {
      p.ct = time;
    }
  }

  return finish('RR', processes, timeline, q);
}`
                          : selectedAlgo === 'SRTF'
                          ? `function runSRTF(bursts) {
  const processes = makeProcesses(bursts);
  let time = 0;
  const timeline = [];
  let completed = 0;
  const n = processes.length;

  while (completed < n) {
    const available = processes.filter(p => p.remaining > 0);
    if (available.length === 0) break;
    available.sort((a, b) => a.remaining - b.remaining || a.id - b.id);
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
}`
                          : `function runNonPreemptive(bursts, algorithm) {
  const processes = makeProcesses(bursts);
  // สำเนาอาร์เรย์ก่อน sort เพื่อคงตารางผลลัพธ์ตาม P1..Pn
  const order = [...processes];
  if (algorithm === 'SJF') order.sort((a, b) => a.bt - b.bt || a.id - b.id);
  let time = 0;
  const timeline = [];
  for (const p of order) {
    p.st = time;
    time += p.bt;
    p.ct = time;
    p.remaining = 0;
    timeline.push({ process: p.process, start: p.st, end: p.ct, remaining: 0 });
  }
  return finish(algorithm, processes, timeline);
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          04 การเปรียบเทียบ ROUND ROBIN ด้วย TIME QUANTUM หลายค่าพร้อมกัน
          (MULTI-QUANTUM SENSITIVITY ANALYSIS)
          ==================================================================== */}
      <div
        id="sim-multi-rr"
        className="mt-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-24 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>ส่วนที่ 1 ตอนท้าย · การเปรียบเทียบ Time Quantum หลายค่า (RR Sensitivity Analysis)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              เปรียบเทียบ Round Robin ด้วย Time Quantum หลายค่าพร้อมกัน
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              ใช้ชุดข้อมูลโปรเซสเดียวกัน (<span className="font-mono font-semibold text-slate-700">{processes.map(p => `${p.id}:${p.burstTime}`).join(', ')}</span>) ทดสอบผลกระทบของการเปลี่ยนค่า Time Quantum ต่อเวลารอคอยเฉลี่ย (AWT) และความถี่ในการสลับงาน
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-slate-400">ชุดข้อมูล: {processes.length} โปรเซส</span>
          </div>
        </div>

        {/* Quantum Chips and Add Form */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">
                ค่า Time Quantum ที่กำลังเปรียบเทียบ ({multiQuantums.length} ค่า):
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium mr-1 text-[11px]">ชุดสำเร็จรูป:</span>
              <button
                type="button"
                onClick={() => setMultiQuantums([1, 2, 4])}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors shadow-2xs"
                title="โหลดค่ามาตรฐานตาม Case 3 (Q = 1, 2, 4)"
              >
                Case 3 (Q = 1, 2, 4)
              </button>
              <button
                type="button"
                onClick={() => setMultiQuantums([2, 4, 8])}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                ก้าวกระโดด (Q = 2, 4, 8)
              </button>
              <button
                type="button"
                onClick={() => setMultiQuantums([1, 2, 3, 5])}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                ละเอียด (Q = 1, 2, 3, 5)
              </button>
            </div>
          </div>

          {/* Active Chips & Add Input Form */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {multiQuantums.map((q) => (
              <div
                key={q}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 text-amber-950 rounded-xl shadow-2xs font-mono font-bold text-xs sm:text-sm"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Q = {q}</span>
                {multiQuantums.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuantum(q)}
                    className="ml-1 w-4 h-4 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
                    title={`ลบ Q = ${q}`}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Add custom Quantum input */}
            <form onSubmit={handleAddQuantum} className="inline-flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={1000}
                placeholder="เพิ่ม Q..."
                value={newQuantumInput}
                onChange={(e) => setNewQuantumInput(e.target.value)}
                className="w-20 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!newQuantumInput.trim()}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่ม</span>
              </button>
            </form>
          </div>
        </div>

        {/* 1. Comparison Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-3 text-center w-24">Time Quantum</th>
                <th className="py-3 px-3 text-center w-36">จำนวน Slices (Context Switches)</th>
                <th className="py-3 px-3 text-center w-32">AVG Waiting Time</th>
                <th className="py-3 px-3 text-center w-32">AVG Turnaround</th>
                <th className="py-3 px-4 min-w-[240px]">พฤติกรรมและการวิเคราะห์ทางทฤษฎี</th>
                <th className="py-3 px-3 text-center w-32">การเลือกใช้งาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {multiRrResults.map((item) => {
                const isOptimal = item.avgWaitingTime === lowestMultiAwt;
                const isCurrentActive = quantum === item.quantum && selectedAlgo === 'RR';

                return (
                  <tr
                    key={item.quantum}
                    className={`transition-colors ${
                      isCurrentActive ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        Q = {item.quantum}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {item.totalSlices} ช่วง
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-black text-slate-900">
                          {item.avgWaitingTime.toFixed(2)} ms
                        </span>
                        {isOptimal && (
                          <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>AWT ต่ำที่สุด</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {item.avgTurnaroundTime.toFixed(2)} ms
                    </td>
                    <td className="py-3 px-4 font-sans text-xs text-slate-600 leading-relaxed">
                      {item.behaviorDesc}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isCurrentActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded-lg">
                          กำลังใช้งานอยู่
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectQuantumAsMain(item.quantum)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-800 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                        >
                          เลือกค่านี้
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 2. Visual Gantt Timeline Strips Comparison */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              <span>ผัง Gantt Chart เปรียบเทียบความถี่ของ Time Slice แต่ละค่า Quantum</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Makespan รวม: {multiRrResults[0]?.makespan || 0} หน่วยเวลา</span>
          </div>

          <div className="space-y-4 bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5">
            {multiRrResults.map((item) => {
              const totalSpan = item.makespan || 1;
              return (
                <div key={item.quantum} className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  {/* Strip Label */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs">
                        Time Quantum = {item.quantum}
                      </span>
                      <span className="text-slate-500 font-medium text-xs">
                        ({item.totalSlices} Time Slices)
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-600">
                      AVG WT: <strong className="text-slate-900">{item.avgWaitingTime.toFixed(2)} ms</strong>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="relative w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex border border-slate-200 shadow-inner">
                    {item.output.gantt.map((block, bIdx) => {
                      const widthPct = (block.duration / totalSpan) * 100;
                      return (
                        <div
                          key={bIdx}
                          style={{
                            width: `${widthPct}%`,
                            backgroundColor: block.color || '#6366F1',
                          }}
                          className="h-full flex items-center justify-center text-white font-mono font-bold text-[10px] sm:text-xs border-r border-black/20 hover:brightness-110 transition-all cursor-default select-none overflow-hidden px-0.5"
                          title={`${block.processId} [${block.startTime} → ${block.endTime}] ใช้ ${block.duration} หน่วย`}
                        >
                          <span className="truncate">{block.processId}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sequence Trace Text */}
                  <div className="text-[11px] font-mono text-slate-500 overflow-x-auto whitespace-nowrap pt-0.5">
                    ลำดับคิว: {item.output.gantt.map((b) => `${b.processId}(${b.duration})`).join(' → ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
