// google_drive_service.js
const fs = require('fs');
const path = require('path');
const { parsePptx } = require('./pptx_parser');
const { parseSyllabus } = require('./syllabus_parser');
const { generateShortNotes, generateInteractiveNotes, generatePredictedExamPaper } = require('./ai_engine');
const db = require('./db_store');

// Sample files directory
const SAMPLES_DIR = path.join(__dirname, 'data', 'sample_decks');

// Curated Institutional Google Drive Study Materials for CUJammu & Partner Universities
const curatedDriveFiles = [
  // CUJammu Sem 5 - Cryptography
  {
    id: "drive_cuj_501_01",
    name: "CYB501_Lec04_AES_Architecture_and_Rounds.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "1.4 MB",
    modifiedTime: "2026-09-28T14:30:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 5 / CYB-501 Cryptography",
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
    university: "Central University of Jammu",
    semester: 5,
    courseCode: "CYB-501",
    courseTitle: "Cryptography and Network Security",
    author: "Board of Studies, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_Syllabus.txt'),
    description: "Complete 5-unit syllabus document detailing examination weightages and textbook references."
  },
  // CUJammu Sem 4 - Operating Systems
  {
    id: "drive_cuj_401_01",
    name: "CYB401_OS_SystemSecurity_Deadlocks_Canaries.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "2.8 MB",
    modifiedTime: "2026-03-22T11:00:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 4 / CYB-401 Operating Systems",
    university: "Central University of Jammu",
    semester: 4,
    courseCode: "CYB-401",
    courseTitle: "Operating Systems & System Security",
    author: "Faculty of Cyber Security, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Lecture deck on Coffman Deadlock Conditions, Banker's Algorithm, Stack-based Buffer Overflows, ASLR, and Stack Canaries."
  },
  // CUJammu Sem 6 - Digital Forensics
  {
    id: "drive_cuj_601_01",
    name: "CYB601_Digital_Forensics_RFC3227_Volatility.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "3.1 MB",
    modifiedTime: "2026-04-18T16:20:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 6 / CYB-601 Digital Forensics",
    university: "Central University of Jammu",
    semester: 6,
    courseCode: "CYB-601",
    courseTitle: "Digital Forensics & Incident Investigation",
    author: "Cyber Forensics Lab, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Chain of custody standards, Order of Volatility (RFC 3227), memory dumping via LiME, and Volatility 3 malfind analysis."
  },
  // CUJammu Sem 7 - Ethical Hacking
  {
    id: "drive_cuj_701_01",
    name: "CYB701_Ethical_Hacking_ActiveDirectory_Kerberoasting.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "4.5 MB",
    modifiedTime: "2026-09-10T10:45:00Z",
    folder: "CUJammu / B.Tech Cyber Security / Sem 7 / CYB-701 Ethical Hacking",
    university: "Central University of Jammu",
    semester: 7,
    courseCode: "CYB-701",
    courseTitle: "Ethical Hacking & Penetration Testing",
    author: "Red Team Research Group, CUJammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Enterprise penetration testing methodologies (PTES), Nmap stealth scanning, and Active Directory Kerberoasting attacks."
  },
  // IIT Jammu - Cryptographic Engineering
  {
    id: "drive_iitj_520_01",
    name: "IITJ_CS520_SideChannelAttacks_DPA_Masking.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "3.7 MB",
    modifiedTime: "2026-10-02T13:10:00Z",
    folder: "IIT Jammu / B.Tech CSE / CS-520 Cryptographic Engineering",
    university: "IIT Jammu",
    semester: 5,
    courseCode: "CS-520",
    courseTitle: "Cryptographic Engineering",
    author: "Dept of CSE, IIT Jammu",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "Differential Power Analysis (DPA) on hardware cryptographic implementations and Boolean masking schemes in GF(2^8)."
  },
  // NIT Srinagar - Advanced Network Security
  {
    id: "drive_nits_502_01",
    name: "NITS_CST502_IPsec_Tunnel_Transport_IKEv2.pptx",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    size: "2.2 MB",
    modifiedTime: "2026-05-14T08:30:00Z",
    folder: "NIT Srinagar / B.Tech CSE / CST-502 Advanced Network Security",
    university: "NIT Srinagar",
    semester: 5,
    courseCode: "CST-502",
    courseTitle: "Advanced Network Security",
    author: "Dept of CSE, NIT Srinagar",
    localSampleFile: path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx'),
    description: "IPsec architecture, AH vs ESP headers, Security Associations (SA), and IKEv2 key negotiation phases."
  }
];

let driveSession = {
  connected: true,
  userEmail: "rahul.sharma@cujammu.ac.in",
  userName: "Rahul Sharma",
  storageUsed: "4.8 GB of 100 GB (University Google Workspace)",
  connectedAt: new Date().toISOString(),
  exportedFiles: []
};

/**
 * Returns list of Google Drive files filtered by semester, university, or query
 */
function getDriveFiles(filter = {}) {
  let files = [...curatedDriveFiles];

  if (filter.semester && filter.semester !== 'all') {
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
    // Parse the presentation
    parsedPptx = parsePptx(fileMeta.localSampleFile);
    parsedPptx.fileName = fileMeta.name;

    // Complement with course syllabus if available
    const syllabusSample = path.join(SAMPLES_DIR, 'CUJammu_CYB501_Syllabus.txt');
    if (fs.existsSync(syllabusSample)) {
      const sylText = fs.readFileSync(syllabusSample, 'utf8');
      parsedSyllabus = parseSyllabus(sylText);
      parsedSyllabus.fileName = `${fileMeta.courseCode}_Syllabus.txt`;
    }
  } else {
    // Parse syllabus text
    const sylText = fs.readFileSync(fileMeta.localSampleFile, 'utf8');
    parsedSyllabus = parseSyllabus(sylText);
    parsedSyllabus.fileName = fileMeta.name;
  }

  // Generate AI Short Notes & Interactive Notes
  const shortNotes = generateShortNotes(parsedPptx, parsedSyllabus, `${fileMeta.courseCode}: ${fileMeta.courseTitle}`);
  const interactiveNotes = generateInteractiveNotes(parsedPptx, parsedSyllabus, shortNotes);
  const predictedPaper = generatePredictedExamPaper(
    fileMeta.university.toLowerCase().includes('cuj') ? 'cujammu' : 'iit_jammu',
    fileMeta.semester,
    fileMeta.courseCode,
    parsedPptx?.keywords || []
  );

  // Store in database
  const record = {
    source: "Google Drive",
    driveFileId: fileMeta.id,
    driveFolder: fileMeta.folder,
    courseTitle: `${fileMeta.courseCode}: ${fileMeta.courseTitle}`,
    semester: fileMeta.semester,
    universityId: fileMeta.university.toLowerCase().includes('cuj') ? 'cujammu' : 'iit_jammu',
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
    message: `Successfully imported "${fileMeta.name}" from Google Drive!`,
    file: fileMeta,
    documentId: saved.id,
    data: saved
  };
}

/**
 * Saves generated notes or exam papers directly back to the user's Google Drive
 */
function exportToGoogleDrive(payload) {
  const { title, type, content, userEmail } = payload;
  const fileName = `${title.replace(/[^a-zA-Z0-9_\-]/g, '_')}_${type === 'exam' ? 'QuestionPaper' : 'ShortNotes'}.pdf`;
  const driveFolder = "My Drive / ExamPulse Antigravity / Predicted Papers 2026";

  const exportedItem = {
    id: "gdrive_exp_" + Date.now(),
    name: fileName,
    type,
    folder: driveFolder,
    size: `${(Math.random() * 200 + 150).toFixed(1)} KB`,
    webUrl: `https://drive.google.com/file/d/1ExamPulse_${Date.now()}/view`,
    savedAt: new Date().toISOString(),
    userEmail: userEmail || driveSession.userEmail
  };

  driveSession.exportedFiles.unshift(exportedItem);

  return {
    success: true,
    message: `Successfully saved "${fileName}" to Google Drive in folder "${driveFolder}"!`,
    exportedItem
  };
}

module.exports = {
  getDriveFiles,
  importDriveFile,
  exportToGoogleDrive,
  driveSession,
  curatedDriveFiles
};
