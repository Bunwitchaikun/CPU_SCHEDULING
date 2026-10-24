/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, CheckCircle, Github, Users } from 'lucide-react';
import { TeamMember } from '../types/simulator';

interface ProjectOverviewProps {
  members: TeamMember[];
  onUpdateMembers?: (members: TeamMember[]) => void;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ members }) => {
  return (
    <section id="overview" className="scroll-mt-20 py-12 border-t border-slate-200">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl font-mono mb-3">
          <span>ส่วนที่ 2 · คู่มือโครงงานและหลักการทฤษฎี</span>
          <span aria-hidden="true">·</span>
          <span>ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
          วัตถุประสงค์และข้อกำหนดของ Term Project
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 max-w-4xl leading-relaxed mt-2.5">
          พัฒนาโปรแกรมจำลองการจัดสรรหน่วยประมวลผล (CPU Scheduling) เพื่อแสดงความเข้าใจเกี่ยวกับหลักการทำงาน การเขียนโปรแกรม และการเปรียบเทียบผลลัพธ์ของอัลกอริทึม{' '}
          <strong className="text-slate-900 font-semibold">FCFS</strong>,{' '}
          <strong className="text-slate-900 font-semibold">SJF (ทั้ง Non-preemptive และ Preemptive)</strong> และ{' '}
          <strong className="text-slate-900 font-semibold">Round Robin</strong> ตามเกณฑ์การประเมิน
        </p>
      </div>

      {/* Constraints & Formula Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div id="overview-rules" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs scroll-mt-24">
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold mb-2">
            <BookOpen className="w-4 h-4" />
            <span>กติกาและเงื่อนไขเริ่มต้น</span>
          </div>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <li>• ทุกโปรเซสเข้ามาพร้อมกัน: <span className="font-mono text-indigo-600 font-bold">Arrival Time (AT) = 0</span></li>
            <li>• ลำดับเริ่มต้นของโปรเซส: <span className="font-mono text-slate-800 font-bold">P1 ถึง Pn</span></li>
            <li>• Burst Time (BT) และ Time Quantum ต้องเป็น <span className="text-emerald-600 font-bold">จำนวนเต็มบวก (&gt; 0)</span></li>
          </ul>
        </div>

        <div id="overview-theory" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs scroll-mt-24">
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold mb-2">
            <CheckCircle className="w-4 h-4" />
            <span>สูตรคำนวณตามมาตรฐานวิชา</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 space-y-2 font-mono">
            <p><span className="text-slate-400">Turnaround:</span> TAT = CT - AT = <strong className="text-emerald-600">CT</strong></p>
            <p><span className="text-slate-400">Waiting Time:</span> WT = TAT - BT = <strong className="text-emerald-600">CT - BT</strong></p>
            <p><span className="text-slate-400">Average WT:</span> AVG WT = <strong className="text-emerald-600">∑(WT) ÷ n</strong></p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 text-sm font-bold mb-2">
            <Users className="w-4 h-4" />
            <span>นิยามเวลา ST &amp; CT</span>
          </div>
          <ul className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <li>• <strong className="text-slate-900 font-mono">ST (Start Time)</strong>: เวลาที่โปรเซสได้รับ CPU ครั้งแรกสุด</li>
            <li>• <strong className="text-slate-900 font-mono">CT (Completion Time)</strong>: เวลาที่โปรเซสทำงานเสร็จสิ้น</li>
            <li>• ใน Round Robin โปรเซสอาจได้ CPU หลายรอบ แต่ ST จะนับเฉพาะรอบแรก</li>
          </ul>
        </div>
      </div>

      {/* Team Members Matrix */}
      <div id="overview-members" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">รายชื่อสมาชิกและหน้าที่รับผิดชอบ</h3>
            <p className="text-xs text-slate-500 mt-0.5">แบ่งหน้าที่หลัก 3 ตำแหน่งตามข้อกำหนดของโครงงาน</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {members.map((m, idx) => (
            <div key={m.id} className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
                  ตำแหน่งที่ {idx + 1}: {m.roleScope}
                </div>
                <div className="mb-2">
                  <div className="text-base font-bold text-slate-900">{m.name}</div>
                  <div className="text-xs font-mono text-slate-500">{m.studentId}</div>
                </div>
                <div className="text-xs font-semibold text-indigo-700 mb-3">{m.roleTitle}</div>
              </div>

              <div className="border-t border-slate-200/80 pt-3">
                <div className="text-xs font-bold text-slate-700 mb-1.5">ขอบเขตงานที่รับผิดชอบ:</div>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  {m.responsibilities.map((r, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold shrink-0">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project File Architecture & Module Responsibilities (หน้าที่ของแต่ละไฟล์ในโปรเจกต์) */}
      <div id="overview-files" className="mt-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-md mb-2">
              <span>โครงสร้างไฟล์และสถาปัตยกรรมระบบ (File Architecture & Module Catalog)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              โครงสร้างและหน้าที่ของแต่ละไฟล์ในระบบ
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              แผนผังแสดงความรับผิดชอบของโมดูลในระบบ ตั้งแต่การรับข้อมูล (Input) การประมวลผล (Algorithm Engine) ไปจนถึงการแสดงผล (Visual Presentation)
            </p>
          </div>
          <a
            href="https://github.com/Bunwitchaikun/CPU_SCHEDULING.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-center cursor-pointer active:scale-95"
            title="ดูซอร์สโค้ดโปรเจกต์บน GitHub (Bunwitchaikun/CPU_SCHEDULING)"
          >
            <Github className="w-4 h-4 text-slate-800" />
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Data Pipeline Flow Banner matching image_68d0cd1d.png */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 sm:p-5 mb-8 shadow-inner">
          <div className="text-[11px] font-mono text-indigo-300 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ลำดับขั้นตอนการทำงาน: จากข้อมูลเข้าสู่ผลลัพธ์ (Data Pipeline Execution Flow)
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-200 font-medium">
            <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/10">ช่องกรอกข้อมูล</span>
            <span className="text-indigo-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/10">ตรวจจำนวนเต็มบวก (Validation)</span>
            <span className="text-indigo-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/10">สร้างโมเดลโปรเซส</span>
            <span className="text-indigo-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold">เลือกอัลกอริทึม (FCFS/SJF/SRTF/RR)</span>
            <span className="text-indigo-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/10">บันทึก ST และ CT</span>
            <span className="text-indigo-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-white border border-white/10">คำนวณ TAT, WT และ AVG WT</span>
            <span className="text-indigo-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold">แสดงตาราง ลำดับ CPU & ผัง Gantt</span>
          </div>
        </div>

        {/* File Responsibilities Table */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
            ตารางแสดงหน้าที่และความรับผิดชอบของแต่ละไฟล์ (File Responsibilities Matrix)
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4 w-1/3">ชื่อไฟล์ / โมดูล</th>
                  <th className="py-3 px-4 w-1/4">ประเภทและหมวดหมู่</th>
                  <th className="py-3 px-4">บทบาทหน้าที่และความรับผิดชอบในโครงงาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {/* Core App & Entry */}
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/App.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">State & Orchestrator</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    ศูนย์กลางควบคุม State หลักของโปรแกรม: รับค่าโปรเซส, บริหารการคำนวณอัลกอริทึม, เชื่อมต่อและประสานงานระหว่าง Component ทุกส่วน
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/main.tsx / index.html</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Entry Point & Shell</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    จุดเริ่มต้นในการเมานต์ React Application สู่ DOM และโครงสร้างพื้นฐานของหน้าเว็บตามมาตรฐาน HTML5
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/index.css</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200 font-medium">Global Styles</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    กำหนดสไตล์หลักทั้งระบบด้วย Tailwind CSS v4, Font Smoothing, Scrollbar และการตั้งค่าสีธีมสำหรับการแสดงผล
                  </td>
                </tr>

                {/* Algorithm & Engine */}
                <tr className="hover:bg-slate-50/70 transition-colors bg-indigo-50/30">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-900">src/utils/algorithms.ts</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300 font-bold">Core CPU Engine</span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium leading-relaxed">
                    หัวใจหลักของการคำนวณ: บรรจุตรรกะอัลกอริทึม FCFS, SJF (Non-preemptive), SRTF (Preemptive SJF), และ Round Robin (RR) พร้อมสร้าง Timeline สำหรับ Gantt Chart
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors bg-indigo-50/30">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-900">src/utils/schedulerGenerator.ts</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">Generator & Exporter</span>
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium leading-relaxed">
                    สร้างไฟล์ Standalone HTML สำหรับใช้งานออฟไลน์ 100%, สร้างซอร์สโค้ดภาษา C++ (<code className="text-slate-900">scheduler.cpp</code>), ภาษา Python (<code className="text-slate-900">scheduler.py</code>), และบีบอัดเป็นไฟล์ ZIP สำหรับส่งงาน
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/types/simulator.ts</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium">Type Definitions</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    นิยาม Data Model ด้วย TypeScript Interfaces: โครงสร้างของ Process, GanttBlock, SchedulingOutput, AlgorithmType เพื่อความถูกต้องและปลอดภัยของข้อมูล
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/data/testCases.ts</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">Standard Test Data</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    คลังชุดข้อมูลทดสอบมาตรฐาน 3 กรณีศึกษาตามข้อกำหนดอาจารย์ผู้สอน (เช่น Case 1: P1-P4 ค่า BT [6, 8, 7, 3]) สำหรับการกดทดสอบได้ทันที
                  </td>
                </tr>

                {/* UI Components */}
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/SimulatorSection.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">UI Component (ส่วนที่ 3)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    แผงควบคุมหลัก: กล่องกรอกข้อมูล Arrival Time (AT) และ Burst Time (BT) ปรับลดได้ทีละ 1, สลับเลือกอัลกอริทึม, ปรับ Time Quantum, และปุ่ม Preset
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/GanttChart.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">UI Component (ส่วนที่ 3)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    แสดงผังแกนต์ชาร์ต CPU Timeline แบบ Interactive, สเกลเวลาตัวเลข (Ruler Scale), แถบสีประจำโปรเซส, และปุ่ม Stepper จำลองทีละช่วงเวลา
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/ResultsTable.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">UI Component (ส่วนที่ 3)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    ตารางแสดงผลลัพธ์รายโปรเซส (PID, AT, BT, ST, CT, TAT, WT) พร้อมแสดงวิธีคำนวณแต่ละช่อง และคำนวณค่าเฉลี่ย AVG WT / AVG TAT อย่างละเอียด
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/SidebarTOC.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Navigation</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    แถบสารบัญด้านข้างแบบ Sticky ติดตามการเลื่อนหน้าจอ (Scrollspy) พร้อมเมนู Toggle ขยายหัวข้อย่อยทั้ง 7 ส่วน ให้อาจารย์และผู้ตรวจคลิกกระโดดข้ามส่วนได้ทันที
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/TopNav.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">Navigation</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    แถบนำทางส่วนหัวด้านบน ติดตั้งโลโก้ สัญลักษณ์วิชา CS422 ลิงก์กระโดดด่วน และปุ่ม "ดาวน์โหลดโปรแกรม (ZIP)"
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/ManualVerification.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">Verification (ส่วนที่ 4)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    ส่วนตรวจสอบความถูกต้องด้วยการคำนวณมือ (Manual Step-by-Step) ทั้ง 3 กรณีทดสอบ เพื่อยืนยันว่าโปรแกรมให้ผลลัพธ์ตรงกับทฤษฎี 100%
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/ComparisonMatrix.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">Comparison (ส่วนที่ 5)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    ตารางและกราฟเปรียบเทียบผลลัพธ์ทั้ง 4 อัลกอริทึม (FCFS, SJF, SRTF, RR) แบบ Head-to-Head พร้อมป้ายระบุอัลกอริทึมที่ให้ Waiting Time ต่ำที่สุด
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/RealExperimentLog.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-medium">Analysis (ส่วนที่ 6)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    บันทึกผลการทดลองจริง 3 กรณีศึกษาตามโจทย์ พร้อมบทวิเคราะห์จุดเด่น ข้อจำกัด ปรากฏการณ์ Convoy Effect และ Starvation
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/CodeWalkthrough.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">Source Walk (ส่วนที่ 7)</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    แสดงซอร์สโค้ดจริงของฟังก์ชันหลักทั้งหมด พร้อมคำอธิบายทีละฟังก์ชันเพื่อให้นักศึกษาและอาจารย์เปิดดูไส้ในของอัลกอริทึมได้ทันที
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/AITransparencySection.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">AI Disclosure</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    เอกสารเปิดเผยการใช้งาน AI อย่างโปร่งใสและมีจริยธรรมตามเกณฑ์การประเมินของรายวิชา
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">src/components/ExportModal.tsx</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">Export Dialog</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    โมดอลสำหรับดาวน์โหลดผลลัพธ์ในรูปแบบ JSON ข้อมูล, ตาราง CSV, และพิมพ์รายงานสรุปผล
                  </td>
                </tr>

                {/* Configurations */}
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">package.json / vite.config.ts / tsconfig.json</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">Configuration</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed">
                    การจัดการแพ็กเกจ (React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, JSZip) และการตั้งค่าคอมไพเลอร์
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Collapsible Key Function Catalog matching image_68d0cd1d.png */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
            ฟังก์ชันหลักและตรรกะการประมวลผล (Core Engine Functions Catalog)
          </h4>
          <div className="space-y-2.5">
            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>positiveInteger(value, label, max)</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">ตรวจสอบจำนวนเต็มบวก (&gt; 0)</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                ตรวจสอบว่าค่าที่กรอกเข้ามาในช่อง Burst Time (BT) และ Time Quantum (Q) เป็นจำนวนเต็มบวกที่ถูกต้อง (&gt; 0) หากพบค่าว่าง ทศนิยม หรือค่าติดลบ จะส่งข้อความแจ้งเตือนทันที
              </div>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>nonNegativeInteger(value, label, max)</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">ตรวจสอบจำนวนเต็มตั้งแต่ 0 ขึ้นไป (&gt;= 0)</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                ตรวจสอบและอนุญาตให้กำหนดค่า Arrival Time (AT) เป็น 0 หรือจำนวนเต็มบวกใดๆ โดยตั้งค่า Default ไว้เป็น 0 และสามารถปรับลดเพิ่มได้ทีละ 1
              </div>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>validateBursts(bursts) &amp; makeProcesses(bursts, arrivalTimes)</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">ตรวจสอบชุดข้อมูลและสร้างอ็อบเจกต์โปรเซส</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                ตรวจสอบขอบเขตจำนวนโปรเซส (1 ถึง 20 โปรเซส) และแปลงค่าอาร์เรย์ตัวเลขให้เป็นโครงสร้างอ็อบเจกต์ Process ที่ประกอบด้วย id, process (เช่น P1), at, bt, st: null, ct: null, remaining: bt
              </div>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>runFCFS(bursts, arrivalTimes)</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">อัลกอริทึม First-Come, First-Served</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                จัดสรร CPU ให้โปรเซสตามลำดับการมาถึง (Arrival Time) หากมาถึงพร้อมกันจะเรียงตาม PID (P1 มาก่อน P2) ทำงานต่อเนื่องจนเสร็จสิ้น (Non-preemptive)
              </div>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>runSJF(bursts, arrivalTimes)</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">อัลกอริทึม Shortest Job First (Non-preemptive)</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                ในกลุ่มโปรเซสที่มาถึงแล้ว (at &le; current_time) จะเลือกโปรเซสที่มี Burst Time (BT) น้อยที่สุดขึ้นมาทำงานก่อนจนกระทั่งเสร็จสิ้นกระบวนการ หากเท่ากันจะตัดด้วย PID
              </div>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>runSRTF(bursts, arrivalTimes)</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">อัลกอริทึม Shortest Remaining Time First (Preemptive)</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                ตรวจสอบเวลาที่เหลืออยู่ (Remaining Time) ทุกๆ 1 หน่วยเวลา หากมีงานที่เหลือเวลาน้อยกว่า จะทำการสลับซีพียู (Preempt) ทันที เพื่อให้ได้ค่าเฉลี่ยเวลารอคอยที่สั้นที่สุด
              </div>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>runRoundRobin(bursts, quantum, arrivalTimes)</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">อัลกอริทึม Round Robin (Time-Sharing)</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                นำโปรเซสเข้าคิว FIFO ให้ประมวลผลได้ไม่เกินช่วงเวลา Time Quantum (Q) หากหมดเวลาแต่ยังทำงานไม่เสร็จ จะถูกส่งกลับไปต่อท้ายคิวเพื่อให้โปรเซสถัดไปได้ประมวลผลอย่างเท่าเทียม
              </div>
            </details>

            <details className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
              <summary className="flex items-center justify-between p-3.5 cursor-pointer font-mono font-bold text-slate-800 hover:bg-slate-100/70 transition-colors select-none">
                <span className="flex items-center gap-2">
                  <span className="text-indigo-600 font-black">▶</span>
                  <span>finish(algorithm, processes, timeline) &amp; compare()</span>
                </span>
                <span className="text-[11px] font-sans font-normal text-slate-500">คำนวณตัวชี้วัด TAT, WT, AVG WT และการเปรียบเทียบ</span>
              </summary>
              <div className="p-4 pt-1 border-t border-slate-200/60 bg-white text-slate-600 leading-relaxed font-sans">
                คำนวณตัวชี้วัดประสิทธิภาพตามสูตรมาตรฐานวิชา: Turnaround Time (TAT = CT - AT), Waiting Time (WT = TAT - BT), Average Waiting Time (AVG WT = &sum;WT / n) และรันคำนวณคู่ขนาน 4 อัลกอริทึมเพื่อสร้างตารางเปรียบเทียบ Head-to-Head
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
};
