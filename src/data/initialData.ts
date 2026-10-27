/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AiPromptLog, HandCalculationVerification, RealExperimentEntry, TeamMember } from '../types/simulator';

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'ธนสิทธิ์ บุญวิทย์ชัยกุล',
    studentId: '1670701273',
    roleTitle: 'Algorithm & Core Logic Lead',
    roleScope: 'Algorithm & Math',
    responsibilities: [
      'ออกแบบและพัฒนาอัลกอริทึม FCFS, SJF (Non-preemptive & Preemptive) และ Round Robin',
      'เขียนฟังก์ชันคำนวณ ST (Start Time), CT (Completion Time), TAT (Turnaround Time) และ WT (Waiting Time)',
      'ตรวจสอบสูตรคณิตศาสตร์: TAT = CT - AT และ WT = TAT - BT พร้อมตรวจสอบความถูกต้องของ Ready Queue',
    ],
  },
  {
    id: 'm2',
    name: 'ธรรมสรณ์ สุวลาภา',
    studentId: '1670700291',
    roleTitle: 'UI/UX & Interactive Visualizer Lead',
    roleScope: 'UI & Integration',
    responsibilities: [
      'ออกแบบ User Interface สำหรับการกรอกข้อมูล, สุ่ม Burst Time, และเลือกอัลกอริทึม',
      'พัฒนา Gantt Chart ไทม์ไลน์แสดงการจัดสรร CPU พร้อมระบบสีจำแนกโปรเซส',
      'เชื่อมต่อ Input Controllers เข้ากับ Core Algorithm และสร้างตารางแสดงผลลัพธ์ละเอียด',
    ],
  },
  {
    id: 'm3',
    name: 'ณัชพล โพธิ์ตาก',
    studentId: '1670700242',
    roleTitle: 'QA Testing, Video Production & Documentation Lead',
    roleScope: 'Testing, Video & Documentation',
    responsibilities: [
      'ออกแบบกรณีทดสอบทั้ง 3 รูปแบบ (Manual BT, Random BT, Round Robin Multi-Quantum)',
      'ทำการคำนวณด้วยตนเอง (Manual Calculation Proof) เพื่อเทียบผลลัพธ์กับระบบ',
      'จัดเตรียมสคริปต์ ถ่ายทำ และตัดต่อวิดีโอทั้งสองส่วน (อธิบายโปรแกรม & เบื้องหลัง AI) พร้อมจัดทำ README',
    ],
  },
];

export const INITIAL_EXPERIMENT_LOGS: RealExperimentEntry[] = [
  {
    id: 'exp-1',
    testCaseNumber: 'Case 1: Manual BT (4 Processes)',
    scenario: 'ทดสอบกรอก Burst Time ด้วยตนเอง: P1=6, P2=8, P3=7, P4=3 โดยเทียบ FCFS, SJF, RR(Q=2)',
    isFirstAttemptPass: false,
    encounteredIssue: 'ในการทดสอบรอบแรก ค่า ST ของ Round Robin แสดงผลเป็นเวลาของ Time Slice สุดท้าย แทนที่จะเป็นเวลาเริ่มแรกที่โปรเซสแตะ CPU',
    rootCause: 'โค้ดเดิมเขียนอัปเดต `startTime = currentTime` ซ้ำทุกครั้งที่หยิบโปรเซสออกจาก Ready Queue ทำให้ค่า ST กลายเป็นเวลาของ slice ล่าสุด',
    solutionFix: 'แก้เงื่อนไขโดยเพิ่ม `if (firstStartTime[currentId] === undefined)` บันทึก ST เฉพาะครั้งแรกสุดที่โปรเซสได้รับ CPU เท่านั้น',
    verifiedOutput: 'ผ่านเกณฑ์: FCFS (AVG WT=10.25), SJF (AVG WT=7.00), RR Q=2 (AVG WT=13.75) ตัวเลขตรงกับการคำนวณมือ 100%',
    testerName: 'ธนสิทธิ์ & ทีม QA',
    date: '2026-09-28',
  },
  {
    id: 'exp-2',
    testCaseNumber: 'Case 2: Random BT System Verification',
    scenario: 'สุ่ม Burst Time 5 โปรเซส (ค่า 1-20) ตรวจสอบว่าระบบสามารถประมวลผลได้ครบทุกโปรเซสโดยไม่มี Deadlock หรือ Loop ค้าง',
    isFirstAttemptPass: false,
    encounteredIssue: 'เมื่อสุ่มโปรเซสที่มี Burst Time สูง โปรแกรมค้างและเบราว์เซอร์แจ้งเตือน unresponsive script',
    rootCause: 'ใน Round Robin เงื่อนไขการวนซ้ำไม่มี Loop Guard และกรณีที่ Time Quantum ถูกป้อนเป็น 0 หรือค่าว่าง ทำให้ `currentTime` ไม่เดินหน้า เกิด infinite loop',
    solutionFix: 'เพิ่ม Input Validation บังคับ Quantum >= 1 และครอบ Loop Guard ป้องกันการวนซ้ำเกินขีดจำกัด พร้อมแจ้ง Error Alert ทันทีหากค่าไม่ถูกต้อง',
    verifiedOutput: 'ผ่านเกณฑ์: สุ่มทดสอบ 20 รอบต่อเนื่อง ทั้ง 5 โปรเซสคำนวณได้ผลลัพธ์ถูกต้องทุกรอบ และค่า Completion Time รวมเท่ากับผลรวม Burst Time พอดี',
    testerName: 'ทีมทดสอบ',
    date: '2026-09-29',
  },
  {
    id: 'exp-3',
    testCaseNumber: 'Case 3: RR Multi-Quantum Comparison',
    scenario: 'ใช้ชุดข้อมูลเดิม P1=6, P2=8, P3=7, P4=3 แต่ทดสอบเปรียบเทียบค่า Time Quantum = 1, 2, และ 4',
    isFirstAttemptPass: true,
    encounteredIssue: 'ไม่มีข้อผิดพลาดในการรัน แต่สังเกตว่าเมื่อ Quantum น้อยเกินไป (Q=1) จะเกิด Context Switch สูงมาก แม้ AVG WT จะกระจายตัวดี',
    rootCause: 'เป็นพฤติกรรมปกติของ Round Robin (Trade-off ระหว่าง Response Time และ Overhead ของ Context Switch)',
    solutionFix: 'จัดทำกราฟเปรียบเทียบจำนวนการสลับคิว (Gantt Blocks count) เพื่อใช้อธิบายในวิดีโอคลิปส่วนที่ 2 ว่าทำไม Q=2 ถึงเหมาะสมกว่า Q=1 ในเคสนี้',
    verifiedOutput: 'ผ่านเกณฑ์: Q=1 ได้ 24 blocks (AVG WT=11.00), Q=2 ได้ 14 blocks (AVG WT=12.25), Q=4 ได้ 9 blocks (AVG WT=11.75)',
    testerName: 'ธนสิทธิ์',
    date: '2026-09-30',
  },
  {
    id: 'exp-4',
    testCaseNumber: 'Case 4: Negative & Zero Input Validation Edge Cases',
    scenario: 'ทดสอบกรอกค่าผิดปกติ: จำนวนโปรเซส = 0, Burst Time = -5, ตัวอักษร "abc", และ Time Quantum = -2',
    isFirstAttemptPass: false,
    encounteredIssue: 'ในตอนแรกโปรแกรมไม่แจ้งเตือนแต่แสดงผลตารางเป็น NaN และคำนวณ AVG WT ออกมาเป็น NaN',
    rootCause: 'ฟังก์ชันรับค่าจาก Input Element ไม่ได้แปลงชนิดข้อมูล (Type Casting) และไม่ได้เช็ค `Number.isInteger(val) && val > 0` ก่อนส่งเข้า Engine',
    solutionFix: 'เขียน Validation Middleware ก่อนเริ่มรัน โดยถ้าพบข้อผิดพลาด จะแสดง Modal Alert แจ้งระบุช่องที่ผิดชัดเจน และระงับการคำนวณจนกว่าจะแก้ไข',
    verifiedOutput: 'ผ่านเกณฑ์: ขึ้นเตือน "กรุณากรอก Burst Time เป็นจำนวนเต็มบวก (> 0)" และไม่ยอมให้ส่งค่าผิดเข้าฟังก์ชันคำนวณ',
    testerName: 'ทีม QA',
    date: '2026-10-01',
  },
];

export const INITIAL_HAND_CALCULATION: HandCalculationVerification = {
  caseTitle: 'การตรวจสอบด้วยการคำนวณด้วยตนเอง (Manual Calculation Proof) - Case 1',
  datasetSummary: 'กำหนด 4 โปรเซส: P1(BT=6), P2(BT=8), P3(BT=7), P4(BT=3) กำหนด Arrival Time = 0 ทุกตัว',
  algorithm: 'เปรียบเทียบทั้ง 3 อัลกอริทึม (FCFS vs SJF Non-preemptive vs Round Robin Q=2)',
  quantum: 2,
  manualSteps: [
    {
      step: '1. FCFS ลำดับ P1 -> P2 -> P3 -> P4',
      formula: 'P1: ST=0, CT=6, TAT=6, WT=0 | P2: ST=6, CT=14, TAT=14, WT=6 | P3: ST=14, CT=21, TAT=21, WT=14 | P4: ST=21, CT=24, TAT=24, WT=21',
      result: 'ผลรวม WT = 0 + 6 + 14 + 21 = 41 -> AVG WT = 41 / 4 = 10.25 ms (ตรงกับระบบ)',
    },
    {
      step: '2. SJF (Non-preemptive) เรียงตาม BT: P4(3) -> P1(6) -> P3(7) -> P2(8)',
      formula: 'P4: ST=0, CT=3, TAT=3, WT=0 | P1: ST=3, CT=9, TAT=9, WT=3 | P3: ST=9, CT=16, TAT=16, WT=9 | P2: ST=16, CT=24, TAT=24, WT=16',
      result: 'ผลรวม WT = 3 + 16 + 9 + 0 = 28 -> AVG WT = 28 / 4 = 7.00 ms (ตรงกับระบบ)',
    },
    {
      step: '3. Round Robin (Time Quantum = 2)',
      formula: 'คิวทำงาน: P1[0-2], P2[2-4], P3[4-6], P4[6-8], P1[8-10], P2[10-12], P3[12-14], P4[14-15 เสร็จ], P1[15-17 เสร็จ], P2[17-19], P3[19-21], P2[21-23 เสร็จ], P3[23-24 เสร็จ]',
      result: 'CT: P1=17, P2=23, P3=24, P4=15 | WT = CT - BT: P1=11, P2=15, P3=17, P4=12 | ผลรวม WT = 55 -> AVG WT = 13.75 ms (ตรงกับระบบ)',
    },
  ],
  systemMatchConfirmed: true,
  notes: 'ยืนยันว่าอัลกอริทึม SJF ให้ค่า AVG WT ต่ำที่สุด (7.00 ms) ดีกว่า FCFS (10.25 ms) และ Round Robin ตามทฤษฎีในหนังสือ Operating System Concepts',
};

export const INITIAL_AI_PROMPT_LOGS: AiPromptLog[] = [
  {
    id: 'ai-1',
    phase: '1. การวางแผน (Planning & Architecture)',
    toolUsed: 'Google AI Studio (Gemini 2.5 Flash)',
    purpose: 'วางแผนโครงสร้าง One-Page Applet ให้เลื่อนนำเสนออาจารย์ตั้งแต่บนลงล่างได้อย่างลื่นไหล ไม่ต้องสลับหน้าต่าง',
    promptExample:
      'เรากำลังทำ Term Project วิชา Operating Systems ต้องสร้างโปรแกรมจำลอง CPU Scheduling (FCFS, SJF, RR) ช่วยวางแผนสถาปัตยกรรมเว็บแอปแบบ Single-Page เพื่อให้สามารถเปิดเว็บแล้วใช้เป็นสไลด์พรีเซนต์สดให้อาจารย์ดูทีละขั้นตอน ตั้งแต่ Input -> ผลลัพธ์ -> โค้ด -> การตรวจคำนวณมือ -> บันทึกผลจริง -> วิดีโอ ควรแบ่งลำดับหัวข้อและ Component อย่างไร?',
    aiResponseSummary:
      'AI แนะนำให้แบ่งเป็น 7 ส่วนหลักตามลำดับการเลื่อน (Sequential Storyflow) พร้อมทำแถบ Sticky Top Navigation ด้านบนระบุหมายเลข 1–7 ให้กรรมการเห็นความคืบหน้า และแนะนำให้วางตัวจำลองไว้ด้านบนเพื่อดึงดูดความสนใจทันทีที่เปิดเว็บ',
    humanVerificationAndCorrection:
      'สมาชิกในกลุ่มนำแผนนี้มาปรับแก้ โดยเพิ่มส่วน "ตารางบันทึกผลจริงของสมาชิก" และ "ระบบส่งออกโค้ดคู่กับ JSON" เพื่อให้ตรงตามเกณฑ์และคำสั่งเพิ่มเติมของอาจารย์',
    ethicalSummary: 'ใช้ AI ช่วย Brainstorm โครงสร้าง UX และ User Journey โดยสมาชิกเป็นผู้ตัดสินใจเลือกลำดับและการจัดวางจริง',
  },
  {
    id: 'ai-2',
    phase: '2. การคิดและทบทวนทฤษฎี (Thinking & OS Concepts)',
    toolUsed: 'Gemini 2.5 Pro',
    purpose: 'ตรวจสอบความถูกต้องของนิยามเวลา ST (Start Time), CT, TAT, WT เมื่อโปรเซสทุกตัวมี Arrival Time = 0',
    promptExample:
      'ในโจทย์ CPU Scheduling กำหนดว่าทุกโปรเซสเข้ามาพร้อมกันที่ AT = 0: 1) ทำไมสูตร TAT = CT - AT จึงลดรูปเหลือ TAT = CT? 2) ใน Round Robin หากโปรเซสหนึ่งได้รับ CPU หลายช่วงเวลา (Context Switches) ค่า Start Time (ST) และ Completion Time (CT) ต้องนับช่วงเวลาไหน?',
    aiResponseSummary:
      'AI อธิบายว่า เมื่อ AT=0 เวลาที่โปรเซสอยู่ในระบบ (TAT) จะเท่ากับเวลาที่ทำงานเสร็จ (CT) พอดี และใน Round Robin: ST ต้องบันทึกเฉพาะเวลาที่โปรเซส "แตะ CPU ครั้งแรกสุด" (First Time Allocated) ส่วน CT คือเวลาที่เบิร์สไทม์หยดสุดท้ายทำงานจบสมบูรณ์',
    humanVerificationAndCorrection:
      'สมาชิกตรวจสอบยืนยันกับหนังสือ Operating System Concepts (Silberschatz) และสไลด์บรรยายของ ผศ.ดร.กิ่งกาญจน์ พบว่าถูกต้องตรงกันทุกประการ จึงนำนิยามนี้ไปใช้ตั้งสูตรในระบบ',
    ethicalSummary: 'ใช้ AI ช่วยทวนสอบแนวคิดเชิงทฤษฎี โดยมีการ cross-check กับตำราเรียนและชีทของอาจารย์ผู้สอนก่อนนำมาใช้งานจริง',
  },
  {
    id: 'ai-3',
    phase: '3. การคำนวณและตรวจสอบตัวเลข (Calculation & Verification)',
    toolUsed: 'Google AI Studio & Custom Scripts',
    purpose: 'สร้างชุดตัวเลขทดสอบ Case 1 (4 โปรเซส: 6, 8, 7, 3) และคำนวณหาค่าเฉลี่ย AVG WT ล่วงหน้าเพื่อใช้ตรวจกับระบบ',
    promptExample:
      'ให้โปรเซส P1=6, P2=8, P3=7, P4=3 (ทุกตัว AT=0) ช่วยคำนวณตาราง Gantt Chart, ST, CT, TAT, WT และ AVG WT ของทั้ง FCFS, SJF (Non-preemptive), และ Round Robin (Q=2) แสดงวิธีคิดทีละขั้นตอนแบบละเอียด',
    aiResponseSummary:
      'AI คำนวณผลลัพธ์: FCFS ได้ AVG WT = 10.25 ms, SJF ได้ AVG WT = 7.00 ms (จัดลำดับ P4, P1, P3, P2), และ Round Robin (Q=2) ได้ AVG WT = 13.75 ms พร้อมแจกแจงช่วงเวลาสลับคิวครบทั้ง 13 รอบ',
    humanVerificationAndCorrection:
      'สมาชิกในกลุ่ม (นายธนสิทธิ์ และทีม QA) หยิบกระดาษมาคำนวณมือด้วยตนเองทีละขั้นตอนตามโจทย์ 1.6 เพื่อยืนยันว่าผลของ AI ไม่มีความผิดพลาดทางคณิตศาสตร์ และนำบันทึกนี้ไปใส่ในตาราง Hand Calculation Proof',
    ethicalSummary: 'ไม่เชื่อผลลัพธ์ของ AI ทันที มีการคำนวณมือซ้ำโดยมนุษย์เพื่อพิสูจน์ความถูกต้อง 100% ก่อนใส่ลงในระบบ',
  },
  {
    id: 'ai-4',
    phase: '4. การเขียนโค้ดและแก้บั๊ก (Coding & Debugging)',
    toolUsed: 'Gemini Code Assist',
    purpose: 'ช่วยวิเคราะห์และแก้ไขบั๊ก Round Robin ที่คำนวณ ST ผิดพลาด และปัญหาคิวค้าง (Infinite Loop)',
    promptExample:
      'ในฟังก์ชัน Round Robin ของเรา ค่า ST ของ P1 แสดงเป็นเวลาของรอบสุดท้ายแทนที่จะเป็น 0 และถ้าผู้ใช้กรอก Time Quantum = 0 โปรแกรมจะค้าง ช่วยดูโค้ดนี้และระบุจุดที่ผิดให้หน่อย',
    aiResponseSummary:
      'AI ชี้จุดบกพร่อง 2 จุด: 1) โค้ดเดิมอัปเดต `firstStartTime[id] = currentTime` ทุกครั้งที่ dequeue ทำให้ค่า ST ถูกเขียนทับ แนะนำให้ใส่ `if (firstStartTime[id] === undefined)` 2) ขาดการตรวจสอบ Quantum <= 0 ทำให้ currentTime ไม่เดินหน้า แนะนำให้ใส่ Input Validation และ Loop Guard',
    humanVerificationAndCorrection:
      'สมาชิกได้นำคำแนะนำของ AI มาเขียนแก้ไขจริงในฟังก์ชัน `runRoundRobin` และบันทึกข้อผิดพลาดนี้ลงใน "ตารางบันทึกผลจริงของสมาชิก" เพื่อใช้อธิบายอาจารย์ว่าเจอบั๊กอะไรและแก้อย่างไร',
    ethicalSummary: 'เปิดเผยอย่างโปร่งใสว่า AI ช่วยระบุจุดบกพร่องของโค้ด และนักศึกษาเป็นผู้เขียนโค้ดแก้ไขและทดสอบซ้ำด้วยตนเอง',
  },
  {
    id: 'ai-5',
    phase: '5. การวางแผนนำเสนอและสคริปต์วิดีโอ (Presentation Scripting)',
    toolUsed: 'Google AI Studio (Gemini 2.5 Flash)',
    purpose: 'ช่วยร่างโครงสร้างสคริปต์การพูดนำเสนอความยาว 5–8 นาที สำหรับวิดีโอส่วนที่ 2 และส่วนที่ 3 ให้ครบตาม Rubric',
    promptExample:
      'ช่วยร่างโครงร่างสคริปต์การพูดนำเสนอ Term Project วิดีโอ 2 ส่วน: ส่วนที่ 2 (อธิบายโปรแกรม) และ ส่วนที่ 3 (เบื้องหลัง AI) โดยแบ่งหน้าที่พูดให้สมาชิก 3 คนอย่างเท่าเทียม เน้นการอธิบายเหตุผลของการเขียนโค้ด ไม่ใช่แค่อ่านสไลด์',
    aiResponseSummary:
      'AI จัดทำ Script Timeline: นาทีที่ 0-1 แนะนำตัวและโจทย์, นาทีที่ 1-3 อธิบายอัลกอริทึมและโค้ดสำคัญ, นาทีที่ 3-5 สาธิตการรัน 3 กรณีทดสอบ, นาทีที่ 5-7 อธิบายการใช้ AI อย่างโปร่งใสและบั๊กที่เจอจริง พร้อมจุดแบ่งบทพูดให้สมาชิกทั้ง 3 คน',
    humanVerificationAndCorrection:
      'สมาชิกนำสคริปต์มาซักซ้อม ปรับภาษาให้เป็นธรรมชาติของตนเอง และซ้อมสาธิตการคลิกหน้าเว็บจริงตามเวลาที่กำหนด',
    ethicalSummary: 'ใช้ AI เป็นเสมือนที่ปรึกษาช่วยจัดลำดับความคิดและซักซ้อมบทพูด เพื่อการนำเสนอที่มีประสิทธิภาพสูงสุด',
  },
];

