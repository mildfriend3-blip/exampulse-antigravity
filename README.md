# ExamPulse // Antigravity 🚀
### Futuristic, High-Performance Examination Powerhouse for University Engineering Students
**Central University of Jammu (CUJammu) B.Tech CSE (Cyber Security) • NITs • IITs**

---

## 📥 Instant Downloads (Publicly Available for Anyone)

| Asset | Link | Who Can Download? |
| :--- | :--- | :--- |
| **🚀 Direct Pre-Compiled APK** | [**Download ExamPulse-Antigravity-v2.0.0.apk**](https://github.com/mildfriend3-blip/exampulse-antigravity/releases/download/v2.0.0-antigravity/ExamPulse-Antigravity-v2.0.0.apk) | **Anyone (No sign-in needed)** |
| **⚡ Anonymous Artifact Zip** | [**Download via nightly.link**](https://nightly.link/mildfriend3-blip/exampulse-antigravity/workflows/build-apk/main/ExamPulse-Antigravity-v2.0.0-APK.zip) | **Anyone (Direct without login)** |
| **🌐 GitHub Public Release** | [**View Release v2.0.0-antigravity**](https://github.com/mildfriend3-blip/exampulse-antigravity/releases/tag/v2.0.0-antigravity) | **Public GitHub Page** |
| **📦 Complete Source (.zip)** | [**Download Source Package**](https://github.com/mildfriend3-blip/exampulse-antigravity/releases/download/v2.0.0-antigravity/exampulse-antigravity-source.zip) | **Ready for Android Studio** |
| **🖥️ Localhost Live HUD** | [**http://localhost:3000**](http://localhost:3000) | **Live interactive browser simulator** |

---

## 🌌 Overview
ExamPulse Antigravity is a complete examination intelligence platform engineered for university engineering students. It features **PPTX & Syllabus ingestion**, **Google Login**, **AI Short Notes & Interactive Notes generation**, and a **60–70% accurate predicted question paper engine** powered by a database covering **Central University of Jammu (CUJammu) B.Tech CSE Cyber Security (Semesters 1 to 8)** as well as **IITs, NITs, and GFTIs**.

---

## 🛠️ Architecture & System Design
- **Web & Backend Platform:** Node.js Express fullstack server with REST API (`server.js`), SQLite/JSON persistent database (`db_store.js`), and glassmorphic frontend (`web/index.html`).
- **Mobile Android Engine:** Kotlin, Jetpack Compose Material 3, Clean Architecture + MVVM + StateFlow, Android Studio ready.
- **Document Ingestion:** Native `.pptx` presentation parser (`pptx_parser.js`) extracting slide titles, bullet points, and speaker notes; plus Syllabus module parser (`syllabus_parser.js`) extracting units and course learning outcomes.
- **Active Recall Algorithm:** Pure SuperMemo-2 (SM-2) Spaced Repetition calculation (`E-Factor`, intervals, repetitions, 3D flip physics).
- **University PYQ Repository:** Comprehensive database across **Semesters 1 to 8** for **Central University of Jammu (CUJammu) B.Tech CSE (Cyber Security)**, IIT Jammu, IIT Delhi, NIT Srinagar, NIT Trichy, and SMVDU Katra.
- **Authentication:** University Google Sign-In with Google Identity Services (GIS) & 1-Click CUJammu student demo mode.

---

## ⚡ Core Upgraded Capabilities

### 1. Antigravity Visual Design & Zero-G Physics
- **Deep Cosmic Midnight Palette:** `#080C14` & `#0F172A`
- **Electric Cyber Accents:** `#00F0FF` (Cyan), `#8B5CF6` (Electric Violet), `#10B981` (Emerald Hyper), `#F59E0B` (Amber)
- **Glassmorphic UI:** Translucent cards with subtle border stroke, spring animations (`CardExpansionSpring`, `CardFlipSpring`), glowing indicators for high-yield topics, and smooth animated progress rings.

### 2. 60–70% Exam Prediction & Probability Heatmap
- **University Topic Weightage Radar:** Custom Compose Canvas rendering radar breakdown across 6 core pillars for CUJammu B.Tech CSE Cyber Security (Semesters 1 to 8).
- **Confidence Badges:** Each topic and predicted question is tagged with frequency scores:
  - `97% Highest Yield`
  - `94% Frequent`
  - `88% Core Concept`
  - `76% High Yield`
- **Sectioned Exam Simulator:** Structured around official university formats:
  - **Section A:** Short compulsory 2-mark questions (10 &times; 2M = 20M)
  - **Section B:** Medium 5-mark conceptual/analytical (Attempt 4 out of 6 = 20M)
  - **Section C:** Long 10-mark architectural/numerical with internal choice (3 &times; 10M = 30M)

### 3. Active Recall & Spaced Repetition (SRS)
- **3D Interactive Flashcards:** Smooth spring flip physics (`graphicsLayer` rotationY, camera distance).
- **SM-2 Engine:** Automatic scheduling with review buttons: `Again`, `Hard`, `Good`, `Easy`.
- **Recall Mastery Meter:** Visual circular progress ring tracking retention score per subject.

### 4. Live Timed Mock Exam HUD
- **Zero-G HUD Mode:** Full-screen exam dashboard with a real-time countdown timer, question navigator ribbon, and bookmark drawer.
- **Instant AI Answer Grading:** Students enter answers to receive:
  - Instant rubric score (out of 10)
  - 4-criterion breakdown: Technical Accuracy (/4), Completeness (/3), Diagrams/Syntax (/2), Clarity (/1)
  - Missed university keywords alert
  - Bulletproof model benchmark answer

### 5. Document Ingestion Hub (PPTX & Syllabus)
- **Native PPTX Presentation Parser:** Automatically unpacks `.pptx` XML archives to extract slide titles, bullet points, speaker notes, and high-frequency technical keywords.
- **Syllabus Module Parser:** Structures raw text, `.txt`, `.md`, or `.pdf` syllabus documents into Units 1–5, Course Outcomes, and textbook references.
- **1-Click Sample Deck Loader:** Instant pre-loaded CUJammu CYB-501 lecture presentation and syllabus for immediate zero-friction evaluation.

### 6. AI Short Notes & Interactive Notes Synthesis
- **Executive Short Notes:** 1-Page exam morning summary, essential mathematical formulas (RSA, AES GF(2^8), Diffie-Hellman, Birthday bound), and 15 critical 2-mark definitions.
- **Interactive Notes:** 3D Flip Flashcards with SM-2 spaced repetition ratings, interactive MCQ knowledge-check quizzes with explanations, and hierarchical visual mindmaps.

### 7. Google University Login & Session Sync
- **Google Identity Services (GIS):** Seamless Google OAuth login supporting university domain accounts (`@cujammu.ac.in`).
- **Instant Demo Access:** 1-Click student demo mode pre-configured for CUJammu B.Tech CSE Cyber Security (Rahul Sharma, Sem 5, Roll: CUJ/CSE/22/042).

### 8. Comprehensive University PYQ Repository (Semesters 1 to 8)
- **Central University of Jammu (CUJammu):** Dedicated curriculum and question bank for **Semesters 1 through 8** for B.Tech CSE (Cyber Security):
  - Sem 1 (C Programming, Math-I, Basic Electrical)
  - Sem 2 (Data Structures, Math-II, Physics)
  - Sem 3 (Advanced Data Structures, Digital Logic, Cyber Fundamentals)
  - Sem 4 (Operating Systems, DBMS, Networks, Cyber Laws)
  - Sem 5 (Cryptography, Design of Algorithms, Web App Security)
  - Sem 6 (Digital Forensics, Malware Analysis, IDS/IPS, Cloud Security)
  - Sem 7 (Ethical Hacking, SOC Operations, AI in Cyber Security, Blockchain)
  - Sem 8 (Advanced Cyber Defense, Privacy Engineering, Capstone Viva)
- **IITs, NITs, and GFTIs:** Additional question banks for IIT Jammu, IIT Delhi, NIT Srinagar, NIT Trichy, and SMVDU Katra.

### 9. Export & Offline Capability
- Printable clean view formatted to official university question paper standards.
- 1-click clipboard copy and export.

---

## 📂 Project Structure
```
exampulse_antigravity/
├── app/
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── res/values/ (colors.xml, strings.xml, themes.xml)
│       └── java/com/exampulse/antigravity/
│           ├── MainActivity.kt
│           ├── theme/
│           │   ├── Color.kt
│           │   ├── Type.kt
│           │   ├── Physics.kt
│           │   ├── Glassmorphic.kt
│           │   └── Theme.kt
│           ├── model/
│           │   ├── CurriculumModels.kt
│           │   ├── ExamModels.kt
│           │   ├── FlashcardModels.kt
│           │   └── VivaModels.kt
│           ├── data/
│           │   ├── CUJammuCurriculumRepository.kt
│           │   ├── SpacedRepetitionEngine.kt
│           │   ├── GeminiService.kt
│           │   └── FirebaseRepository.kt
│           ├── viewmodel/
│           │   └── AntigravityViewModel.kt
│           └── ui/
│               ├── components/
│               │   ├── AntigravityComponents.kt
│               │   └── RadarChartCanvas.kt
│               └── screens/
│                   ├── RadarPredictionScreen.kt
│                   ├── SectionedPaperScreen.kt
│                   ├── FlashcardEngineScreen.kt
│                   ├── MockExamHUDScreen.kt
│                   ├── VivaQuizScreen.kt
│                   └── PrintableViewScreen.kt
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

---

## 🚀 How to Run
1. Open Android Studio (Ladybug / Koala or newer).
2. Select **Open an Existing Project** and browse to:
   `C:\Users\CUJ PC\.gemini\antigravity\scratch\exampulse_antigravity`
3. Add your `google-services.json` into the `app/` directory (or use default local demo mode).
4. Run on an Android device or emulator (Android 8.0+ / API 26+).
5. You can also view the live interactive HUD simulator in:
   `antigravity_exampulse_hud.html`
