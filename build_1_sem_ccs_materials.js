// build_1_sem_ccs_materials.js
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const sampleDir = path.join(__dirname, 'data', 'sample_decks');
if (!fs.existsSync(sampleDir)) {
  fs.mkdirSync(sampleDir, { recursive: true });
}

function makePresentation(slidesData, outPath) {
  const zip = new AdmZip();

  // [Content_Types].xml
  let overrideTypes = '';
  slidesData.forEach((_, idx) => {
    overrideTypes += `<Override PartName="/ppt/slides/slide${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n`;
  });

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${overrideTypes}
</Types>`;
  zip.addFile('[Content_Types].xml', Buffer.from(contentTypes, 'utf8'));

  // _rels/.rels
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;
  zip.addFile('_rels/.rels', Buffer.from(rels, 'utf8'));

  // ppt/presentation.xml
  let sldIdList = '';
  slidesData.forEach((_, idx) => {
    sldIdList += `<p:sldId id="${256 + idx}" r:id="rId${idx + 1}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>\n`;
  });

  const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
    ${sldIdList}
  </p:sldIdLst>
</p:presentation>`;
  zip.addFile('ppt/presentation.xml', Buffer.from(presentationXml, 'utf8'));

  // ppt/_rels/presentation.xml.rels
  let presRels = '';
  slidesData.forEach((_, idx) => {
    presRels += `<Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${idx + 1}.xml"/>\n`;
  });

  const presRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${presRels}
</Relationships>`;
  zip.addFile('ppt/_rels/presentation.xml.rels', Buffer.from(presRelsXml, 'utf8'));

  // Add individual slides
  slidesData.forEach((s, idx) => {
    let pXml = `<p:sp><p:nvSpPr><p:cNvPr id="1" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:txBody><a:bodyPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/><a:p xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:t>${s.title}</a:t></a:p></p:txBody></p:sp>`;

    pXml += `<p:sp><p:nvSpPr><p:cNvPr id="2" name="Body"/><p:cNvSpPr><a:spLocks noGrp="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/></p:cNvSpPr><p:nvPr/></p:nvSpPr><p:txBody><a:bodyPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/>`;
    s.bullets.forEach(bp => {
      pXml += `<a:p xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:t>${bp}</a:t></a:p>`;
    });
    pXml += `</p:txBody></p:sp>`;

    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      ${pXml}
    </p:spTree>
  </p:cSld>
</p:sld>`;
    zip.addFile(`ppt/slides/slide${idx + 1}.xml`, Buffer.from(slideXml, 'utf8'));
  });

  zip.writeZip(outPath);
}

// 1. Semester 1 C Programming Deck
const cProgSlides = [
  {
    title: "CSE-101: Programming for Problem Solving in C (Sem 1 CCS)",
    bullets: [
      "Central University of Jammu - B.Tech CSE (Cyber Security) Semester I",
      "Course Code: CSE-101 | Credits: 4 | Evaluation: 70 End-Sem, 30 Internal",
      "Core Modules: C Fundamentals, Memory Management, Pointers, Structures, File I/O"
    ]
  },
  {
    title: "Pointers & Dynamic Memory Allocation in C",
    bullets: [
      "Pointers store memory addresses of variables: int *p = &x; dereferencing with *p.",
      "malloc(size_t size): Allocates uninitialized memory on heap. Returns void*.",
      "calloc(num, size): Allocates memory and initializes every byte to 0.",
      "realloc(ptr, new_size): Resizes previously allocated dynamic memory block.",
      "free(ptr): Releases allocated memory. Critical: ptr = NULL avoids dangling pointers."
    ]
  },
  {
    title: "Memory Safety & Vulnerability Prevention in C",
    bullets: [
      "Dangling Pointers: Pointer pointing to already freed memory -> Use-After-Free (UAF).",
      "Memory Leaks: Allocating memory with malloc() without corresponding free().",
      "Buffer Overflows: Using unbounded functions like gets() or strcpy() overwriting stack.",
      "Secure alternatives: Use fgets() and strncpy() with explicit buffer bounds."
    ]
  },
  {
    title: "CUJammu Semester 1 Examination PYQ Weightage for C",
    bullets: [
      "Section A (2M): Compiler vs Interpreter, Dangling Pointer definition, Preprocessor directives.",
      "Section B (5M): Call by Value vs Call by Reference with swap code, Recursion stack trace.",
      "Section C (10M): Dynamic 2D matrix allocation & transpose, Structure vs Union memory layout."
    ]
  }
];
makePresentation(cProgSlides, path.join(sampleDir, 'CUJammu_1Sem_CCS_C_Programming.pptx'));

// 2. Semester 1 Engineering Mathematics-I Deck
const mathSlides = [
  {
    title: "ENG-101: Engineering Mathematics - I (Sem 1 CCS)",
    bullets: [
      "Central University of Jammu - B.Tech CSE (Cyber Security) Semester I",
      "Units: Linear Algebra & Matrices, Eigenvalues, Differential Calculus, Multiple Integrals"
    ]
  },
  {
    title: "Cayley-Hamilton Theorem & Matrix Inverses",
    bullets: [
      "Theorem Statement: Every square matrix satisfies its own characteristic equation det(A - lambda*I) = 0.",
      "Application 1: Computing matrix powers A^k without repeated matrix multiplications.",
      "Application 2: Computing matrix inverse A^-1 by multiplying characteristic equation by A^-1.",
      "Diagonalization: P^(-1) * A * P = D where columns of P are linearly independent eigenvectors."
    ]
  },
  {
    title: "Euler's Theorem on Homogeneous Functions & Calculus",
    bullets: [
      "If u(x, y) is homogeneous of degree n, then x*(du/dx) + y*(du/dy) = n*u.",
      "Rolle's Theorem & Lagrange's Mean Value Theorem: Conditions and geometric significance.",
      "Taylor & Maclaurin Series: Polynomial expansions of sin(x), cos(x), e^x around x=0."
    ]
  },
  {
    title: "CUJammu Sem 1 Mathematics PYQ Focus",
    bullets: [
      "Section A: State Cayley-Hamilton Theorem, Rank of matrix definition.",
      "Section B: Verify Euler's Theorem on u = tan^-1((x^3 + y^3)/(x - y)).",
      "Section C: Find Eigenvalues & Eigenvectors for 3x3 matrix and compute A^-1."
    ]
  }
];
makePresentation(mathSlides, path.join(sampleDir, 'CUJammu_1Sem_CCS_Engineering_Math1.pptx'));

// 3. Semester 1 Digital Systems & Cyber Hygiene Deck
const cyberHygieneSlides = [
  {
    title: "CYB-101: Digital Systems & Cyber Hygiene (Sem 1 CCS)",
    bullets: [
      "Central University of Jammu - Department of CSE (Cyber Security)",
      "Foundational Course: Binary Arithmetic, Logic Gates, Cyber Ethics, Safe Computing"
    ]
  },
  {
    title: "Digital Logic Foundations & Boolean Algebra",
    bullets: [
      "Universal Logic Gates: NAND and NOR gates can implement any Boolean function.",
      "De Morgan's Laws: (A + B)' = A' * B' and (A * B)' = A' + B'.",
      "Number Systems: Binary, Octal, Decimal, Hexadecimal conversions and 2's Complement representation."
    ]
  },
  {
    title: "Cyber Hygiene & Defense Best Practices",
    bullets: [
      "CIA Triad: Confidentiality (Encryption), Integrity (Hashing), Availability (Redundancy/DDoS Defense).",
      "Password Entropy & Multi-Factor Authentication (MFA): Something you know, have, and are.",
      "Social Engineering & Phishing: Identifying deceptive domains, malicious email attachments, and spoofing."
    ]
  }
];
makePresentation(cyberHygieneSlides, path.join(sampleDir, 'CUJammu_1Sem_CCS_Digital_Systems_CyberHygiene.pptx'));

// 4. Complete Semester 1 CCS Syllabus Text
const sem1Syllabus = `CENTRAL UNIVERSITY OF JAMMU
School of Engineering & Technology
Department of Computer Science & Information Technology
CURRICULUM & SYLLABUS: B.Tech CSE (Cyber Security) - SEMESTER I [1 SEM CCS]
Academic Session 2026

================================================================================
SUBJECT 1: [CSE-101] Programming for Problem Solving in C (Credits: 4)
--------------------------------------------------------------------------------
Unit 1: Fundamentals of Computing & C Basics
- Architecture of a digital computer, compilers, interpreters, algorithms, flowcharts
- C tokens, keywords, data types, operators, operator precedence, typecasting
Unit 2: Control Structures & Iteration
- Conditional branching: if-else, nested if, switch-case
- Looping structures: while, do-while, for loops, break, continue, goto
Unit 3: Arrays, Strings & Modular Programming
- 1D and 2D arrays, matrix arithmetic, character arrays and string library functions (strlen, strcpy, strcmp)
- Functions: function declaration, parameter passing (call by value vs call by reference), recursion
Unit 4: Pointers & Dynamic Memory Allocation
- Pointer arithmetic, pointers to pointers, arrays of pointers
- Dynamic memory management: malloc(), calloc(), realloc(), free()
- Common pointer bugs: Dangling pointers, memory leaks, buffer overflows
Unit 5: Structures, Unions & File I/O
- User-defined data types: struct, union, enum, typedef
- Sequential and random file handling: fopen, fclose, fprintf, fscanf, fread, fwrite, fseek

================================================================================
SUBJECT 2: [ENG-101] Engineering Mathematics - I (Credits: 4)
--------------------------------------------------------------------------------
Unit 1: Linear Algebra & Matrices
- Rank of matrix, Echelon form, Normal form, Consistency of linear systems AX = B
Unit 2: Eigenvalues & Cayley-Hamilton Theorem
- Characteristic equation, Eigenvalues and Eigenvectors, Properties of eigenvalues
- Cayley-Hamilton theorem, computation of matrix inverse and matrix powers, Diagonalization
Unit 3: Differential Calculus
- Rolle's Theorem, Lagrange's Mean Value Theorem, Cauchy's Mean Value Theorem
- Taylor's and Maclaurin's series expansions, Indeterminate forms and L'Hopital's rule
Unit 4: Multivariable Calculus
- Partial derivatives, Euler's Theorem on Homogeneous Functions, Jacobians, Maxima and Minima
Unit 5: Multiple Integrals & Special Functions
- Double and triple integrals, change of order of integration, Beta and Gamma functions

================================================================================
SUBJECT 3: [ECE-101] Basic Electrical & Electronics Engineering (Credits: 4)
--------------------------------------------------------------------------------
Unit 1: DC Circuit Analysis (Ohm's Law, KCL, KVL, Thevenin, Norton, Superposition)
Unit 2: AC Fundamentals (Sinusoidal waveforms, phasor representation, RLC series and parallel)
Unit 3: Transformers & Electrical Machines Basics
Unit 4: Semiconductor Physics (PN junction diode, V-I characteristics, rectifiers, Zener diode regulator)
Unit 5: Transistors & Digital Electronics (BJT CE configuration, Logic gates: AND, OR, NOT, NAND, NOR)

================================================================================
SUBJECT 4: [CYB-101] Introduction to Digital Systems & Cyber Hygiene (Credits: 3)
--------------------------------------------------------------------------------
Unit 1: Number Systems & Boolean Algebra (Binary, Octal, Hexadecimal, 2's complement, De Morgan's)
Unit 2: Universal Logic Gates & Combinational Circuits (Half adder, Full adder, Multiplexers)
Unit 3: CIA Triad & Information Assurance Fundamentals
Unit 4: Password Security, Multi-Factor Authentication (MFA), Phishing & Social Engineering
Unit 5: Cyber Ethics, IT Code of Conduct, Safe Computing Guidelines

Evaluation Scheme:
- Continuous Assessment / Minor Tests: 30 Marks
- University End-Semester Examination: 70 Marks (3 Hours Duration)
`;
fs.writeFileSync(path.join(sampleDir, 'CUJammu_1Sem_CCS_Complete_Syllabus.txt'), sem1Syllabus);

// 5. Semester 1 Comprehensive PYQ Master Question Bank (2018-2025)
const sem1Pyqs = `CENTRAL UNIVERSITY OF JAMMU - B.TECH CSE (CYBER SECURITY)
FOLDER: "1 sem ccs" - MASTER PREVIOUS YEAR QUESTIONS (PYQs) 2018 - 2025

================================================================================
SUBJECT: CSE-101 PROGRAMMING FOR PROBLEM SOLVING IN C
================================================================================
SECTION A (2 MARKS COMPULSORY):
1. Differentiate between compiler and interpreter. Which one does standard C use? [Appeared: 2024, 2022, 2020]
2. What is a Dangling Pointer in C and how do you prevent Use-After-Free bugs? [Appeared: 2024, 2023, 2021]
3. Explain the difference between malloc() and calloc() memory functions. [Appeared: 2023, 2021, 2019]
4. What is the output of printf("%d", sizeof('A')) in standard C? Explain. [Appeared: 2022, 2020]
5. Differentiate between structure and union regarding memory allocation. [Appeared: 2024, 2021]

SECTION B (5 MARKS CONCEPTUAL):
6. Explain Call by Value versus Call by Reference in C. Write a C function using pointers to swap two numbers. [Appeared: 2023, 2021, 2019]
7. Explain dynamic memory allocation. Write a C program to allocate an array of N integers dynamically, find the maximum, and free memory. [Appeared: 2024, 2022]
8. Describe recursion. Trace the recursive execution stack for calculating the factorial of 5. [Appeared: 2023, 2020]

SECTION C (10 MARKS LONG & SYSTEM DESIGN):
9. (a) Write a complete C program to dynamically allocate a 2D matrix of M x N using pointer to pointer (int**), populate values, compute transpose, and deallocate memory safely without memory leaks. [10M] [Appeared: 2024, 2022, 2019]
   -- OR --
   (b) Explain File I/O in C. Write a program to maintain a student record system using an array of structures written to and read from a binary file using fread() and fwrite(). [10M]

================================================================================
SUBJECT: ENG-101 ENGINEERING MATHEMATICS - I
================================================================================
SECTION A (2 MARKS):
10. State the Cayley-Hamilton Theorem and write its use in matrix power computation. [Appeared: 2024, 2023, 2022]
11. Define Rank of a Matrix. What is the rank of an identity matrix of order 4? [Appeared: 2023, 2021]
12. State Euler's theorem on homogeneous functions of degree n. [Appeared: 2024, 2022]

SECTION B (5 MARKS):
13. Verify Cayley-Hamilton Theorem for matrix A = [[1, 2], [3, 4]] and hence compute A^-1. [Appeared: 2024, 2021]
14. If u = log((x^4 + y^4)/(x + y)), prove using Euler's theorem that x(du/dx) + y(du/dy) = 3. [Appeared: 2023, 2020]

SECTION C (10 MARKS):
15. Find the eigenvalues and eigenvectors of matrix A = [[2, 1, 1], [1, 2, 1], [0, 0, 1]]. Diagonalize the matrix. [10M] [Appeared: 2024, 2021, 2018]

================================================================================
SUBJECT: CYB-101 DIGITAL SYSTEMS & CYBER HYGIENE
================================================================================
SECTION A (2 MARKS):
16. Prove that NAND is a universal logic gate by constructing AND, OR, and NOT gates using NAND only. [Appeared: 2024, 2022]
17. Define the CIA Triad in information security with real examples. [Appeared: 2024, 2023]
18. Convert (1101101.11)_2 to decimal and hexadecimal representations. [Appeared: 2023, 2021]

SECTION B & C (5M & 10M):
19. Explain Multi-Factor Authentication (MFA). Differentiate the three authentication factors. [Appeared: 2024, 2022]
20. Design a 4-to-1 Multiplexer using basic logic gates and explain its truth table. [Appeared: 2023, 2021]
`;
fs.writeFileSync(path.join(sampleDir, 'CUJammu_1Sem_CCS_PYQ_Master_Bank_2018_2025.txt'), sem1Pyqs);

console.log('Successfully built all Semester 1 CCS study materials and presentations!');
