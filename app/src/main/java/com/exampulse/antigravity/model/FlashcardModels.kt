package com.exampulse.antigravity.model

enum class SM2Rating(val quality: Int, val label: String) {
    AGAIN(1, "Again"),
    HARD(2, "Hard"),
    GOOD(3, "Good"),
    EASY(4, "Easy")
}

data class SM2State(
    val repetitions: Int = 0,
    val intervalDays: Int = 1,
    val easeFactor: Float = 2.5f,
    val lastReviewedTimestamp: Long = 0L,
    val nextReviewTimestamp: Long = System.currentTimeMillis()
)

data class Flashcard(
    val id: String,
    val subjectId: String,
    val subjectName: String,
    val unitNumber: Int,
    val frontPrompt: String,
    val backAnswer: String,
    val pyqProbability: Int, // e.g. 88%
    val tag: String,
    val keyFormulasOrDiagramNotes: String? = null,
    val sm2State: SM2State = SM2State()
)

data class SubjectMasteryMeter(
    val subjectId: String,
    val subjectName: String,
    val totalFlashcards: Int,
    val cardsMastered: Int,
    val cardsLearning: Int,
    val cardsToReviewToday: Int,
    val masteryPercentage: Float // 0.0f to 100.0f
)
