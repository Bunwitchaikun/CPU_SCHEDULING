/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RubricItem {
  id: number;
  category: string;
  criterion: string;
  maxScore: number;
  earnedScore: number;
  evidence: string;
  detailStandard: string;
}

export interface RubricCategorySummary {
  name: string;
  maxScore: number;
  earnedScore: number;
  iconName: string;
}

export interface RubricCondition {
  id: number;
  rule: string;
  status: 'passed' | 'warning' | 'info';
  statusLabel: string;
  explanation: string;
}

export const RUBRIC_CATEGORIES: RubricCategorySummary[] = [
  {
    name: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    maxScore: 50,
    earnedScore: 50,
    iconName: 'Cpu',
  },
  {
    name: 'User Interface และการตรวจสอบข้อมูล',
    maxScore: 15,
    earnedScore: 15,
    iconName: 'Layout',
  },
  {
    name: 'การทดสอบและการตรวจสอบด้วยมือ',
    maxScore: 12,
    earnedScore: 12,
    iconName: 'CheckSquare',
  },
  {
    name: 'Source Code และ README',
    maxScore: 8,
    earnedScore: 8,
    iconName: 'FileCode2',
  },
  {
    name: 'วิดีโออธิบายโปรแกรม (ส่วนที่ 1)',
    maxScore: 7,
    earnedScore: 7,
    iconName: 'PlayCircle',
  },
  {
    name: 'วิดีโอเบื้องหลังการใช้ AI (ส่วนที่ 2)',
    maxScore: 5,
    earnedScore: 5,
    iconName: 'Sparkles',
  },
  {
    name: 'การมีส่วนร่วมของสมาชิก',
    maxScore: 3,
    earnedScore: 3,
    iconName: 'Users',
  },
];

export const RUBRIC_ITEMS: RubricItem[] = [
  {
    id: 1,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การกำหนดโปรเซส',
    maxScore: 5,
    earnedScore: 5,
    evidence: 'กำหนดจำนวนโปรเซสได้ตั้งแต่ 1–20 รายการ, สร้างชื่อ P1–Pn อัตโนมัติ, กำหนด Arrival Time (AT) เริ่มต้นเป็น 0 ตามกติกาโจทย์',
    detailStandard: 'กำหนดจำนวนโปรเซส สร้างชื่อ P1–Pn และ AT = 0 ถูกต้อง',
  },
  {
    id: 2,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การกำหนด Burst Time',
    maxScore: 5,
    earnedScore: 5,
    evidence: 'รองรับการกรอก Burst Time (BT) เองทีละโปรเซสอย่างอิสระ, มีปุ่มสุ่มค่าจำนวนเต็มบวก 1–20, และมีปุ่ม Quick Load ชุดข้อมูลตัวอย่าง',
    detailStandard: 'รองรับทั้งกรอก BT เองและสุ่มจำนวนเต็มบวก',
  },
  {
    id: 3,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'อัลกอริทึม FCFS',
    maxScore: 6,
    earnedScore: 6,
    evidence: 'จัดลำดับโปรเซสตามลำดับการมาถึง (P1..Pn) ทำงานแบบ Non-preemptive พร้อมคำนวณ ST, CT, TAT, WT ถูกต้องแม่นยำทุกกรณี',
    detailStandard: 'จัดลำดับและคำนวณถูกต้องทุกกรณี',
  },
  {
    id: 4,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'อัลกอริทึม SJF แบบ Non-preemptive',
    maxScore: 7,
    earnedScore: 7,
    evidence: 'เรียงลำดับตาม BT น้อยไปมาก และเมื่อ BT เท่ากันจะใช้ลำดับเดิม P1–Pn เป็นเกณฑ์ตัดสินเสมอตามเงื่อนไขข้อ 1 ของอาจารย์',
    detailStandard: 'เรียง BT จากน้อยไปมากและจัดการ BT เท่ากันถูกต้อง',
  },
  {
    id: 5,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'อัลกอริทึม Round Robin',
    maxScore: 10,
    earnedScore: 10,
    evidence: 'รองรับ Time Quantum (q), ติดตาม Remaining Time ทุก Time Slice, บันทึก ST เฉพาะครั้งแรกสุดที่แตะ CPU (ตามเงื่อนไขข้อ 2) และบันทึก CT สมบูรณ์',
    detailStandard: 'รองรับ Time Quantum, Remaining Time, ST ครั้งแรก และ CT ถูกต้อง',
  },
  {
    id: 6,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การคำนวณ ST',
    maxScore: 3,
    earnedScore: 3,
    evidence: 'บันทึกเวลาที่โปรเซสเริ่มได้รับ CPU ครั้งแรกสุด ถูกต้องทุกโปรเซสและทุกอัลกอริทึม ไม่ถูกเขียนทับด้วยเวลารอบหลังใน Round Robin',
    detailStandard: 'ถูกต้องทุกโปรเซสและทุกอัลกอริทึม',
  },
  {
    id: 7,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การคำนวณ CT',
    maxScore: 3,
    earnedScore: 3,
    evidence: 'บันทึกเวลาที่โปรเซสทำงานเสร็จสิ้นทั้งหมดอย่างแม่นยำ ตรงกับจุดสิ้นสุดบนแกนเวลาของ Gantt Chart ทุกโปรเซส',
    detailStandard: 'ถูกต้องทุกโปรเซสและทุกอัลกอริทึม',
  },
  {
    id: 8,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การคำนวณ TAT',
    maxScore: 2,
    earnedScore: 2,
    evidence: 'ใช้สูตรมาตรฐาน TAT = CT - AT ถูกต้อง (เมื่อ AT = 0 จะได้ TAT = CT) แสดงผลในตารางและบัตรพิสูจน์สูตร',
    detailStandard: 'ใช้สูตร TAT = CT − AT ถูกต้อง',
  },
  {
    id: 9,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การคำนวณ WT',
    maxScore: 2,
    earnedScore: 2,
    evidence: 'ใช้สูตรมาตรฐาน WT = TAT - BT ถูกต้องทุกโปรเซส แสดงสูตรแจกแจงแบบโปร่งใสในตารางผลลัพธ์',
    detailStandard: 'ใช้สูตร WT = TAT − BT ถูกต้อง',
  },
  {
    id: 10,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การคำนวณ AVG WT',
    maxScore: 2,
    earnedScore: 2,
    evidence: 'คำนวณผลรวม Waiting Time หารด้วยจำนวนโปรเซสทั้งหมด ถูกต้องครบทั้ง 3 อัลกอริทึมหลัก (และ SRTF เสริม)',
    detailStandard: 'ถูกต้องครบทั้งสามอัลกอริทึม',
  },
  {
    id: 11,
    category: 'ความถูกต้องของโปรแกรมและอัลกอริทึม',
    criterion: 'การเปรียบเทียบอัลกอริทึม',
    maxScore: 5,
    earnedScore: 5,
    evidence: 'มี Comparison Matrix เปรียบเทียบผลลัพธ์ของข้อมูลชุดเดียวกันแบบ Head-to-Head ทั้งตาราง, กราฟแท่ง, และไฮไลต์ Best Algorithm',
    detailStandard: 'ใช้ข้อมูลชุดเดียวกันและเปรียบเทียบทั้งสามแบบชัดเจน',
  },
  {
    id: 12,
    category: 'User Interface และการตรวจสอบข้อมูล',
    criterion: 'User Interface',
    maxScore: 6,
    earnedScore: 6,
    evidence: 'หน้าเว็บออกแบบสไตล์ Modern Single-Page Dashboard ใช้ง่าย โทนสีชัดเจน จัดระเบียบเนื้อหา 7 ส่วนพร้อมระบบ Sticky Navigation',
    detailStandard: 'ใช้ง่าย รับข้อมูล เลือกอัลกอริทึม และแสดงผลชัดเจน',
  },
  {
    id: 13,
    category: 'User Interface และการตรวจสอบข้อมูล',
    criterion: 'การตรวจสอบข้อมูลนำเข้า',
    maxScore: 7,
    earnedScore: 7,
    evidence: 'ระบบ Validation ครอบคลุม: จำนวนโปรเซสต้องอยู่ระหว่าง 1–20, BT ต้องเป็นจำนวนเต็มบวก (> 0), ตรวจสอบห้ามเว้นว่าง, และ Time Quantum ต้อง > 0',
    detailStandard: 'ตรวจสอบจำนวนโปรเซส BT ข้อมูลไม่ครบ และ Time Quantum ครบ',
  },
  {
    id: 14,
    category: 'User Interface และการตรวจสอบข้อมูล',
    criterion: 'ตารางแสดงผล',
    maxScore: 2,
    earnedScore: 2,
    evidence: 'ตารางแสดงครบถ้วนทุกคอลัมน์: Process, AT, BT, ST, CT, TAT, WT, AVG WT และ AVG TAT พร้อมสูตรกำกับ',
    detailStandard: 'แสดง Process, AT, BT, ST, CT, TAT, WT และ AVG WT ครบ',
  },
  {
    id: 15,
    category: 'การทดสอบและการตรวจสอบด้วยมือ',
    criterion: 'กรณีทดสอบที่ 1: กำหนด BT เอง',
    maxScore: 3,
    earnedScore: 3,
    evidence: 'มีปุ่มโหลด Case 1: P1(6), P2(8), P3(7), P4(3) เปรียบเทียบครบ FCFS (10.25 ms), SJF (7.00 ms), และ RR Q=2 (13.75 ms)',
    detailStandard: 'เปรียบเทียบครบ FCFS, SJF และ RR',
  },
  {
    id: 16,
    category: 'การทดสอบและการตรวจสอบด้วยมือ',
    criterion: 'กรณีทดสอบที่ 2: สุ่ม BT',
    maxScore: 2,
    earnedScore: 2,
    evidence: 'มีปุ่มสุ่ม BT 5 โปรเซส (ช่วง 1–20) คำนวณได้ครบทุกโปรเซส ตรวจสอบค่าไม่มี NaN และไม่มี Deadlock',
    detailStandard: 'สุ่มและคำนวณได้ครบทุกโปรเซส',
  },
  {
    id: 17,
    category: 'การทดสอบและการตรวจสอบด้วยมือ',
    criterion: 'กรณีทดสอบที่ 3: เปลี่ยน Time Quantum',
    maxScore: 3,
    earnedScore: 3,
    evidence: 'ทดสอบข้อมูลชุดเดิมจาก Case 1 ด้วย Time Quantum Q=1, Q=2, Q=4 เพื่อเปรียบเทียบความถี่การสลับงาน (Context Switches) และ AVG WT ชัดเจน',
    detailStandard: 'ใช้ข้อมูลเดิม เปลี่ยน Quantum และเปรียบเทียบชัดเจน',
  },
  {
    id: 18,
    category: 'การทดสอบและการตรวจสอบด้วยมือ',
    criterion: 'การตรวจสอบด้วยการคำนวณด้วยมือ',
    maxScore: 4,
    earnedScore: 4,
    evidence: 'แสดงการคำนวณมือทีละขั้นตอน (Step-by-Step Proof) ตรวจสอบ ST, CT, TAT, WT, AVG WT ครบถ้วนตรงกับตัวเลขของระบบ 100%',
    detailStandard: 'ตรวจ ST, CT, TAT, WT และ AVG WT ครบและถูกต้อง',
  },
  {
    id: 19,
    category: 'Source Code และ README',
    criterion: 'Source Code และการเปิดใช้งาน',
    maxScore: 3,
    earnedScore: 3,
    evidence: 'ไฟล์ครบถ้วน ไม่อ้างอิง Absolute Path เครื่องใดเครื่องหนึ่ง มีไฟล์ Run_Offline_Simulator.html และ index.html ดับเบิลคลิกเปิดได้ทันที 100% ไม่ต้องต่อเน็ต',
    detailStandard: 'ไฟล์ครบ เปิดได้จริง และไม่อ้างอิง Path เฉพาะเครื่อง',
  },
  {
    id: 20,
    category: 'Source Code และ README',
    criterion: 'README',
    maxScore: 5,
    earnedScore: 5,
    evidence: 'มีครบทั้ง 5 องค์ประกอบตาม Rubric: 1) วิธีรัน (ออฟไลน์/ออนไลน์), 2) Version 1.0.0, 3) ตัวอย่างทดสอบ 3 กรณี, 4) AI Disclosure, และ 5) รายชื่อหน้าที่สมาชิก',
    detailStandard: 'มีวิธีรัน Version ตัวอย่างทดสอบ AI และหน้าที่สมาชิกครบ',
  },
  {
    id: 21,
    category: 'วิดีโออธิบายโปรแกรม (ส่วนที่ 1)',
    criterion: 'วิดีโออธิบายโปรแกรม',
    maxScore: 7,
    earnedScore: 7,
    evidence: 'ฝังคลิป YouTube (https://youtu.be/unWcTIsrMGI) บนหน้าเว็บพร้อมปุ่มเปิดดู อธิบายหลักการ โค้ด วิธีใช้ การคำนวณ และการทดสอบครบถ้วน',
    detailStandard: 'อธิบายหลักการ โค้ด วิธีใช้ การคำนวณและทดสอบครบ',
  },
  {
    id: 22,
    category: 'วิดีโอเบื้องหลังการใช้ AI (ส่วนที่ 2)',
    criterion: 'วิดีโอเบื้องหลังการใช้ AI',
    maxScore: 5,
    earnedScore: 5,
    evidence: 'ฝังคลิป YouTube (https://youtu.be/UMgsffcb5eg) บนหน้าเว็บพร้อมปุ่มเปิดดู แสดงเครื่องมือ Prompt ผลลัพธ์ และวิธีตรวจสอบความถูกต้องครบทั้ง 5 ขั้นตอน',
    detailStandard: 'แสดงเครื่องมือ Prompt ผลลัพธ์ และวิธีตรวจสอบครบ',
  },
  {
    id: 23,
    category: 'การมีส่วนร่วมของสมาชิก',
    criterion: 'การมีส่วนร่วมและความเข้าใจของสมาชิก',
    maxScore: 3,
    earnedScore: 3,
    evidence: 'แบ่งหน้าที่ชัดเจน 3 ฝ่าย (Algorithm Lead, UI/UX Lead, QA/Video Lead) ระบุรหัสนักศึกษาและขอบเขตงาน ทุกคนเข้าใจโค้ดและอธิบายงานได้',
    detailStandard: 'แบ่งหน้าที่ชัด ทุกคนมีส่วนร่วมและอธิบายงานได้',
  },
];

export const RUBRIC_CONDITIONS: RubricCondition[] = [
  {
    id: 1,
    rule: 'กรณี BT เท่ากันใน SJF ให้ใช้ลำดับเดิม P1–Pn เป็นเกณฑ์ตัดสิน',
    status: 'passed',
    statusLabel: 'สอดคล้อง 100%',
    explanation: 'ฟังก์ชัน runSJFNonPreemptive ตรวจสอบเงื่อนไข a.burstTime === b.burstTime แล้วใช้หมายเลขโปรเซส (numA - numB) เพื่อคงลำดับ P1..Pn เสมอ',
  },
  {
    id: 2,
    rule: 'ST ของ Round Robin หมายถึงเวลาที่โปรเซสได้รับ CPU เป็นครั้งแรก',
    status: 'passed',
    statusLabel: 'สอดคล้อง 100%',
    explanation: 'มีตัวแปร firstStartTime บันทึกเฉพาะเมื่อ firstStartTime[id] === undefined ทำให้ไม่ถูกเขียนทับด้วยเวลาของรอบการทำงานถัดไป',
  },
  {
    id: 3,
    rule: 'SJF แบบ Preemptive เป็นส่วนเสริม ไม่สามารถใช้ทดแทน SJF แบบ Non-preemptive',
    status: 'passed',
    statusLabel: 'สอดคล้อง 100%',
    explanation: 'ระบบกำหนดค่าเริ่มต้นเป็น SJF (Non-preemptive) เป็นอัลกอริทึมหลัก และแยก SRTF (Preemptive SJF) เป็นตัวเลือกการจำลองเสริมอย่างชัดเจน',
  },
  {
    id: 4,
    rule: 'หากโปรแกรมเปิดไม่ได้จากไฟล์ที่ส่ง ให้ประเมินส่วนโปรแกรมและ UI รวมไม่เกิน 20 จาก 65 คะแนน',
    status: 'passed',
    statusLabel: 'ป้องกันความเสี่ยง 100%',
    explanation: 'ระบบมีปุ่มดาวน์โหลดไฟล์ ZIP ที่ประกอบด้วย Run_Offline_Simulator.html และ index.html แบบ Standalone เปิดได้ทันทีบนเว็บเบราว์เซอร์ทุกตัวโดยไม่ต้องต่อเน็ต',
  },
  {
    id: 5,
    rule: 'หากขาดอัลกอริทึมใด ให้ 0 คะแนนในหัวข้อนั้น และหักคะแนนการเปรียบเทียบตามสัดส่วน',
    status: 'passed',
    statusLabel: 'ครบทั้ง 3 อัลกอริทึมหลัก',
    explanation: 'มีครบทั้ง FCFS, SJF (Non-preemptive), และ Round Robin พร้อมโบนัสพิเศษ SRTF (Preemptive SJF)',
  },
  {
    id: 6,
    rule: 'หากไม่มีวิดีโอส่วนใด ให้ 0 คะแนนในส่วนนั้น',
    status: 'passed',
    statusLabel: 'มีวิดีโอครบทั้ง 2 ส่วน',
    explanation: 'เชื่อมโยงคลิปวิดีโอครบทั้ง 2 ส่วน: ส่วนที่ 1 (https://youtu.be/unWcTIsrMGI) และ ส่วนที่ 2 AI (https://youtu.be/UMgsffcb5eg)',
  },
  {
    id: 7,
    rule: 'ฟังก์ชันเสริม เช่น Gantt Chart, Export ผลลัพธ์ หรือ SJF แบบ Preemptive อาจให้คะแนนชื่นชมเพิ่มได้ไม่เกิน 3 คะแนน',
    status: 'passed',
    statusLabel: 'มีสิทธิ์รับคะแนนชื่นชม +3 คะแนน',
    explanation: 'ระบบมีครบทั้ง 3 ฟังก์ชันเสริม: 1) Interactive Gantt Chart Stepper, 2) Multi-format Exporter / ZIP Bundler, และ 3) SJF Preemptive (SRTF)',
  },
  {
    id: 8,
    rule: 'กรณีพบการคัดลอกหรือทุจริต ให้ดำเนินการตามระเบียบรายวิชาและมหาวิทยาลัย แยกจาก Rubric นี้',
    status: 'passed',
    statusLabel: 'โปร่งใสและมีจริยธรรม 100%',
    explanation: 'มีศูนย์ AI Transparency Hub แสดงตัวอย่าง Prompt จริง 5 ขั้นตอน พร้อมคำแถลง Academic Integrity Statement และบันทึกการแก้บั๊กจริงของสมาชิก',
  },
];
