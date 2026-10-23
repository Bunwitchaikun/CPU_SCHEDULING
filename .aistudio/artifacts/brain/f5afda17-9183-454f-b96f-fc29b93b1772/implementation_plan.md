# CPU Scheduling Simulator: Full Codebase & Offline Runnable HTML Package

ยกระดับปุ่ม "ดาวน์โหลดโปรแกรม" ให้สามารถส่งออกไฟล์ ZIP ที่ประกอบด้วยทั้งซอร์สโค้ดโปรเจกต์เว็บทั้งหมด (Full React + TypeScript + Vite Codebase) ควบคู่กับแอปพลิเคชัน HTML แบบ Standalone (Zero-Dependency Offline HTML Simulator) ที่ผู้ใช้งานสามารถดับเบิลคลิกเปิดรันบนเว็บเบราว์เซอร์ได้ทันทีโดยไม่ต้องใช้อินเทอร์เน็ตหรือติดตั้ง Node.js พร้อมแนบซอร์สโค้ดภาษา C++ และ Python สำหรับประกอบรายงานฉบับสมบูรณ์

---

## User Review & Critical Decisions

> [!IMPORTANT]
> สรุปข้อตกลงที่ได้รับการยืนยันจากผู้ใช้ใน Phase 1:
> 1. **โครงสร้างไฟล์ ZIP แบบไฮบริด (Hybrid Architecture)**: ไฟล์ ZIP จะบรรจุทั้ง (1) ไฟล์ `Run_Offline_Simulator.html` และ `index.html` แบบ Standalone Single-File ที่ฝังทั้ง CSS, UI และ Logic ครบวงจร ดับเบิลคลิกใช้งานได้ทันที และ (2) โฟลเดอร์ซอร์สโค้ดทั้งโปรเจกต์ (`src/`, `public/`, `package.json`, `vite.config.ts`, `tsconfig.json`) สำหรับนำไปพัฒนาต่อหรือตรวจสอบโครงสร้างโค้ด
> 2. **รวมซอร์สโค้ดหลายภาษาครบถ้วน (Multi-Language Source Files)**: แนบไฟล์อัลกอริทึม CPU Scheduling (FCFS, Non-preemptive Priority/SJF, Preemptive SJF/SRTF, Round Robin) ในภาษา C++ (`scheduler.cpp`), Python (`scheduler.py`) และ JavaScript/TypeScript (`scheduler.js` / `scheduler.ts`) ให้อาจารย์และผู้ตรวจนำไปทดสอบใน terminal ได้ทันที
> 3. **การทำงานแบบออฟไลน์ 100% (Zero-Dependency Guarantee)**: ไฟล์ HTML ออฟไลน์จะไม่มีการดึง CDN ภายนอก ทั้งฟอนต์ สไตล์ UI กล่องกรอกข้อมูล Process/AT/BT ปุ่มสลับอัลกอริทึม การคำนวณ ST, CT, TAT, WT, AVG WT และ Gantt Chart จะถูก Render ด้วย Vanilla HTML/CSS/JavaScript ในตัวไฟล์เดียว

---

## 1. Overview & Core Concept

- **What It Does**: เมื่อผู้ใช้คลิกปุ่ม "ดาวน์โหลดโปรแกรม" จากแถบสารบัญด้านข้าง (Sidebar TOC) หรือเมนูด่วน ระบบจะสร้างไฟล์บีบอัด `CS422-CPU-Scheduling-Complete.zip` ที่มีข้อมูลครบทุกมิติ:
  - **Offline Runner**: `Run_Offline_Simulator.html` (และ `index.html`) เปิดใน Google Chrome, Microsoft Edge, Safari หรือ Firefox ได้ทันทีแบบออฟไลน์
  - **Complete Web Project Source**: ไฟล์โปรเจกต์ React + TypeScript + Tailwind ทั้งหมดที่ตรงกับโครงสร้างจริงใน Workspace
  - **Academic Multi-Language Implementations**: `scheduler.cpp`, `scheduler.py`, `scheduler.js` พร้อมชุดคำสั่งทดสอบผ่าน Terminal
  - **Documentation & Test Data**: `README.md`, `HOW_TO_RUN_OFFLINE.txt`, `test-cases.json`, และ `report-template.md`
- **Target Audience**: อาจารย์ประจำวิชา (ตรวจโค้ด รันโปรแกรมออฟไลน์ หรือคอมไพล์ C++/Python), กรรมการประเมิน Term Project, และนักศึกษาในกลุ่มที่ต้องส่งมอบไฟล์ครบชุด
- **Key Value**: แก้ปัญหาอาจารย์ไม่มี Node.js หรือเปิดโปรเจกต์ไม่เป็น — แค่ดับเบิลคลิกไฟล์ HTML ก็รันแบบจำลองและเห็น Gantt Chart ได้ทันที พร้อมส่งโค้ดทุกภาษาตามเกณฑ์การให้คะแนน

---

## 2. User Experience & Visual Design

### Key User Flows
1. **คลิกดาวน์โหลด**: ผู้ใช้กดปุ่ม "ดาวน์โหลดโปรแกรม" ในแถบสารบัญด้านข้าง
2. **สร้างและบันทึก ZIP**: ระบบประมวลผลผ่าน `JSZip` รวบรวมไฟล์ทั้งหมดและดาวน์โหลดอัตโนมัติ พร้อมแสดงสถานะ Toast "ดาวน์โหลดโค้ดและไฟล์ออฟไลน์สำเร็จ"
3. **เปิดใช้งานแบบออฟไลน์**:
   - ผู้ใช้แตกไฟล์ ZIP จะพบไฟล์ `Run_Offline_Simulator.html` อยู่ที่ Root Directory
   - ดับเบิลคลิกเปิดไฟล์ขึ้นมา จะพบหน้าจอ Interactive CPU Scheduling Simulator สไตล์ Modern Academic (ธีม Slate Dark/Light สะอาดตา)
   - ปรับแต่งจำนวนโปรเซส, กรอกหรือสลับค่า AT/BT ได้อิสระ, ปรับ Time Quantum, และกดจำลองการทำงาน
   - ตารางผลลัพธ์ (ST, CT, TAT, WT, AVG WT) และ Gantt Chart ตอบสนองทันทีแบบ Real-time พร้อมปุ่ม Copy สรุปผล

### Visual Identity & Theme for Offline Simulator
- **Canvas & Surface**: โทนสี Deep Slate (`#0F172A`) ควบคู่กับบล็อกข้อมูล `#1E293B` และเส้นขอบละเอียด `rgba(255,255,255,0.08)` สะท้อนความเป็นเครื่องมือวิศวกรรมคอมพิวเตอร์
- **Gantt Chart Visual**: บล็อกสีมาตรฐานกำกับแต่ละโปรเซส (P1 Sky Blue, P2 Emerald, P3 Amber, P4 Purple, P5 Rose) ตัวเลขช่วงเวลาใช้ `font-mono tabular-nums` ชัดเจน ไม่เบี้ยว
- **Zero-Pill Typography**: ส่วนหัวและค่าพารามิเตอร์แสดงผลอย่างเรียบหรู คั่นด้วย `·` ตามมาตรฐาน Anti-Slop
- **Responsive Controls**: ตารางโปรเซสปรับความกว้างช่อง AT และ BT พอดี ไม่ถูกตัดทอน พร้อมปุ่ม Add/Remove Process

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: การจัดทำ Standalone Offline Simulator แบบ Zero-Dependency
- **Chosen Approach**: สร้างไฟล์ `Run_Offline_Simulator.html` ที่รวบรวม HTML โครงสร้าง, Embedded Modern CSS, และ Vanilla JavaScript สำหรับอัลกอริทึมทั้ง 4 (FCFS, Priority/SJF, SRTF, RR) และตัววาด Gantt Chart ในไฟล์เดียว
- **Why**: อาจารย์หรือผู้ตรวจมักไม่มีสภาพแวดล้อม `npm` หรือ `node_modules` ในเครื่อง การมีไฟล์ HTML ไฟล์เดียวที่ดับเบิลคลิกแล้วทำงานได้ทันทีแบบ 100% Offline รับประกันคะแนนและการทำงานโดยไม่มีข้อผิดพลาดเรื่องสภาพแวดล้อม
- **Alternatives Considered**: การ Export เฉพาะโค้ด React ดิบ จะทำให้อาจารย์ที่เปิดผ่านเบราว์เซอร์ตรงๆ เจอหน้าจอว่างเปล่า (Blank Page) หรือติดปัญหา CORS/Vite Bundling

### Decision 2: การแถมชุดไฟล์ C++ และ Python
- **Chosen Approach**: สร้างไฟล์ `scheduler.cpp` (ใช้ STL vector, queue, algorithm) และ `scheduler.py` (ใช้ dataclasses และ standard library) ที่ให้ผลลัพธ์ ST, CT, TAT, WT, AVG WT ตรงกับแบบจำลองหน้าเว็บ 100%
- **Why**: วิชา Operating Systems มักมีเกณฑ์ให้ส่ง Source Code ภาษาเบื้องต้น (C/C++ หรือ Python) การมีทั้งสองภาษาเสริมควบคู่กับ Web Simulator ช่วยให้รายงานวิชาการสมบูรณ์แบบ
- **Alternatives Considered**: มีเฉพาะ JavaScript อย่างเดียว อาจไม่ครอบคลุมเกณฑ์ของบางอาจารย์ที่ต้องการดู Implementation ในภาษา C++

### Decision 3: การรวบรวม Source Code โปรเจกต์จริงใน Workspace
- **Chosen Approach**: บรรจุไฟล์โครงสร้าง React/TypeScript หลัก (`App.tsx`, `components/*`, `utils/*`, `types/*`, `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`) เข้าไปในโฟลเดอร์ `web-project-source/`
- **Why**: ตอบโจทย์ผู้ใช้ตามภาพ screenshot ที่ต้องการโค้ดโปรเจกต์ทั้งหมดสำหรับนำไป Build หรือ Deploy ต่อได้

---

## 4. Technical Architecture & Data Strategy

### System & ZIP Bundle Structure Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CS422-CPU-Scheduling-Complete.zip                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [1] STANDALONE OFFLINE SIMULATORS (Zero-Dependency, Run in Browser)   │
│  ├── Run_Offline_Simulator.html      <-- ดับเบิลคลิกเปิดรันได้ทันที     │
│  ├── index.html                      <-- ทางเข้าหลักแบบออฟไลน์          │
│  └── HOW_TO_RUN_OFFLINE.txt          <-- คำอธิบายการใช้งานแบบย่อ       │
│                                                                        │
│  [2] MULTI-LANGUAGE ALGORITHM IMPLEMENTATIONS                          │
│  ├── cplusplus/                                                        │
│  │   └── scheduler.cpp               <-- C++17 Standard Implementation │
│  ├── python/                                                           │
│  │   └── scheduler.py                <-- Python 3.8+ Implementation    │
│  └── javascript/                                                       │
│      └── scheduler.js                <-- Node.js / Browser Engine      │
│                                                                        │
│  [3] FULL REACT / TYPESCRIPT PROJECT SOURCE (Workspace Source Tree)    │
│  └── web-project-source/                                               │
│      ├── package.json                                                  │
│      ├── vite.config.ts                                                │
│      ├── tsconfig.json                                                 │
│      ├── index.html                                                    │
│      └── src/                                                          │
│          ├── App.tsx                                                   │
│          ├── main.tsx                                                  │
│          ├── index.css                                                 │
│          ├── components/ (Header, Simulator, Gantt, Comparison, TOC)   │
│          ├── utils/ (algorithms, schedulerGenerator, exportUtils)      │
│          ├── types/ (simulator.ts)                                     │
│          └── data/ (initialProcesses.ts, members.ts)                   │
│                                                                        │
│  [4] ACADEMIC DOCUMENTATION & TEST SUITES                              │
│  ├── README.md                       <-- คู่มือและสารบัญโครงการ         │
│  ├── test-cases.json                 <-- ข้อมูลทดสอบ Case 1, 2, 3       │
│  └── report-summary.md               <-- สรุปผลสำหรับใส่เล่มรายงาน      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & Generator Flow Mapping
- **`SidebarTOC.tsx` / `App.tsx`**: ควบคุม Trigger เมื่อคลิกปุ่ม "ดาวน์โหลดโปรแกรม"
- **`src/utils/schedulerGenerator.ts`**:
  - `generateOfflineHtml(bursts, quantum)`: สร้าง HTML String ขนาดกะทัดรัดแต่สมบูรณ์ ฝัง CSS + Vanilla JS คำนวณ FCFS, Priority, SRTF, RR และวาด Gantt Chart สวยงาม
  - `generateCppSource()`: สร้างโค้ด C++ พร้อม main() ตัวอย่างการรัน
  - `generatePythonSource()`: สร้างโค้ด Python พร้อม CLI argument runner
  - `downloadFullProjectZip(bursts, quantum, ...)`: รวบรวมทุกส่วนเข้า JSZip และส่งออกเป็น `CS422-CPU-Scheduling-Complete.zip`
- **State Integration**: ดึงชุดข้อมูลโปรเซสและพารามิเตอร์ปัจจุบันที่ผู้ใช้ตั้งไว้บนหน้าจอ (Current Processes & Quantum) นำไปตั้งเป็นค่าเริ่มต้นในไฟล์ HTML ออฟไลน์และชุดทดสอบอัตโนมัติ

---

## 5. Planned Verification & Acceptance Criteria
1. **Compilation Check**: ตรวจสอบว่าแอปพลิเคชันยังคง Build ผ่าน (`compile_applet`) โดยไม่มี Error หรือ Missing Dependencies
2. **ZIP Generation Test**: ทดสอบการกดปุ่ม "ดาวน์โหลดโปรแกรม" ตรวจสอบโครงสร้างไฟล์ภายใน ZIP ว่าครบถ้วนทั้ง `Run_Offline_Simulator.html`, C++, Python, และซอร์สโค้ด React
3. **Offline HTML Verification**: ตรวจสอบว่า `Run_Offline_Simulator.html` มี Logic ครบ 100%, สลับอัลกอริทึมได้, กรอก AT และ BT ได้, วาด Gantt Chart ถูกต้อง และไม่มี External Network Calls ใดๆ
