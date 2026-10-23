/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calculator } from 'lucide-react';
import { ProcessResult } from '../types/simulator';

interface ResultsTableProps {
  processes: ProcessResult[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  algorithmName?: string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  processes,
  avgWaitingTime,
  avgTurnaroundTime,
  algorithmName,
}) => {
  if (processes.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-8 text-center text-slate-400 text-base">
        ไม่มีข้อมูลผลลัพธ์
      </div>
    );
  }

  const totalBT = processes.reduce((acc, p) => acc + p.burstTime, 0);
  const totalTAT = processes.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const totalWT = processes.reduce((acc, p) => acc + p.waitingTime, 0);

  return (
    <div className="w-full">
      {/* Table Header Strip matching image_af6bd418.png */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-bold text-slate-900 tracking-tight">
          ผลลัพธ์รายโปรเซส
        </h4>
        <span className="text-xs font-mono text-slate-500">
          เรียงตาม P1–Pn · AT = 0 ทุกโปรเซส
        </span>
      </div>

      {/* Clean Full-Width Table Container without horizontal scrollbar */}
      <div className="w-full bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-slate-700 table-fixed">
          <thead>
            <tr className="border-b border-slate-200/90 bg-slate-50/70 text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 text-left w-1/6">Process</th>
              <th className="py-3 px-3 text-center w-1/6">BT</th>
              <th className="py-3 px-3 text-center w-1/6 text-amber-700">ST</th>
              <th className="py-3 px-3 text-center w-1/6 text-emerald-700">CT</th>
              <th className="py-3 px-3 text-center w-1/6">TAT</th>
              <th className="py-3 px-3 text-center w-1/6 text-indigo-700 font-bold">WT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm sm:text-base font-mono">
            {processes.map((proc) => (
              <tr key={proc.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/70 text-slate-800 text-sm">
                    {proc.id}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center tabular-nums text-slate-600 font-medium">
                  {proc.burstTime}
                </td>
                <td className="py-3.5 px-3 text-center tabular-nums text-amber-600 font-semibold">
                  {proc.startTime}
                </td>
                <td className="py-3.5 px-3 text-center tabular-nums text-emerald-600 font-semibold">
                  {proc.completionTime}
                </td>
                <td className="py-3.5 px-3 text-center tabular-nums text-slate-600 font-medium">
                  {proc.turnaroundTime}
                </td>
                <td className="py-3.5 px-3 text-center tabular-nums text-indigo-600 font-bold text-base">
                  {proc.waitingTime}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Summary Row */}
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50/90 text-sm sm:text-base font-mono font-bold text-slate-900">
              <td className="py-3.5 px-4 text-left font-sans">
                ผลรวม (Total)
              </td>
              <td className="py-3.5 px-3 text-center tabular-nums">
                {totalBT}
              </td>
              <td className="py-3.5 px-3 text-center text-slate-400 font-normal">-</td>
              <td className="py-3.5 px-3 text-center text-slate-400 font-normal">-</td>
              <td className="py-3.5 px-3 text-center tabular-nums text-slate-700">
                {totalTAT}
              </td>
              <td className="py-3.5 px-3 text-center tabular-nums text-indigo-600">
                {totalWT}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Average Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-t border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center gap-3.5 py-1 px-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Waiting Time (AVG WT)
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
                {avgWaitingTime}{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">หน่วยเวลา</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                = ผลรวม WT ({totalWT}) ÷ {processes.length} โปรเซส
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 py-1 px-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Turnaround Time (AVG TAT)
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
                {avgTurnaroundTime}{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">หน่วยเวลา</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                = ผลรวม TAT ({totalTAT}) ÷ {processes.length} โปรเซส
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
