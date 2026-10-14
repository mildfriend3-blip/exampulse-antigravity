// db_store.js
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'database.json');

const defaultDb = {
  users: [
    {
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
      notesCount: 6,
      createdAt: new Date().toISOString()
    }
  ],
  uploads: [],
  generatedPapers: [],
  savedNotes: []
};

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
  }
}

function readDb() {
  initDb();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading database file:', e);
    return defaultDb;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error writing database file:', e);
    return false;
  }
}

// User methods
function findOrCreateUser(googleProfile) {
  const db = readDb();
  let user = db.users.find(u => u.email === googleProfile.email);
  if (!user) {
    user = {
      id: "usr_" + Date.now(),
      email: googleProfile.email,
      name: googleProfile.name || googleProfile.email.split('@')[0],
      picture: googleProfile.picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
      university: googleProfile.university || "Central University of Jammu",
      department: googleProfile.department || "Computer Science & Engineering",
      semester: googleProfile.semester || 5,
      rollNo: googleProfile.rollNo || "CUJ/CSE/22/088",
      role: "Student",
      savedPapersCount: 0,
      notesCount: 0,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDb(db);
  }
  return user;
}

// Document Upload methods
function saveUpload(record) {
  const db = readDb();
  record.id = "doc_" + Date.now();
  record.uploadedAt = new Date().toISOString();
  db.uploads.unshift(record);
  writeDb(db);
  return record;
}

function getUploads(userId) {
  const db = readDb();
  return db.uploads.filter(u => !userId || u.userId === userId);
}

// Paper methods
function saveGeneratedPaper(paper) {
  const db = readDb();
  paper.id = "paper_" + Date.now();
  paper.savedAt = new Date().toISOString();
  db.generatedPapers.unshift(paper);
  writeDb(db);
  return paper;
}

function getGeneratedPapers(userId) {
  const db = readDb();
  return db.generatedPapers.filter(p => !userId || p.userId === userId);
}

// Notes methods
function saveGeneratedNotes(notes) {
  const db = readDb();
  notes.id = "notes_" + Date.now();
  notes.savedAt = new Date().toISOString();
  db.savedNotes.unshift(notes);
  writeDb(db);
  return notes;
}

function getGeneratedNotes(userId) {
  const db = readDb();
  return db.savedNotes.filter(n => !userId || n.userId === userId);
}

initDb();

module.exports = {
  findOrCreateUser,
  saveUpload,
  getUploads,
  saveGeneratedPaper,
  getGeneratedPapers,
  saveGeneratedNotes,
  getGeneratedNotes
};
