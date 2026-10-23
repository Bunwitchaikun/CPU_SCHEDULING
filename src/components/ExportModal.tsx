/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Code2, Copy, Download, FileJson, FileText, X } from 'lucide-react';
import { ProcessInput, SchedulingOutput, TeamMember } from '../types/simulator';
import { FCFS_SOURCE_CODE, RR_SOURCE_CODE, SJF_SOURCE_CODE, SRTF_SOURCE_CODE } from '../utils/algorithms';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  processes: ProcessInput[];
  outputs: {
    fcfs: SchedulingOutput;
    sjf: SchedulingOutput;
    rr: SchedulingOutput;
    srtf?: SchedulingOutput;
  };
  members: TeamMember[];
  quantum: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  processes,
  outputs,
  members,
  quantum,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'markdown' | 'code'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build Comprehensive JSON Bundle including Underlying Algorithm Source Code
  const exportBundle = {
    termProject: {
      title: 'CPU Scheduling Simulator',
      course: 'Operating Systems',
      instructor: 'Asst. Prof. Kingkarn Sookhanaphibarn',
      exportDate: new Date().toISOString(),
      teamMembers: members,
    },
    constraints: {
      arrivalTime: 'All processes AT = 0',
      initialSequence: 'P1 through Pn',
      formulas: {
        TAT: 'CT - AT (since AT=0, TAT = CT)',
        WT: 'TAT - BT',
        AVG_WT: 'Sum(WT) / Number of processes',
      },
      timeQuantumForRR: quantum,
    },
    inputs: processes.map((p) => ({
      processId: p.id,
      burstTime: p.burstTime,
      arrivalTime: p.arrivalTime,
    })),
    simulationResults: {
      fcfs: {
        avgWaitingTime: outputs.fcfs.avgWaitingTime,
        avgTurnaroundTime: outputs.fcfs.avgTurnaroundTime,
        table: outputs.fcfs.processes,
        gantt: outputs.fcfs.gantt,
        stepLogs: outputs.fcfs.stepLogs,
      },
      sjf: {
        avgWaitingTime: outputs.sjf.avgWaitingTime,
        avgTurnaroundTime: outputs.sjf.avgTurnaroundTime,
        table: outputs.sjf.processes,
        gantt: outputs.sjf.gantt,
        stepLogs: outputs.sjf.stepLogs,
      },
      roundRobin: {
        quantum,
        avgWaitingTime: outputs.rr.avgWaitingTime,
        avgTurnaroundTime: outputs.rr.avgTurnaroundTime,
        table: outputs.rr.processes,
        gantt: outputs.rr.gantt,
        stepLogs: outputs.rr.stepLogs,
      },
    },
    // The requested core logic: underlying algorithm implementation source code
    underlyingCalculationCode: {
      fcfsImplementation: FCFS_SOURCE_CODE,
      sjfImplementation: SJF_SOURCE_CODE,
      roundRobinImplementation: RR_SOURCE_CODE,
      srtfImplementation: SRTF_SOURCE_CODE,
      explanation:
        'โค้ดชุดนี้คือเบื้องหลังการคำนวณตัวเลข ST, CT, TAT, WT ทั้งหมด เพื่อใช้ตรวจสอบความโปร่งใสและแสดงความเข้าใจอย่างแท้จริงในโครงงาน',
    },
  };

  const jsonString = JSON.stringify(exportBundle, null, 2);

  // Build Markdown Report
  const markdownReport = `# รายงานผลการจำลอง CPU Scheduling Simulator
วิชา: Operating Systems | อาจารย์ผู้สอน: ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล
วันที่ส่งออก: ${new Date().toLocaleDateString('th-TH')}

## 1. ข้อมูลสมาชิกในกลุ่ม
${members.map((m) => `- **${m.name}** (${m.studentId}) — ${m.roleTitle}`).join('\n')}

## 2. ข้อมูลนำเข้า (Input Processes)
| Process | Burst Time (ms) | Arrival Time (AT) |
|---|---|---|
${processes.map((p) => `| ${p.id} | ${p.burstTime} | ${p.arrivalTime} |`).join('\n')}

## 3. สรุปเปรียบเทียบผลลัพธ์ (Comparison Summary)
| อัลกอริทึม | AVG Waiting Time (WT) | AVG Turnaround Time (TAT) | จำนวนช่วงรัน (Slices) |
|---|---|---|---|
| FCFS | ${outputs.fcfs.avgWaitingTime} ms | ${outputs.fcfs.avgTurnaroundTime} ms | ${outputs.fcfs.gantt.length} |
| SJF (Non-preemptive) | ${outputs.sjf.avgWaitingTime} ms | ${outputs.sjf.avgTurnaroundTime} ms | ${outputs.sjf.gantt.length} |
| Round Robin (Q=${quantum}) | ${outputs.rr.avgWaitingTime} ms | ${outputs.rr.avgTurnaroundTime} ms | ${outputs.rr.gantt.length} |

## 4. โค้ดเบื้องหลังอัลกอริทึม Round Robin (Core Logic)
\`\`\`typescript
${RR_SOURCE_CODE}
\`\`\`
`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'json' ? jsonString : activeTab === 'markdown' ? markdownReport : RR_SOURCE_CODE;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let content = jsonString;
    let filename = `cpu_scheduling_simulation_${Date.now()}.json`;
    let type = 'application/json';

    if (activeTab === 'markdown') {
      content = markdownReport;
      filename = `cpu_scheduling_report_${Date.now()}.md`;
      type = 'text/markdown';
    } else if (activeTab === 'code') {
      content = `// Source Code Behind Calculations\n\n// 1. FCFS\n${FCFS_SOURCE_CODE}\n\n// 2. SJF\n${SJF_SOURCE_CODE}\n\n// 3. Round Robin\n${RR_SOURCE_CODE}`;
      filename = `cpu_scheduling_algorithms_${Date.now()}.ts`;
      type = 'text/typescript';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">Export &amp; Code Inspector</div>
            <h2 className="text-lg font-bold text-white">ส่งออกผลลัพธ์พร้อมซอร์สโค้ดเบื้องหลังการคำนวณ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800 bg-slate-900/40">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>Full JSON Bundle (รวมผล + โค้ด)</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'markdown'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Markdown Report (สำหรับรายงาน/สไลด์)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>ซอร์สโค้ดเฉพาะส่วน (Round Robin Engine)</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="p-5 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap select-all leading-relaxed">
            {activeTab === 'json' && jsonString}
            {activeTab === 'markdown' && markdownReport}
            {activeTab === 'code' && RR_SOURCE_CODE}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="text-xs text-slate-400">
            {activeTab === 'json' && 'ไฟล์ JSON จะแนบทั้งตัวเลขผลลัพธ์และโค้ดฟังก์ชันเบื้องหลังครบถ้วน'}
            {activeTab === 'markdown' && 'สามารถคัดลอกไปใส่ใน README.md หรือเอกสารรายงานวิชาได้ทันที'}
            {activeTab === 'code' && 'โค้ดจริงที่ใช้รันอัลกอริทึม Round Robin ในโปรเจกต์นี้'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอก (Copy)'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดไฟล์ (Download)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
