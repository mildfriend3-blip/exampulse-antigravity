package com.exampulse.antigravity.model

data class VivaQuestionItem(
    val id: String,
    val subjectName: String,
    val labOrCourseName: String,
    val unitNumber: Int,
    val question: String,
    val expectedQuickPunchline: String,
    val examinerFollowUpTrap: String,
    val practicalDemoContext: String,
    val difficulty: VivaDifficulty
)

enum class VivaDifficulty(val label: String) {
    ESSENTIAL_PASS("Pass Benchmark"),
    A_GRADE_HONORS("Distinction Level"),
    PROFESSOR_CHALLENGE("Lab Mastery")
}
