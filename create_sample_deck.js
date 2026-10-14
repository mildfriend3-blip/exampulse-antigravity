// create_sample_deck.js
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const sampleDir = path.join(__dirname, 'data', 'sample_decks');
if (!fs.existsSync(sampleDir)) {
  fs.mkdirSync(sampleDir, { recursive: true });
}

// 1. Create Sample Syllabus
const sampleSyllabus = `CENTRAL UNIVERSITY OF JAMMU
Department of Computer Science & Information Technology
Course Code: CYB-501
Course Title: Cryptography & Network Security
Semester: 5
Credits: 4
Evaluation: End-Semester 70 Marks, Mid-Term 30 Marks

Unit 1: Classical Ciphers & Number Theory
- Historical Ciphers: Caesar, Playfair, Hill, Vigenere, Transposition ciphers
- Modular Arithmetic, GCD, Extended Euclidean Algorithm
- Fermat's and Euler's Totient Theorem, Discrete Logarithms

Unit 2: Symmetric Block Ciphers & Hash Functions
- Shannon's Principles of Confusion and Diffusion, Feistel Networks
- Data Encryption Standard (DES) and Triple-DES
- Advanced Encryption Standard (AES): SubBytes, ShiftRows, MixColumns, AddRoundKey
- Block Cipher Modes: ECB, CBC, CFB, OFB, CTR, GCM
- Cryptographic Hash Functions: SHA-256, SHA-3, Birthday Paradox & Collision Resistance

Unit 3: Public Key Cryptography & Key Exchange
- Principles of Asymmetric Cryptography
- RSA Algorithm: Key Generation, Encryption, Decryption, Security against Wiener's Attack
- Diffie-Hellman Key Exchange and Man-in-the-Middle (MITM) Vulnerability
- Elliptic Curve Cryptography (ECC) & Digital Signature Standard (ECDSA)

Unit 4: System & Network Security Protocols
- Transport Layer Security (TLS 1.3) Handshake vs TLS 1.2
- IPsec Architecture: AH vs ESP in Tunnel and Transport Modes
- Kerberos v5 Authentication and Cross-Realm Trust
- Buffer Overflows, Stack Canaries, ASLR, and Return-Oriented Programming (ROP)

Unit 5: Perimeter Defense & Modern Threat Landscapes
- Firewalls: Packet Filtering, Stateful Inspection, Next-Generation Firewalls (NGFW)
- Intrusion Detection & Prevention (Snort / Suricata IDS/IPS)
- Zero Trust Architecture (ZTA) under NIST SP 800-207
- Digital Forensics Chain of Custody & RFC 3227 Order of Volatility

Prescribed Textbooks:
1. William Stallings, "Cryptography and Network Security: Principles and Practice", Pearson 8th Edition.
2. Behrouz A. Forouzan, "Cryptography & Network Security", McGraw-Hill.
`;

fs.writeFileSync(path.join(sampleDir, 'CUJammu_CYB501_Syllabus.txt'), sampleSyllabus);

// 2. Build a valid sample PPTX using AdmZip
const zip = new AdmZip();

// [Content_Types].xml
const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide3.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide4.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>`;
zip.addFile('[Content_Types].xml', Buffer.from(contentTypes, 'utf8'));

// _rels/.rels
const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`;
zip.addFile('_rels/.rels', Buffer.from(rels, 'utf8'));

// ppt/presentation.xml
const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
    <p:sldId id="256" r:id="rId1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
    <p:sldId id="257" r:id="rId2" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
    <p:sldId id="258" r:id="rId3" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
    <p:sldId id="259" r:id="rId4" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
  </p:sldIdLst>
</p:presentation>`;
zip.addFile('ppt/presentation.xml', Buffer.from(presentationXml, 'utf8'));

// ppt/_rels/presentation.xml.rels
const presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide4.xml"/>
</Relationships>`;
zip.addFile('ppt/_rels/presentation.xml.rels', Buffer.from(presRels, 'utf8'));

function makeSlideXml(title, bulletPoints) {
  let pXml = `<p:sp><p:nvSpPr><p:cNvPr id="1" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr><p:txBody><a:bodyPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/><a:p xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:t>${title}</a:t></a:p></p:txBody></p:sp>`;

  pXml += `<p:sp><p:nvSpPr><p:cNvPr id="2" name="Body"/><p:cNvSpPr><a:spLocks noGrp="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/></p:cNvSpPr><p:nvPr/></p:nvSpPr><p:txBody><a:bodyPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/>`;
  bulletPoints.forEach(bp => {
    pXml += `<a:p xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:t>${bp}</a:t></a:p>`;
  });
  pXml += `</p:txBody></p:sp>`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      ${pXml}
    </p:spTree>
  </p:cSld>
</p:sld>`;
}

// Slide 1
zip.addFile('ppt/slides/slide1.xml', Buffer.from(makeSlideXml(
  "CYB-501: Cryptography & Network Security Lecture 04",
  [
    "Central University of Jammu - Department of CSE (Cyber Security)",
    "Instructor: Faculty of Cyber Security & Information Assurance",
    "Module: Symmetric Encryption & Advanced Encryption Standard (AES)"
  ]
), 'utf8'));

// Slide 2
zip.addFile('ppt/slides/slide2.xml', Buffer.from(makeSlideXml(
  "AES Architecture & 4 Core Round Transformations",
  [
    "1. SubBytes: Non-linear byte substitution using 16x16 S-box over GF(2^8).",
    "2. ShiftRows: Cyclic permutation of matrix rows for intra-block diffusion.",
    "3. MixColumns: Matrix multiplication over GF(2^8) modulo (x^4 + 1).",
    "4. AddRoundKey: Bitwise XOR of the 128-bit state with the round subkey.",
    "Notice: MixColumns is skipped in Round 10 to ensure symmetric decryption circuit."
  ]
), 'utf8'));

// Slide 3
zip.addFile('ppt/slides/slide3.xml', Buffer.from(makeSlideXml(
  "Public Key Cryptography & RSA Mathematical Proof",
  [
    "Choose primes p and q. Compute modulus n = p * q and Euler phi(n) = (p-1)(q-1).",
    "Select public exponent e such that gcd(e, phi(n)) = 1.",
    "Compute private exponent d: d * e = 1 mod phi(n) via Extended Euclidean Algorithm.",
    "Encryption: Ciphertext C = M^e mod n.",
    "Decryption: Plaintext M = C^d mod n. Proof holds by Euler's Totient Theorem."
  ]
), 'utf8'));

// Slide 4
zip.addFile('ppt/slides/slide4.xml', Buffer.from(makeSlideXml(
  "High-Yield University Examination PYQ Weightage",
  [
    "Historical Exam Focus: 32% Number Theory & RSA, 28% AES, 24% TLS/IPsec Protocols.",
    "Common trap in Section A: ECB mode leak (identical plaintext produces identical ciphertext).",
    "Common trap in Section C: Wiener's attack on small private exponent d < (1/3)n^0.25."
  ]
), 'utf8'));

const pptxPath = path.join(sampleDir, 'CUJammu_CYB501_LectureSlides.pptx');
zip.writeZip(pptxPath);
console.log('Created sample presentation: ' + pptxPath);
console.log('Created sample syllabus: ' + path.join(sampleDir, 'CUJammu_CYB501_Syllabus.txt'));
