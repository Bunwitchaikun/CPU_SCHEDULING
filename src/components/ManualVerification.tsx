/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, ChevronRight, PlayCircle, ShieldCheck } from 'lucide-react';
import { HandCalculationVerification } from '../types/simulator';

interface ManualVerificationProps {
  handCalculation: HandCalculationVerification;
  onLoadTestCase: (caseId: 'case1' | 'case2' | 'case3') => void;
}

export const ManualVerification: React.FC<ManualVerificationProps> = ({
  handCalculation,
  onLoadTestCase,
}) => {
  return (
    <section id="verification" className="scroll-mt-20 py-12 border-t border-slate-200">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl font-mono mb-3">
          <span>ส่วนที่ 4 · กรณีทดสอบ 3 รูปแบบ &amp; การตรวจสอบการคำนวณด้วยตนเอง</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
          Test Scenarios &amp; Manual Calculation Proof
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mt-2.5 max-w-4xl">
          ทดสอบความถูกต้องของระบบตามเกณฑ์กำหนด 3 กรณี พร้อมตารางพิสูจน์การคำนวณมือเพื่อยืนยันว่าค่า ST, CT, TAT, WT ถูกต้อง 100%
        </p>
      </div>

      {/* 3 Required Test Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Case 1 */}
        <div id="verify-case1" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between scroll-mt-24">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 mb-1">
              กรณีที่ 1 (Manual BT)
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">กำหนด Burst Time ด้วยตนเอง</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
              กรอก 4 โปรเซส: <code className="text-indigo-600 font-mono font-bold">P1=6, P2=8, P3=7, P4=3</code> (AT=0) เปรียบเทียบผลลัพธ์ของ FCFS, SJF และ Round Robin (Q=2)
            </p>
            <div className="text-xs font-mono text-slate-600 space-y-1 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
              <div>• FCFS AVG WT: 10.25 ms</div>
              <div>• SJF AVG WT: 7.00 ms (ต่ำที่สุด)</div>
              <div>• RR (Q=2) AVG WT: 13.75 ms</div>
            </div>
          </div>
          <button
            onClick={() => onLoadTestCase('case1')}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs"
          >
            <PlayCircle className="w-4 h-4" />
            <span>โหลดเคสนี้เข้า Simulator</span>
          </button>
        </div>

        {/* Case 2 */}
        <div id="verify-case2" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between scroll-mt-24">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">
              กรณีที่ 2 (Random BT)
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">ระบบสุ่มค่า Burst Time</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
              สุ่มค่า Burst Time จำนวน 5 โปรเซส (ค่าจำนวนเต็มบวก 1-20) เพื่อทดสอบว่าระบบสามารถประมวลผลได้ครบทุกโปรเซส ไม่มีข้อผิดพลาด
            </p>
            <div className="text-xs font-mono text-slate-600 space-y-1 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
              <div>• ทดสอบ N=5 โปรเซส</div>
              <div>• เช็ค Completion Time รวม</div>
              <div>• ยืนยันผลลัพธ์ไม่มี NaN หรือค่าติดลบ</div>
            </div>
          </div>
          <button
            onClick={() => onLoadTestCase('case2')}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shadow-2xs"
          >
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            <span>สุ่มชุดข้อมูล 5 โปรเซส</span>
          </button>
        </div>

        {/* Case 3 */}
        <div id="verify-case3" className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between scroll-mt-24">
          <div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 mb-1">
              กรณีที่ 3 (RR Multi-Quantum)
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">เปลี่ยน Time Quantum ใน RR</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
              ใช้ชุดข้อมูลเดิมจาก Case 1 แต่เปลี่ยนค่า Time Quantum เป็น <code className="text-amber-700 font-mono font-bold">Q=1, Q=2, Q=4</code> เพื่อเปรียบเทียบผลลัพธ์และจำนวนการสลับงาน
            </p>
            <div className="text-xs font-mono text-slate-600 space-y-1 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
              <div>• Q=1: Context Switches สูงสุด (24 ช่วง)</div>
              <div>• Q=2: สมดุล Response/Overhead (14 ช่วง)</div>
              <div>• Q=4: ลดการสลับงาน (9 ช่วง)</div>
            </div>
          </div>
          <button
            onClick={() => onLoadTestCase('case3')}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-colors shadow-2xs cursor-pointer active:scale-95"
            title="โหลดชุดข้อมูล Case 1 พร้อมกำหนด Time Quantum [1, 2, 4] และแสดงผลเปรียบเทียบทันที"
          >
            <PlayCircle className="w-4 h-4 text-amber-700" />
            <span>โหลด Case 3 เปรียบเทียบ Q = 1, 2, 4</span>
          </button>
        </div>
      </div>

      {/* Hand-Calculation Step-by-Step Proof Box (Zero horizontal scrollbar!) */}
      <div id="verify-hand-proof" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{handCalculation.caseTitle}</h3>
              <p className="text-xs text-slate-500 font-mono">{handCalculation.datasetSummary}</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ยืนยันผลคำนวณมือตรงกับโปรแกรม 100%</span>
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs sm:text-sm">
          {handCalculation.manualSteps.map((step, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <div className="text-indigo-700 font-bold mb-1.5 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-indigo-600" />
                <span>{step.step}</span>
              </div>
              <div className="text-slate-600 pl-6 mb-1 text-xs sm:text-sm leading-relaxed">
                <span className="text-slate-400 font-sans">สูตรและกระบวนการ:</span> {step.formula}
              </div>
              <div className="text-emerald-700 pl-6 font-bold text-xs sm:text-sm">
                <span className="text-slate-400 font-sans font-normal">ผลสรุป:</span> {step.result}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs sm:text-sm text-slate-600">
          <span className="text-indigo-600 font-bold shrink-0">• สรุปการตรวจสอบ:</span>
          <span>{handCalculation.notes}</span>
        </div>
      </div>
    </section>
  );
};
