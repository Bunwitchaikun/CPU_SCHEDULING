# GitHub Repository Quick Access Button

Add a dedicated GitHub repository link button beside the existing "ดาวน์โหลดโปรแกรม (.zip)" button on the top navigation bar (`TopNav.tsx`), directing users to `https://github.com/Bunwitchaikun/CPU_SCHEDULING.git` in a new tab.

## User Review & Critical Decisions

> [!IMPORTANT]
> All design and behavioral requirements have been confirmed via Phase 1 clarification:
> - **Button Style & Label**: GitHub icon accompanied by the "GitHub" text label.
> - **Interaction & Navigation**: Opens `https://github.com/Bunwitchaikun/CPU_SCHEDULING.git` in a fresh browser tab (`target="_blank" rel="noopener noreferrer"`).
> - **Placement**: Situated directly beside the "ดาวน์โหลดโปรแกรม (.zip)" button in Zone 3 of `TopNav.tsx`.

- **Confirmed Decision 1**: GitHub icon with "GitHub" label.
- **Confirmed Decision 2**: Open external repository URL in a new tab (`target="_blank" rel="noopener noreferrer"`).
- **Default Theme Integration**: Styled as a secondary dark pill (`bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700`) to harmoniously complement the primary indigo download button.

---

## 1. Overview & Core Concept

- **What It Does**: Provides one-click access to the project's source code on GitHub directly from the top navigation bar, enabling academic evaluators, students, and collaborators to review the repository, commit history, and release tags without navigating away from the running simulator.
- **Target Audience / Persona**: Instructor (ผศ.ดร.กิ่งกาญจน์ สุขขะภิบาล), teaching assistants, examiners, and fellow students reviewing the CS422 Term Project.
- **Key Value**: Immediate repository discoverability, seamless navigation between live interactive simulator and Git version control, adhering to standard open-source academic project presentation best practices.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. The user visits the CPU Scheduling Simulator application.
  2. On the sticky top bar (`TopNav`), right next to the indigo "ดาวน์โหลดโปรแกรม (.zip)" button, the user sees the GitHub button with the official GitHub mark and label "GitHub".
  3. Clicking the button opens `https://github.com/Bunwitchaikun/CPU_SCHEDULING.git` in a new browser tab without interrupting the ongoing CPU simulation state or page scroll position.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Dark slate utilitarian modern UI with crisp borders and micro-elevation.
  - *Color Palette & Tokens*:
    - Background: `bg-slate-800 hover:bg-slate-700 active:bg-slate-800`
    - Text: `text-slate-200 hover:text-white`
    - Border: `border border-slate-700 hover:border-slate-600`
    - Focus: `focus-visible:ring-2 focus-visible:ring-indigo-500`
  - *Typography & Dimensions*: `text-xs sm:text-sm font-semibold`, padding `px-3 py-1.5`, matching the height and curvature (`rounded-lg`) of the download button.
  - *Iconography*: Crisp GitHub Octocat SVG mark (`w-4 h-4`) aligned cleanly with the label.
  - *Responsive Layout*: Flex container with `shrink-0` ensuring both buttons remain cleanly accessible across desktop, tablet, and mobile breakpoints without overflow clipping.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Anchor Link (`<a>`) vs. JavaScript Window Handler (`window.open`)**
  - *Chosen Approach*: Standard HTML `<a>` anchor tag with `href="https://github.com/Bunwitchaikun/CPU_SCHEDULING.git"`, `target="_blank"`, and `rel="noopener noreferrer"`.
  - *Why*: Native HTML anchors avoid popup blockers in sandboxed iframe environments, allow right-click ("Open in new tab / Copy link"), and provide optimal accessibility and SEO crawler discovery.
  - *Alternatives Considered*: `window.open()` in an onClick handler was discarded because browsers and sandboxed iframes can block programmatic window opens.

- **Decision 2: Visual Hierarchy (Secondary Neutral vs. Primary Accent)**
  - *Chosen Approach*: Slate dark button style (`bg-slate-800 border-slate-700`) beside the primary indigo download button.
  - *Why*: Balances the top bar visual weight so the primary action ("ดาวน์โหลดโปรแกรม") retains prominence while the GitHub button is immediately recognizable and clearly distinguishable.

---

## 4. Technical Architecture & Component Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│ TopNav (Sticky Header)                                                │
│                                                                        │
│ ┌──────────────────────┐  ┌────────────────┐  ┌──────────────────────┐ │
│ │ Zone 1: Branding     │  │ Zone 2: Nav    │  │ Zone 3: Actions      │ │
│ │ CPU Scheduling Sim   │  │ 1.จำลอง..7.AI  │  │ [GitHub] [ดาวน์โหลด] │ │
│ └──────────────────────┘  └────────────────┘  └──────────┬───────────┘ │
└──────────────────────────────────────────────────────────┼─────────────┘
                                                           │
                                   ┌───────────────────────┴───────────────────────┐
                                   │                                               │
                                   ▼                                               ▼
                      ┌────────────────────────┐                     ┌────────────────────────┐
                      │ <a href="...github...">│                     │ <button onClick=... >  │
                      │ GitHub Icon + Label    │                     │ Download Zip (.zip)    │
                      │ target="_blank"        │                     │ HTML & source code     │
                      └────────────────────────┘                     └────────────────────────┘
```

### Component & State Mapping

- **Target Component**: `/src/components/TopNav.tsx`
- **Zone 3 Updates**:
  - Insert `<a href="https://github.com/Bunwitchaikun/CPU_SCHEDULING.git" target="_blank" rel="noopener noreferrer" className="...">` directly before or beside `<button onClick={onDownloadProgram}>`.
  - Inline the GitHub SVG icon to guarantee 100% SVG fidelity and zero dependency friction.
  - Add descriptive accessibility attribute `aria-label="View source code on GitHub"`.
