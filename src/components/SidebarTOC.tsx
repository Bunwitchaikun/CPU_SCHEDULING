/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Github,
  ListTree,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

export interface TocSubItem {
  id: string;
  subNumber: string;
  title: string;
}

export interface TocItem {
  id: string;
  step: string;
  title: string;
  sub: string;
  subItems: TocSubItem[];
}

export const TOC_SECTIONS: TocItem[] = [
  {
    id: 'simulator',
    step: '01',
    title: 'ตัวจำลอง CPU',
    sub: 'Interactive Sandbox',
    subItems: [
      { id: 'sim-config', subNumber: '1.1', title: 'ข้อมูลโปรเซส & Burst Time' },
      { id: 'sim-controls', subNumber: '1.2', title: 'ผลการจำลอง 4 อัลกอริทึม' },
      { id: 'sim-gantt', subNumber: '1.3', title: 'ผังแกนต์ชาร์ต (Gantt Chart)' },
      { id: 'sim-detail', subNumber: '1.4', title: 'ตารางผลลัพธ์ละเอียด (CT, TAT, WT)' },
      { id: 'sim-slices', subNumber: '1.5', title: 'การทำงานทีละช่วง & BT เหลือ' },
      { id: 'sim-code-behind', subNumber: '1.6', title: 'โค้ดเบื้องหลังในการได้มาซึ่งคำตอบ' },
    ],
  },
  {
    id: 'overview',
    step: '02',
    title: 'คู่มือโปรเจกต์',
    sub: 'Objective & Theory',
    subItems: [
      { id: 'overview-rules', subNumber: '2.1', title: 'กติกาและเงื่อนไขเริ่มต้น (AT=0)' },
      { id: 'overview-theory', subNumber: '2.2', title: 'สูตรคำนวณมาตรฐาน (TAT, WT, AVG)' },
      { id: 'overview-members', subNumber: '2.3', title: 'รายนามสมาชิกกลุ่ม & บทบาทหน้าที่' },
      { id: 'overview-files', subNumber: '2.4', title: 'โครงสร้างไฟล์และหน้าที่ของแต่ละโมดูล' },
    ],
  },
  {
    id: 'code-walkthrough',
    step: '03',
    title: 'โค้ดเบื้องหลัง',
    sub: 'scheduler.js Engine',
    subItems: [
      { id: 'code-fcfs', subNumber: '3.1', title: 'First-Come First-Served (FCFS)' },
      { id: 'code-sjf', subNumber: '3.2', title: 'SJF Non-preemptive Engine' },
      { id: 'code-rr', subNumber: '3.3', title: 'Round Robin (Time Slicing)' },
      { id: 'code-srtf', subNumber: '3.4', title: 'SJF Preemptive (SRTF Engine)' },
      { id: 'code-finish', subNumber: '3.5', title: 'การคำนวณสถิติและผลลัพธ์ finish()' },
    ],
  },
  {
    id: 'verification',
    step: '04',
    title: 'ชุดทดสอบ & คำนวณมือ',
    sub: '3 Cases & Math Proof',
    subItems: [
      { id: 'verify-case1', subNumber: '4.1', title: 'กรณีที่ 1: กำหนด Burst Time เอง (6, 8, 7, 3)' },
      { id: 'verify-case2', subNumber: '4.2', title: 'กรณีที่ 2: สุ่มค่า Burst Time (1–20)' },
      { id: 'verify-case3', subNumber: '4.3', title: 'กรณีที่ 3: Extreme Burst Time (หลักร้อย)' },
      { id: 'verify-hand-proof', subNumber: '4.4', title: 'ตารางพิสูจน์การคำนวณมือ 100%' },
    ],
  },
  {
    id: 'experiment-logs',
    step: '05',
    title: 'บันทึกผลจริง',
    sub: 'Team Member Logs',
    subItems: [
      { id: 'logs-history', subNumber: '5.1', title: 'ตารางบันทึกผลการทดสอบจริง' },
      { id: 'logs-fixes', subNumber: '5.2', title: 'สรุปปัญหา/บั๊กและการแก้ไข' },
    ],
  },
  {
    id: 'video-presentation',
    step: '06',
    title: 'VDO นำเสนอ',
    sub: 'Project Video Demo',
    subItems: [
      { id: 'vdo-demo', subNumber: '6.1', title: 'วิดีโอ 1: สาธิตโปรแกรมและการคำนวณ' },
      { id: 'vdo-ai', subNumber: '6.2', title: 'วิดีโอ 2: กระบวนการใช้ AI & การแก้ปัญหา' },
      { id: 'vdo-criteria', subNumber: '6.3', title: 'รายการหัวข้อสำคัญที่นำเสนอ' },
    ],
  },
  {
    id: 'ai-collaboration',
    step: '07',
    title: 'การใช้ AI',
    sub: 'AI Transparency Logs',
    subItems: [
      { id: 'ai-phases', subNumber: '7.1', title: 'ผัง 5 ขั้นตอนการใช้ AI อย่างเป็นระบบ' },
      { id: 'ai-prompts', subNumber: '7.2', title: 'คลัง Prompt จริงและผลลัพธ์การใช้งาน' },
      { id: 'ai-ethics', subNumber: '7.3', title: 'ความโปร่งใสและจริยธรรมทางวิชาการ' },
    ],
  },
];

interface SidebarTOCProps {
  activeId: string;
  activeSubId?: string;
  onSelectSection: (id: string) => void;
  onSelectSubItem?: (subId: string) => void;
  onDownloadProgram: () => void;
}

export const SidebarTOC: React.FC<SidebarTOCProps> = ({
  activeId,
  activeSubId,
  onSelectSection,
  onSelectSubItem,
  onDownloadProgram,
}) => {
  // Store expanded state per section. Default active section open.
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      simulator: true,
      overview: false,
      'code-walkthrough': false,
      verification: false,
      'experiment-logs': false,
      'video-presentation': false,
      'ai-collaboration': false,
    };
    if (activeId) {
      initial[activeId] = true;
    }
    return initial;
  });

  // Auto-expand section when activeId changes
  useEffect(() => {
    if (activeId) {
      setExpandedSections((prev) => ({
        ...prev,
        [activeId]: true,
      }));
    }
  }, [activeId]);

  const toggleSection = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    TOC_SECTIONS.forEach((s) => {
      allExpanded[s.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  const handleCollapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    TOC_SECTIONS.forEach((s) => {
      allCollapsed[s.id] = false;
    });
    setExpandedSections(allCollapsed);
  };

  const allAreExpanded = TOC_SECTIONS.every((s) => expandedSections[s.id]);

  const currentIndex = Math.max(
    0,
    TOC_SECTIONS.findIndex((s) => s.id === activeId)
  );
  const activeStep = TOC_SECTIONS[currentIndex]?.step || '01';

  const handleSubClick = (subId: string, parentId: string) => {
    if (onSelectSubItem) {
      onSelectSubItem(subId);
    } else {
      const el = document.getElementById(subId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        onSelectSection(parentId);
      }
    }
  };

  return (
    <aside className="w-full lg:sticky lg:top-20 z-20">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs max-h-[calc(100vh-5.5rem)] flex flex-col">
        {/* Header matching image_32d35ef9.png */}
        <div className="border-b border-slate-100 pb-3 mb-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold font-mono uppercase tracking-widest text-slate-400">
              STICKY TOC
            </div>
            <button
              type="button"
              onClick={allAreExpanded ? handleCollapseAll : handleExpandAll}
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
              title={allAreExpanded ? 'ย่อเรื่องย่อยทั้งหมด' : 'ขยายเรื่องย่อยทั้งหมด'}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>{allAreExpanded ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด'}</span>
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-1">สารบัญการนำเสนอ</h3>
          <div className="flex items-center justify-between text-xs text-indigo-600 font-semibold mt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>กำลังอ่านส่วนที่ {activeStep} / 07</span>
            </span>
            <span className="font-mono text-slate-400 font-normal">CS422 Lab</span>
          </div>
        </div>

        {/* 7 Section Items with interactive Sub-topics toggles */}
        <nav
          className="space-y-1.5 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300"
          aria-label="Table of contents"
        >
          {TOC_SECTIONS.map((item) => {
            const isActive = activeId === item.id;
            const isExpanded = Boolean(expandedSections[item.id]);

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all ${
                  isActive
                    ? 'bg-indigo-50/70 border-indigo-200/90 shadow-2xs'
                    : 'bg-transparent border-transparent hover:bg-slate-50/90'
                }`}
              >
                {/* Main Item Row */}
                <div className="flex items-center justify-between p-1.5 sm:p-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSelectSection(item.id)}
                    className="flex-1 flex items-center gap-2.5 min-w-0 text-left cursor-pointer group"
                  >
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 group-hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.step}
                    </span>
                    <div className="truncate min-w-0">
                      <div
                        className={`text-sm leading-snug truncate transition-colors ${
                          isActive
                            ? 'font-bold text-indigo-950'
                            : 'font-medium text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono font-normal truncate">
                        {item.sub}
                      </div>
                    </div>
                  </button>

                  {/* Sub-item Toggle Button (▾ / ▸) */}
                  <button
                    type="button"
                    onClick={(e) => toggleSection(item.id, e)}
                    className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 ${
                      isActive ? 'text-indigo-600 hover:bg-indigo-100/70' : ''
                    }`}
                    title={isExpanded ? 'ย่อเรื่องย่อย' : 'กดเพื่อขยายเรื่องย่อย'}
                    aria-label={`Toggle subtopics for ${item.title}`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>

                {/* Sub-topics list (collapsible) */}
                {isExpanded && item.subItems && item.subItems.length > 0 && (
                  <div className="ml-5 pl-2.5 pb-2 pr-2 border-l-2 border-indigo-200/70 space-y-1 animate-in fade-in duration-150">
                    {item.subItems.map((sub) => {
                      const isSubActive = activeSubId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSubClick(sub.id, item.id)}
                          className={`w-full flex items-center justify-between text-left py-1 px-2 rounded-lg text-xs transition-colors cursor-pointer group ${
                            isSubActive
                              ? 'bg-indigo-100 text-indigo-950 font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-indigo-500 font-semibold shrink-0">
                              {sub.subNumber}
                            </span>
                            <span className="truncate">{sub.title}</span>
                          </span>
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Program Download & GitHub Actions inside Sidebar */}
        <div className="mt-3 pt-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Bunwitchaikun/CPU_SCHEDULING.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer active:scale-95 border border-slate-200"
              title="ดูซอร์สโค้ดโปรเจกต์บน GitHub (Bunwitchaikun/CPU_SCHEDULING)"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <button
              type="button"
              onClick={onDownloadProgram}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer active:scale-95"
              title="ดาวน์โหลดไฟล์ zip ของทั้งระบบ (CS422-CPU-Scheduling.zip)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด .zip</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1.5 leading-tight">
            มีไฟล์ HTML เปิดรันได้ทันทีแบบออฟไลน์ + โค้ด C++, Python และซอร์สโค้ดโปรเจกต์ครบถ้วน
          </p>
        </div>
      </div>
    </aside>
  );
};

