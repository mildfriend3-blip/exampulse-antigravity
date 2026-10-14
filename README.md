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
ExamPulse Antigravity transforms exam preparation into an interactive zero-gravity command center. Engineered with **Kotlin**, **Jetpack Compose (Material 3 Glassmorphism)**, **Firebase Auth & Firestore backend**, and **Google Gemini Generative AI**, it equips engineering students with predictive examination intelligence and active recall systems.

---

## 🛠️ Architecture & System Design
- **Architecture:** Clean Architecture + MVVM + StateFlow + Kotlin Coroutines
- **UI Toolkit:** Jetpack Compose (BOM 2024.08), Material 3, Custom Glassmorphic Modifiers, Canvas Radar Chart
- **Cloud Backend:** Firebase Authentication (Anonymous & Email auth) + Cloud Firestore with offline cache persistence
- **Intelligence Engine:** Google Gemini Generative AI SDK (`gemini-1.5-flash`) for instant rubric grading & question synthesis
- **Active Recall Algorithm:** Pure SuperMemo-2 (SM-2) Spaced Repetition calculation (`E-Factor`, intervals, repetitions)

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

### 5. Smart Viva & Rapid-Fire Quiz Mode
- Designed for university laboratory viva and end-semester oral examinations.
- One-tap punchline reveal & critical examiner follow-up traps.

### 6. Export & Offline Capability
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
