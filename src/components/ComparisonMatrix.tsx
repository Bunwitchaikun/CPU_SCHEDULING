/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Check, Layers, TrendingDown } from 'lucide-react';
import { SchedulingOutput } from '../types/simulator';

interface ComparisonMatrixProps {
  fcfs: SchedulingOutput;
  sjf: SchedulingOutput;
  rr: SchedulingOutput;
  srtf?: SchedulingOutput;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ fcfs, sjf, rr, srtf }) => {
  const algorithms = [
    { key: 'fcfs', data: fcfs, title: 'FCFS', desc: 'First-Come, First-Served' },
    { key: 'sjf', data: sjf, title: 'SJF', desc: 'Shortest Job First (Non-preemptive)' },
    { key: 'rr', data: rr, title: `Round Robin (Q=${rr.quantum || 2})`, desc: 'Time Slicing / FIFO Queue' },
  ];

  if (srtf) {
    algorithms.push({ key: 'srtf', data: srtf, title: 'SRTF (Preemptive SJF)', desc: 'Shortest Remaining Time First' });
  }

  // Find lowest AVG WT
  const lowestAvgWT = Math.min(...algorithms.map((a) => a.data.avgWaitingTime));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">การเปรียบเทียบผลลัพธ์จากชุดข้อมูลเดียวกัน</div>
          <h3 className="text-base font-semibold text-white">Algorithm Performance Comparison Matrix</h3>
        </div>
        <div className="text-xs text-slate-400">
          ประมวลผลด้วยชุดข้อมูลและ Burst Time เดียวกันเพื่อเปรียบเทียบประสิทธิภาพอย่างเป็นธรรม
        </div>
      </div>

      {/* Algorithm Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {algorithms.map((algo) => {
          const isWinner = algo.data.avgWaitingTime === lowestAvgWT;
          const contextSwitches = Math.max(0, algo.data.gantt.length - 1);

          return (
            <div
              key={algo.key}
              className={`rounded-xl p-4 border transition-all ${
                isWinner
                  ? 'bg-slate-950/80 border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{algo.title}</h4>
                  <div className="text-[11px] text-slate-400">{algo.desc}</div>
                </div>
                {isWinner && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    <Award className="w-3 h-3" />
                    <span>AVG WT ต่ำสุด</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">AVG WT</div>
                  <div className={`text-lg font-bold tabular-nums ${isWinner ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {algo.data.avgWaitingTime} <span className="text-xs font-normal text-slate-400">ms</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">AVG TAT</div>
                  <div className="text-lg font-bold tabular-nums text-slate-200">
                    {algo.data.avgTurnaroundTime} <span className="text-xs font-normal text-slate-400">ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-400" />
                  <span>สลับคิว (Slices):</span>
                </span>
                <span className="text-slate-200 font-semibold">{algo.data.gantt.length} ช่วง</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Detailed Process WT Comparison Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4">Process</th>
              <th className="py-2.5 px-4 text-right">Burst Time</th>
              <th className="py-2.5 px-4 text-right">WT: FCFS</th>
              <th className="py-2.5 px-4 text-right">WT: SJF</th>
              <th className="py-2.5 px-4 text-right">WT: RR (Q={rr.quantum})</th>
              <th className="py-2.5 px-4 text-right text-emerald-400">อัลกอริทึมที่รอสั้นสุด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200 bg-slate-950/40">
            {fcfs.processes.map((p, idx) => {
              const sjfP = sjf.processes.find((item) => item.id === p.id);
              const rrP = rr.processes.find((item) => item.id === p.id);
              const wtFCFS = p.waitingTime;
              const wtSJF = sjfP?.waitingTime ?? 0;
              const wtRR = rrP?.waitingTime ?? 0;

              let bestAlgo = 'SJF';
              const minWT = Math.min(wtFCFS, wtSJF, wtRR);
              if (minWT === wtFCFS && minWT === wtSJF) bestAlgo = 'FCFS / SJF';
              else if (minWT === wtFCFS) bestAlgo = 'FCFS';
              else if (minWT === wtSJF) bestAlgo = 'SJF';
              else bestAlgo = 'Round Robin';

              return (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-semibold text-white">{p.id}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">{p.burstTime} ms</td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-300">{wtFCFS} ms</td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-emerald-300 font-semibold">{wtSJF} ms</td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-amber-300">{wtRR} ms</td>
                  <td className="py-2.5 px-4 text-right font-medium text-emerald-400">
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{bestAlgo} ({minWT} ms)</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-950 font-bold border-t border-slate-800 text-xs text-white">
            <tr>
              <td className="py-3 px-4">ค่าเฉลี่ย (AVG WT)</td>
              <td className="py-3 px-4 text-right text-slate-500">-</td>
              <td className="py-3 px-4 text-right text-slate-200 tabular-nums">{fcfs.avgWaitingTime} ms</td>
              <td className="py-3 px-4 text-right text-emerald-300 tabular-nums">{sjf.avgWaitingTime} ms</td>
              <td className="py-3 px-4 text-right text-amber-300 tabular-nums">{rr.avgWaitingTime} ms</td>
              <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                {sjf.avgWaitingTime <= fcfs.avgWaitingTime && sjf.avgWaitingTime <= rr.avgWaitingTime
                  ? 'SJF ชนะเลิศ (Optimal AVG WT)'
                  : 'SJF / FCFS Optimal'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Theoretical Lesson Note */}
      <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-300 flex items-start gap-2.5">
        <TrendingDown className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white font-medium">ข้อสังเกตเชิงทฤษฎีตามบทเรียน OS:</strong> อัลกอริทึม <strong className="text-emerald-400">SJF</strong> ให้ค่า Average Waiting Time ต่ำที่สุดเสมอ (Provably Optimal) เนื่องจากจัดโปรเซสสั้นขึ้นก่อน แต่ <strong className="text-amber-400">Round Robin</strong> โดดเด่นในแง่ความยุติธรรมและ Response Time เหมาะกับระบบ Interactive แม้จะมี Context Switch เพิ่มขึ้นตาม Time Quantum
        </div>
      </div>
    </div>
  );
};
