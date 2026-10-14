// update_cujammu_sem1.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'cujammu_pyq_database.json');
const cujDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Find Sem 1
const sem1 = cujDatabase.find(s => s.sem === 1);
if (sem1) {
  // Ensure all 5 subjects are present
  const ece101 = {
    code: "ECE-101",
    title: "Basic Electrical & Electronics Engineering",
    credits: 4,
    units: [
      { unit: 1, title: "DC Circuits, Kirchhoff's Laws (KCL, KVL), Network Theorems" },
      { unit: 2, title: "AC Fundamentals, Single Phase Sinusoidal Analysis, Phasors" },
      { unit: 3, title: "Magnetic Circuits, Single-Phase Transformers" },
      { unit: 4, title: "Semiconductor Diodes, PN Junction Characteristics, Rectifiers" },
      { unit: 5, title: "Bipolar Junction Transistors (BJT) & Logic Gate Foundations" }
    ],
    pyqs: [
      {
        id: "CUJ-S1-ECE-01",
        section: "A",
        marks: 2,
        unit: 1,
        text: "State Kirchhoff's Current Law (KCL) and Kirchhoff's Voltage Law (KVL).",
        years: ["2024", "2022", "2020"],
        freq: "98% Highest Yield",
        probability: 98,
        bloom: "Remember",
        answer: "KCL states that the algebraic sum of currents entering any node is zero (conservation of charge): sum(I) = 0. KVL states that the algebraic sum of electrical potential differences (voltages) around any closed loop is zero (conservation of energy): sum(V) = 0.",
        rubric: "1 Mark for KCL with conservation law; 1 Mark for KVL with conservation law."
      },
      {
        id: "CUJ-S1-ECE-02",
        section: "B",
        marks: 5,
        unit: 4,
        text: "Explain the working of a Full-Wave Bridge Rectifier with circuit diagram and input/output waveforms. Derive its Ripple Factor and Rectification Efficiency.",
        years: ["2024", "2023", "2021"],
        freq: "95% Highest Yield",
        probability: 95,
        bloom: "Apply",
        answer: "A bridge rectifier uses 4 diodes in bridge topology. During positive half cycle, D1 and D2 conduct; during negative half cycle, D3 and D4 conduct, delivering unidirectional current through load. Maximum efficiency is 81.2% and ripple factor is gamma = 0.482 without filter.",
        rubric: "2 Marks for circuit & waveforms; 3 Marks for ripple factor & efficiency derivation."
      },
      {
        id: "CUJ-S1-ECE-03",
        section: "C",
        marks: 10,
        unit: 1,
        text: "State Thevenin's and Norton's Theorems. Find the Thevenin equivalent circuit across terminals A-B for a DC bridge circuit containing 10V source and resistors R1=2ohm, R2=4ohm, R3=3ohm, R4=6ohm. Hence compute current through load RL = 5ohm.",
        choice: "OR: Explain the input and output characteristics of a BJT in Common Emitter (CE) configuration. Define alpha and beta parameters and derive relation beta = alpha / (1 - alpha).",
        years: ["2024", "2022", "2019"],
        freq: "97% Highest Yield",
        probability: 97,
        bloom: "Evaluate",
        answer: "Thevenin's theorem states any linear two-terminal circuit can be replaced by an ideal voltage source Vth in series with resistance Rth. Vth is open-circuit voltage; Rth is resistance with independent sources deactivated. Load current IL = Vth / (Rth + RL).",
        rubric: "3 Marks for theorem statements; 5 Marks for Vth and Rth calculation; 2 Marks for load current."
      }
    ]
  };

  const cyb101 = {
    code: "CYB-101",
    title: "Introduction to Digital Systems & Cyber Hygiene",
    credits: 3,
    units: [
      { unit: 1, title: "Number Systems, Binary Arithmetic, 1's and 2's Complement" },
      { unit: 2, title: "Boolean Algebra, Logic Gates (Universal NAND/NOR), De Morgan's" },
      { unit: 3, title: "Information Assurance & CIA Triad Principles" },
      { unit: 4, title: "Authentication, Password Entropy & Social Engineering/Phishing" },
      { unit: 5, title: "Safe Computing Guidelines, Malware Basics & Cyber Hygiene" }
    ],
    pyqs: [
      {
        id: "CUJ-S1-CYB-01",
        section: "A",
        marks: 2,
        unit: 2,
        text: "Prove that the NAND gate is a Universal Logic Gate.",
        years: ["2024", "2023", "2021"],
        freq: "99% Highest Yield",
        probability: 99,
        bloom: "Understand",
        answer: "A NAND gate is universal because all fundamental logic operations can be constructed from it: 1. NOT gate: Join both NAND inputs (A NAND A = A'). 2. AND gate: Invert NAND output with another NAND ( (AB)' )' = AB. 3. OR gate: Invert inputs with NAND then NAND together ( (A' B')' = A + B by De Morgan).",
        rubric: "1 Mark for definition; 1 Mark for constructing NOT, AND, OR gates."
      },
      {
        id: "CUJ-S1-CYB-02",
        section: "B",
        marks: 5,
        unit: 4,
        text: "Explain Phishing, Spear Phishing, and Whaling attack vectors. Detail three technical indicators students should inspect in deceptive emails.",
        years: ["2024", "2022"],
        freq: "92% Frequent",
        probability: 92,
        bloom: "Analyze",
        answer: "Phishing: Broad mass fraudulent communication. Spear Phishing: Highly targeted attack against specific individual with customized pretext. Whaling: Targeted attack against senior executives. Technical indicators: 1. Mismatched SPF/DKIM/DMARC headers. 2. Lookalike domains (typosquatting like cujammu-verify.com). 3. Suspicious urgent calls-to-action requesting credentials or attachments.",
        rubric: "2 Marks for comparison; 3 Marks for 3 technical email header inspection points."
      },
      {
        id: "CUJ-S1-CYB-03",
        section: "C",
        marks: 10,
        unit: 1,
        text: "Discuss Binary, Octal, Decimal, and Hexadecimal Number Systems. Perform the following operations:\n(a) Convert (1101101.101)_2 to Hexadecimal and Decimal.\n(b) Subtract (45)_10 from (28)_10 using 8-bit 2's Complement representation and show overflow flag status.\n(c) Design a 4-to-1 Multiplexer using basic logic gates with truth table.",
        choice: "OR: Explain the CIA Triad (Confidentiality, Integrity, Availability) and Multi-Factor Authentication (MFA). Differentiate Knowledge, Possession, and Inherence factors with real-world authentication protocols.",
        years: ["2024", "2023", "2020"],
        freq: "98% Highest Yield",
        probability: 98,
        bloom: "Apply",
        answer: "Conversion groups binary bits in 4s: (110 1101 . 1010)_2 = 0x6D.A = (109.625)_10. 2's complement subtraction: 28 - 45 = 28 + (-45). 28 = 00011100_2; 45 = 00101101_2; -45 = 11010011_2. Sum = 11101111_2 = -17_10. No overflow.",
        rubric: "3 Marks for conversions; 4 Marks for 2's complement calculation; 3 Marks for multiplexer / MFA."
      }
    ]
  };

  // Add if not already present
  if (!sem1.subjects.some(s => s.code === 'ECE-101')) {
    sem1.subjects.push(ece101);
  }
  if (!sem1.subjects.some(s => s.code === 'CYB-101')) {
    sem1.subjects.push(cyb101);
  }

  fs.writeFileSync(dbPath, JSON.stringify(cujDatabase, null, 2));
  console.log(`Updated Semester 1 with complete subjects: ${sem1.subjects.map(s => s.code).join(', ')}`);
}
