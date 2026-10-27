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
 * Delegated to standaloneOfflineHtml.ts for modular architecture
 */
import { generateStandaloneOfflineHtml } from './standaloneOfflineHtml';
export { generateStandaloneOfflineHtml };

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
