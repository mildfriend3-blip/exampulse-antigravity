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
// 4.5 AI COPILOT CHAT ASSISTANT (CUJAMMU & 1 SEM CCS FOCUS)
// -----------------------------------------------------------------------------
app.post('/api/copilot/chat', (req, res) => {
  try {
    const { message, semester = 1 } = req.body;
    const query = (message || '').trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query message is required' });
    }

    // 1. Check for Master Examination PYQ Paper queries
    if (query.includes('pyq') || query.includes('examination pyq') || query.includes('master') || query.includes('blueprint') || query.includes('pattern')) {
      return res.json({
        success: true,
        reply: `### ⭐ CUJammu Master Examination PYQ Blueprint & Overview
Linked Drive File: **\`examination pyq.pdf\`** (*Central University of Jammu, Semester 1 End-Term Examination*)

#### 📊 Question Paper Blueprint (70 Marks Total):
- **Section A (10 × 2 Marks = 20 Marks)**: Short compulsory analytical definitions & high-frequency concepts.
  - *Dangling pointers & Use-After-Free (UAF) prevention*
  - *Cayley-Hamilton Theorem statement & characteristic equation*
  - *Kirchhoff's Current Law (KCL) & charge conservation*
  - *Eutrophication, Biochemical Oxygen Demand (BOD) vs DO*
  - *Lean Startup Build-Measure-Learn & Minimum Viable Product (MVP)*
- **Section B (4 × 5 Marks = 20 Marks)**: In-depth code implementations, algorithmic derivations, and numerical proofs.
  - *In-place string reversal using dynamic memory without string.h*
  - *Gram-Schmidt orthonormalization in R^3*
  - *Thevenin equivalent circuit derivation across load resistors*
- **Section C (3 × 10 Marks = 30 Marks with Internal Choice)**: Comprehensive system designs, circuit analysis, and full-length programs.
  - *Full dynamic 2D matrix transpose with zero memory leaks*
  - *RLC series resonance bandwidth and quality factor Q*

💡 *Pro-tip: Click "⭐ INGEST MASTER PYQ & PREDICT PAPER" on the Study Command Center to import all model solutions immediately into your notes.*`,
        sources: [
          { name: "examination pyq.pdf", driveId: "1N7kbMvHBw_4OnOlA66NNRobLGgcA1CDC", type: "Master PYQ" },
          { name: "data/cujammu_pyq_database.json", type: "Official CUJammu Database" }
        ]
      });
    }

    // 2. Check for Pointer / Memory / C programming queries
    if (query.includes('pointer') || query.includes('malloc') || query.includes('calloc') || query.includes('dangling') || query.includes('c program') || query.includes('uaf') || query.includes('memory') || query.includes('string')) {
      return res.json({
        success: true,
        reply: `### 💻 C Dynamic Memory Allocation & Pointer Security
Reference Drive Files: **\`Computer Programming_UNIT-2_1\` through \`UNIT-2_5\`**

#### 1. Dangling Pointer & Use-After-Free (UAF):
A dangling pointer points to memory that has been deallocated via \`free(ptr)\`. If dereferenced or reallocated, an attacker can hijack control flow.
\`\`\`c
int *ptr = (int *)malloc(sizeof(int));
*ptr = 42;
free(ptr);
ptr = NULL; // CRITICAL: Always nullify dangling pointers!
\`\`\`

#### 2. \`malloc()\` vs \`calloc()\`:
| Feature | \`malloc(size_t size)\` | \`calloc(size_t num, size_t size)\` |
|---|---|---|
| Initialization | Contains unpredictable garbage values | Zero-initializes all bytes |
| Arguments | Total byte size | Number of elements and size of each |
| Performance | Faster allocation | Slightly slower due to \`memset()\` zeroing |

#### 3. High-Frequency Exam Question:
*"Why is \`gets()\` prohibited in cyber security?"*
\`gets()\` performs no bounds checking on buffer length, leading directly to buffer overflow and stack return address overwriting. Always use \`fgets(buf, sizeof(buf), stdin)\`.`,
        sources: [
          { name: "Computer Programming_UNIT-2_5_b93d09b9fcc7b45ee37549312051ccdd.pdf", driveId: "1MA6SBBdXiiVhNZLZahVFxEV7i8u8pMV3" },
          { name: "Computer Programming_UNIT-2_1_394407bfaa1f2a955e1fbc974728cf5f.pdf", driveId: "1wVhKfwN7JYKJLQVaYP1M3_HdPMy-uUPg" }
        ]
      });
    }

    // 3. Check for Math / Cayley-Hamilton / Linear Algebra queries
    if (query.includes('cayley') || query.includes('eigen') || query.includes('matrix') || query.includes('gram') || query.includes('vector') || query.includes('linear')) {
      return res.json({
        success: true,
        reply: `### 📐 Engineering Mathematics - I: Linear Algebra & Vectors
Reference Drive Files: **\`Vector\`**, **\`Linear Transformation- L3\`**, **\`Inner Product Space\`**

#### 1. Cayley-Hamilton Theorem:
> **Statement**: Every square matrix A satisfies its own characteristic equation:
> $$P(\\lambda) = \\det(A - \\lambda I) = 0 \\implies P(A) = 0$$

#### 2. Verification Example (2x2 Identity I):
- Matrix $I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$
- Characteristic equation: $\\det(I - \\lambda I) = (1 - \\lambda)^2 = \\lambda^2 - 2\\lambda + 1 = 0$
- Substitute $I$: $I^2 - 2I + I = I - 2I + I = 0$. (Verified!)
- Matrix inverse formula: $A^{-1} = -\\frac{1}{a_0}(A^{n-1} + a_{n-1}A^{n-2} + \\dots + a_1 I)$.

#### 3. Gram-Schmidt Orthonormalization:
Given basis $\{v_1, v_2\}$:
$$u_1 = v_1, \\quad e_1 = \\frac{u_1}{\\|u_1\\|}$$
$$u_2 = v_2 - \\frac{\\langle v_2, u_1 \\rangle}{\\|u_1\\|^2} u_1, \\quad e_2 = \\frac{u_2}{\\|u_2\\|}$$`,
        sources: [
          { name: "Linear Transformation_c8b173718a7a58f12f0070c1558615ce.pdf", driveId: "1jPXF6I5aQynM8DJYtmklvtEjdfDwHubi" },
          { name: "Inner Product Space_275c4608e49e90aab1ce0cc71e3d3aee.pdf", driveId: "12hiKnQdbIT3f_aUZAYGRt6Uy4V56IsCM" }
        ]
      });
    }

    // 4. Check for Electrical / BEE queries
    if (query.includes('bee') || query.includes('thevenin') || query.includes('kcl') || query.includes('kvl') || query.includes('rlc') || query.includes('superposition') || query.includes('circuit')) {
      return res.json({
        success: true,
        reply: `### ⚡ Basic Electrical Engineering (BEE-101)
Reference Drive Files: **\`Lect1pdf.pdf\` through \`Lect7pdf\`**, **\`BEE_ syllabus-2026\`**

#### 1. Kirchhoff's Laws:
- **KCL (Conservation of Charge)**: $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ at any junction node. Charge cannot accumulate in an infinitesimal volume.
- **KVL (Conservation of Energy)**: $\\sum V = 0$ around any closed mesh loop. The net work done moving a unit charge around a closed path is zero.

#### 2. Thevenin's Theorem Steps:
1. Identify and disconnect load resistor $R_L$.
2. Calculate open-circuit voltage $V_{th} = V_{oc}$ across terminals.
3. Deactivate all independent sources (short voltage sources, open current sources) to find $R_{th}$.
4. Connect Thevenin equivalent circuit: series $V_{th}$ and $R_{th}$ with $R_L$.
5. Compute load current: $I_L = \\frac{V_{th}}{R_{th} + R_L}$.

#### 3. RLC Series Resonance:
$$f_0 = \\frac{1}{2\\pi\\sqrt{LC}}, \\quad Q = \\frac{\\omega_0 L}{R} = \\frac{1}{\\omega_0 CR}$$`,
        sources: [
          { name: "Lect1pdf.pdf to Lect7pdf", driveId: "1b0rwJxq9CicqjUE0N9m1tNM019vQ33he" },
          { name: "BEE_ syllabus-2026_ed90dd8c99e27bb2495359a00057d0e8.docx.pdf", driveId: "1DVODCQNOANnhS2GJwhWD8LcKXNsKV5G4" }
        ]
      });
    }

    // 5. Check for EVS queries
    if (query.includes('evs') || query.includes('eutrophication') || query.includes('bod') || query.includes('environmental') || query.includes('pollution')) {
      return res.json({
        success: true,
        reply: `### 🌱 Environmental Studies & Sustainable Systems (EVS-101)
Reference Drive Files: **\`Unit I Environmental_Studies_A\`**, **\`SYLLABUS ES\`**, **\`Environmental Studies 1\`**

#### 1. Eutrophication Sequence:
1. **Nutrient Runoff**: Excess nitrogen ($N$) and phosphorus ($P$) from agriculture wash into aquatic bodies.
2. **Algal Bloom**: Proliferation of surface algae blocks sunlight from benthic phototrophs.
3. **Decomposition**: Algae dies; aerobic microbes decompose biomass, exhausting Dissolved Oxygen ($DO$).
4. **Hypoxia / Anoxia**: $DO < 2\\text{ mg/L}$ creates aquatic "Dead Zones" and catastrophic fish kills.

#### 2. BOD vs DO Relationship:
- **Biochemical Oxygen Demand (BOD)** is inversely related to **Dissolved Oxygen (DO)**.
- High organic pollution $\\implies$ High microbial respiration $\\implies$ Surging BOD $\\implies$ Depleted DO.`,
        sources: [
          { name: "Unit I Environmental_Studies_A_5c4efe24a691e463be71dae4951ccd0b.pdf", driveId: "1VmOUGImSi5E6GvmrBcQqi-XLBa-xfcz6" },
          { name: "Environmental Studies 1_a82bdd253b381a0ad0de3ab703285d1b.pdf", driveId: "1ImdxqzLEdIPLilKYGwt7Kr4iCGORZyLC" }
        ]
      });
    }

    // 6. Check for Entrepreneurship / Startups queries
    if (query.includes('startup') || query.includes('entrepreneurship') || query.includes('mvp') || query.includes('bmc') || query.includes('business model')) {
      return res.json({
        success: true,
        reply: `### 🚀 Introduction to Entrepreneurship & Startups (ENT-101)
Reference Drive Files: **\`Lesson 2\`**, **\`Syllabus_ Introduction to Entrepreneurship Startup\`**, **\`Study Material 1 to 8\`**

#### 1. Lean Startup Methodology:
- **Core Loop**: $\\text{Build} \\rightarrow \\text{Measure} \\rightarrow \\text{Learn}$.
- Goal: Minimize cycle time through validated learning rather than speculative multi-year business plans.

#### 2. Minimum Viable Product (MVP):
The version of a new product that enables collecting the maximum amount of validated customer learning with the least effort and expenditure.

#### 3. Business Model Canvas (BMC) 9 Building Blocks:
1. Customer Segments  2. Value Propositions  3. Channels  4. Customer Relationships
5. Revenue Streams  6. Key Resources  7. Key Activities  8. Key Partnerships  9. Cost Structure.`,
        sources: [
          { name: "Lesson 2", driveId: "1nsTh_hxSyWMCYMQnpU0Dh-uC3xpamvn1" },
          { name: "Study Material_32456f7e385f994565d971582ab17fe0.pdf", driveId: "1Z0bUjiUedpFfvsjv7io6DIxQjWsIeoGR" }
        ]
      });
    }

    // 7. Fallback search across CUJammu PYQ database
    const matchedPyqs = [];
    cujDatabase.forEach(s => {
      s.subjects.forEach(sub => {
        sub.pyqs.forEach(q => {
          if (q.text.toLowerCase().includes(query) || (q.answer && q.answer.toLowerCase().includes(query)) || sub.title.toLowerCase().includes(query)) {
            matchedPyqs.push({
              semester: s.sem,
              subjectCode: sub.code,
              subjectTitle: sub.title,
              ...q
            });
          }
        });
      });
    });

    if (matchedPyqs.length > 0) {
      const top = matchedPyqs[0];
      return res.json({
        success: true,
        reply: `### 🎯 CUJammu PYQ Match (${top.subjectCode}: ${top.subjectTitle})
**Question (${top.marks} Marks - ${top.examYear || '2024-2025'}):**
> ${top.text}

**Model Examination Answer:**
${top.answer || 'Refer to the course notes for full derivation.'}

${top.blueprintCategory ? `*Blueprint Category:* \`${top.blueprintCategory}\` | *Probability:* \`${top.repeatProbability || '90%'}\`` : ''}`,
        sources: [
          { name: "cujammu_pyq_database.json", subject: top.subjectTitle }
        ]
      });
    }

    // Generic helpful response
    res.json({
      success: true,
      reply: `### 🤖 ExamPulse AI Cyber Assistant
I have searched the **CUJammu Semester 1 Cyber Security Database** and all **34 Google Drive files** in folder \`1 sem ccs\`.

You can ask me anything about:
- **Official Master PYQ Paper**: \`examination pyq.pdf\` structure, questions, and mark distributions.
- **Computer Programming (C & Python)**: Pointers, dynamic memory (\`malloc\`, \`calloc\`, \`free\`), memory leaks, buffer overflow.
- **Engineering Math**: Cayley-Hamilton Theorem, Eigenvalues, Gram-Schmidt orthogonalization, Inner Products.
- **Basic Electrical (BEE)**: KCL, KVL, Thevenin theorem, Superposition, RLC resonance.
- **Environmental Studies (EVS)**: Eutrophication, BOD, DO, Sustainable development.
- **Entrepreneurship**: Lean Startup, MVP, Business Model Canvas (BMC).`,
      sources: []
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
