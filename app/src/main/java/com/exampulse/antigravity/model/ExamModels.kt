package com.exampulse.antigravity.model

enum class ExamSectionType(
    val title: String,
    val marksPerQuestion: Int,
    val description: String,
    val isCompulsory: Boolean
) {
    SECTION_A(
        title = "Section A: Direct Recall & Definitions",
        marksPerQuestion = 2,
        description = "Short answer compulsory questions (10 questions x 2 marks = 20 marks)",
        isCompulsory = true
    ),
    SECTION_B(
        title = "Section B: Conceptual & Analytical",
        marksPerQuestion = 5,
        description = "Medium analytical questions (Attempt any 4 out of 6 x 5 marks = 20 marks)",
        isCompulsory = false
    ),
    SECTION_C(
        title = "Section C: Architectural, Numerical & System Design",
        marksPerQuestion = 10,
        description = "Long architectural/numerical questions with internal choice (3 questions x 10 marks = 30 marks)",
        isCompulsory = false
    )
}

data class ExamQuestion(
    val id: String,
    val number: String,
    val text: String,
    val section: ExamSectionType,
    val marks: Int,
    val unitOrigin: Int,
    val hasInternalChoice: Boolean = false,
    val alternativeQuestion: String? = null,
    val confidenceBadge: ConfidenceBadge,
    val pyqYears: List<Int>,
    val keyConcepts: List<String>,
    val modelAnswer: String
)

data class GeneratedExamPaper(
    val id: String,
    val university: String,
    val degree: String,
    val semesterText: String,
    val subjectCode: String,
    val subjectTitle: String,
    val durationMinutes: Int = 180,
    val maximumMarks: Int = 70, // Standard CUJammu BTech theory marks
    val sectionA: List<ExamQuestion>,
    val sectionB: List<ExamQuestion>,
    val sectionC: List<ExamQuestion>,
    val timestamp: Long = System.currentTimeMillis()
)

data class StudentAnswerEvaluation(
    val questionId: String,
    val studentText: String,
    val rubricScore: Float, // 0.0 to 10.0
    val maxMarks: Int,
    val technicalAccuracyScore: Float, // /4
    val conceptualCompletenessScore: Float, // /3
    val diagramSyntaxScore: Float, // /2
    val presentationClarityScore: Float, // /1
    val missedKeywords: List<String>,
    val strengths: List<String>,
    val weaknesses: List<String>,
    val modelAnswer: String,
    val examinerVerdict: String
)
