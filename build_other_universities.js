// build_other_universities.js
const fs = require('fs');
const path = require('path');

const otherUnis = [
  {
    universityId: "iit_jammu",
    universityName: "IIT Jammu",
    subjects: [
      {
        code: "CS-520",
        title: "Cryptographic Engineering",
        pyqs: [
          {
            id: "IITJ-01",
            section: "Major",
            marks: 10,
            unit: 2,
            text: "Explain Side-Channel Attacks (SCA) on AES hardware implementations. Analyze Simple Power Analysis (SPA) and Differential Power Analysis (DPA) targeting the SubBytes lookup table. Propose masking countermeasure GF(2^8).",
            freq: "98% Major Exam Recurring",
            probability: 96,
            bloom: "Analyze",
            answer: "DPA correlates power consumption traces with hypothesized intermediate cryptographic values (such as S-box output). Masking randomizes intermediate data with secret sharing: x' = x XOR m, ensuring power consumption remains statistically independent of plaintext or key.",
            rubric: "4 Marks for DPA power trace analysis; 4 Marks for GF(2^8) Boolean masking equations; 2 Marks for hardware overhead."
          },
          {
            id: "IITJ-02",
            section: "Minor",
            marks: 5,
            unit: 3,
            text: "Differentiate between Montgomery Multiplication and Barrett Reduction for accelerating large modular exponentiations in RSA hardware accelerators.",
            freq: "91% Frequent",
            probability: 90,
            bloom: "Apply",
            answer: "Montgomery converts numbers to Montgomery domain (A * R mod N), replacing division with right-shifts by R = 2^k. Barrett precomputes mu = floor(2^(2k)/N) to estimate quotients using multiplications instead of division.",
            rubric: "2.5 Marks for Montgomery transformation; 2.5 Marks for Barrett reduction precomputation."
          }
        ]
      }
    ]
  },
  {
    universityId: "nit_srinagar",
    universityName: "NIT Srinagar",
    subjects: [
      {
        code: "CST-502",
        title: "Advanced Network Security",
        pyqs: [
          {
            id: "NITS-01",
            section: "End-Term",
            marks: 12,
            unit: 4,
            text: "Detail IPsec Architecture. Compare Tunnel Mode versus Transport Mode for AH (Authentication Header) and ESP (Encapsulating Security Payload). Show packet headers and explain Security Association (SA) negotiation via IKEv2.",
            freq: "95% End-Term Recurring",
            probability: 95,
            bloom: "Evaluate",
            answer: "Transport mode encrypts only IP payload, preserving original IP header (host-to-host). Tunnel mode encapsulates entire original IP packet inside a new IP header (gateway-to-gateway VPN). ESP provides confidentiality and integrity; AH provides integrity only. IKEv2 negotiates SAs in two phases: IKE_SA_INIT (Diffie-Hellman) and IKE_AUTH (credentials).",
            rubric: "4 Marks for Tunnel vs Transport diagram; 4 Marks for ESP vs AH fields; 4 Marks for IKEv2 phase exchange."
          },
          {
            id: "NITS-02",
            section: "End-Term",
            marks: 6,
            unit: 3,
            text: "What is BGP Route Hijacking and how does RPKI (Resource Public Key Infrastructure) with Route Origin Authorization (ROA) cryptographically validate Autonomous System (AS) paths?",
            freq: "88% High Yield",
            probability: 88,
            bloom: "Understand",
            answer: "A rogue AS announces IP prefixes it does not own. RPKI creates cryptographically signed ROAs tying IP prefixes to authorized Origin AS numbers, verified via X.509 PKI certificates by border routers.",
            rubric: "3 Marks for BGP announcement flaw; 3 Marks for ROA verification."
          }
        ]
      }
    ]
  },
  {
    universityId: "iit_delhi",
    universityName: "IIT Delhi",
    subjects: [
      {
        code: "COL-759",
        title: "Cryptography & Computer Security",
        pyqs: [
          {
            id: "IITD-01",
            section: "Major",
            marks: 12,
            unit: 3,
            text: "Define IND-CPA and IND-CCA2 security notions for Public Key Cryptography. Prove why textbook RSA is not IND-CPA secure, and prove how OAEP (Optimal Asymmetric Encryption Padding) achieves IND-CCA2 security under random oracle model.",
            freq: "99% Recurring Concept",
            probability: 98,
            bloom: "Evaluate",
            answer: "Textbook RSA is deterministic: E(m) = m^e mod n. Adversary encrypts challenge messages m0, m1 and trivially distinguishes ciphertext. OAEP adds random seed and two hash functions (Feistel network) providing all-or-nothing plaintext awareness and semantic security.",
            rubric: "4 Marks for IND-CPA definition & RSA counterexample; 4 Marks for OAEP Feistel diagram; 4 Marks for CCA2 simulator proof."
          }
        ]
      }
    ]
  }
];

fs.writeFileSync(
  path.join(__dirname, 'data', 'other_universities_pyqs.json'),
  JSON.stringify(otherUnis, null, 2)
);
console.log('Saved other universities PYQ dataset.');
