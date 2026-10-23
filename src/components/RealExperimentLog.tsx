/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { RealExperimentEntry } from '../types/simulator';

interface RealExperimentLogProps {
  logs: RealExperimentEntry[];
  onUpdateLogs: (logs: RealExperimentEntry[]) => void;
}

export const RealExperimentLog: React.FC<RealExperimentLogProps> = ({ logs, onUpdateLogs }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<RealExperimentEntry>>({
    testCaseNumber: 'Case พิเศษ: ',
    scenario: '',
    isFirstAttemptPass: false,
    encounteredIssue: '',
    rootCause: '',
    solutionFix: '',
    verifiedOutput: '',
    testerName: 'สมาชิกในกลุ่ม',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.scenario || !newEntry.solutionFix) return;

    const entry: RealExperimentEntry = {
      id: `exp-${Date.now()}`,
      testCaseNumber: newEntry.testCaseNumber || 'Case ทดสอบเพิ่มเติม',
      scenario: newEntry.scenario || '',
      isFirstAttemptPass: Boolean(newEntry.isFirstAttemptPass),
      encounteredIssue: newEntry.encounteredIssue || 'ไม่พบปัญหาในการรันรอบแรก',
      rootCause: newEntry.rootCause || '-',
      solutionFix: newEntry.solutionFix || '',
      verifiedOutput: newEntry.verifiedOutput || 'ผ่านเกณฑ์การทดสอบ',
      testerName: newEntry.testerName || 'สมาชิก',
      date: newEntry.date || new Date().toISOString().split('T')[0],
    };

    onUpdateLogs([...logs, entry]);
    setShowAddModal(false);
    setNewEntry({
      testCaseNumber: 'Case พิเศษ: ',
      scenario: '',
      isFirstAttemptPass: false,
      encounteredIssue: '',
      rootCause: '',
      solutionFix: '',
      verifiedOutput: '',
      testerName: 'สมาชิกในกลุ่ม',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDelete = (id: string) => {
    onUpdateLogs(logs.filter((l) => l.id !== id));
  };

  return (
    <section id="experiment-logs" className="scroll-mt-20 py-12 border-t border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-sm sm:text-base font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl font-mono mb-3">
            <span>ส่วนที่ 5 · ตารางบันทึกผลจริงของสมาชิก</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Real Member Experiment &amp; Debugging Log
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mt-2.5 max-w-4xl leading-relaxed">
            บันทึกการทดลองจริงของสมาชิกในกลุ่ม โดยระบุทั้งรอบที่ไม่ผ่าน ปัญหาที่พบจริง และการแก้ไข เพื่อแสดงความโปร่งใสและหลักฐานการทำงานจริงก่อนส่งมอบ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มบันทึกการทดสอบ</span>
        </button>
      </div>

      {/* Advisory Banner & Bug Fixes */}
      <div id="logs-fixes" className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3.5 text-sm text-amber-900 leading-relaxed shadow-2xs scroll-mt-24">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-950 font-bold">ข้อตกลงและคำแนะนำการบันทึก:</strong>{' '}
          &quot;เก็บบันทึกที่ไม่ผ่านด้วย พร้อมสิ่งที่แก้ อย่าเขียนว่าผ่านก่อนทดลองจริง&quot; — ตารางนี้สะท้อนกระบวนการค้นพบและแก้บั๊กจริง (เช่น ปัญหาคำนวณ ST ใน Round Robin, ปัญหา Infinite Loop เมื่อ Quantum เป็นศูนย์) ซึ่งเป็นหลักฐานสำคัญในการตอบคำถามอาจารย์
        </div>
      </div>

      {/* Log Cards (Clean Modern Grid - Zero Horizontal Scrollbars!) */}
      <div id="logs-history" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-24">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Bar */}
              <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">
                    {log.testCaseNumber}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    ผู้ทดสอบ: <strong className="text-slate-700">{log.testerName}</strong> · วันที่ {log.date}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {log.isFirstAttemptPass ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ผ่านรอบแรก</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>ไม่ผ่าน (พบบั๊ก)</span>
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                    title="ลบรายการนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scenario */}
              <div className="text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 font-mono">
                <strong className="text-slate-800 font-sans">เงื่อนไข:</strong> {log.scenario}
              </div>

              {/* Bug & Root Cause */}
              <div className="space-y-2 mb-3 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-rose-700 block mb-0.5">
                    ข้อผิดพลาดที่พบ (Encountered Issue):
                  </span>
                  <p className="text-slate-700">{log.encounteredIssue}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-600 block mb-0.5">
                    สาเหตุในโค้ด (Root Cause):
                  </span>
                  <p className="text-slate-500 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-200/50">
                    {log.rootCause}
                  </p>
                </div>
              </div>
            </div>

            {/* Fix & Verification */}
            <div className="pt-3 border-t border-slate-100 text-xs leading-relaxed">
              <span className="font-bold text-indigo-700 block mb-0.5">
                วิธีแก้ไขและผลการยืนยัน (Solution &amp; Fix):
              </span>
              <p className="text-slate-700 font-mono text-[11px] mb-1.5">
                {log.solutionFix}
              </p>
              <div className="text-emerald-700 font-semibold flex items-center gap-1 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{log.verifiedOutput}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">เพิ่มบันทึกผลการทดสอบจริงของสมาชิก</h3>
            <form onSubmit={handleAddLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">หัวข้อกรณีทดสอบ</label>
                <input
                  type="text"
                  value={newEntry.testCaseNumber}
                  onChange={(e) => setNewEntry({ ...newEntry, testCaseNumber: e.target.value })}
                  placeholder="เช่น Case 5: ตรวจสอบ Boundary Quantum"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">เงื่อนไขและข้อมูลที่ทดสอบ (Scenario)</label>
                <textarea
                  value={newEntry.scenario}
                  onChange={(e) => setNewEntry({ ...newEntry, scenario: e.target.value })}
                  placeholder="เช่น กำหนด 6 โปรเซส ให้ BT เท่ากันทั้งหมดที่ 5 ms..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ผลการทดสอบครั้งแรก</label>
                <select
                  value={newEntry.isFirstAttemptPass ? 'true' : 'false'}
                  onChange={(e) => setNewEntry({ ...newEntry, isFirstAttemptPass: e.target.value === 'true' })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="false">❌ ไม่ผ่าน (พบข้อผิดพลาดหรือบั๊กก่อนแก้ไข)</option>
                  <option value="true">✅ ผ่านทันที</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ข้อผิดพลาดที่พบ (Encountered Issue)</label>
                <input
                  type="text"
                  value={newEntry.encounteredIssue}
                  onChange={(e) => setNewEntry({ ...newEntry, encounteredIssue: e.target.value })}
                  placeholder="เช่น คำนวณ CT ไม่ตรงกับสูตร, ค่าลูปค้าง..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">สาเหตุที่แท้จริง (Root Cause)</label>
                <input
                  type="text"
                  value={newEntry.rootCause}
                  onChange={(e) => setNewEntry({ ...newEntry, rootCause: e.target.value })}
                  placeholder="เช่น ลืมเช็ค undefined ใน Map..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">วิธีการแก้ไขและผลการยืนยัน (Solution &amp; Verification)</label>
                <textarea
                  value={newEntry.solutionFix}
                  onChange={(e) => setNewEntry({ ...newEntry, solutionFix: e.target.value })}
                  placeholder="เช่น ปรับแก้เงื่อนไข if และรันซ้ำ 3 รอบ พบว่าผลลัพธ์ตรงกัน..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ชื่อผู้ทดสอบ</label>
                  <input
                    type="text"
                    value={newEntry.testerName}
                    onChange={(e) => setNewEntry({ ...newEntry, testerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">วันที่ทดสอบ</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  บันทึกลงตาราง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
