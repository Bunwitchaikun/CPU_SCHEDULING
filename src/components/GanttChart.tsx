/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Pause, Clock, Zap } from 'lucide-react';
import { GanttBlock } from '../types/simulator';
import { getProcessPastel } from '../utils/algorithms';

interface GanttChartProps {
  blocks: GanttBlock[];
  totalTime: number;
  algorithmName?: string;
  unitLabel?: string;
  // Interactive Playback Controls matching image_33241f99.png and image_427dbd81.png
  currentTime?: number;
  onTimeChange?: (time: number) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onReset?: () => void;
  onStepBack?: () => void;
  onStepForward?: () => void;
  onJumpEnd?: () => void;
  playbackSpeed?: number;
  onChangeSpeed?: (speed: number) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  blocks,
  totalTime,
  algorithmName,
  unitLabel = 'หน่วย',
  currentTime = 0,
  onTimeChange,
  isPlaying = false,
  onTogglePlay,
  onReset,
  onStepBack,
  onStepForward,
  onJumpEnd,
  playbackSpeed = 1,
  onChangeSpeed,
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

  // Active block currently executing under the scrubber
  const activeBlock = blocks.find(
    (b) => currentTime >= b.startTime && currentTime < b.endTime
  );

  return (
    <div className="w-full space-y-3">
      {/* ====================================================================
          1. Interactive Playback & Stepper Control Bar (Soft Purple Background - สีม่วงอ่อน)
          ==================================================================== */}
      <div className="w-full bg-[#f5f3ff] border border-purple-200/90 rounded-2xl p-3.5 shadow-sm text-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Stepper Group & Play/Pause Button */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onReset}
            title="ย้อนกลับไปจุดเริ่มต้น (t = 0)"
            className="h-8 px-2.5 bg-white hover:bg-purple-100/80 active:scale-95 text-purple-950 border border-purple-200 rounded-lg font-mono text-xs font-bold transition-all shadow-2xs"
          >
            |&lt;
          </button>
          <button
            type="button"
            onClick={onStepBack}
            disabled={currentTime <= 0}
            title="ถอยหลัง 1 หน่วยเวลา"
            className="h-8 px-2.5 bg-white hover:bg-purple-100/80 disabled:opacity-40 disabled:hover:bg-white active:scale-95 text-purple-950 border border-purple-200 rounded-lg font-mono text-xs font-bold transition-all shadow-2xs"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            title={isPlaying ? 'หยุดการจำลองชั่วคราว' : 'เล่นจำลองการจัดสรรเวลา CPU'}
            className={`h-8 px-4 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center gap-1.5 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>หยุด (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>เล่น (Play)</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onStepForward}
            disabled={currentTime >= totalTime}
            title="ก้าวหน้า 1 หน่วยเวลา"
            className="h-8 px-2.5 bg-white hover:bg-purple-100/80 disabled:opacity-40 disabled:hover:bg-white active:scale-95 text-purple-950 border border-purple-200 rounded-lg font-mono text-xs font-bold transition-all shadow-2xs"
          >
            &gt;
          </button>
          <button
            type="button"
            onClick={onJumpEnd}
            title="ข้ามไปจนจบการจำลอง (Makespan)"
            className="h-8 px-2.5 bg-white hover:bg-purple-100/80 active:scale-95 text-purple-950 border border-purple-200 rounded-lg font-mono text-xs font-bold transition-all shadow-2xs"
          >
            &gt;|
          </button>

          {/* Speed Selector Pills */}
          {onChangeSpeed && (
            <div className="flex items-center gap-1 bg-white/90 border border-purple-200 rounded-lg p-0.5 ml-1 shadow-2xs">
              <span className="text-[10px] font-mono text-purple-700 px-1.5 flex items-center gap-1 font-semibold">
                <Zap className="w-2.5 h-2.5 text-amber-500" />
                <span>ความเร็ว:</span>
              </span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                    playbackSpeed === s
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-purple-900/70 hover:text-purple-950 hover:bg-purple-100/70'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: CPU Real-time Status Indicator Pill */}
        <div className="flex items-center gap-2 bg-white border border-purple-200/90 px-3.5 py-1.5 rounded-full shadow-2xs text-xs font-mono">
          <span className="relative flex h-2 w-2">
            {isPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                currentTime >= totalTime
                  ? 'bg-sky-500'
                  : activeBlock
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
            />
          </span>
          <span className="text-slate-800 font-medium">
            {currentTime >= totalTime ? (
              <span className="text-sky-700 font-semibold">
                CPU สถานะ: ประมวลผลเสร็จสิ้นทุกโปรเซส
              </span>
            ) : activeBlock ? (
              <span>
                CPU กำลังรัน:{' '}
                <strong className="text-emerald-700 font-bold">
                  {activeBlock.processId}
                </strong>{' '}
                <span className="text-slate-500 text-[11px]">
                  (ช่วง {activeBlock.startTime} → {activeBlock.endTime})
                </span>
              </span>
            ) : (
              <span className="text-amber-700 font-semibold">
                CPU สถานะ: ว่าง [IDLE]
              </span>
            )}
          </span>
        </div>

        {/* Right: Simulation Current Time Counter */}
        <div className="text-xs font-mono font-medium text-slate-800 bg-white border border-purple-200/90 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-purple-900/80">เวลาจำลอง:</span>
          <span className="text-purple-700 font-bold text-sm tabular-nums">{currentTime}</span>
          <span className="text-purple-300">/</span>
          <span className="text-slate-700 font-bold tabular-nums">{totalTime}</span>
          <span className="text-purple-600/80 text-[11px]">{unitLabel}</span>
        </div>
      </div>

      {/* ====================================================================
          2. Gantt Meta Header
          ==================================================================== */}
      <div className="flex flex-wrap items-end justify-between gap-2 pt-1">
        <div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">
            ผังแกนต์ชาร์ต {algorithmName ? `(${algorithmName})` : 'ลำดับการใช้ CPU'}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            คลิกที่แต่ละบล็อกเพื่อกระโดดเวลาไปยังจังหวะนั้น · เส้น Scrubber สีน้ำเงินแสดงตำแหน่งเวลาจำลองปัจจุบัน
          </p>
        </div>
        <div className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Makespan รวม <strong className="text-slate-800 font-bold">{totalTime}</strong> {unitLabel}
          {contextSwitches > 0 && (
            <span className="ml-2 pl-2 border-l border-slate-300">
              สลับคิว {contextSwitches} ครั้ง
            </span>
          )}
        </div>
      </div>

      {/* ====================================================================
          3. Main Gantt Track with Animated Scrubber Needle
          ==================================================================== */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 shadow-2xs">
        <div className="relative flex w-full items-stretch rounded-lg overflow-hidden border border-slate-200/80 divide-x divide-slate-200/80 select-none">
          {/* Scrubber vertical line needle */}
          {totalTime > 0 && (
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-150 ease-out"
              style={{
                left: `${Math.min(100, Math.max(0, (currentTime / totalTime) * 100))}%`,
              }}
            >
              {/* Vertical needle bar */}
              <div className="w-0.5 h-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.8)] -translate-x-1/2" />
              {/* Needle Top Badge - lowered to top-1.5 with full visibility and no clipping */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-md shadow-indigo-600/30 whitespace-nowrap">
                t = {currentTime}
              </div>
            </div>
          )}

          {blocks.map((block, idx) => {
            const pastel = getProcessPastel(block.processId);
            const widthPct = (block.duration / totalTime) * 100;
            const isHovered = hoveredIdx === idx;
            const isActive = currentTime >= block.startTime && currentTime < block.endTime;

            return (
              <div
                key={idx}
                onClick={() => onTimeChange?.(block.startTime)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  width: `${Math.max(widthPct, 4)}%`,
                  backgroundColor: pastel.bg,
                }}
                className={`relative py-4 sm:py-5 min-h-[68px] px-1.5 flex flex-col items-center justify-center transition-all cursor-pointer select-none text-center ${
                  isActive
                    ? 'ring-2 ring-indigo-600 z-10 brightness-105 shadow-inner'
                    : isHovered
                    ? 'ring-1 ring-slate-400 z-10 brightness-95 scale-[1.01]'
                    : 'hover:brightness-95'
                }`}
                title={`คลิกเพื่อเลื่อนเวลาไปที่ ${block.startTime} (${block.processId}: เริ่ม ${block.startTime} ถึง ${block.endTime})`}
              >
                {/* Active pulsating beacon indicator */}
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                )}

                {/* Process ID */}
                <span
                  style={{ color: pastel.text }}
                  className={`text-sm font-bold tracking-tight font-mono leading-tight ${
                    isActive ? 'scale-110 font-black transition-transform' : ''
                  }`}
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

        {/* Timeline numeric scale under Gantt Track */}
        <div className="flex justify-between font-mono text-[11px] text-slate-400 px-1 pt-1.5 select-none">
          <span>0</span>
          <span>{Math.round(totalTime * 0.25)}</span>
          <span>{Math.round(totalTime * 0.5)}</span>
          <span>{Math.round(totalTime * 0.75)}</span>
          <span>{totalTime}</span>
        </div>

        {/* Hovered summary detail callout */}
        {hoveredIdx !== null && blocks[hoveredIdx] && (
          <div className="mt-2.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 font-mono shadow-2xs animate-in fade-in">
            <span className="font-semibold text-slate-800">
              {blocks[hoveredIdx].processId}: ช่วงเวลา [{blocks[hoveredIdx].startTime} → {blocks[hoveredIdx].endTime}]
            </span>
            <span>
              ระยะเวลาใช้งาน: <strong className="text-indigo-600 font-bold">{blocks[hoveredIdx].duration}</strong> {unitLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
