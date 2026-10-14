package com.exampulse.antigravity.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.exampulse.antigravity.data.CUJammuCurriculumRepository
import com.exampulse.antigravity.data.FirebaseRepository
import com.exampulse.antigravity.data.GeminiService
import com.exampulse.antigravity.data.SpacedRepetitionEngine
import com.exampulse.antigravity.model.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AntigravityUiState(
    // University & Curriculum Selection
    val selectedUniversity: University = CUJammuCurriculumRepository.SupportedUniversities.first(),
    val selectedSemester: Int = 5,
    val selectedSubject: Subject = CUJammuCurriculumRepository.CUJammuCyberSecurityCurriculum[5]!!.first(),
    val availableSubjects: List<Subject> = CUJammuCurriculumRepository.CUJammuCyberSecurityCurriculum[5] ?: emptyList(),
    val radarAxes: List<RadarAxisData> = CUJammuCurriculumRepository.getRadarAxesForSubject("CS501"),

    // Sectioned Paper Simulator
    val currentPaper: GeneratedExamPaper = CUJammuCurriculumRepository.getPreloadedPredictedPaper("CS501"),
    val activeSectionFilter: ExamSectionType = ExamSectionType.SECTION_A,

    // Active Recall & Spaced Repetition (SRS)
    val flashcards: List<Flashcard> = CUJammuCurriculumRepository.getStarterFlashcards("CS501"),
    val currentCardIndex: Int = 0,
    val isCardFlipped: Boolean = false,
    val masteryPercentage: Float = 68.5f,

    // Live Timed Mock Exam HUD
    val mockTimeRemainingSeconds: Int = 180 * 60, // 3 hours
    val isMockRunning: Boolean = false,
    val activeMockQuestionIndex: Int = 0,
    val mockAnswers: Map<String, String> = emptyMap(),
    val bookmarkedQuestionIds: Set<String> = emptySet(),
    val isGradingAnswer: Boolean = false,
    val latestEvaluation: StudentAnswerEvaluation? = null,

    // Viva Prep Mode
    val vivaQuestions: List<VivaQuestionItem> = CUJammuCurriculumRepository.getStarterVivaQuestions(),
    val currentVivaIndex: Int = 0,
    val isVivaAnswerRevealed: Boolean = false,
    val isVivaTrapRevealed: Boolean = false,

    // HUD Tab
    val currentTab: AntigravityTab = AntigravityTab.PREDICTION_RADAR,
    val statusMessage: String? = null
)

enum class AntigravityTab(val title: String) {
    PREDICTION_RADAR("Radar & PYQs"),
    EXAM_SIMULATOR("Exam Paper"),
    FLASHCARDS_SRS("Active Recall"),
    LIVE_MOCK_HUD("Mock Exam HUD"),
    VIVA_PREP("Viva Lab"),
    PRINT_EXPORT("Export")
}

class AntigravityViewModel(
    private val geminiService: GeminiService = GeminiService("DEMO-KEY"),
    private val firebaseRepository: FirebaseRepository = FirebaseRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(AntigravityUiState())
    val uiState: StateFlow<AntigravityUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null

    init {
        updateMasteryMeter()
    }

    fun selectTab(tab: AntigravityTab) {
        _uiState.update { it.copy(currentTab = tab) }
    }

    fun selectSemester(semester: Int) {
        val subjects = CUJammuCurriculumRepository.CUJammuCyberSecurityCurriculum[semester] ?: emptyList()
        val defaultSubject = subjects.firstOrNull() ?: _uiState.value.selectedSubject
        _uiState.update {
            it.copy(
                selectedSemester = semester,
                availableSubjects = subjects,
                selectedSubject = defaultSubject,
                radarAxes = CUJammuCurriculumRepository.getRadarAxesForSubject(defaultSubject.id),
                currentPaper = CUJammuCurriculumRepository.getPreloadedPredictedPaper(defaultSubject.id)
            )
        }
    }

    fun selectSubject(subject: Subject) {
        _uiState.update {
            it.copy(
                selectedSubject = subject,
                radarAxes = CUJammuCurriculumRepository.getRadarAxesForSubject(subject.id),
                currentPaper = CUJammuCurriculumRepository.getPreloadedPredictedPaper(subject.id)
            )
        }
    }

    fun selectUniversity(university: University) {
        _uiState.update { it.copy(selectedUniversity = university) }
    }

    // Flashcard SRS Actions
    fun flipCard() {
        _uiState.update { it.copy(isCardFlipped = !it.isCardFlipped) }
    }

    fun reviewFlashcard(rating: SM2Rating) {
        val currentDeck = _uiState.value.flashcards.toMutableList()
        val currentIndex = _uiState.value.currentCardIndex
        if (currentIndex in currentDeck.indices) {
            val card = currentDeck[currentIndex]
            val updatedState = SpacedRepetitionEngine.review(card.sm2State, rating)
            val updatedCard = card.copy(sm2State = updatedState)
            currentDeck[currentIndex] = updatedCard

            // Sync to Firebase in background
            viewModelScope.launch {
                firebaseRepository.syncFlashcardProgress("guest_user", updatedCard.id, updatedState)
            }

            val nextIndex = (currentIndex + 1) % currentDeck.size
            _uiState.update {
                it.copy(
                    flashcards = currentDeck,
                    currentCardIndex = nextIndex,
                    isCardFlipped = false,
                    masteryPercentage = SpacedRepetitionEngine.computeMastery(currentDeck)
                )
            }
        }
    }

    private fun updateMasteryMeter() {
        val mastery = SpacedRepetitionEngine.computeMastery(_uiState.value.flashcards)
        _uiState.update { it.copy(masteryPercentage = mastery) }
    }

    // Live Mock Exam HUD Actions
    fun toggleMockTimer() {
        if (_uiState.value.isMockRunning) {
            timerJob?.cancel()
            _uiState.update { it.copy(isMockRunning = false) }
        } else {
            _uiState.update { it.copy(isMockRunning = true) }
            timerJob = viewModelScope.launch {
                while (_uiState.value.mockTimeRemainingSeconds > 0 && _uiState.value.isMockRunning) {
                    delay(1000)
                    _uiState.update { it.copy(mockTimeRemainingSeconds = it.mockTimeRemainingSeconds - 1) }
                }
            }
        }
    }

    fun updateStudentAnswer(questionId: String, text: String) {
        val updatedMap = _uiState.value.mockAnswers.toMutableMap()
        updatedMap[questionId] = text
        _uiState.update { it.copy(mockAnswers = updatedMap) }
    }

    fun toggleQuestionBookmark(questionId: String) {
        val bookmarks = _uiState.value.bookmarkedQuestionIds.toMutableSet()
        if (bookmarks.contains(questionId)) {
            bookmarks.remove(questionId)
        } else {
            bookmarks.add(questionId)
        }
        _uiState.update { it.copy(bookmarkedQuestionIds = bookmarks) }
    }

    fun submitAnswerForAIGrading(question: ExamQuestion, studentText: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isGradingAnswer = true) }
            val evaluation = geminiService.evaluateAnswer(question, studentText)
            _uiState.update {
                it.copy(
                    isGradingAnswer = false,
                    latestEvaluation = evaluation
                )
            }
        }
    }

    fun dismissEvaluationDialog() {
        _uiState.update { it.copy(latestEvaluation = null) }
    }

    // Viva Prep Actions
    fun nextVivaQuestion() {
        val nextIdx = (_uiState.value.currentVivaIndex + 1) % _uiState.value.vivaQuestions.size
        _uiState.update {
            it.copy(
                currentVivaIndex = nextIdx,
                isVivaAnswerRevealed = false,
                isVivaTrapRevealed = false
            )
        }
    }

    fun toggleVivaReveal() {
        _uiState.update { it.copy(isVivaAnswerRevealed = !it.isVivaAnswerRevealed) }
    }

    fun toggleVivaTrapReveal() {
        _uiState.update { it.copy(isVivaTrapRevealed = !it.isVivaTrapRevealed) }
    }
}
