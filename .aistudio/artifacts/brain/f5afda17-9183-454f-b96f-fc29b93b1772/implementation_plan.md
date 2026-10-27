# Project User Manual & README Documentation Page

Add a dedicated **"คู่มือ" (User Manual / README)** view accessible from the top navigation bar. This view provides a high-fidelity, interactive documentation reader displaying the complete contents of `README.md`, equipped with a formatted presentation mode, raw markdown inspector, table of contents jumper, one-click README.md download, and quick copy-to-clipboard functionality.

---

> [!IMPORTANT]
> **User Confirmed Requirements from Clarification Phase:**
> - **Display Mode**: Beautifully formatted publication document with an interactive tab to toggle and inspect Raw Markdown syntax.
> - **Action Header**: Placed prominently at the top of the Manual page with both a "ดาวน์โหลด README.md" (Download `.md` file) button and a "คัดลอก Markdown" (Copy to clipboard) button with instant visual feedback.
> - **Navigation Integration**: Seamlessly embedded alongside "ห้องทดลองจำลอง" (Simulator) and "แบบประเมิน Rubric (100)" in the persistent Top Navigation bar.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the technical `README.md` repository documentation into an accessible, beautiful in-app User Manual ("คู่มือ") that students, instructors, and evaluators can read without leaving the application or opening external code viewers.
- **Target Audience**: Course instructors (Asst. Prof. Dr. Kingkarn Sookhanaphibarn), evaluators checking rubric compliance, students learning CPU scheduling concepts, and developers inspecting project structure.
- **Key Value**: Delivers zero-friction access to installation guides, mathematical formulas, algorithm logic, video presentation links, and project architecture with instant download and copy abilities.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Accessing the Manual**:
   - The user clicks the **"คู่มือ" (Book/FileText icon)** button in the Top Navigation bar next to "ห้องทดลองจำลอง" and "แบบประเมิน Rubric (100)".
   - The main view switches smoothly to the Documentation page without losing any active simulator state or calculations in memory.

2. **Reading & Interacting with the Documentation**:
   - **Formatted View (ค่าเริ่มต้น)**: Displays styled typography, badge indicators, code blocks with syntax styling, mathematical formula callouts, embedded video shortcut cards, and structured tables.
   - **Raw Markdown View**: Clicking the "Raw Markdown" tab switches to a clean monospace code view with line numbers and a dark terminal aesthetic.
   - **Sticky Sub-navigation / Jump Bar**: Allows users to quickly jump between key chapters (Overview, Algorithms & Formulas, Installation, AI Collaboration, Team).

3. **Export & Sharing Actions**:
   - **"ดาวน์โหลด README.md" Button**: Triggers an immediate browser download of the clean, raw UTF-8 `README.md` file with correct MIME type.
   - **"คัดลอก Markdown" Button**: Copies the entire markdown text to the user's clipboard and displays a 2-second checkmark confirmation toast.

### Visual Identity & Theme

- **Color Tokens**:
  - Background: Crisp canvas background (`bg-slate-50` with high-contrast `bg-white` reading container).
  - Primary Accents: Deep Indigo (`text-indigo-600`, `bg-indigo-600`) matching the core app branding, paired with Slate and Zinc for neutral reading comfort.
  - Code Block Surfaces: Dark slate theme (`bg-slate-900` / `border-slate-800`) with syntax color coding for bash commands, TypeScript, C++, and Python snippets.
- **Typography & Layout**:
  - Header Title: Bold display typography with metadata chip (`v1.0.0`, `Operating Systems CS422`).
  - Reading Column: Maximum width of 1100px with generous vertical rhythm (`leading-relaxed`), clear section dividers, and anti-slop text styling.
  - Badges & Pills Discipline: Plain, unboxed metadata text separated by typographic bullets (`·`), reserving bordered containers strictly for clickable action buttons and code fences.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Embedded Document vs. External Fetch**
  - *Chosen Approach*: Embed the authoritative, production-ready markdown text directly in a typed data module (`src/data/readmeContent.ts`), synchronized with the root `README.md`.
  - *Why*: Eliminates network latency, works 100% offline in exported standalone bundles, and avoids CORS or dynamic fetch path resolution errors in static preview environments.
- **Decision 2: Formatted Rich Reader + Raw Tab Switcher**
  - *Chosen Approach*: Provide a segmented control to switch between "จัดรูปแบบสวยงาม (Formatted View)" and "โค้ด Markdown ดิบ (Raw View)".
  - *Why*: Directly satisfies the user's clarified preference, giving casual readers an executive summary and developers/instructors access to verbatim text.
- **Decision 3: Standalone File Download via Blob**
  - *Chosen Approach*: Use client-side `URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8;' }))` for the download button.
  - *Why*: Instant download without server dependencies, preserving UTF-8 Thai and English characters perfectly.

---

## 4. Technical Architecture & Data Strategy

### Component Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│  (State: activePage = 'simulator' | 'rubric' | 'readme')│
└───────────┬────────────────────────────────────────────┘
            │
            ├── TopNav.tsx
            │    ├── [ห้องทดลองจำลอง]
            │    ├── [แบบประเมิน Rubric]
            │    └── [คู่มือ (README)] ◄─── NEW TAB
            │
            └── Page Renderer (Conditional Switch)
                 ├── <SimulatorSection /> (when activePage === 'simulator')
                 ├── <RubricScorecard />  (when activePage === 'rubric')
                 └── <ReadmeManualView /> ◄─── NEW COMPONENT
                      ├── Action Header (Download .md, Copy, Search)
                      ├── Mode Switcher (Formatted ⟷ Raw Markdown)
                      ├── Quick Chapter Jump Bar
                      └── Rendered Article / Raw Monospace Viewer
```

### Module Specifications

1. **`src/data/readmeContent.ts`**:
   - Contains the exact, full content of `README.md` exported as a constant string `README_CONTENT`.
   - Structured metadata list for quick chapter jumps (Overview, Quick Start, Algorithms & Formulas, Project Structure, AI Disclosure).

2. **`src/components/ReadmeManualView.tsx`**:
   - Action header with:
     - Title and document version badge
     - Download `.md` handler with automatic cleanup of object URLs
     - Copy to clipboard handler with feedback state (`copied: boolean`)
     - Search input to filter sections or keywords
   - Two presentation panels:
     - **Formatted Panel**: Clean typography, collapsible code sections, formula reference cards, video cards with YouTube links.
     - **Raw Panel**: Monospace pre-formatted code block with syntax line numbers and copy line features.

3. **`src/components/TopNav.tsx`**:
   - Update `activePage` prop to `'simulator' | 'rubric' | 'readme'`.
   - Add the "คู่มือ" tab with `BookOpen` / `FileText` icon and active state indicator.

4. **`src/App.tsx`**:
   - Manage `activePage` state across all three views.
   - Render `<ReadmeManualView />` when `activePage === 'readme'`.
