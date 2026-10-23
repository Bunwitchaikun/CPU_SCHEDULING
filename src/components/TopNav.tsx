/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, Download } from 'lucide-react';

interface TopNavProps {
  onQuickSimulate: () => void;
  onDownloadProgram: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onQuickSimulate, onDownloadProgram }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0c1427] border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#simulator"
          className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <span>
            CPU Scheduling <span className="text-indigo-400 font-semibold">Lab</span>
          </span>
        </a>

        {/* Zone 2: Fast Jump Navigation Links matching image_32d35ef9.png */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#simulator"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            ตัวจำลอง
          </a>
          <a
            href="#overview"
            className="text-white border-b-2 border-indigo-400 pb-0.5 font-semibold whitespace-nowrap"
          >
            คู่มือโปรเจกต์
          </a>
          <a
            href="#verification"
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            ชุดทดสอบ
          </a>
          <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded bg-slate-800 border border-slate-700 text-slate-400">
            CS422
          </span>
        </nav>

        {/* Mobile / Compact Nav Pills for smaller screens */}
        <div className="xl:hidden flex items-center gap-2 text-xs font-mono text-slate-400 overflow-x-auto py-1">
          <a href="#simulator" className="hover:text-white whitespace-nowrap">1.จำลอง</a>
          <span>·</span>
          <a href="#overview" className="hover:text-white whitespace-nowrap">2.คู่มือ</a>
          <span>·</span>
          <a href="#code-walkthrough" className="hover:text-white whitespace-nowrap">3.โค้ด</a>
          <span>·</span>
          <a href="#verification" className="hover:text-white whitespace-nowrap">4.ทดสอบ</a>
          <span>·</span>
          <a href="#experiment-logs" className="hover:text-white whitespace-nowrap">5.ผลจริง</a>
          <span>·</span>
          <a href="#video-presentation" className="hover:text-white whitespace-nowrap">6.VDO</a>
          <span>·</span>
          <a href="#ai-collaboration" className="text-indigo-400 font-bold whitespace-nowrap">7.AI</a>
        </div>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDownloadProgram}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer active:scale-95"
            title="ดาวน์โหลดไฟล์ zip ของทั้งระบบ (CS422-CPU-Scheduling.zip) พร้อมไฟล์ HTML รันออฟไลน์ได้ทันที และโค้ด C++/Python"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดโปรแกรม (.zip)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
