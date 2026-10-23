/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GanttBlock, ProcessInput, ProcessResult, SchedulingOutput } from '../types/simulator';

// Preset process pastel palette matching modern minimal UI design
export const PROCESS_PALETTE = [
  '#6366F1', // P1: Indigo
  '#10B981', // P2: Emerald / Mint
  '#F59E0B', // P3: Amber / Peach
  '#0EA5E9', // P4: Sky Blue
  '#EC4899', // P5: Rose / Pink
  '#8B5CF6', // P6: Purple
  '#14B8A6', // P7: Teal
  '#F97316', // P8: Orange
];

export const PROCESS_PASTEL_MAP: Record<string, { bg: string; border: string; text: string }> = {
  P1: { bg: '#EEF2FF', border: '#C7D2FE', text: '#3730A3' },
  P2: { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46' },
  P3: { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' },
  P4: { bg: '#E0F2FE', border: '#BAE6FD', text: '#0369A1' },
  P5: { bg: '#FDF2F8', border: '#FBCFE8', text: '#9D174D' },
  P6: { bg: '#F5F3FF', border: '#DDD6FE', text: '#5B21B6' },
  P7: { bg: '#CCFBF1', border: '#99F6E4', text: '#115E59' },
  P8: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
};

export function getProcessPastel(id: string) {
  return PROCESS_PASTEL_MAP[id] || { bg: '#F1F5F9', border: '#CBD5E1', text: '#334155' };
}

export function getProcessColor(index: number): string {
  return PROCESS_PALETTE[index % PROCESS_PALETTE.length];
}

/* ==========================================================================
   ALGORITHM SOURCE CODE STRINGS (For Export and UI Code Walkthrough)
   ========================================================================== */

export const FCFS_SOURCE_CODE = `function runFCFS(processes: ProcessInput[]): SchedulingOutput {
  // Sort by Arrival Time first, then original order (P1 -> Pn)
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const results: ProcessResult[] = [];
  const gantt: GanttBlock[] = [];

  for (const proc of sorted) {
    if (currentTime < proc.arrivalTime) {
      currentTime = proc.arrivalTime; // CPU idle if gap
    }
    const startTime = currentTime;
    const completionTime = startTime + proc.burstTime;
    currentTime = completionTime;

    const turnaroundTime = completionTime - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;

    results.push({
      id: proc.id,
      burstTime: proc.burstTime,
      arrivalTime: proc.arrivalTime,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime
    });

    gantt.push({
      processId: proc.id,
      startTime,
      endTime: completionTime,
      duration: proc.burstTime,
      color: proc.color
    });
  }

  // Restore display order by Process ID (P1, P2, ...)
  results.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\\D/g, '')) || 0;
    const numB = parseInt(b.id.replace(/\\D/g, '')) || 0;
    return numA - numB;
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);

  return {
    algorithm: 'FCFS',
    algorithmName: 'First-Come, First-Served (FCFS)',
    processes: results,
    gantt,
    avgWaitingTime: Number((totalWT / results.length).toFixed(2)),
    avgTurnaroundTime: Number((totalTAT / results.length).toFixed(2)),
    stepLogs: [/* chronological step notes */]
  };
}`;

export const SJF_SOURCE_CODE = `function runSJFNonPreemptive(processes: ProcessInput[]): SchedulingOutput {
  // When all Arrival Times = 0, sort directly by Burst Time (stable sort preserves P1 -> Pn on ties)
  // When Arrival Times vary, pick available process in ready queue with shortest BT
  const remaining = [...processes];
  let currentTime = 0;
  const results: ProcessResult[] = [];
  const gantt: GanttBlock[] = [];

  while (remaining.length > 0) {
    // Filter processes that have arrived by currentTime
    const available = remaining.filter(p => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      // CPU Idle: jump to earliest arrival
      const nextArrival = Math.min(...remaining.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    // Pick shortest burst time; tie-breaker: earlier arrival or lower ID
    available.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      const numA = parseInt(a.id.replace(/\\D/g, '')) || 0;
      const numB = parseInt(b.id.replace(/\\D/g, '')) || 0;
      return numA - numB;
    });

    const chosen = available[0];
    const indexInRemaining = remaining.findIndex(p => p.id === chosen.id);
    remaining.splice(indexInRemaining, 1);

    const startTime = currentTime;
    const completionTime = startTime + chosen.burstTime;
    currentTime = completionTime;

    const turnaroundTime = completionTime - chosen.arrivalTime;
    const waitingTime = turnaroundTime - chosen.burstTime;

    results.push({
      id: chosen.id,
      burstTime: chosen.burstTime,
      arrivalTime: chosen.arrivalTime,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime
    });

    gantt.push({
      processId: chosen.id,
      startTime,
      endTime: completionTime,
      duration: chosen.burstTime,
      color: chosen.color
    });
  }

  // Restore display order by Process ID
  results.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\\D/g, '')) || 0;
    const numB = parseInt(b.id.replace(/\\D/g, '')) || 0;
    return numA - numB;
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);

  return {
    algorithm: 'SJF',
    algorithmName: 'Shortest Job First (Non-preemptive)',
    processes: results,
    gantt,
    avgWaitingTime: Number((totalWT / results.length).toFixed(2)),
    avgTurnaroundTime: Number((totalTAT / results.length).toFixed(2))
  };
}`;

export const RR_SOURCE_CODE = `function runRoundRobin(processes: ProcessInput[], quantum: number): SchedulingOutput {
  if (quantum <= 0) throw new Error("Time Quantum must be a positive integer (> 0)");

  // Track remaining burst times and first-allocation start time (ST)
  const remainingBT: Record<string, number> = {};
  const firstStartTime: Record<string, number> = {};
  const completionTime: Record<string, number> = {};
  const procMap = new Map<string, ProcessInput>();

  processes.forEach(p => {
    remainingBT[p.id] = p.burstTime;
    procMap.set(p.id, p);
  });

  const readyQueue: string[] = [];
  const inQueue = new Set<string>();
  const gantt: GanttBlock[] = [];
  let currentTime = 0;

  // Add initially arrived processes (AT = 0) in sequential order P1..Pn
  const unarrived = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  function checkNewArrivals(time: number) {
    while (unarrived.length > 0 && unarrived[0].arrivalTime <= time) {
      const nextP = unarrived.shift()!;
      if (!inQueue.has(nextP.id)) {
        readyQueue.push(nextP.id);
        inQueue.add(nextP.id);
      }
    }
  }

  checkNewArrivals(currentTime);

  while (readyQueue.length > 0 || unarrived.length > 0) {
    if (readyQueue.length === 0) {
      // Idle until next process arrives
      currentTime = unarrived[0].arrivalTime;
      checkNewArrivals(currentTime);
      continue;
    }

    const currentId = readyQueue.shift()!;
    inQueue.delete(currentId);
    const proc = procMap.get(currentId)!;

    // Record Start Time (ST) ONLY the first time process receives CPU
    if (firstStartTime[currentId] === undefined) {
      firstStartTime[currentId] = currentTime;
    }

    const execTime = Math.min(quantum, remainingBT[currentId]);
    const sliceStart = currentTime;
    currentTime += execTime;
    remainingBT[currentId] -= execTime;

    gantt.push({
      processId: currentId,
      startTime: sliceStart,
      endTime: currentTime,
      duration: execTime,
      color: proc.color
    });

    // Check for newly arrived processes during this time slice
    checkNewArrivals(currentTime);

    // If still has remaining work, put back at tail of ready queue
    if (remainingBT[currentId] > 0) {
      readyQueue.push(currentId);
      inQueue.add(currentId);
    } else {
      completionTime[currentId] = currentTime;
    }
  }

  // Calculate final table values
  const results: ProcessResult[] = processes.map(proc => {
    const st = firstStartTime[proc.id] ?? 0;
    const ct = completionTime[proc.id] ?? 0;
    const tat = ct - proc.arrivalTime;
    const wt = tat - proc.burstTime;
    return {
      id: proc.id,
      burstTime: proc.burstTime,
      arrivalTime: proc.arrivalTime,
      startTime: st,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt
    };
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);

  return {
    algorithm: 'RR',
    algorithmName: 'Round Robin (RR)',
    quantum,
    processes: results,
    gantt,
    avgWaitingTime: Number((totalWT / results.length).toFixed(2)),
    avgTurnaroundTime: Number((totalTAT / results.length).toFixed(2))
  };
}`;

export const SRTF_SOURCE_CODE = `function runSRTFPreemptive(processes: ProcessInput[]): SchedulingOutput {
  // Shortest Remaining Time First (Preemptive SJF)
  // Note: When all AT = 0, SRTF behaves identically to non-preemptive SJF
  // If AT varies, preemption happens whenever a new process with shorter remaining BT arrives.
  const n = processes.length;
  const remainingBT: Record<string, number> = {};
  const firstStartTime: Record<string, number> = {};
  const completionTime: Record<string, number> = {};
  const procMap = new Map<string, ProcessInput>();

  processes.forEach(p => {
    remainingBT[p.id] = p.burstTime;
    procMap.set(p.id, p);
  });

  let completed = 0;
  let currentTime = 0;
  const rawTimeline: { time: number; processId: string }[] = [];

  while (completed < n) {
    const available = processes.filter(
      p => p.arrivalTime <= currentTime && remainingBT[p.id] > 0
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    available.sort((a, b) => {
      if (remainingBT[a.id] !== remainingBT[b.id]) {
        return remainingBT[a.id] - remainingBT[b.id];
      }
      return a.arrivalTime - b.arrivalTime;
    });

    const chosen = available[0];
    if (firstStartTime[chosen.id] === undefined) {
      firstStartTime[chosen.id] = currentTime;
    }

    rawTimeline.push({ time: currentTime, processId: chosen.id });
    remainingBT[chosen.id]--;
    currentTime++;

    if (remainingBT[chosen.id] === 0) {
      completed++;
      completionTime[chosen.id] = currentTime;
    }
  }

  // Compress 1-unit ticks into continuous Gantt blocks
  const gantt: GanttBlock[] = [];
  for (const tick of rawTimeline) {
    const lastBlock = gantt[gantt.length - 1];
    if (lastBlock && lastBlock.processId === tick.processId && lastBlock.endTime === tick.time) {
      lastBlock.endTime++;
      lastBlock.duration++;
    } else {
      const proc = procMap.get(tick.processId)!;
      gantt.push({
        processId: tick.processId,
        startTime: tick.time,
        endTime: tick.time + 1,
        duration: 1,
        color: proc.color
      });
    }
  }

  const results: ProcessResult[] = processes.map(proc => {
    const st = firstStartTime[proc.id] ?? 0;
    const ct = completionTime[proc.id] ?? 0;
    const tat = ct - proc.arrivalTime;
    const wt = tat - proc.burstTime;
    return {
      id: proc.id,
      burstTime: proc.burstTime,
      arrivalTime: proc.arrivalTime,
      startTime: st,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt
    };
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);

  return {
    algorithm: 'SRTF',
    algorithmName: 'SJF Preemptive (SRTF)',
    processes: results,
    gantt,
    avgWaitingTime: Number((totalWT / results.length).toFixed(2)),
    avgTurnaroundTime: Number((totalTAT / results.length).toFixed(2))
  };
}`;

/* ==========================================================================
   ACTUAL RUNTIME IMPLEMENTATIONS
   ========================================================================== */

export function runFCFS(processes: ProcessInput[]): SchedulingOutput {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const results: ProcessResult[] = [];
  const gantt: GanttBlock[] = [];
  const stepLogs: string[] = [];
  const executionTrace: SchedulingOutput['executionTrace'] = [];

  stepLogs.push(`เริ่มต้นการจำลอง FCFS ด้วยโปรเซสทั้งหมด ${processes.length} รายการ (Arrival Time = 0)`);

  for (const proc of sorted) {
    if (currentTime < proc.arrivalTime) {
      currentTime = proc.arrivalTime;
    }
    const startTime = currentTime;
    const completionTime = startTime + proc.burstTime;
    currentTime = completionTime;

    const turnaroundTime = completionTime - proc.arrivalTime;
    const waitingTime = turnaroundTime - proc.burstTime;

    results.push({
      id: proc.id,
      burstTime: proc.burstTime,
      arrivalTime: proc.arrivalTime,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    gantt.push({
      processId: proc.id,
      startTime,
      endTime: completionTime,
      duration: proc.burstTime,
      color: proc.color,
    });

    stepLogs.push(
      `เวลา ${startTime} - ${completionTime}: ประมวลผล ${proc.id} (BT=${proc.burstTime}) -> เสร็จที่เวลา ${completionTime} (TAT=${turnaroundTime}, WT=${waitingTime})`
    );

    executionTrace.push({
      time: startTime,
      action: `เริ่มทำงาน ${proc.id}`,
      runningProcess: proc.id,
      readyQueue: sorted.filter(p => p.arrivalTime <= startTime && p.id !== proc.id).map(p => p.id),
      remainingBT: { [proc.id]: 0 },
    });
  }

  // Sort results back to original ID order P1, P2...
  results.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const avgWT = Number((totalWT / results.length).toFixed(2));
  const avgTAT = Number((totalTAT / results.length).toFixed(2));

  stepLogs.push(`คำนวณค่าเฉลี่ย: ผลรวม WT = ${totalWT} / ${results.length} = AVG WT ${avgWT}`);

  return {
    algorithm: 'FCFS',
    algorithmName: 'First-Come, First-Served (FCFS)',
    processes: results,
    gantt,
    avgWaitingTime: avgWT,
    avgTurnaroundTime: avgTAT,
    stepLogs,
    executionTrace,
  };
}

export function runSJFNonPreemptive(processes: ProcessInput[]): SchedulingOutput {
  const remaining = [...processes];
  let currentTime = 0;
  const results: ProcessResult[] = [];
  const gantt: GanttBlock[] = [];
  const stepLogs: string[] = [];
  const executionTrace: SchedulingOutput['executionTrace'] = [];

  stepLogs.push(`เริ่มต้นการจำลอง SJF (Non-preemptive) เรียงลำดับตาม Burst Time จากน้อยไปมาก`);

  while (remaining.length > 0) {
    const available = remaining.filter(p => p.arrivalTime <= currentTime);

    if (available.length === 0) {
      const nextArrival = Math.min(...remaining.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    available.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    const chosen = available[0];
    const indexInRemaining = remaining.findIndex(p => p.id === chosen.id);
    remaining.splice(indexInRemaining, 1);

    const startTime = currentTime;
    const completionTime = startTime + chosen.burstTime;
    currentTime = completionTime;

    const turnaroundTime = completionTime - chosen.arrivalTime;
    const waitingTime = turnaroundTime - chosen.burstTime;

    results.push({
      id: chosen.id,
      burstTime: chosen.burstTime,
      arrivalTime: chosen.arrivalTime,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    });

    gantt.push({
      processId: chosen.id,
      startTime,
      endTime: completionTime,
      duration: chosen.burstTime,
      color: chosen.color,
    });

    stepLogs.push(
      `เวลา ${startTime} - ${completionTime}: คิวเลือก ${chosen.id} (สั้นที่สุด BT=${chosen.burstTime}) -> เสร็จที่เวลา ${completionTime} (WT=${waitingTime})`
    );

    executionTrace.push({
      time: startTime,
      action: `เลือกงานที่สั้นที่สุด ${chosen.id}`,
      runningProcess: chosen.id,
      readyQueue: remaining.map(p => p.id),
      remainingBT: { [chosen.id]: 0 },
    });
  }

  results.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const avgWT = Number((totalWT / results.length).toFixed(2));
  const avgTAT = Number((totalTAT / results.length).toFixed(2));

  stepLogs.push(`คำนวณค่าเฉลี่ย: ผลรวม WT = ${totalWT} / ${results.length} = AVG WT ${avgWT}`);

  return {
    algorithm: 'SJF',
    algorithmName: 'Shortest Job First (Non-preemptive)',
    processes: results,
    gantt,
    avgWaitingTime: avgWT,
    avgTurnaroundTime: avgTAT,
    stepLogs,
    executionTrace,
  };
}

export function runRoundRobin(processes: ProcessInput[], quantum: number): SchedulingOutput {
  const q = Math.max(1, Math.floor(quantum || 2));
  const remainingBT: Record<string, number> = {};
  const firstStartTime: Record<string, number> = {};
  const completionTime: Record<string, number> = {};
  const procMap = new Map<string, ProcessInput>();

  processes.forEach(p => {
    remainingBT[p.id] = p.burstTime;
    procMap.set(p.id, p);
  });

  const readyQueue: string[] = [];
  const inQueue = new Set<string>();
  const gantt: GanttBlock[] = [];
  const stepLogs: string[] = [];
  const executionTrace: SchedulingOutput['executionTrace'] = [];
  let currentTime = 0;

  stepLogs.push(`เริ่มต้น Round Robin ด้วย Time Quantum = ${q}`);

  const unarrived = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  const checkNewArrivals = (time: number) => {
    while (unarrived.length > 0 && unarrived[0].arrivalTime <= time) {
      const nextP = unarrived.shift()!;
      if (!inQueue.has(nextP.id)) {
        readyQueue.push(nextP.id);
        inQueue.add(nextP.id);
        stepLogs.push(`เวลา ${time}: โปรเซส ${nextP.id} เข้าสู่ Ready Queue`);
      }
    }
  };

  checkNewArrivals(currentTime);

  let loopGuard = 0;
  while ((readyQueue.length > 0 || unarrived.length > 0) && loopGuard < 10000) {
    loopGuard++;
    if (readyQueue.length === 0) {
      currentTime = unarrived[0].arrivalTime;
      checkNewArrivals(currentTime);
      continue;
    }

    const currentId = readyQueue.shift()!;
    inQueue.delete(currentId);
    const proc = procMap.get(currentId)!;

    // Record ST first time process gets CPU
    if (firstStartTime[currentId] === undefined) {
      firstStartTime[currentId] = currentTime;
      stepLogs.push(`เวลา ${currentTime}: [ST บันทึก] โปรเซส ${currentId} ได้รับ CPU ครั้งแรกที่ ST = ${currentTime}`);
    }

    const execTime = Math.min(q, remainingBT[currentId]);
    const sliceStart = currentTime;
    currentTime += execTime;
    remainingBT[currentId] -= execTime;

    gantt.push({
      processId: currentId,
      startTime: sliceStart,
      endTime: currentTime,
      duration: execTime,
      color: proc.color,
    });

    stepLogs.push(
      `เวลา ${sliceStart} - ${currentTime}: ${currentId} รันไป ${execTime} หน่วย (เหลือ BT=${remainingBT[currentId]})`
    );

    executionTrace.push({
      time: sliceStart,
      action: `${currentId} ได้รับสิทธิ์รัน (Quantum=${q}, ใช้จริง=${execTime})`,
      runningProcess: currentId,
      readyQueue: [...readyQueue],
      remainingBT: { ...remainingBT },
    });

    checkNewArrivals(currentTime);

    if (remainingBT[currentId] > 0) {
      readyQueue.push(currentId);
      inQueue.add(currentId);
      stepLogs.push(`เวลา ${currentTime}: ${currentId} ยังไม่เสร็จ ส่งกลับไปต่อท้าย Ready Queue`);
    } else {
      completionTime[currentId] = currentTime;
      stepLogs.push(`เวลา ${currentTime}: [CT บันทึก] ${currentId} ทำงานเสร็จสมบูรณ์ที่ CT = ${currentTime}`);
    }
  }

  const results: ProcessResult[] = processes.map(proc => {
    const st = firstStartTime[proc.id] ?? 0;
    const ct = completionTime[proc.id] ?? 0;
    const tat = ct - proc.arrivalTime;
    const wt = tat - proc.burstTime;
    return {
      id: proc.id,
      burstTime: proc.burstTime,
      arrivalTime: proc.arrivalTime,
      startTime: st,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt,
    };
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const avgWT = Number((totalWT / results.length).toFixed(2));
  const avgTAT = Number((totalTAT / results.length).toFixed(2));

  stepLogs.push(`สรุปผล Round Robin (Q=${q}): AVG WT = ${avgWT}, AVG TAT = ${avgTAT}`);

  return {
    algorithm: 'RR',
    algorithmName: `Round Robin (RR, Q=${q})`,
    quantum: q,
    processes: results,
    gantt,
    avgWaitingTime: avgWT,
    avgTurnaroundTime: avgTAT,
    stepLogs,
    executionTrace,
  };
}

export function runSRTFPreemptive(processes: ProcessInput[]): SchedulingOutput {
  const n = processes.length;
  const remainingBT: Record<string, number> = {};
  const firstStartTime: Record<string, number> = {};
  const completionTime: Record<string, number> = {};
  const procMap = new Map<string, ProcessInput>();

  processes.forEach(p => {
    remainingBT[p.id] = p.burstTime;
    procMap.set(p.id, p);
  });

  let completed = 0;
  let currentTime = 0;
  const rawTimeline: { time: number; processId: string }[] = [];
  const stepLogs: string[] = [];
  const executionTrace: SchedulingOutput['executionTrace'] = [];

  stepLogs.push(`เริ่มต้น SJF Preemptive (SRTF) - ตรวจสอบงานที่เหลือสั้นที่สุดทุกหน่วยเวลา`);

  let loopGuard = 0;
  while (completed < n && loopGuard < 10000) {
    loopGuard++;
    const available = processes.filter(
      p => p.arrivalTime <= currentTime && remainingBT[p.id] > 0
    );

    if (available.length === 0) {
      currentTime++;
      continue;
    }

    available.sort((a, b) => {
      if (remainingBT[a.id] !== remainingBT[b.id]) {
        return remainingBT[a.id] - remainingBT[b.id];
      }
      const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

    const chosen = available[0];
    if (firstStartTime[chosen.id] === undefined) {
      firstStartTime[chosen.id] = currentTime;
      stepLogs.push(`เวลา ${currentTime}: [ST บันทึก] ${chosen.id} ได้รับ CPU ครั้งแรก`);
    }

    rawTimeline.push({ time: currentTime, processId: chosen.id });
    remainingBT[chosen.id]--;
    currentTime++;

    if (remainingBT[chosen.id] === 0) {
      completed++;
      completionTime[chosen.id] = currentTime;
      stepLogs.push(`เวลา ${currentTime}: [CT บันทึก] ${chosen.id} ประมวลผลเสร็จสมบูรณ์`);
    }
  }

  // Compress continuous 1-unit blocks into clean Gantt blocks
  const gantt: GanttBlock[] = [];
  for (const tick of rawTimeline) {
    const lastBlock = gantt[gantt.length - 1];
    if (lastBlock && lastBlock.processId === tick.processId && lastBlock.endTime === tick.time) {
      lastBlock.endTime++;
      lastBlock.duration++;
    } else {
      const proc = procMap.get(tick.processId)!;
      gantt.push({
        processId: tick.processId,
        startTime: tick.time,
        endTime: tick.time + 1,
        duration: 1,
        color: proc.color,
      });
    }
  }

  const results: ProcessResult[] = processes.map(proc => {
    const st = firstStartTime[proc.id] ?? 0;
    const ct = completionTime[proc.id] ?? 0;
    const tat = ct - proc.arrivalTime;
    const wt = tat - proc.burstTime;
    return {
      id: proc.id,
      burstTime: proc.burstTime,
      arrivalTime: proc.arrivalTime,
      startTime: st,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: wt,
    };
  });

  const totalWT = results.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTAT = results.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const avgWT = Number((totalWT / results.length).toFixed(2));
  const avgTAT = Number((totalTAT / results.length).toFixed(2));

  return {
    algorithm: 'SRTF',
    algorithmName: 'SJF Preemptive (SRTF)',
    processes: results,
    gantt,
    avgWaitingTime: avgWT,
    avgTurnaroundTime: avgTAT,
    stepLogs,
    executionTrace,
  };
}

export function runAllAlgorithms(processes: ProcessInput[], quantum: number): {
  fcfs: SchedulingOutput;
  sjf: SchedulingOutput;
  rr: SchedulingOutput;
  srtf: SchedulingOutput;
} {
  return {
    fcfs: runFCFS(processes),
    sjf: runSJFNonPreemptive(processes),
    rr: runRoundRobin(processes, quantum),
    srtf: runSRTFPreemptive(processes),
  };
}
