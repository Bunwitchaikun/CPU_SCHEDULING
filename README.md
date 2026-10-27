# 🚀 CPU Scheduling Simulator & Visualizer (v1.0.0)

[![Version](https://img.shields.io/badge/Version-1.0.0-emerald.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github&logoColor=white)](https://github.com/Bunwitchaikun/CPU_SCHEDULING.git)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![YouTube Part 1](https://img.shields.io/badge/YouTube-Part_1:_Program_Demo-FF0000?logo=youtube&logoColor=white)](https://youtu.be/unWcTIsrMGI)
[![YouTube Part 2](https://img.shields.io/badge/YouTube-Part_2:_AI_Collaboration-9333EA?logo=youtube&logoColor=white)](https://youtu.be/UMgsffcb5eg)

An interactive, high-fidelity **CPU Scheduling Simulator and Analysis Suite** developed as a university term project for the **Operating Systems** course under the supervision of **Asst. Prof. Dr. Kingkarn Sookhanaphibarn**.

This platform simulates, visualizes, and benchmarks classical CPU scheduling algorithms with arbitrary arrival times, dynamic quantum configurations, interactive Gantt chart scrubbing, step-by-step mathematical verification, and multi-language algorithm implementations (JavaScript, C++, and Python).

---

## 📺 Project Video Presentations

Watch our comprehensive video presentations walking through the core concepts, user interface, algorithm implementations, experimental results, and transparent AI collaboration:

- 🎬 **Part 1 · Program Demonstration & Architecture:** 👉 **[Watch on YouTube](https://youtu.be/unWcTIsrMGI)**
- 🤖 **Part 2 · AI Collaboration & Behind-the-Scenes:** 👉 **[Watch on YouTube](https://youtu.be/UMgsffcb5eg)**

---

## 🎯 Key Features

- **⚡ Four Classical Scheduling Algorithms**:
  - **FCFS** (First-Come, First-Served)
  - **SJF Non-Preemptive** (Shortest Job First)
  - **SJF Preemptive / SRTF** (Shortest Remaining Time First)
  - **Round Robin (RR)** with configurable Time Quantum ($q$)
- **📊 Interactive Gantt Chart Visualizer**:
  - Continuous timeline with clear idle time indicators (`[IDLE]`)
  - Real-time execution playback: **Play**, **Pause**, **Step Forward**, **Step Backward**, and **Playback Speed Slider** (0.25x – 4.0x)
  - Current CPU execution state, remaining burst time counters, and timeline scrubber
- **📐 Mathematical Verification & Formula Engine**:
  - Transparent step-by-step calculation cards for every process
  - Real-time computing of Start Time ($ST$), Completion Time ($CT$), Turnaround Time ($TAT$), Waiting Time ($WT$), and Response Time ($RT$)
  - Auto-generated summary of Average Waiting Time ($\text{AWT}$) and Average Turnaround Time ($\text{ATAT}$)
- **⚖️ Side-by-Side Algorithm Comparison Matrix**:
  - Run all 4 algorithms concurrently on identical workloads
  - Compare $\text{AWT}$ and $\text{ATAT}$ metrics to identify optimal scheduling strategies and analyze the Convoy Effect
- **💻 Multi-Language Code Walkthrough**:
  - Inspect production-grade implementations in **JavaScript**, **C++ (STL)**, and **Python (standard library)**
  - Syntax-highlighted code blocks with inline commentary explaining queue dynamics and tie-breaking rules
- **📦 Comprehensive Offline Export & Bundle**:
  - One-click packaging into a `.zip` archive containing:
    1. A single-file, zero-dependency **Standalone Offline HTML Simulator** runnable in any browser without an internet connection or web server
    2. Ready-to-compile **C++ (`scheduler.cpp`)** and **Python (`scheduler.py`)** source code pre-populated with your active dataset
    3. Complete full-stack React project source code with detailed `README.md`
- **🎓 Academic Transparency & Course Compliance**:
  - Built-in course guidelines section detailing assignment requirements, rubric alignment, team responsibilities, and AI tool disclosure statement

---

## 🔬 Theoretical Foundations & Formulas

In CPU scheduling, the operating system's short-term scheduler decides which ready process in main memory is allocated the CPU core.

### Process Metric Definitions

| Metric | Symbol | Definition |
| :--- | :---: | :--- |
| **Arrival Time** | $AT$ | Time unit at which the process arrives into the Ready Queue |
| **Burst Time** | $BT$ | Total CPU execution time required by the process |
| **Start Time** | $ST$ | Time unit when the CPU executes the process for the very first time |
| **Completion Time** | $CT$ | Time unit when the process finishes its total execution requirement |
| **Turnaround Time** | $TAT$ | Total duration from arrival to completion: $$TAT = CT - AT$$ |
| **Waiting Time** | $WT$ | Total duration spent waiting inside the Ready Queue: $$WT = TAT - BT$$ |
| **Response Time** | $RT$ | Duration from arrival until first CPU acquisition: $$RT = ST - AT$$ |

### Aggregate Performance Metrics

$$\text{Average Turnaround Time (ATAT)} = \frac{1}{n} \sum_{i=1}^{n} TAT_i$$

$$\text{Average Waiting Time (AWT)} = \frac{1}{n} \sum_{i=1}^{n} WT_i$$

### Scheduling Algorithms Overview

```
                   ┌─────────────────────────────────────────┐
                   │        CPU Scheduling Algorithms         │
                   └────────────────────┬────────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
       [ Non-Preemptive ]                                 [ Preemptive ]
  ┌─────────────────────────────┐               ┌─────────────────────────────┐
  │ • FCFS (Arrival order)       │               │ • SJF / SRTF (Remaining BT) │
  │ • SJF Non-Preemptive (Min BT)│               │ • Round Robin (Time Slice q)│
  └─────────────────────────────┘               └─────────────────────────────┘
```

1. **FCFS (First-Come, First-Served)**:
   - Non-preemptive discipline where processes are scheduled strictly by arrival order ($AT$).
   - Susceptible to the **Convoy Effect**, where long processes delay shorter processes behind them, inflating average waiting time.
2. **SJF (Shortest Job First - Non-Preemptive)**:
   - Selects the ready process with the smallest initial Burst Time ($BT$).
   - Once assigned to the CPU, the process executes to completion without interruption.
3. **SJF Preemptive / SRTF (Shortest Remaining Time First)**:
   - Preemptive variant of SJF. Whenever a new process arrives, if its burst time is strictly shorter than the currently running process's remaining burst time, a context switch occurs.
   - Yields the theoretically minimal average waiting time, but requires overhead for preemption tracking.
4. **Round Robin (RR)**:
   - Preemptive discipline allocating each process a fixed time quantum ($q$).
   - When a quantum expires, the currently executing process is moved to the tail of the Ready Queue, preventing starvation and optimizing response times for time-sharing environments.

---

## 🧪 Test Cases & Verification Suite (กรณีทดสอบตามเกณฑ์และตัวอย่างผลลัพธ์)

The simulator includes three standardized test cases adhering strictly to the course rubric and manual calculation proofs:

### 1. Case 1: Manual Burst Time Input (กรณีที่ 1: กำหนด BT เอง)
- **Workload**: $n = 4$ processes with $AT = 0$
  - $P1: BT = 6$
  - $P2: BT = 8$
  - $P3: BT = 7$
  - $P4: BT = 3$
- **Time Quantum ($q$)**: 2 units for Round Robin
- **Benchmark Results & Mathematical Verification**:
  | Algorithm | Process Execution Order | CT by Process | AWT ($\text{ms}$) | ATAT ($\text{ms}$) | Status |
  | :--- | :--- | :--- | :---: | :---: | :---: |
  | **FCFS** | $P1 \to P2 \to P3 \to P4$ | $P1:6, P2:14, P3:21, P4:24$ | **10.25** | 16.25 | ✅ 100% Match |
  | **SJF (Non-preemptive)** | $P4 \to P1 \to P3 \to P2$ | $P1:9, P2:24, P3:16, P4:3$ | **7.00** *(Optimal)* | 13.00 | ✅ 100% Match |
  | **SJF (Preemptive / SRTF)** | $P4 \to P1 \to P3 \to P2$ | $P1:9, P2:24, P3:16, P4:3$ | **7.00** | 13.00 | ✅ 100% Match |
  | **Round Robin ($q=2$)** | 13 Slices ($P1,P2,P3,P4,\dots$) | $P1:17, P2:23, P3:24, P4:15$ | **13.75** | 19.75 | ✅ 100% Match |

### 2. Case 2: Random Burst Time Generation (กรณีที่ 2: สุ่ม BT)
- **Workload**: $n = 5$ processes with randomized Burst Times ($1 \le BT \le 20$, positive integers) and $AT = 0$.
- **Verification Criteria**: Confirms zero deadlocks, zero negative values, zero `NaN` occurrences, and correct calculation across all processes.

### 3. Case 3: Round Robin Multi-Quantum Comparison (กรณีที่ 3: เปลี่ยน Time Quantum)
- **Workload**: Identical Case 1 dataset ($P1=6, P2=8, P3=7, P4=3$).
- **Quantum Sensitivity Analysis**:
  | Quantum ($q$) | Context Switches / Slices | Behavior & Trade-off | AWT ($\text{ms}$) |
  | :---: | :---: | :--- | :---: |
  | **$q = 1$** | 24 Slices | High overhead, fine-grained time sharing | 15.25 |
  | **$q = 2$** | 13 Slices | Balanced response time and context switching | 13.75 |
  | **$q = 4$** | 9 Slices | Lower context switching, behaves closer to FCFS | 12.25 |

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) (Functional Components, Hooks, Context API) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Type Checking) |
| **Bundler & Tooling** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Compression & Export** | [JSZip](https://stuk.github.io/jszip/) |
| **Celebrations** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |

---

## 📂 Project Directory Structure

```text
├── index.html                     # Application HTML entry point
├── package.json                   # Project dependencies and npm scripts
├── tsconfig.json                  # TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler build settings
├── public/                        # Static assets (favicons, report attachments)
└── src/
    ├── main.tsx                   # React DOM root bootstrapping
    ├── App.tsx                    # Main container, active tab state, top navbar
    ├── index.css                  # Tailwind CSS root imports and theme tokens
    ├── types/
    │   └── simulator.ts           # Type definitions (Process, SimulationResult, Step)
    ├── data/
    │   └── initialData.ts         # Default process workloads, team data, guidelines
    ├── utils/
    │   ├── algorithms.ts          # Core scheduling engines (FCFS, SJF, SRTF, RR)
    │   └── schedulerGenerator.ts  # Dynamic code generation (HTML offline, C++, Python)
    └── components/
        ├── ProcessConfigurator.tsx# Process inputs (P#, AT, BT, Add/Delete, Presets)
        ├── SimulationControls.tsx # Playback controls, step scrubbing, speed slider
        ├── GanttChart.tsx         # Responsive Gantt chart & execution timeline
        ├── MetricsTable.tsx       # Detailed process metrics & aggregate averages
        ├── AlgorithmComparison.tsx# Side-by-side benchmark matrix across all 4 algorithms
        ├── ManualVerification.tsx # Step-by-step mathematical proof walkthrough cards
        ├── CodeWalkthrough.tsx    # Multi-language algorithm source code viewer
        ├── CourseGuidelines.tsx   # Project requirements, rubric, team duties & AI disclosure
        └── OfflineExportModal.tsx # ZIP bundling modal (Offline HTML, C++, Python, Project)
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: Version `18.0.0` or higher
- **npm**: Version `9.0.0` or higher (or `pnpm` / `yarn`)

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bunwitchaikun/CPU_SCHEDULING.git
   cd CPU_SCHEDULING
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port indicated in your terminal).

### Production Build

To compile a minified production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 💾 Running the Standalone Offline HTML File

The application features a built-in exporter that generates a zero-dependency, self-contained single-file HTML version (`cpu_scheduler_offline.html`):

1. Click **"ดาวน์โหลดโปรแกรม (ZIP)"** in the top navigation bar.
2. Select **"ดาวน์โหลดแพ็กเกจสมบูรณ์ (.ZIP)"**.
3. Extract the downloaded ZIP archive.
4. Double-click `cpu_scheduler_offline.html` to open it in **Chrome**, **Firefox**, **Edge**, or **Safari**.
5. No Node.js runtime, terminal, or internet connection is required!

---

## 👥 Project Team & Responsibilities

This project was developed for the **Operating Systems Term Project** at Bangkok University.

* **Course Instructor & Advisor**: **Asst. Prof. Dr. Kingkarn Sookhanaphibarn** (ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล)

| Name | Student ID | Role & Responsibilities |
| :--- | :---: | :--- |
| **Tanasit Boonwitcheikun**<br>*(ธนสิทธิ์ บุญวิทย์ชัยกุล)* | `1670701273` | **Algorithm Engine Lead & Core Architecture**<br>• Implemented mathematical scheduling algorithms (`runFCFS`, `runSJFNonPreemptive`, `runSJFPreemptive`, `runRoundRobin`)<br>• Handled context-switching edge cases, tie-breaking, and idle time states |
| **Thammasorn Suwalapha**<br>*(ธรรมสรณ์ สุวลาภา)* | `1670700291` | **Frontend UI/UX & Interactive Visualizer Lead**<br>• Designed modern responsive layout with Tailwind CSS<br>• Engineered animated Gantt chart, interactive timeline scrubber, and playback controller |
| **Natchaphon Photak**<br>*(ณัชพล โพธิ์ตาก)* | `1670700242` | **QA Testing, Video Production & Documentation Lead**<br>• Authored comprehensive verification engine and step-by-step calculation cards<br>• Directed, recorded, and produced project video presentation and technical documentation |

---

## 🤖 AI Disclosure & Academic Integrity

In compliance with university academic guidelines and syllabus requirements:

- **AI Tools Used**: Generative AI assistance was utilized to assist in drafting boilerplate UI layouts, formulating sample unit test datasets, and reviewing TypeScript interfaces.
- **Human Verification**: All scheduling algorithm logic, mathematical equations, verification formulas, tie-breaking rules, and architectural design were independently verified, tested against manual textbook calculation problems, and finalized by the project team.

---

## 📄 License

This project is open-source software licensed under the [Apache License 2.0](LICENSE).
