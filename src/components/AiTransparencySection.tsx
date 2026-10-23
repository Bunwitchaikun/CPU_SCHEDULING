/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  FileSpreadsheet,
  Lightbulb,
  MessageSquare,
  Presentation,
  Shield,
  Sparkles,
} from 'lucide-react';
import { AiPromptLog } from '../types/simulator';

interface AiTransparencySectionProps {
  promptLogs: AiPromptLog[];
}

export const AiTransparencySection: React.FC<AiTransparencySectionProps> = ({ promptLogs }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPhaseIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 1:
        return <Brain className="w-5 h-5 text-indigo-500" />;
      case 2:
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 3:
        return <Code2 className="w-5 h-5 text-sky-500" />;
      case 4:
        return <Presentation className="w-5 h-5 text-purple-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <section id="ai-collaboration" className="scroll-mt-20 py-12 border-t border-slate-200">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl font-mono mb-3">
          <span>ส่วนที่ 7 · การนำ AI มาใช้ในทุกขั้นตอนของโครงงานอย่างโปร่งใส</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
          การนำ AI มาใช้ในการทำโครงงาน (AI Collaboration Hub)
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 mt-2.5 max-w-4xl leading-relaxed">
          แสดงหลักฐานการนำ AI มาช่วยในการทำ Term Project อย่างโปร่งใสและตรงไปตรงมา ครอบคลุมตั้งแต่{' '}
          <strong className="text-slate-900 font-semibold">การวางแผน</strong>,{' '}
          <strong className="text-slate-900 font-semibold">การคิดวิเคราะห์ทฤษฎี</strong>,{' '}
          <strong className="text-slate-900 font-semibold">การคำนวณตรวจสอบตัวเลข</strong>,{' '}
          <strong className="text-slate-900 font-semibold">การเขียนโค้ดและแก้บั๊ก</strong>, ไปจนถึง{' '}
          <strong className="text-slate-900 font-semibold">การวางแผนนำเสนอ</strong> โดยสมาชิกในกลุ่มเป็นผู้ตรวจสอบและเข้าใจโค้ดทุกส่วน 100%
        </p>
      </div>

      {/* 5-Phase Overview Badges */}
      <div id="ai-phases" className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8 scroll-mt-24">
        {[
          { label: '1. การวางแผน', desc: 'Architecture & UX' },
          { label: '2. การคิดทฤษฎี', desc: 'OS & Formula Logic' },
          { label: '3. การคำนวณ', desc: 'Math Verification' },
          { label: '4. การเขียนโค้ด', desc: 'Coding & Debugging' },
          { label: '5. การนำเสนอ', desc: 'Script & Video Plan' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs text-center"
          >
            <div className="text-xs font-bold text-slate-900">{item.label}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Academic Ethics Statement Card */}
      <div id="ai-ethics" className="mb-8 p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-start gap-4 text-xs sm:text-sm text-indigo-950 leading-relaxed shadow-2xs scroll-mt-24">
        <Shield className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-indigo-900 mb-1 text-sm sm:text-base">
            คำแถลงความโปร่งใสและจริยธรรมทางวิชาการ (Academic Integrity Statement)
          </h3>
          <p className="text-indigo-800/90">
            &quot;การใช้ AI ไม่ถือเป็นข้อผิดพลาดของโครงงาน แต่ผู้จัดทำต้องตรวจสอบความถูกต้องของผลลัพธ์จาก AI เข้าใจโค้ดทุกส่วนที่นำมาใช้ สามารถอธิบายและแก้ไขโค้ดได้ ไม่คัดลอกผลลัพธ์โดยไม่มีการตรวจสอบ และระบุอย่างชัดเจนว่า AI ช่วยในส่วนใด&quot; — กลุ่มผู้จัดทำได้บันทึกขั้นตอนการใช้งานจริงไว้ครบถ้วนทั้ง 5 ขั้นตอนด้านล่างนี้
          </p>
        </div>
      </div>

      {/* 5 Detailed Phase Cards */}
      <div id="ai-prompts" className="space-y-6 scroll-mt-24">
        {promptLogs.map((log, idx) => (
          <div
            key={log.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-slate-300 transition-all"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {getPhaseIcon(idx)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {log.phase}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    เครื่องมือที่ใช้: <span className="text-indigo-600 font-semibold">{log.toolUsed}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                วัตถุประสงค์: <span className="text-slate-800">{log.purpose}</span>
              </div>
            </div>

            {/* Prompt Box */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ตัวอย่าง Prompt ที่สมาชิกในกลุ่มใช้จริง:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(log.id, log.promptExample)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {copiedId === log.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">คัดลอก Prompt แล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>คัดลอก Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 select-all leading-relaxed shadow-2xs">
                &quot;{log.promptExample}&quot;
              </div>
            </div>

            {/* 2-Column Split: AI Output vs Human Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Left: AI Output */}
              <div className="bg-purple-50/50 border border-purple-200/80 rounded-xl p-4">
                <span className="text-xs font-bold text-purple-900 block mb-1.5">
                  1) สิ่งที่ AI ตอบกลับหรือช่วยสร้าง:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {log.aiResponseSummary}
                </p>
              </div>

              {/* Right: Human Verification & Edits */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4">
                <span className="text-xs font-bold text-emerald-900 block mb-1.5">
                  2) การตรวจสอบและแก้ไขโดยสมาชิกในกลุ่ม:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {log.humanVerificationAndCorrection}
                </p>
              </div>
            </div>

            {/* Ethical Summary Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong className="text-slate-800">บทเรียนและความโปร่งใส:</strong> {log.ethicalSummary}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
