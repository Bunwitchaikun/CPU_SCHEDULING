/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  INITIAL_AI_PROMPT_LOGS,
  INITIAL_EXPERIMENT_LOGS,
  INITIAL_HAND_CALCULATION,
  INITIAL_MEMBERS,
} from './data/initialData';
import {
  AiPromptLog,
  HandCalculationVerification,
  ProcessInput,
  RealExperimentEntry,
  SchedulingOutput,
  TeamMember,
} from './types/simulator';
import { TopNav } from './components/TopNav';
import { ProjectOverview } from './components/ProjectOverview';
import { SimulatorSection } from './components/SimulatorSection';
import { CodeWalkthrough } from './components/CodeWalkthrough';
import { ManualVerification } from './components/ManualVerification';
import { RealExperimentLog } from './components/RealExperimentLog';
import { VideoSection } from './components/VideoSection';
import { AiTransparencySection } from './components/AiTransparencySection';
import { RubricScorecard } from './components/RubricScorecard';
import { ReadmeManualView } from './components/ReadmeManualView';
import { ListTree, X } from 'lucide-react';
import { downloadFullProjectZip } from './utils/schedulerGenerator';
import {
  SidebarTOC,
  TOC_SECTIONS,
} from './components/SidebarTOC';

export default function App() {
  /*
   * ใช้ข้อมูลสมาชิกจาก INITIAL_MEMBERS โดยตรง
   * ไม่อ่านหรือบันทึกข้อมูลสมาชิกลง localStorage
   */
  const [members, setMembers] =
    useState<TeamMember[]>(INITIAL_MEMBERS);

  /*
   * คงฟังก์ชันนี้ไว้เพื่อให้เข้ากันได้กับ ProjectOverview
   * แต่จะไม่บันทึกข้อมูลสมาชิกลง localStorage
   */
  const handleUpdateMembers = (
    updated: TeamMember[]
  ) => {
    setMembers(updated);
  };

  /*
   * บันทึกเฉพาะ Experiment Logs ใน localStorage
   */
  const [experimentLogs, setExperimentLogs] =
    useState<RealExperimentEntry[]>(() => {
      try {
        const saved = localStorage.getItem(
          'cpu_sim_experiment_logs'
        );

        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.map((item: RealExperimentEntry) =>
              item.verifiedOutput?.includes('12.25')
                ? { ...item, verifiedOutput: item.verifiedOutput.replace('12.25', '13.75') }
                : item
            );
          }
        }
        return INITIAL_EXPERIMENT_LOGS;
      } catch {
        return INITIAL_EXPERIMENT_LOGS;
      }
    });

  const [handCalculation] =
    useState<HandCalculationVerification>(
      INITIAL_HAND_CALCULATION
    );

  const [aiPromptLogs] =
    useState<AiPromptLog[]>(INITIAL_AI_PROMPT_LOGS);

  /*
   * หน้าปัจจุบัน: 'simulator' (หน้าหลัก) หรือ 'rubric' (หน้าแบบประเมิน Rubric) หรือ 'readme' (หน้าคู่มือ)
   */
  const [activePage, setActivePage] = useState<'simulator' | 'rubric' | 'readme'>(() => {
    if (window.location.hash === '#rubric') return 'rubric';
    if (window.location.hash === '#readme') return 'readme';
    return 'simulator';
  });

  const handleSelectPage = (page: 'simulator' | 'rubric' | 'readme') => {
    setActivePage(page);
    if (page === 'rubric') {
      window.location.hash = '#rubric';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'readme') {
      window.location.hash = '#readme';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#simulator';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#rubric') {
        setActivePage('rubric');
      } else if (window.location.hash === '#readme') {
        setActivePage('readme');
      } else if (window.location.hash === '#simulator') {
        setActivePage('simulator');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  /*
   * ใช้สำหรับส่ง Test Case จากส่วนตรวจสอบ
   * กลับไปยัง Simulator
   */
  const [triggerTestCase, setTriggerTestCase] =
    useState<
      'case1' | 'case2' | 'case3' | null
    >(null);

  /*
   * เก็บผลลัพธ์ล่าสุดสำหรับนำไปสร้างไฟล์ดาวน์โหลด
   * ไม่มีการเปิด ExportModal
   */
  const [exportData, setExportData] =
    useState<{
      processes: ProcessInput[];
      outputs: {
        fcfs: SchedulingOutput;
        sjf: SchedulingOutput;
        rr: SchedulingOutput;
        srtf: SchedulingOutput;
      };
      quantum: number;
    } | null>(null);

  const handleUpdateLogs = (
    updated: RealExperimentEntry[]
  ) => {
    setExperimentLogs(updated);

    try {
      localStorage.setItem(
        'cpu_sim_experiment_logs',
        JSON.stringify(updated)
      );
    } catch {
      // Ignore storage errors
    }
  };

  /*
   * รับผลลัพธ์ล่าสุดจาก Simulator
   * เก็บข้อมูลไว้สำหรับดาวน์โหลดเท่านั้น
   * ไม่เปิด Popup หรือ Modal
   */
  const handleExportRequest = (
    processes: ProcessInput[],
    outputs: {
      fcfs: SchedulingOutput;
      sjf: SchedulingOutput;
      rr: SchedulingOutput;
      srtf: SchedulingOutput;
    },
    quantum: number
  ) => {
    setExportData({
      processes,
      outputs,
      quantum,
    });
  };

  const handleDownloadProgram = async () => {
    const bursts = exportData
      ? exportData.processes.map(
          (process) => process.burstTime
        )
      : [6, 8, 7, 3];

    const quantum = exportData
      ? exportData.quantum
      : 2;

    await downloadFullProjectZip(
      bursts,
      quantum,
      exportData ? exportData.processes : undefined
    );
  };

  /*
   * Active Section และ Sub-Item
   * สำหรับ Sticky Table of Contents
   */
  const [activeSection, setActiveSection] =
    useState<string>('simulator');

  const [activeSubId, setActiveSubId] =
    useState<string>('sim-config');

  const [isMobileTocOpen, setIsMobileTocOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const sectionIds = [
      'simulator',
      'overview',
      'code-walkthrough',
      'verification',
      'experiment-logs',
      'video-presentation',
      'ai-collaboration',
    ];

    const subItemIds = [
      'sim-config',
      'sim-controls',
      'sim-gantt',
      'sim-detail',
      'sim-slices',
      'sim-code-behind',
      'overview-rules',
      'overview-theory',
      'overview-members',
      'code-fcfs',
      'code-sjf',
      'code-rr',
      'code-srtf',
      'code-finish',
      'verify-case1',
      'verify-case2',
      'verify-case3',
      'verify-hand-proof',
      'logs-history',
      'logs-fixes',
      'vdo-demo',
      'vdo-ai',
      'vdo-criteria',
      'ai-phases',
      'ai-prompts',
      'ai-ethics',
    ];

    const handleScroll = () => {
      const scrollPosition =
        window.scrollY + 180;

      // ตรวจสอบ Main Section ที่กำลังแสดง
      for (
        let index = sectionIds.length - 1;
        index >= 0;
        index--
      ) {
        const element =
          document.getElementById(
            sectionIds[index]
          );

        if (
          element &&
          element.offsetTop <= scrollPosition
        ) {
          setActiveSection(
            sectionIds[index]
          );
          break;
        }
      }

      // ตรวจสอบ Sub-Item ที่กำลังแสดง
      for (
        let index = subItemIds.length - 1;
        index >= 0;
        index--
      ) {
        const element =
          document.getElementById(
            subItemIds[index]
          );

        if (element) {
          const rect =
            element.getBoundingClientRect();

          if (rect.top <= 240) {
            setActiveSubId(
              subItemIds[index]
            );
            break;
          }
        }
      }
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  const handleSelectSection = (
    id: string
  ) => {
    setActiveSection(id);

    const element =
      document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleSelectSubItem = (
    subId: string
  ) => {
    setActiveSubId(subId);

    const element =
      document.getElementById(subId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleQuickSimulate = () => {
    handleSelectSection('simulator');
  };

  const handleLoadTestCase = (
    caseId:
      | 'case1'
      | 'case2'
      | 'case3'
  ) => {
    setTriggerTestCase(caseId);
    handleSelectSection('simulator');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      <TopNav
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onQuickSimulate={
          handleQuickSimulate
        }
        onDownloadProgram={
          handleDownloadProgram
        }
      />

      {activePage === 'rubric' ? (
        <main className="flex-1 w-full">
          <RubricScorecard
            onBackToSimulator={() =>
              handleSelectPage('simulator')
            }
          />
        </main>
      ) : activePage === 'readme' ? (
        <main className="flex-1 w-full">
          <ReadmeManualView
            onBackToSimulator={() =>
              handleSelectPage('simulator')
            }
          />
        </main>
      ) : (
        <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Desktop Table of Contents */}
            <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-20 z-20 self-start">
              <SidebarTOC
                activeId={activeSection}
                activeSubId={activeSubId}
                onSelectSection={
                  handleSelectSection
                }
                onSelectSubItem={
                  handleSelectSubItem
                }
                onDownloadProgram={
                  handleDownloadProgram
                }
              />
            </div>

            {/* Main Content */}
            <main className="flex-1 min-w-0 space-y-12 w-full">
              <SimulatorSection
                onExportRequest={
                  handleExportRequest
                }
                externalLoadCase={
                  triggerTestCase
                }
                onClearExternalLoadCase={() =>
                  setTriggerTestCase(null)
                }
              />

              <ProjectOverview
                members={members}
                onUpdateMembers={
                  handleUpdateMembers
                }
              />

              <CodeWalkthrough />

              <ManualVerification
                handCalculation={
                  handCalculation
                }
                onLoadTestCase={
                  handleLoadTestCase
                }
              />

              <RealExperimentLog
                logs={experimentLogs}
                onUpdateLogs={
                  handleUpdateLogs
                }
              />

              <VideoSection />

              <AiTransparencySection
                promptLogs={aiPromptLogs}
              />
            </main>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-800 text-sm">
            (Term Project): CPU Scheduling
            Simulator
            {' · '}
            ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล
            {' '}
            (KINGKARN SOOKHANAPHIBARN)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500 text-xs font-mono">
            <span>FCFS</span>
            <span>·</span>

            <span>
              SJF Non-preemptive &amp;
              Preemptive
            </span>

            <span>·</span>

            <span>
              Round Robin (Time Slicing)
            </span>

            <span>·</span>

            <span>
              Arrival Time = 0 ทุกโปรเซส
            </span>
          </div>

          <p className="text-xs text-slate-400 pt-1">
            พัฒนาเป็น Modern Minimal Web
            Application สำหรับการนำเสนอสดและ
            บันทึกวิดีโอคลิปการทำงานจริง
          </p>
        </div>
      </footer>

      {/* Mobile Table of Contents Button */}
      <div className="fixed bottom-5 right-5 z-40 lg:hidden">
        <button
          type="button"
          onClick={() =>
            setIsMobileTocOpen(true)
          }
          className="flex items-center gap-2.5 bg-slate-900/95 hover:bg-slate-800 text-white px-4 py-3 rounded-full shadow-xl border border-slate-700/80 text-xs sm:text-sm font-bold active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          title="เปิดสารบัญการนำเสนอและหัวข้อย่อย"
        >
          <ListTree className="w-4 h-4 text-indigo-400 shrink-0" />

          <span>
            สารบัญ ▾ (ส่วนที่{' '}
            {TOC_SECTIONS.find(
              (section) =>
                section.id ===
                activeSection
            )?.step || '01'}{' '}
            / 07)
          </span>
        </button>
      </div>

      {/* Mobile Table of Contents Drawer */}
      {isMobileTocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <ListTree className="w-4 h-4 text-indigo-600" />

                <h3 className="font-bold text-slate-900 text-base">
                  สารบัญการนำเสนอ
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsMobileTocOpen(false)
                }
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="ปิดหน้าต่างสารบัญ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-3 pr-1">
              <SidebarTOC
                activeId={activeSection}
                activeSubId={activeSubId}
                onSelectSection={(id) => {
                  handleSelectSection(id);
                  setIsMobileTocOpen(false);
                }}
                onSelectSubItem={(
                  subId
                ) => {
                  handleSelectSubItem(
                    subId
                  );
                  setIsMobileTocOpen(false);
                }}
                onDownloadProgram={
                  handleDownloadProgram
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}