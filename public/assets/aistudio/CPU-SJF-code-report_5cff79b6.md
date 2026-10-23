# รายงานผลและโค้ด CPU Scheduling

Algorithm: SJF
BT: 8, 4, 2
Quantum: ไม่ใช้
AT=0, CPU=1, I/O=0, Context Switch cost=0

## ลำดับ CPU ที่สร้างตัวเลข
1. P3: 0 → 2; ใช้ 2; เหลือ 0
2. P2: 2 → 6; ใช้ 4; เหลือ 0
3. P1: 6 → 14; ใช้ 8; เหลือ 0

## ผลรายโปรเซส
P1: ST=6, CT=14, TAT=14−0=14, WT=14−8=6
P2: ST=2, CT=6, TAT=6−0=6, WT=6−4=2
P3: ST=0, CT=2, TAT=2−0=2, WT=2−2=0
AVG WT = 6 + 2 + 0 หาร 3 = 2.6666666666666665

## โค้ดจริงจาก scheduler.js
ส่วนอ้างอิงใช้ร่วมกับ scheduler.js ฉบับเต็ม
### positiveInteger
```javascript
function positiveInteger(value, label, max = Number.MAX_SAFE_INTEGER) {
    const text = String(value).trim();
    const number = Number(text);
    if (!/^\d+$/.test(text) || !Number.isSafeInteger(number) || number < 1) {
      throw new Error(`${label} ต้องเป็นจำนวนเต็มบวก เช่น 1, 2, 3`);
    }
    if (number > max) throw new Error(`${label} ต้องไม่เกิน ${max}`);
    return number;
  }
```

### validateBursts
```javascript
function validateBursts(bursts) {
    if (!Array.isArray(bursts) || bursts.length < 1 || bursts.length > LIMITS.processes) {
      throw new Error(`จำนวนโปรเซสต้องอยู่ระหว่าง 1–${LIMITS.processes}`);
    }
    return Array.from(bursts, (bt, i) => positiveInteger(bt, `BT ของ P${i + 1}`, LIMITS.burst));
  }
```

### makeProcesses
```javascript
function makeProcesses(bursts) {
    return bursts.map((bt, i) => ({ id: i + 1, process: `P${i + 1}`, at: 0, bt,
      st: null, ct: null, remaining: bt }));
  }
```

### runNonPreemptive
```javascript
function runNonPreemptive(bursts, algorithm) {
    const processes = makeProcesses(bursts);
    // สำเนาอาร์เรย์ก่อน sort เพื่อคงตารางผลลัพธ์ตาม P1..Pn
    const order = [...processes];
    if (algorithm === 'SJF') order.sort((a, b) => a.bt - b.bt || a.id - b.id);
    let time = 0;
    const timeline = [];
    for (const p of order) {
      p.st = time;
      time += p.bt;
      p.ct = time;
      p.remaining = 0;
      timeline.push({ process: p.process, start: p.st, end: p.ct, remaining: 0 });
    }
    return finish(algorithm, processes, timeline);
  }
```

### finish
```javascript
function finish(algorithm, processes, timeline, quantum = null) {
    const rows = processes.map(p => {
      const tat = p.ct - p.at;
      const wt = tat - p.bt;
      return { process: p.process, at: p.at, bt: p.bt, st: p.st, ct: p.ct, tat, wt };
    });
    return { algorithm, quantum, rows, timeline,
      totalTime: timeline[timeline.length - 1].end,
      avgWT: rows.reduce((sum, p) => sum + p.wt, 0) / rows.length };
  }
```

### simulate
```javascript
function simulate(bursts, algorithm, quantum = 2) {
    const clean = validateBursts(bursts);
    if (!['FCFS', 'SJF', 'SRTF', 'RR'].includes(algorithm)) throw new Error('ไม่รู้จักอัลกอริทึมนี้');
    if (algorithm === 'RR') {
      return runRoundRobin(clean, positiveInteger(quantum, 'Time Quantum', LIMITS.quantum));
    }
    if (algorithm === 'SRTF') return runSRTF(clean);
    return runNonPreemptive(clean, algorithm);
  }
```