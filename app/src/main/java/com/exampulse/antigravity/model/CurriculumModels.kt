package com.exampulse.antigravity.model

data class University(
    val id: String,
    val name: String,
    val shortName: String,
    val department: String,
    val specializations: List<String>
)

data class Subject(
    val id: String,
    val code: String,
    val name: String,
    val semester: Int,
    val credits: Int,
    val units: List<CurriculumUnit>,
    val pyqAnalyzedYears: Int = 8
)

data class CurriculumUnit(
    val unitNumber: Int,
    val title: String,
    val weightagePercent: Int,
    val topics: List<TopicWeightage>
)

data class TopicWeightage(
    val topicId: String,
    val name: String,
    val pyqFrequencyRate: Float, // e.g. 0.92 for 92%
    val confidenceBadge: ConfidenceBadge,
    val pastYearsAppeared: List<Int>,
    val averageMarksAsked: Int,
    val radarAxis: RadarCategory
)

enum class RadarCategory(val label: String) {
    THEORETICAL_CONCEPTS("Theory & Concepts"),
    ARCHITECTURAL_DESIGN("Architecture & Protocols"),
    CRYPTOGRAPHIC_NUMERICALS("Math & Cryptanalysis"),
    ATTACK_DEFENSE_LAB("Attack & Defense Labs"),
    FORENSICS_INVESTIGATION("Forensics & Analysis"),
    STANDARDS_COMPLIANCE("Laws & Compliance")
}

data class ConfidenceBadge(
    val text: String,
    val percentage: Int,
    val badgeType: BadgeType
)

enum class BadgeType {
    HIGH_FREQUENT,      // e.g., 90%+
    CORE_CONCEPT,       // e.g., 70-89%
    HIGH_YIELD_CRITICAL,// e.g., 60-69%
    CONCEPTUAL_VIVA     // Lab / Viva priority
}

data class RadarAxisData(
    val category: RadarCategory,
    val score: Float, // 0.0f to 1.0f
    val weightagePercent: Int,
    val highYieldTopicCount: Int
)
