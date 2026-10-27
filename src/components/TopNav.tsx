/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, BookOpen, Cpu, Download, Github } from 'lucide-react';

interface TopNavProps {
  activePage?: 'simulator' | 'rubric' | 'readme';
  onSelectPage?: (page: 'simulator' | 'rubric' | 'readme') => void;
  onQuickSimulate: () => void;
  onDownloadProgram: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activePage = 'simulator',
  onSelectPage,
  onQuickSimulate,
  onDownloadProgram,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0c1427] border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6 px-3 sm:px-6 py-2.5 sm:py-3.5">
        {/* Zone 1: Brand Wordmark & Primary View Tabs */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <button
            type="button"
            onClick={() => onSelectPage?.('simulator')}
            className="flex items-center gap-2 sm:gap-2.5 text-sm sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer text-left"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span>
              CPU Scheduling <span className="text-indigo-400 font-semibold">Lab</span>
            </span>
          </button>

          {/* Primary View Switcher Tabs (Simulator vs Rubric vs คู่มือ) */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => onSelectPage?.('simulator')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePage === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 shrink-0" />
              <span>การนำเสนอ</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPage?.('rubric')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePage === 'rubric'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="whitespace-nowrap">แบบประเมิน (100)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPage?.('readme')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activePage === 'readme'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="เปิดดูคู่มือการใช้งานและเอกสาร README.md"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="whitespace-nowrap">คู่มือ</span>
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop, only on simulator view) */}
        {activePage === 'simulator' && (
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-300">
            <a
              href="#simulator"
              className="hover:text-white transition-colors whitespace-nowrap"
            >
              ตัวจำลอง
            </a>
            <a
              href="#overview"
              className="hover:text-white transition-colors whitespace-nowrap"
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
        )}

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/Bunwitchaikun/CPU_SCHEDULING.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition-all shadow-xs whitespace-nowrap cursor-pointer active:scale-95"
            title="ดูซอร์สโค้ดโปรเจกต์บน GitHub (Bunwitchaikun/CPU_SCHEDULING)"
            aria-label="GitHub Repository"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden md:inline">GitHub</span>
          </a>
          <button
            type="button"
            onClick={onDownloadProgram}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer active:scale-95"
            title="ดาวน์โหลดไฟล์ zip ของทั้งระบบ (CS422-CPU-Scheduling.zip) พร้อมไฟล์ HTML รันออฟไลน์ได้ทันที และโค้ด C++/Python"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ดาวน์โหลดโปรแกรม (.zip)</span>
            <span className="sm:hidden">.zip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
