// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const { parsePptx } = require('./pptx_parser');
const { parseSyllabus } = require('./syllabus_parser');
const {
  generateShortNotes,
  generateInteractiveNotes,
  generatePredictedExamPaper,
  cujDatabase,
  otherUnisDatabase,
  universitiesList
} = require('./ai_engine');
const db = require('./db_store');
const googleDrive = require('./google_drive_service');

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_DIR = __dirname;
const WEB_DIR = path.join(__dirname, 'web');
const HTML_FILE = path.join(WEB_DIR, 'index.html');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const SAMPLES_DIR = path.join(__dirname, 'data', 'sample_decks');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_\-]/g, '_');
    cb(null, `${Date.now()}_${safeName}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static files
app.use(express.static(WEB_DIR));
app.use('/data/sample_decks', express.static(SAMPLES_DIR));

// -----------------------------------------------------------------------------
// 1. AUTHENTICATION (Google Login & Profile)
// -----------------------------------------------------------------------------
app.post('/api/auth/google', (req, res) => {
  try {
    const { token, profile } = req.body;
    let userProfile = profile;

    // If client sends token, or in mock/student demo mode
    if (!userProfile) {
      userProfile = {
        email: "rahul.sharma@cujammu.ac.in",
        name: "Rahul Sharma",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        university: "Central University of Jammu",
        department: "Computer Science & Engineering",
        semester: 5,
        rollNo: "CUJ/CSE/22/042"
      };
    }

    const user = db.findOrCreateUser(userProfile);
    res.json({
      success: true,
      user,
      message: `Authenticated as ${user.name} (${user.university})`
    });
  } catch (err) {
    console.error('Google Auth error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const users = db.getUploads();
  const defaultUser = {
    id: "cuj_demo_user_01",
    email: "rahul.sharma@cujammu.ac.in",
    name: "Rahul Sharma",
    picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    university: "Central University of Jammu",
    department: "Computer Science & Engineering",
    semester: 5,
    rollNo: "CUJ/CSE/22/042",
    role: "Student",
    savedPapersCount: 4,
    notesCount: 6
  };
  res.json({ success: true, user: defaultUser });
});

// -----------------------------------------------------------------------------
// 2. FILE UPLOADS (PPTX & Syllabus Processing)
// -----------------------------------------------------------------------------
app.post(
  '/api/upload',
  upload.fields([
    { name: 'pptx', maxCount: 1 },
    { name: 'syllabus', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const pptxFile = req.files?.pptx?.[0];
      const syllabusFile = req.files?.syllabus?.[0];
      const rawSyllabusText = req.body.syllabusText || '';
      const courseTitle = req.body.courseTitle || 'Cyber Security Course';
      const semester = parseInt(req.body.semester, 10) || 5;
      const universityId = req.body.universityId || 'cujammu';

      let parsedPptx = null;
      let parsedSyllabus = null;

      // Parse PPTX
      if (pptxFile) {
        parsedPptx = parsePptx(pptxFile.path);
        parsedPptx.fileName = pptxFile.originalname;
        parsedPptx.fileSize = pptxFile.size;
      }

      // Parse Syllabus
      if (syllabusFile) {
        const ext = path.extname(syllabusFile.originalname).toLowerCase();
        let content = '';
        if (ext === '.txt' || ext === '.md' || ext === '.json') {
          content = fs.readFileSync(syllabusFile.path, 'utf8');
        } else {
          // Binary or unsupported format fallback
          content = `Uploaded syllabus file: ${syllabusFile.originalname}\nCourse: ${courseTitle}\nSemester: ${semester}`;
        }
        parsedSyllabus = parseSyllabus(content);
        parsedSyllabus.fileName = syllabusFile.originalname;
      } else if (rawSyllabusText.trim().length > 0) {
        parsedSyllabus = parseSyllabus(rawSyllabusText);
        parsedSyllabus.fileName = "Direct Input Syllabus";
      }

      // Generate initial AI notes and predictions automatically
      const shortNotes = generateShortNotes(parsedPptx, parsedSyllabus, courseTitle);
      const interactiveNotes = generateInteractiveNotes(parsedPptx, parsedSyllabus, shortNotes);
      const predictedPaper = generatePredictedExamPaper(
        universityId,
        semester,
        parsedSyllabus?.courseInfo?.courseCode || 'CYB-501',
        parsedPptx?.keywords || []
      );

      const record = {
        courseTitle,
        semester,
        universityId,
        pptx: parsedPptx ? {
          fileName: parsedPptx.fileName,
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

      res.json({
        success: true,
        message: 'Successfully processed PPTX presentation and syllabus!',
        documentId: saved.id,
        summary: {
          totalSlides: parsedPptx?.totalSlides || 0,
          totalUnits: parsedSyllabus?.totalUnits || 0,
          keywordsCount: parsedPptx?.keywords?.length || 0,
          predictedAccuracy: predictedPaper.overallAccuracy
        },
        data: saved
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Quick 1-Click Load Sample CUJammu Deck & Syllabus
app.post('/api/upload/load-sample', (req, res) => {
  try {
    const samplePptxPath = path.join(SAMPLES_DIR, 'CUJammu_CYB501_LectureSlides.pptx');
    const sampleSyllabusPath = path.join(SAMPLES_DIR, 'CUJammu_CYB501_Syllabus.txt');

    const parsedPptx = parsePptx(samplePptxPath);
    parsedPptx.fileName = "CUJammu_CYB501_LectureSlides.pptx";

    const syllabusText = fs.readFileSync(sampleSyllabusPath, 'utf8');
    const parsedSyllabus = parseSyllabus(syllabusText);
    parsedSyllabus.fileName = "CUJammu_CYB501_Syllabus.txt";

    const shortNotes = generateShortNotes(parsedPptx, parsedSyllabus, "CYB-501: Cryptography & Network Security");
    const interactiveNotes = generateInteractiveNotes(parsedPptx, parsedSyllabus, shortNotes);
    const predictedPaper = generatePredictedExamPaper('cujammu', 5, 'CYB-501', parsedPptx.keywords);

    const record = {
      courseTitle: "CYB-501: Cryptography and Network Security",
      semester: 5,
      universityId: "cujammu",
      isSample: true,
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

    res.json({
      success: true,
      message: 'Loaded Central University of Jammu CYB-501 Sample Deck & Syllabus!',
      documentId: saved.id,
      data: saved
    });
  } catch (err) {
    console.error('Error loading sample deck:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 3. GOOGLE DRIVE STUDY MATERIAL INTEGRATION
// -----------------------------------------------------------------------------
app.get('/api/drive/status', (req, res) => {
  res.json({
    success: true,
    driveSession: googleDrive.driveSession
  });
});

app.post('/api/drive/connect', (req, res) => {
  const { email, name } = req.body;
  if (email) googleDrive.driveSession.userEmail = email;
  if (name) googleDrive.driveSession.userName = name;
  googleDrive.driveSession.connected = true;
  res.json({
    success: true,
    message: `Google Drive connected for ${googleDrive.driveSession.userEmail}`,
    driveSession: googleDrive.driveSession
  });
});

app.get('/api/drive/files', (req, res) => {
  try {
    const { semester, category, university, query } = req.query;
    const files = googleDrive.getDriveFiles({ semester, category, university, query });
    res.json({
      success: true,
      totalFiles: files.length,
      files
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/drive/import', (req, res) => {
  try {
    const { fileId } = req.body;
    if (!fileId) {
      return res.status(400).json({ success: false, error: 'fileId is required' });
    }
    const result = googleDrive.importDriveFile(fileId);
    res.json(result);
  } catch (err) {
    console.error('Drive import error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/drive/export', (req, res) => {
  try {
    const { title, type, content, userEmail } = req.body;
    const result = googleDrive.exportToGoogleDrive({ title, type, content, userEmail });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Dedicated "1 sem ccs" Google Drive Folder endpoints
app.get('/api/drive/folder/1-sem-ccs', (req, res) => {
  try {
    const { category, query } = req.query;
    const files = googleDrive.getDriveFiles({ folder: '1_sem_ccs', category, query });
    res.json({
      success: true,
      folder: googleDrive.folder1SemCcs,
      totalFiles: files.length,
      files
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/drive/folder/1-sem-ccs/load-pack', (req, res) => {
  try {
    const { subjectCode } = req.body;
    const result = googleDrive.load1SemCcsPack(subjectCode || 'CSE-101');
    res.json(result);
  } catch (err) {
    console.error('Error loading 1 sem ccs pack:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 4. AI NOTES & EXAM GENERATOR ENDPOINTS
// -----------------------------------------------------------------------------
app.post('/api/notes/generate', (req, res) => {
  try {
    const { pptxData, syllabusData, courseTitle } = req.body;
    const shortNotes = generateShortNotes(pptxData, syllabusData, courseTitle);
    const interactiveNotes = generateInteractiveNotes(pptxData, syllabusData, shortNotes);
    
    db.saveGeneratedNotes({
      courseTitle: courseTitle || 'Cyber Security',
      shortNotes,
      interactiveNotes
    });

    res.json({
      success: true,
      shortNotes,
      interactiveNotes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/exam/generate', (req, res) => {
  try {
    const { universityId, semester, subjectCode, keywords } = req.body;
    const paper = generatePredictedExamPaper(universityId, semester, subjectCode, keywords);
    
    db.saveGeneratedPaper(paper);

    res.json({
      success: true,
      paper
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------------------------------------------------------
// 4. PYQ DATABASE & UNIVERSITIES EXPLORER
// -----------------------------------------------------------------------------
app.get('/api/pyq/universities', (req, res) => {
  res.json({
    success: true,
    universities: universitiesList
  });
});

app.get('/api/pyq/cujammu', (req, res) => {
  const sem = req.query.semester ? parseInt(req.query.semester, 10) : null;
  if (sem) {
    const found = cujDatabase.find(s => s.sem === sem);
    return res.json({ success: true, semester: sem, data: found || null });
  }
  res.json({
    success: true,
    university: "Central University of Jammu",
    degree: "B.Tech Computer Science & Engineering (Cyber Security)",
    semesters: cujDatabase
  });
});

app.get('/api/pyq/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const sem = req.query.semester ? parseInt(req.query.semester, 10) : null;
  const results = [];

  cujDatabase.forEach(s => {
    if (sem && s.sem !== sem) return;
    s.subjects.forEach(sub => {
      sub.pyqs.forEach(q => {
        if (!query || q.text.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query) || sub.title.toLowerCase().includes(query)) {
          results.push({
            semester: s.sem,
            subjectCode: sub.code,
            subjectTitle: sub.title,
            ...q
          });
        }
      });
    });
  });

  res.json({
    success: true,
    count: results.length,
    results
  });
});

// -----------------------------------------------------------------------------
// 5. DOWNLOADS & STATUS
// -----------------------------------------------------------------------------
app.get('/download/apk', (req, res) => {
  const apkPath = path.join(PROJECT_DIR, 'ExamPulse-Antigravity-v2.0.0.apk');
  if (fs.existsSync(apkPath)) {
    const stat = fs.statSync(apkPath);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename="ExamPulse-Antigravity-v2.0.0.apk"',
      'Content-Length': stat.size
    });
    fs.createReadStream(apkPath).pipe(res);
  } else {
    res.redirect('https://github.com/mildfriend3-blip/exampulse-antigravity/releases/download/v2.0.0-antigravity/ExamPulse-Antigravity-v2.0.0.apk');
  }
});

app.get('/download/project.zip', (req, res) => {
  const zipPath = path.join(PROJECT_DIR, 'exampulse-antigravity-source.zip');
  try {
    if (!fs.existsSync(zipPath)) {
      execSync(`powershell -Command "Compress-Archive -Path '${path.join(PROJECT_DIR, 'app')}', '${path.join(PROJECT_DIR, 'data')}', '${path.join(PROJECT_DIR, 'build.gradle.kts')}', '${path.join(PROJECT_DIR, 'settings.gradle.kts')}', '${path.join(PROJECT_DIR, 'server.js')}', '${path.join(PROJECT_DIR, 'README.md')}' -DestinationPath '${zipPath}' -Force"`);
    }
    const stat = fs.statSync(zipPath);
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="exampulse-antigravity-source.zip"',
      'Content-Length': stat.size
    });
    fs.createReadStream(zipPath).pipe(res);
  } catch (err) {
    res.status(500).send('Error creating zip bundle: ' + err.message);
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    app: 'ExamPulse // Antigravity Examination Powerhouse',
    version: '2.5.0-ANTIGRAVITY',
    port: PORT,
    database: {
      cujammuSemesters: cujDatabase.length,
      universities: universitiesList.length
    }
  });
});

// Fallback to index.html for SPA
app.use((req, res) => {
  if (fs.existsSync(HTML_FILE)) {
    res.sendFile(HTML_FILE);
  } else {
    res.status(404).send('Web HUD index.html not found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n================================================================`);
  console.log(`🚀 ExamPulse // Antigravity Examination Powerhouse Online`);
  console.log(`================================================================`);
  console.log(`📍 Web HUD:        http://localhost:${PORT}`);
  console.log(`🌐 Network URL:    http://127.0.0.1:${PORT}`);
  console.log(`🎓 University:     Central University of Jammu (CUJammu) & All IITs/NITs`);
  console.log(`📂 PPTX & Syllabus Engine Ready for Ingestion`);
  console.log(`================================================================\n`);
});
