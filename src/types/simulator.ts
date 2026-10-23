/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AlgorithmType = 'FCFS' | 'SJF' | 'RR' | 'SRTF';

export interface ProcessInput {
  id: string; // e.g. "P1", "P2"
  burstTime: number;
  arrivalTime: number; // default 0 per project constraints
  color: string;
}

export interface ProcessResult {
  id: string;
  burstTime: number;
  arrivalTime: number;
  startTime: number; // ST: First time CPU is allocated
  completionTime: number; // CT: Time process finishes completely
  turnaroundTime: number; // TAT = CT - AT (= CT when AT=0)
  waitingTime: number; // WT = TAT - BT
}

export interface GanttBlock {
  processId: string;
  startTime: number;
  endTime: number;
  duration: number;
  color: string;
}

export interface SchedulingOutput {
  algorithm: AlgorithmType;
  algorithmName: string;
  processes: ProcessResult[];
  gantt: GanttBlock[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  quantum?: number;
  stepLogs: string[];
  executionTrace: {
    time: number;
    action: string;
    runningProcess: string | null;
    readyQueue: string[];
    remainingBT: Record<string, number>;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  studentId: string;
  roleTitle: string;
  roleScope: 'Algorithm & Math' | 'UI & Integration' | 'Testing, Video & Documentation';
  responsibilities: string[];
}

export interface RealExperimentEntry {
  id: string;
  testCaseNumber: string; // "Case 1: Manual BT", "Case 2: Random BT", "Case 3: RR Quantum", "Case 4: Extreme / Edge"
  scenario: string;
  inputDescription?: string;
  isFirstAttemptPass: boolean;
  encounteredIssue: string; // "พบข้อผิดพลาด: ค่า WT ติดลบใน RR", "ติดลูปไม่สิ้นสุด", etc.
  rootCause: string;
  solutionFix: string; // "แก้ไขการคำนวณ ST โดยจำเฉพาะครั้งแรกที่เข้า CPU", etc.
  verifiedOutput: string;
  testerName: string;
  date: string;
}

export interface AiPromptLog {
  id: string;
  phase: string;
  toolUsed: string;
  purpose: string;
  promptExample: string;
  aiResponseSummary: string;
  humanVerificationAndCorrection: string;
  ethicalSummary: string;
}

export interface HandCalculationVerification {
  caseTitle: string;
  datasetSummary: string;
  algorithm: string;
  quantum?: number;
  manualSteps: {
    step: string;
    formula: string;
    result: string;
  }[];
  systemMatchConfirmed: boolean;
  notes: string;
}
