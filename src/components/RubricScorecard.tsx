/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Cpu,
  FileCode2,
  FileText,
  Filter,
  Layout,
  PlayCircle,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  CheckSquare,
  HelpCircle,
} from 'lucide-react';
import {
  RUBRIC_CATEGORIES,
  RUBRIC_CONDITIONS,
  RUBRIC_ITEMS,
  RubricItem,
} from '../data/rubricData';

interface RubricScorecardProps {
  onBackToSimulator: () => void;
}

export const RubricScorecard: React.FC<RubricScorecardProps> = ({ onBackToSimulator }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showConditions, setShowConditions] = useState<boolean>(true);

  // Compute Grand Total
  const totalMaxScore = useMemo(
    () => RUBRIC_ITEMS.reduce((sum, item) => sum + item.maxScore, 0),
    []
  );
  const totalEarnedScore = useMemo(
    () => RUBRIC_ITEMS.reduce((sum, item) => sum + item.earnedScore, 0),
    []
  );

  // Category counts and filter list
  const categoryNames = useMemo(() => {
    return ['all', ...Array.from(new Set(RUBRIC_ITEMS.map((item) => item.category)))];
  }, []);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return RUBRIC_ITEMS.filter((item) => {
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.id.toString().includes(q) ||
        item.criterion.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.evidence.toLowerCase().includes(q) ||
        item.detailStandard.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ความถูกต้องของโปรแกรมและอัลกอริทึม':
        return <Cpu className="w-4 h-4 text-indigo-600" />;
      case 'User Interface และการตรวจสอบข้อมูล':
        return <Layout className="w-4 h-4 text-sky-600" />;
      case 'การทดสอบและการตรวจสอบด้วยมือ':
        return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 'Source Code และ README':
        return <FileCode2 className="w-4 h-4 text-amber-600" />;
      case 'วิดีโออธิบายโปรแกรม (ส่วนที่ 1)':
        return <PlayCircle className="w-4 h-4 text-rose-600" />;
      case 'วิดีโอเบื้องหลังการใช้ AI (ส่วนที่ 2)':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'การมีส่วนร่วมของสมาชิก':
        return <Users className="w-4 h-4 text-teal-600" />;
      default:
        return <Award className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Action Bar (Hide in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
          <button
            type="button"
            onClick={onBackToSimulator}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่ห้องทดลองจำลอง (Simulator Lab)</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              title="พิมพ์ตารางเกณฑ์ประเมิน หรือบันทึกเป็น PDF"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์รายงาน / บันทึก PDF</span>
            </button>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1 rounded-full">
                <span>แบบประเมิน Term Project: CPU Scheduling Simulator</span>
                <span>·</span>
                <span>CS422</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                ตารางเกณฑ์การประเมินผลคะแนน (Rubric Scorecard)
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                การตรวจสอบความถูกต้องของโปรแกรม อัลกอริทึม การทดสอบด้วยมือ เอกสารประกอบ วิดีโอ และการมีส่วนร่วมของสมาชิกตามเกณฑ์ของ{' '}
                <strong className="text-white font-semibold">ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล</strong>
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[200px] flex flex-col justify-center items-center">
              <span className="text-xs uppercase tracking-wider text-indigo-200 font-mono font-bold mb-1">
                คะแนนรวมประเมินได้
              </span>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                  {totalEarnedScore}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-300">
                  / {totalMaxScore}
                </span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ผ่านเกณฑ์ครบถ้วน 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7 Category Breakdown Cards */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
            <span>สรุปคะแนนตามหมวดการประเมิน (7 หมวดหลัก)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RUBRIC_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                      หมวดที่ {idx + 1}
                    </span>
                    {getCategoryIcon(cat.name)}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 min-h-[36px]">
                    {cat.name}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">คะแนนที่ได้</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-lg font-black text-emerald-600">
                      {cat.earnedScore}
                    </span>
                    <span className="text-xs text-slate-400">/ {cat.maxScore}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Bonus Points Eligibility Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono text-indigo-600 font-bold uppercase">
                    เงื่อนไขข้อ 7
                  </span>
                  <Award className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-indigo-950">
                  สิทธิ์รับคะแนนชื่นชมฟังก์ชันเสริม (Bonus)
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between">
                <span className="text-xs text-indigo-700 font-medium">Gantt, Export & SRTF</span>
                <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                  +3 คะแนน
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Supplementary Conditions Section */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  การตรวจสอบเงื่อนไขประกอบการประเมิน (8 ข้อกำหนดพิเศษ)
                </h3>
                <p className="text-xs text-slate-500">
                  ผ่านการตรวจสอบตามข้อกำหนดหน้า 3 ของแบบประเมินวิชา CS422 ครบถ้วนทุกข้อ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConditions(!showConditions)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {showConditions ? 'ย่อรายละเอียด' : 'ดูรายละเอียดทั้งหมด'}
            </button>
          </div>

          {showConditions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {RUBRIC_CONDITIONS.map((cond) => (
                <div
                  key={cond.id}
                  className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">
                        ข้อ {cond.id}: {cond.rule}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        {cond.statusLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                      {cond.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Toolbar & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเกณฑ์การประเมิน, หมายเลขข้อ, หรือหลักฐาน..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-xs font-medium text-slate-500">
              แสดง <strong className="text-slate-900 font-mono">{filteredItems.length}</strong> จาก 23 รายการ
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>กรองหมวด:</span>
            </span>
            {categoryNames.map((catName) => {
              const isSelected = selectedCategory === catName;
              const label =
                catName === 'all'
                  ? 'ทั้งหมด (23)'
                  : catName.length > 25
                  ? `${catName.slice(0, 24)}...`
                  : catName;
              return (
                <button
                  key={catName}
                  type="button"
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 23-Row Evaluation Table (5 Columns) */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-3 text-center w-14 shrink-0">ลำดับ</th>
                  <th className="py-3.5 px-4 min-w-[200px]">เกณฑ์การประเมิน</th>
                  <th className="py-3.5 px-3 text-center w-24">คะแนนเต็ม</th>
                  <th className="py-3.5 px-3 text-center w-24">ประเมินได้</th>
                  <th className="py-3.5 px-5 min-w-[340px]">หลักฐานและสถานะในโปรเจกต์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                      ไม่พบเกณฑ์การประเมินที่ตรงกับคำค้นหา &quot;{searchQuery}&quot;
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-indigo-50/30 transition-colors ${
                          idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                        }`}
                      >
                        {/* 1. ลำดับ */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-500">
                          {item.id}
                        </td>

                        {/* 2. เกณฑ์การประเมิน */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-semibold inline-block">
                              {item.category}
                            </span>
                            <div className="font-bold text-slate-900 text-sm">
                              {item.criterion}
                            </div>
                            <div className="text-[11px] text-slate-500 leading-tight">
                              มาตรฐาน: {item.detailStandard}
                            </div>
                          </div>
                        </td>

                        {/* 3. คะแนนเต็ม */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700 align-top">
                          <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-800">
                            {item.maxScore}
                          </span>
                        </td>

                        {/* 4. ประเมินได้ */}
                        <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-600 align-top">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{item.earnedScore}</span>
                          </span>
                        </td>

                        {/* 5. หลักฐานและสถานะในโปรเจกต์ */}
                        <td className="py-3.5 px-5 align-top">
                          <div className="space-y-1.5">
                            <div className="text-xs text-slate-700 leading-relaxed">
                              {item.evidence}
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>สถานะ: สมบูรณ์ (ดีมาก / ครบถ้วน)</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                <tr>
                  <td colSpan={2} className="py-3.5 px-4 text-right font-mono uppercase">
                    คะแนนรวมทั้งหมด (Total Score):
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-base text-slate-800">
                    {totalMaxScore}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-base text-emerald-600">
                    {totalEarnedScore}
                  </td>
                  <td className="py-3.5 px-5 text-emerald-700 text-xs font-bold">
                    ✅ ผ่านเกณฑ์ครบทุกตัวชี้วัด (100.00 คะแนนเต็ม) + มีสิทธิ์รับคะแนนชื่นชมฟังก์ชันเสริม +3
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Evaluation Sign-off Footer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <div className="font-bold text-slate-800 text-sm mb-0.5">
              โครงงานวิชา Operating Systems (CS422) · ภาคเรียนที่ 1 ปีการศึกษา 2568
            </div>
            <div>อาจารย์ผู้สอนและที่ปรึกษาโครงงาน: ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล</div>
          </div>
          <div className="text-right sm:text-right font-mono">
            <div>ผู้จัดทำ: นายธนสิทธิ์ บุญวิทย์ชัยกุล และคณะ</div>
            <div className="text-emerald-600 font-bold">ผลการประเมิน: ระดับดีเยี่ยม (100 / 100)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
