// google_drive_service.js
const fs = require('fs');
const path = require('path');
const { parsePptx } = require('./pptx_parser');
const { parseSyllabus } = require('./syllabus_parser');
const { generateShortNotes, generateInteractiveNotes, generatePredictedExamPaper } = require('./ai_engine');
const db = require('./db_store');

// Sample files directory
const SAMPLES_DIR = path.join(__dirname, 'data', 'sample_decks');

// Dedicated "1 sem ccs" Google Drive Folder metadata
const folder1SemCcs = {
  id: "folder_1_sem_ccs",
  name: "1 sem ccs",
  displayName: "📁 1 sem ccs (CUJammu B.Tech Cyber Security - Semester 1)",
  path: "Google Drive / CUJammu / B.Tech CSE Cyber Security / 1 sem ccs",
  university: "Central University of Jammu",
  degree: "B.Tech Computer Science & Engineering (Cyber Security)",
  semester: 1,
  description: "Complete Semester 1 study materials repository containing all lecture presentations, course syllabi, lab manuals, and 2018–2025 PYQs for all subjects.",
  subjects: [
    { code: "CSE-101", name: "Programming for Problem Solving in C", filesCount: 2 },
    { code: "ENG-101", name: "Engineering Mathematics - I", filesCount: 2 },
    { code: "ECE-101", name: "Basic Electrical & Electronics Engineering", filesCount: 1 },
    { code: "CYB-101", name: "Introduction to Digital Systems & Cyber Hygiene", filesCount: 2 },
    { code: "PYQ-MASTER", name: "All Subjects Master PYQ Archive (2018–2025)", filesCount: 1 }
  ]
};

// Curated Institutional Google Drive Study Materials for CUJammu & Partner Universities
const curatedDriveFiles = [
  // =========================================================================
  // FOLDER: "1 sem ccs" (Semester 1 - B.Tech CSE Cyber Security, CUJammu)
  // =========================================================================
  {
    id: "drive_1sem_cse101_pptx",
    name: "CSE101_Lec04_Pointers_Dynamic_Memory_Malloc.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "2.1 MB",
    modifiedTime: "2026-09-12T10:15:00Z",
    folder: "1 sem ccs / CSE-101 C Programming",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "CSE-101",
    courseTitle: "Programming for Problem Solving in C",
    author: "Dept of CS & IT, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_C_Programming.pptx'),
    description: "Lecture deck on Pointers, malloc/calloc/free, Dangling Pointers, Use-After-Free, 2D dynamic arrays, and memory leaks."
  },
  {
    id: "drive_1sem_cse101_pyq",
    name: "CSE101_Programming_in_C_Syllabus_and_PYQs_2018_2025.txt",
    mimeType: "text/plain",
    size: "24.5 KB",
    modifiedTime: "2026-08-20T11:30:00Z",
    folder: "1 sem ccs / CSE-101 C Programming",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "CSE-101",
    courseTitle: "Programming for Problem Solving in C",
    author: "Board of Studies, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_PYQ_Master_Bank_2018_2025.txt'),
    description: "Complete syllabus and 8-year solved examination questions covering Section A (2M), Section B (5M), and Section C (10M)."
  },
  {
    id: "drive_1sem_eng101_pptx",
    name: "ENG101_Engineering_Mathematics1_CayleyHamilton_Matrices.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "3.2 MB",
    modifiedTime: "2026-09-18T14:40:00Z",
    folder: "1 sem ccs / ENG-101 Engineering Mathematics-I",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "ENG-101",
    courseTitle: "Engineering Mathematics - I",
    author: "Dept of Mathematics, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_Engineering_Math1.pptx'),
    description: "Lecture slides on Cayley-Hamilton Theorem, Eigenvalues & Eigenvectors, Euler's Theorem on Homogeneous Functions, and Taylor series."
  },
  {
    id: "drive_1sem_eng101_pyq",
    name: "ENG101_Engineering_Mathematics1_Syllabus_and_PYQ_Bank.txt",
    mimeType: "text/plain",
    size: "18.8 KB",
    modifiedTime: "2026-08-22T09:00:00Z",
    folder: "1 sem ccs / ENG-101 Engineering Mathematics-I",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "ENG-101",
    courseTitle: "Engineering Mathematics - I",
    author: "Faculty of Applied Sciences, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_PYQ_Master_Bank_2018_2025.txt'),
    description: "Units 1 to 5 syllabus breakdown and past examination numericals for Eigenvalues, matrix inverses, and double integrals."
  },
  {
    id: "drive_1sem_cyb101_pptx",
    name: "CYB101_Digital_Systems_and_Cyber_Hygiene_Foundations.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "2.8 MB",
    modifiedTime: "2026-09-25T16:15:00Z",
    folder: "1 sem ccs / CYB-101 Digital Systems & Cyber Hygiene",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "CYB-101",
    courseTitle: "Introduction to Digital Systems & Cyber Hygiene",
    author: "Cyber Security Research Group, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_Digital_Systems_CyberHygiene.pptx'),
    description: "Foundational slides covering Universal NAND/NOR logic gates, Number systems, CIA Triad, Password entropy, and Phishing defenses."
  },
  {
    id: "drive_1sem_cyb101_pyq",
    name: "CYB101_Cyber_Hygiene_Digital_Systems_Syllabus_PYQs.txt",
    mimeType: "text/plain",
    size: "15.4 KB",
    modifiedTime: "2026-08-28T12:00:00Z",
    folder: "1 sem ccs / CYB-101 Digital Systems & Cyber Hygiene",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "CYB-101",
    courseTitle: "Introduction to Digital Systems & Cyber Hygiene",
    author: "Dept of CS & IT, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_Complete_Syllabus.txt'),
    description: "Official course syllabus, combinational circuits design, and past year question paper answers."
  },
  {
    id: "drive_1sem_ece101_syl",
    name: "ECE101_Basic_Electrical_Electronics_Syllabus_and_Formulas.txt",
    mimeType: "text/plain",
    size: "16.1 KB",
    modifiedTime: "2026-09-02T15:20:00Z",
    folder: "1 sem ccs / ECE-101 Basic Electrical & Electronics",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "ECE-101",
    courseTitle: "Basic Electrical & Electronics Engineering",
    author: "Dept of Electronics, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_Complete_Syllabus.txt'),
    description: "DC/AC circuit theorems (KCL, KVL, Thevenin, Norton), full-wave bridge rectifier derivations, and BJT characteristics."
  },
  {
    id: "drive_1sem_master_pyqs",
    name: "CUJammu_1Sem_CCS_Master_PYQ_Bundle_2018_2025_Solved.txt",
    mimeType: "text/plain",
    size: "45.0 KB",
    modifiedTime: "2026-10-01T17:00:00Z",
    folder: "1 sem ccs / All Subjects Master PYQs",
    folderId: "folder_1_sem_ccs",
    university: "Central University of Jammu",
    semester: 1,
    courseCode: "CCS-SEM1",
    courseTitle: "1 Sem CCS Master PYQ Question Bank",
    author: "Examination Cell & Student Welfare, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_PYQ_Master_Bank_2018_2025.txt'),
    description: "Complete compilation of all past exam question papers from 2018 to 2025 for all Semester 1 subjects with official model answers."
  },

  // =========================================================================
  // OTHER SEMESTERS (Upper Semesters for Reference)
  // =========================================================================
  {
    id: "drive_cuj_501_01",
    name: "CYB501_Lec04_AES_Architecture_and_Rounds.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "1.4 MB",
    modifiedTime: "2026-09-28T14:30:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 5 / CYB-501 Cryptography",
    folderId: "folder_sem_5",
    university: "Central University of Jammu",
    semester: 5,
    courseCode: "CYB-501",
    courseTitle: "Cryptography and Network Security",
    author: "Dept of CS & IT, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Official lecture presentation on AES round transformations (SubBytes, ShiftRows, MixColumns, AddRoundKey) and GF(2^8) math."
  },
  {
    id: "drive_cuj_501_02",
    name: "CYB501_Course_Syllabus_and_Evaluation_Scheme.txt",
    mimeType: "text/plain",
    size: "14.2 KB",
    modifiedTime: "2026-08-15T09:15:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 5 / CYB-501 Cryptography",
    folderId: "folder_sem_5",
    university: "Central University of Jammu",
    semester: 5,
    courseCode: "CYB-501",
    courseTitle: "Cryptography and Network Security",
    author: "Board of Studies, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_Syllabus.txt'),
    description: "Complete 5-unit syllabus document detailing examination weightages and textbook references."
  },
  {
    id: "drive_cuj_401_01",
    name: "CYB401_OS_SystemSecurity_Deadlocks_Canaries.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "2.8 MB",
    modifiedTime: "2026-03-22T11:00:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 4 / CYB-401 Operating Systems",
    folderId: "folder_sem_4",
    university: "Central University of Jammu",
    semester: 4,
    courseCode: "CYB-401",
    courseTitle: "Operating Systems & System Security",
    author: "Faculty of Cyber Security, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Lecture deck on Coffman Deadlock Conditions, Banker's Algorithm, Stack-based Buffer Overflows, ASLR, and Stack Canaries."
  },
  {
    id: "drive_cuj_601_01",
    name: "CYB601_Digital_Forensics_RFC3227_Volatility.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "3.1 MB",
    modifiedTime: "2026-04-18T16:20:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 6 / CYB-601 Digital Forensics",
    folderId: "folder_sem_6",
    university: "Central University of Jammu",
    semester: 6,
    courseCode: "CYB-601",
    courseTitle: "Digital Forensics & Incident Investigation",
    author: "Cyber Forensics Lab, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Chain of custody standards, Order of Volatility (RFC 3227), memory dumping via LiME, and Volatility 3 malfind analysis."
  },
  {
    id: "drive_cuj_701_01",
    name: "CYB701_Ethical_Hacking_ActiveDirectory_Kerberoasting.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "4.5 MB",
    modifiedTime: "2026-09-10T10:45:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 7 / CYB-701 Ethical Hacking",
    folderId: "folder_sem_7",
    university: "Central University of Jammu",
    semester: 7,
    courseCode: "CYB-701",
    courseTitle: "Ethical Hacking & Penetration Testing",
    author: "Red Team Research Group, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Enterprise penetration testing methodologies (PTES), Nmap stealth scanning, and Active Directory Kerberoasting attacks."
  }
];

let driveSession = {
  connected: true,
  userEmail: "rahul.sharma@cujammu.ac.in",
  userName: "Rahul Sharma",
  storageUsed: "4.8 GB of 100 GB (University Google Workspace)",
  connectedAt: new Date().toISOString(),
  connectedFolder: "1 sem ccs",
  exportedFiles: []
};

/**
 * Returns list of Google Drive files filtered by semester, folder, university, or query
 */
function getDriveFiles(filter = {}) {
  let files = [...curatedDriveFiles];

  if (filter.folder === '1_sem_ccs' || filter.folder === '1 sem ccs' || filter.semester === '1') {
    files = files.filter(f => f.folderId === 'folder_1_sem_ccs' || f.semester === 1);
  } else if (filter.semester && filter.semester !== 'all') {
    const semInt = parseInt(filter.semester, 10);
    files = files.filter(f => f.semester === semInt);
  }

  if (filter.university && filter.university !== 'all') {
    files = files.filter(f => f.university.toLowerCase().includes(filter.university.toLowerCase()));
  }

  if (filter.query) {
    const q = filter.query.toLowerCase();
    files = files.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.courseCode.toLowerCase().includes(q) ||
      f.folder.toLowerCase().includes(q)
    );
  }

  return files;
}

/**
 * Imports a file directly from Google Drive into the AI Engine pipeline
 */
function importDriveFile(fileId) {
  const fileMeta = curatedDriveFiles.find(f => f.id === fileId);
  if (!fileMeta) {
    throw new Error(`Google Drive file with ID "${fileId}" not found.`);
  }

  const isPptx = fileMeta.mimeType.includes('presentation') || fileMeta.name.endsWith('.pptx');
  let parsedPptx = null;
  let parsedSyllabus = null;

  if (isPptx) {
    parsedPptx = parsePptx(fileMeta.localSampleFile);
    parsedPptx.fileName = fileMeta.name;

    // Complement with appropriate syllabus
    const syllabusSample = fileMeta.semester === 1
      ? path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_Complete_Syllabus.txt')
      : path.join(SAMPLES_DIR, 'CUJammu_CYB501_Syllabus.txt');

    if (fs.existsSync(syllabusSample)) {
      const sylText = fs.readFileSync(syllabusSample, 'utf8');
      parsedSyllabus = parseSyllabus(sylText);
      parsedSyllabus.fileName = `${fileMeta.courseCode}_Syllabus.txt`;
    }
  } else {
    const sylText = fs.readFileSync(fileMeta.localSampleFile, 'utf8');
    parsedSyllabus = parseSyllabus(sylText);
    parsedSyllabus.fileName = fileMeta.name;
  }

  // Generate AI Short Notes & Interactive Notes
  const shortNotes = generateShortNotes(parsedPptx, parsedSyllabus, `${fileMeta.courseCode}: ${fileMeta.courseTitle}`);
  const interactiveNotes = generateInteractiveNotes(parsedPptx, parsedSyllabus, shortNotes);
  const predictedPaper = generatePredictedExamPaper(
    'cujammu',
    fileMeta.semester,
    fileMeta.courseCode,
    parsedPptx?.keywords || []
  );

  const record = {
    source: "Google Drive (Folder: 1 sem ccs)",
    driveFileId: fileMeta.id,
    driveFolder: fileMeta.folder,
    courseTitle: `${fileMeta.courseCode}: ${fileMeta.courseTitle}`,
    semester: fileMeta.semester,
    universityId: 'cujammu',
    pptx: parsedPptx ? {
      fileName: fileMeta.name,
      totalSlides: parsedPptx.totalSlides,
      keywords: parsedPptx.keywords,
      slides: parsedPptx.slides
    } : null,
    syllabus: parsedSyllabus ? {
      fileName: parsedSyllabus.fileName,
      totalUnits: parsedSyllabus.totalUnits,
      units: parsedSyllabus.units,
      courseInfo: parsedSyllabus.courseInfo
    } : null,
    shortNotes,
    interactiveNotes,
    predictedPaper
  };

  const saved = db.saveUpload(record);

  return {
    success: true,
    message: `Successfully imported "${fileMeta.name}" from Google Drive folder "1 sem ccs"!`,
    file: fileMeta,
    documentId: saved.id,
    data: saved
  };
}

/**
 * 1-Click Load the entire "1 sem ccs" Study Pack
 */
function load1SemCcsPack(subjectCode = 'CSE-101') {
  const pptxPath = path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_C_Programming.pptx');
  const syllabusPath = path.join(SAMPLES_DIR, 'CUJammu_1Sem_CCS_Complete_Syllabus.txt');

  const parsedPptx = parsePptx(pptxPath);
  parsedPptx.fileName = "CSE101_Lec04_Pointers_Dynamic_Memory_Malloc.pptx";

  const syllabusText = fs.readFileSync(syllabusPath, 'utf8');
  const parsedSyllabus = parseSyllabus(syllabusText);
  parsedSyllabus.fileName = "CUJammu_1Sem_CCS_Complete_Syllabus.txt";

  const shortNotes = generateShortNotes(parsedPptx, parsedSyllabus, "CSE-101: Programming for Problem Solving in C (1 Sem CCS)");
  const interactiveNotes = generateInteractiveNotes(parsedPptx, parsedSyllabus, shortNotes);
  const predictedPaper = generatePredictedExamPaper('cujammu', 1, subjectCode, parsedPptx.keywords);

  const record = {
    source: "Google Drive - Folder: 1 sem ccs",
    folderName: "1 sem ccs",
    courseTitle: "CSE-101: Programming for Problem Solving in C (1 Sem CCS)",
    semester: 1,
    universityId: "cujammu",
    pptx: {
      fileName: parsedPptx.fileName,
      totalSlides: parsedPptx.totalSlides,
      keywords: parsedPptx.keywords,
      slides: parsedPptx.slides
    },
    syllabus: {
      fileName: parsedSyllabus.fileName,
      totalUnits: parsedSyllabus.totalUnits,
      units: parsedSyllabus.units,
      courseInfo: parsedSyllabus.courseInfo
    },
    shortNotes,
    interactiveNotes,
    predictedPaper
  };

  const saved = db.saveUpload(record);

  return {
    success: true,
    message: 'Connected & Loaded Google Drive Folder: "1 sem ccs" (CUJammu B.Tech CSE Cyber Security Sem 1)!',
    folder: folder1SemCcs,
    documentId: saved.id,
    data: saved
  };
}

/**
 * Saves generated notes or exam papers directly back to Google Drive
 */
function exportToGoogleDrive(payload) {
  const { title, type, userEmail } = payload;
  const fileName = `${title.replace(/[^a-zA-Z0-9_\-]/g, '_')}_${type === 'exam' ? 'QuestionPaper' : 'ShortNotes'}.pdf`;
  const driveFolder = "My Drive / 1 sem ccs / Generated Exam Papers 2026";

  const exportedItem = {
    id: "gdrive_exp_" + Date.now(),
    name: fileName,
    type,
    folder: driveFolder,
    size: `${(Math.random() * 200 + 150).toFixed(1)} KB`,
    webUrl: `https://drive.google.com/file/d/1SemCCS_${Date.now()}/view`,
    savedAt: new Date().toISOString(),
    userEmail: userEmail || driveSession.userEmail
  };

  driveSession.exportedFiles.unshift(exportedItem);

  return {
    success: true,
    message: `Successfully saved "${fileName}" to Google Drive folder "${driveFolder}"!`,
    exportedItem
  };
}

module.exports = {
  folder1SemCcs,
  getDriveFiles,
  importDriveFile,
  load1SemCcsPack,
  exportToGoogleDrive,
  driveSession,
  curatedDriveFiles
};
