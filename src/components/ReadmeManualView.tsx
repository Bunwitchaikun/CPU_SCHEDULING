/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileCode,
  Download,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Users,
  CheckCircle2,
  Tv,
  Calculator,
  ShieldAlert,
  HardDrive,
  Github,
  PlayCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { README_RAW_CONTENT, README_CHAPTERS } from '../data/readmeContent';

interface ReadmeManualViewProps {
  onBackToSimulator: () => void;
}

export const ReadmeManualView: React.FC<ReadmeManualViewProps> = ({
  onBackToSimulator,
}) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChapter, setActiveChapter] = useState<string>('intro');

  // Handle Download README.md
  const handleDownloadReadme = () => {
    const blob = new Blob([README_RAW_CONTENT], {
      type: 'text/markdown;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'README.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Copy Raw Markdown
  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(README_RAW_CONTENT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = README_RAW_CONTENT;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Smooth scroll to chapter
  const handleJumpToChapter = (chapterId: string) => {
    setActiveChapter(chapterId);
    const element = document.getElementById(`doc-${chapterId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Split lines for Raw View
  const rawLines = useMemo(() => README_RAW_CONTENT.split('\n'), []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* 1. Sticky Action Header */}
      <header className="sticky top-[57px] sm:top-[65px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            {/* Title & Context */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToSimulator}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shrink-0"
                title="กลับไปยังหน้าจำลองหลัก"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-600 shrink-0" />
                    <span>คู่มือการใช้งาน & เอกสารระบบ (README.md)</span>
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded-md">
                    v1.0.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans hidden sm:block">
                  เอกสารคู่มือฉบับสมบูรณ์ พร้อมสรุปทฤษฎี โครงสร้างโค้ด และขั้นตอนการเปิดใช้งาน
                </p>
              </div>
            </div>

            {/* Actions: View Switcher + Copy + Download */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Formatted vs Raw Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/90">
                <button
                  type="button"
                  onClick={() => setViewMode('formatted')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'formatted'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                  <span>จัดรูปเล่มสวยงาม</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'raw'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>โค้ดดิบ (Raw)</span>
                </button>
              </div>

              {/* Copy Markdown Button */}
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/90 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                title="คัดลอกเนื้อหา Markdown ทั้งหมดลงคลิปบอร์ด"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>คัดลอก Markdown</span>
                  </>
                )}
              </button>

              {/* Download README.md Button */}
              <button
                type="button"
                onClick={handleDownloadReadme}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
                title="ดาวน์โหลดไฟล์ README.md ตรงลงเครื่อง"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด README.md</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {viewMode === 'formatted' ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Quick Chapter Navigation (Desktop Sticky) */}
            <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-36 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                <Layers className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  สารบัญหัวข้อในคู่มือ
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาในคู่มือ..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              {/* Chapters list */}
              <nav className="space-y-1">
                {README_CHAPTERS.map((ch) => {
                  const isActive = activeChapter === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleJumpToChapter(ch.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate">
                        <div className="text-[10px] text-slate-400 font-mono">{ch.tag}</div>
                        <div className="truncate">{ch.title}</div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href="https://github.com/Bunwitchaikun/CPU_SCHEDULING.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Repository</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </aside>

            {/* Right Column: Formatted Manual Document */}
            <main className="flex-1 min-w-0 space-y-8 w-full">
              {/* Chapter 01: Hero & Intro */}
              <section id="doc-intro" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-36">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>CPU Scheduling Simulator & Visualizer v1.0.0</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  ระบบจำลองและวิเคราะห์การจัดคิวหน่วยประมวลผลกลาง
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  แพลตฟอร์มการเรียนรู้และทดลองปฏิบัติการเรื่อง <strong>CPU Scheduling Algorithms</strong> พัฒนาขึ้นสำหรับรายวิชา <strong>ระบบปฏิบัติการ (Operating Systems - CS422)</strong> มหาวิทยาลัยกรุงเทพ ภายใต้การดูแลและให้คำปรึกษาโดย <strong>ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล</strong>
                </p>

                {/* Video Presentations Cards */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-red-500" />
                    <span>วิดีโอนำเสนอผลงาน (YouTube)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <a
                      href="https://youtu.be/unWcTIsrMGI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-xl bg-red-50/50 hover:bg-red-50 border border-red-200/80 transition-all flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-red-950 group-hover:text-red-700 flex items-center gap-1">
                          <span>Part 1 · สาธิตโปรแกรม & สถาปัตยกรรม</span>
                          <ExternalLink className="w-3 h-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-red-800/80 mt-0.5 line-clamp-2">
                          อธิบายการทำงานของ 4 อัลกอริทึม ผังแกนต์ชาร์ต และการสุ่มข้อมูล
                        </div>
                      </div>
                    </a>

                    <a
                      href="https://youtu.be/UMgsffcb5eg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-xl bg-purple-50/50 hover:bg-purple-50 border border-purple-200/80 transition-all flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-purple-950 group-hover:text-purple-700 flex items-center gap-1">
                          <span>Part 2 · เบื้องหลังการใช้ AI ช่วยพัฒนา</span>
                          <ExternalLink className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-purple-800/80 mt-0.5 line-clamp-2">
                          เปิดเผยกระบวนการใช้ AI พรอมต์ วิธีการตรวจสอบ และจริยธรรม
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </section>

              {/* Chapter 02: Core Features */}
              <section id="doc-features" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-36">
                <div className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Chapter 02 · Functional Capabilities
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <span>คุณสมบัติเด่นของระบบจำลอง</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>4 Classical CPU Scheduling Algorithms</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                      <li><strong>FCFS</strong>: First-Come, First-Served ตามลำดับมาถึง</li>
                      <li><strong>SJF Non-Preemptive</strong>: รันงานสั้นที่สุดจนเสร็จสิ้น</li>
                      <li><strong>SJF Preemptive / SRTF</strong>: แย่งชิงเมื่อมีงานที่สั้นกว่า</li>
                      <li><strong>Round Robin (RR)</strong>: แบ่งเวลาตาม Time Quantum ($q$)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Interactive Gantt Chart Visualizer</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                      <li>ผังแกนต์ชาร์ตต่อเนื่อง แสดงช่วงเวลาทำงานและเวลาว่าง [IDLE] ชัดเจน</li>
                      <li>ปุ่มควบคุม Play, Pause, Step Forward/Backward ทีละช่วงเวลา</li>
                      <li>สไลเดอร์ปรับความเร็วการเล่น (0.25x – 4.0x)</li>
                      <li>แสดง Time Slice และ Remaining Burst Time แบบเรียลไทม์</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Mathematical Verification & Formulas</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                      <li>การ์ดคำนวณและแสดงขั้นตอนคณิตศาสตร์ทีละโปรเซสอย่างโปร่งใส</li>
                      <li>คำนวณ $ST, CT, TAT, WT, RT$ ครบถ้วนทุกโปรเซส</li>
                      <li>คำนวณสรุปค่าเฉลี่ย AWT และ ATAT แม่นยำตรงตามทฤษฎี 100%</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span>Offline Export & Code Generator</span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                      <li>ดาวน์โหลดไฟล์ HTML จำลองเดี่ยว รันออฟไลน์ได้โดยไม่ต้องต่อเน็ต</li>
                      <li>สร้างซอร์สโค้ดภาษา <strong>C++</strong> และ <strong>Python</strong> พร้อมชุดข้อมูลจริง</li>
                      <li>บันทึกแพ็กเกจสมบูรณ์ (.ZIP) ทั้งโปรเจกต์ในคลิกเดียว</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Chapter 03: Theory & Formulas */}
              <section id="doc-theory" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-36">
                <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Chapter 03 · Mathematical Foundations
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <span>ทฤษฎีและสูตรคำนวณมาตรฐาน</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                  ในระบบประมวลผล Short-term CPU Scheduler จะตัดสินใจมอบหมาย CPU ให้กับโปรเซสที่อยู่ใน Ready Queue ตามเงื่อนไขและสูตรคณิตศาสตร์ดังต่อไปนี้:
                </p>

                {/* Formula Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Start Time (ST)</div>
                    <div className="text-base font-bold font-mono text-indigo-700">ST = First CPU Unit</div>
                    <div className="text-[11px] text-slate-500 mt-1">เวลาที่โปรเซสเริ่มได้รับ CPU เป็นครั้งแรก</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Completion Time (CT)</div>
                    <div className="text-base font-bold font-mono text-indigo-700">CT = Finish Unit</div>
                    <div className="text-[11px] text-slate-500 mt-1">เวลาที่โปรเซสทำงานเสร็จสิ้นทั้งหมด</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Turnaround Time (TAT)</div>
                    <div className="text-base font-bold font-mono text-emerald-700">TAT = CT - AT</div>
                    <div className="text-[11px] text-slate-500 mt-1">เวลาตั้งแต่มาถึงจนทำงานเสร็จสิ้น</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Waiting Time (WT)</div>
                    <div className="text-base font-bold font-mono text-emerald-700">WT = TAT - BT</div>
                    <div className="text-[11px] text-slate-500 mt-1">เวลารวมทั้งหมดที่รอคอยอยู่ใน Ready Queue</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Response Time (RT)</div>
                    <div className="text-base font-bold font-mono text-amber-700">RT = ST - AT</div>
                    <div className="text-[11px] text-slate-500 mt-1">เวลาตั้งแต่มาถึงจนเริ่มได้รับการตอบสนองแรก</div>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200/80">
                    <div className="text-[11px] font-mono text-indigo-500 mb-1">Average Waiting Time</div>
                    <div className="text-base font-bold font-mono text-indigo-900">AWT = (Σ WT) / n</div>
                    <div className="text-[11px] text-indigo-700/80 mt-1">ค่าเฉลี่ยเวลารอคอยของทุกโปรเซส</div>
                  </div>
                </div>

                {/* Preemptive vs Non-Preemptive Hierarchy Diagram */}
                <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="text-slate-400 mb-2">// แผนผังจำแนกประเภทอัลกอริทึม (Scheduling Taxonomy)</div>
                  <pre className="text-slate-200 leading-snug">
{`                   ┌─────────────────────────────────────────┐
                   │        CPU Scheduling Algorithms         │
                   └────────────────────┬────────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
       [ Non-Preemptive ]                                 [ Preemptive ]
  ┌─────────────────────────────┐               ┌─────────────────────────────┐
  │ • FCFS (Arrival order)       │               │ • SJF / SRTF (Remaining BT) │
  │ • SJF Non-Preemptive (Min BT)│               │ • Round Robin (Time Slice q)│
  └─────────────────────────────┘               └─────────────────────────────┘`}
                  </pre>
                </div>
              </section>

              {/* Chapter 04: Test Cases & Benchmark Matrix */}
              <section id="doc-testcases" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-36">
                <div className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
                  Chapter 04 · Verification Cases
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  <span>กรณีทดสอบมาตรฐาน Case 1, 2, 3 ตามเกณฑ์ Rubric</span>
                </h3>

                {/* Case 1 Table */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      กรณีที่ 1: กำหนด Burst Time เอง (P1=6, P2=8, P3=7, P4=3, Q=2)
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ตรวจสอบด้วยมือตรง 100%
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">อัลกอริทึม</th>
                          <th className="py-2.5 px-3">ลำดับการทำงาน</th>
                          <th className="py-2.5 px-3">Completion Time (CT)</th>
                          <th className="py-2.5 px-3 text-right">AVG WT</th>
                          <th className="py-2.5 px-3 text-right">AVG TAT</th>
                          <th className="py-2.5 px-3 text-center">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        <tr>
                          <td className="py-2 px-3 font-bold text-slate-800">FCFS</td>
                          <td className="py-2 px-3 text-slate-600">P1 → P2 → P3 → P4</td>
                          <td className="py-2 px-3 text-slate-600">P1:6, P2:14, P3:21, P4:24</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">10.25 ms</td>
                          <td className="py-2 px-3 text-right text-slate-600">16.25 ms</td>
                          <td className="py-2 px-3 text-center text-emerald-600 font-sans font-bold">ตรงตามสูตร</td>
                        </tr>
                        <tr className="bg-emerald-50/50">
                          <td className="py-2 px-3 font-bold text-emerald-800">SJF (Non-preemptive)</td>
                          <td className="py-2 px-3 text-slate-600">P4 → P1 → P3 → P2</td>
                          <td className="py-2 px-3 text-slate-600">P1:9, P2:24, P3:16, P4:3</td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-700">7.00 ms (ดีสุด)</td>
                          <td className="py-2 px-3 text-right text-slate-600">13.00 ms</td>
                          <td className="py-2 px-3 text-center text-emerald-600 font-sans font-bold">ตรงตามสูตร</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold text-slate-800">SJF (Preemptive / SRTF)</td>
                          <td className="py-2 px-3 text-slate-600">P4 → P1 → P3 → P2</td>
                          <td className="py-2 px-3 text-slate-600">P1:9, P2:24, P3:16, P4:3</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">7.00 ms</td>
                          <td className="py-2 px-3 text-right text-slate-600">13.00 ms</td>
                          <td className="py-2 px-3 text-center text-emerald-600 font-sans font-bold">ตรงตามสูตร</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-bold text-slate-800">Round Robin (q = 2)</td>
                          <td className="py-2 px-3 text-slate-600">13 ช่วงเวลา (หมุนเวียน q=2)</td>
                          <td className="py-2 px-3 text-slate-600">P1:17, P2:23, P3:24, P4:15</td>
                          <td className="py-2 px-3 text-right font-bold text-slate-900">13.75 ms</td>
                          <td className="py-2 px-3 text-right text-slate-600">19.75 ms</td>
                          <td className="py-2 px-3 text-center text-emerald-600 font-sans font-bold">ตรงตามสูตร</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Case 2 and Case 3 Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h5 className="font-bold text-xs text-slate-900 mb-1">
                      กรณีที่ 2: สุ่ม Burst Time (N=5)
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      ทดสอบการสุ่มค่า BT ช่วง 1–20 ตรวจสอบว่าระบบสามารถประมวลผลโปรเซสได้ครบถ้วนโดยไม่มีข้อผิดพลาด ไม่มีผลลัพธ์เป็น NaN และค่าตัวเลขทั้งหมดไม่ติดลบ
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <h5 className="font-bold text-xs text-slate-900 mb-1">
                      กรณีที่ 3: เปรียบเทียบ Time Quantum ใน RR
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      ใช้ชุดข้อมูลเดียวกันเปรียบเทียบค่า $Q=1$ (24 Slices, AWT 15.25), $Q=2$ (13 Slices, AWT 13.75) และ $Q=4$ (9 Slices, AWT 12.25) วิเคราะห์ผลกระทบของ Context Switching
                    </p>
                  </div>
                </div>
              </section>

              {/* Chapter 05: Tech Stack & Architecture */}
              <section id="doc-techstack" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-36">
                <div className="text-xs font-mono font-bold text-sky-600 uppercase tracking-wider mb-1">
                  Chapter 05 · Architecture & Stack
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-600" />
                  <span>เทคโนโลยีและโครงสร้างไดเรกทอรี</span>
                </h3>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 font-semibold">
                    React 19
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 font-semibold">
                    TypeScript 5.7
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 font-semibold">
                    Vite 6
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 font-semibold">
                    Tailwind CSS v4
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 font-semibold">
                    Lucide React
                  </span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 font-semibold">
                    JSZip
                  </span>
                </div>

                {/* Directory Tree */}
                <div className="bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="text-slate-400 mb-1">// โครงสร้างไฟล์หลักภายในโปรเจกต์</div>
                  <pre className="text-slate-200 leading-snug">
{`src/
├── main.tsx                   # React DOM root entry point
├── App.tsx                    # Main container, active tab state, top navbar
├── index.css                  # Tailwind CSS root imports and theme tokens
├── types/
│   └── simulator.ts           # Type definitions (Process, SimulationResult, Step)
├── data/
│   ├── initialData.ts         # Default process workloads, team data, rubric criteria
│   └── readmeContent.ts       # Raw documentation content & chapter outlines
├── utils/
│   ├── algorithms.ts          # Core scheduling engines (FCFS, SJF, SRTF, RR)
│   └── schedulerGenerator.ts  # Dynamic code generation (HTML offline, C++, Python)
└── components/
    ├── TopNav.tsx             # Sticky navbar with tab switcher (Simulator, Rubric, คู่มือ)
    ├── SimulatorSection.tsx   # Process inputs, Gantt chart, metrics table & multi-RR
    ├── RubricScorecard.tsx    # 100-point academic rubric scorecard with PDF print
    ├── ReadmeManualView.tsx   # Interactive documentation & README download view
    ├── ManualVerification.tsx # Step-by-step mathematical proof walkthrough cards
    ├── CodeWalkthrough.tsx    # Multi-language algorithm source code viewer
    └── SidebarTOC.tsx         # Sticky table of contents side navigation`}
                  </pre>
                </div>
              </section>

              {/* Chapter 06: Installation & Quick Start */}
              <section id="doc-quickstart" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-36">
                <div className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Chapter 06 · Getting Started
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  <span>คู่มือการติดตั้งและเปิดใช้งานโปรแกรม</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      1. ข้อกำหนดเบื้องต้น (Prerequisites)
                    </h4>
                    <p className="text-xs text-slate-600">
                      ติดตั้ง <strong>Node.js</strong> เวอร์ชัน 18.0.0 ขึ้นไป และ <strong>npm</strong> เวอร์ชัน 9.0.0 ขึ้นไป
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      2. คำสั่งรันในเครื่อง (Local Development)
                    </h4>
                    <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-3 border border-slate-800">
                      <div>
                        <div className="text-slate-400">// โคลนโปรเจกต์จาก GitHub</div>
                        <div className="text-emerald-400">git clone https://github.com/Bunwitchaikun/CPU_SCHEDULING.git</div>
                        <div className="text-emerald-400">cd CPU_SCHEDULING</div>
                      </div>
                      <div>
                        <div className="text-slate-400">// ติดตั้ง Dependencies</div>
                        <div className="text-emerald-400">npm install</div>
                      </div>
                      <div>
                        <div className="text-slate-400">// เริ่มต้นรัน Dev Server</div>
                        <div className="text-emerald-400">npm run dev</div>
                      </div>
                    </div>
                  </div>

                  {/* Offline HTML card */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-2">
                    <div className="font-bold text-xs text-amber-900 flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-amber-600" />
                      <span>การเปิดใช้งานแบบ Standalone Offline HTML (ไม่ต้องลง Node.js)</span>
                    </div>
                    <ol className="text-xs text-amber-800/90 list-decimal pl-4 space-y-1">
                      <li>กดปุ่ม <strong>"ดาวน์โหลดโปรแกรม (ZIP)"</strong> บนแถบเมนูด้านบน</li>
                      <li>เลือก <strong>"ดาวน์โหลดแพ็กเกจสมบูรณ์ (.ZIP)"</strong></li>
                      <li>แตกไฟล์ ZIP ออกมา แล้วดับเบิลคลิกไฟล์ <code>cpu_scheduler_offline.html</code></li>
                      <li>สามารถรันตัวจำลองได้ทันทีใน Google Chrome, Firefox, Safari หรือ Edge แม้ไม่ได้เชื่อมต่ออินเทอร์เน็ต!</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Chapter 07: Team & AI Ethics */}
              <section id="doc-team" className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-36">
                <div className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider mb-1">
                  Chapter 07 · Team & Ethics
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>คณะผู้จัดทำและการใช้ Generative AI อย่างโปร่งใส</span>
                </h3>

                <div className="mb-4 text-xs text-slate-600">
                  <strong>อาจารย์ผู้สอนและที่ปรึกษา:</strong> ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล (Asst. Prof. Dr. Kingkarn Sookhanaphibarn)
                </div>

                {/* Team Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">ชื่อ-นามสกุล</th>
                        <th className="py-2.5 px-3">รหัสนักศึกษา</th>
                        <th className="py-2.5 px-3">บทบาทและความรับผิดชอบหลัก</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          ธนสิทธิ์ บุญวิทย์ชัยกุล<br />
                          <span className="text-[11px] text-slate-500 font-normal">Tanasit Boonwitcheikun</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">1670701273</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <strong>Algorithm Engine Lead</strong>: พัฒนาและทดสอบตรรกะอัลกอริทึม FCFS, SJF-NP, SJF-P, RR รวมถึงการสลับงานและ Tie-breaking
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          ธรรมสรณ์ สุวลาภา<br />
                          <span className="text-[11px] text-slate-500 font-normal">Thammasorn Suwalapha</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">1670700291</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <strong>Frontend UI/UX Lead</strong>: ออกแบบผังแกนต์ชาร์ต ตัวควบคุมการเล่นทีละขั้นตอน และระบบเปรียบเทียบอัลกอริทึม
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          ณัชพล โพธิ์ตาก<br />
                          <span className="text-[11px] text-slate-500 font-normal">Natchaphon Photak</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">1670700242</td>
                        <td className="py-2.5 px-3 text-slate-600">
                          <strong>QA & Video Production Lead</strong>: จัดทำการ์ดตรวจสอบผลคำนวณมือ บันทึกวิดีโอนำเสนอทั้ง 2 ตอน และจัดทำเอกสารสรุป
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* AI Disclosure Card */}
                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                  <div className="font-bold text-xs text-purple-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>คำแถลงการใช้ Generative AI (AI Transparency Disclosure)</span>
                  </div>
                  <p className="text-xs text-purple-900/90 leading-relaxed">
                    โปรเจกต์นี้ใช้ Generative AI ในการช่วยแนะนำโครงร่าง UI และช่วยทบทวนไวยากรณ์ภาษา TypeScript แต่สูตรคำนวณ ตรรกะอัลกอริทึมทั้งหมด การตรวจสอบผลลัพธ์ด้วยมือ และผังแกนต์ชาร์ต ได้รับการตรวจสอบและยืนยันความถูกต้อง 100% โดยสมาชิกกลุ่มตามเกณฑ์จริยธรรมของมหาวิทยาลัย
                  </p>
                </div>
              </section>
            </main>
          </div>
        ) : (
          /* Raw Markdown View Mode */
          <div className="bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
            {/* Raw View Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sky-400">README.md</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono">{rawLines.length} บรรทัด</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono">{(README_RAW_CONTENT.length / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกทั้งหมด'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadReadme}
                  className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์</span>
                </button>
              </div>
            </div>

            {/* Monospace Code Editor View */}
            <div className="p-4 sm:p-6 overflow-x-auto max-h-[75vh] font-mono text-xs leading-relaxed selection:bg-sky-500/30">
              <table className="w-full">
                <tbody>
                  {rawLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="text-right pr-4 select-none text-slate-600 w-12 text-[11px] align-top">
                        {idx + 1}
                      </td>
                      <td className="text-slate-300 whitespace-pre font-mono break-all sm:break-normal">
                        {line || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
