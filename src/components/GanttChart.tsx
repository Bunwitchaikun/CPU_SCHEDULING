/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GanttBlock } from '../types/simulator';
import { getProcessPastel } from '../utils/algorithms';

interface GanttChartProps {
  blocks: GanttBlock[];
  totalTime: number;
  algorithmName?: string;
  unitLabel?: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  blocks,
  totalTime,
  algorithmName,
  unitLabel = 'หน่วย',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (blocks.length === 0 || totalTime === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-8 text-center text-slate-400 text-base">
        ยังไม่มีข้อมูล Gantt Chart
      </div>
    );
  }

  // Count context switches
  let contextSwitches = 0;
  for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].processId !== blocks[i - 1].processId) {
      contextSwitches++;
    }
  }

  return (
    <div className="w-full">
      {/* Top Header matching reference image */}
      <div className="flex flex-wrap items-end justify-between gap-2 mb-2">
        <div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            ลำดับการใช้ CPU
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            ช่องปรับตามสัดส่วนเวลาอ่านง่าย · อ่านเวลาจากช่วงเริ่ม-จบ ใต้แต่ละโปรเซส
          </p>
        </div>
        <div className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          เวลารวม <strong className="text-slate-800 font-bold">{totalTime}</strong> {unitLabel}
          {contextSwitches > 0 && (
            <span className="ml-2 pl-2 border-l border-slate-300">
              สลับคิว {contextSwitches} ครั้ง
            </span>
          )}
        </div>
      </div>

      {/* Main Gantt Block Strip (Clean Pastel Blocks) */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-2xs">
        <div className="flex w-full items-stretch rounded-lg overflow-hidden border border-slate-200/80 divide-x divide-slate-200/80">
          {blocks.map((block, idx) => {
            const pastel = getProcessPastel(block.processId);
            const widthPct = (block.duration / totalTime) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  width: `${Math.max(widthPct, 4)}%`,
                  backgroundColor: pastel.bg,
                }}
                className={`py-3 px-1.5 flex flex-col items-center justify-center transition-all cursor-pointer select-none text-center ${
                  isHovered ? 'ring-2 ring-indigo-500 z-10 brightness-95 scale-[1.01]' : 'hover:brightness-95'
                }`}
                title={`${block.processId}: เริ่ม ${block.startTime} ถึง ${block.endTime} (${block.duration} หน่วย)`}
              >
                {/* Process ID */}
                <span
                  style={{ color: pastel.text }}
                  className="text-sm font-bold tracking-tight font-mono leading-tight"
                >
                  {block.processId}
                </span>

                {/* Range [Start - End] */}
                <span
                  style={{ color: pastel.text }}
                  className="text-[11px] font-mono tabular-nums opacity-85 mt-0.5"
                >
                  {block.startTime}–{block.endTime}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hovered summary detail callout */}
        {hoveredIdx !== null && blocks[hoveredIdx] && (
          <div className="mt-2.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 font-mono shadow-2xs animate-in fade-in">
            <span className="font-semibold text-slate-800">
              {blocks[hoveredIdx].processId}: ช่วงเวลา [{blocks[hoveredIdx].startTime} → {blocks[hoveredIdx].endTime}]
            </span>
            <span>
              ระยะเวลาใช้งาน: <strong className="text-indigo-600 font-bold">{blocks[hoveredIdx].duration}</strong> หน่วย
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
