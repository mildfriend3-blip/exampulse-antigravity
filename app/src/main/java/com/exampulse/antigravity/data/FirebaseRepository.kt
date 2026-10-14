package com.exampulse.antigravity.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FirebaseFirestoreSettings
import com.google.firebase.firestore.PersistentCacheSettings
import com.exampulse.antigravity.model.Flashcard
import com.exampulse.antigravity.model.SM2State
import com.exampulse.antigravity.model.StudentAnswerEvaluation
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

/**
 * Firebase Repository
 * Handles Firebase Authentication and Firestore real-time cloud synchronization
 * with full offline persistence for university campus zero-connectivity conditions.
 */
class FirebaseRepository {

    private val auth: FirebaseAuth? by lazy {
        try {
            FirebaseAuth.getInstance()
        } catch (e: Exception) {
            null
        }
    }

    private val firestore: FirebaseFirestore? by lazy {
        try {
            val db = FirebaseFirestore.getInstance()
            val settings = FirebaseFirestoreSettings.Builder()
                .setLocalCacheSettings(PersistentCacheSettings.newBuilder().build())
                .build()
            db.firestoreSettings = settings
            db
        } catch (e: Exception) {
            null
        }
    }

    val currentUser: FirebaseUser?
        get() = auth?.currentUser

    /**
     * Signs in anonymously for seamless student guest onboarding
     */
    suspend fun signInGuest(): Result<FirebaseUser?> = withContext(Dispatchers.IO) {
        try {
            val authInstance = auth ?: return@withContext Result.success(null)
            val result = authInstance.signInAnonymously().await()
            Result.success(result.user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Syncs updated flashcard SM-2 review progress to Cloud Firestore
     */
    suspend fun syncFlashcardProgress(
        userId: String,
        flashcardId: String,
        sm2State: SM2State
    ): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val db = firestore ?: return@withContext Result.success(Unit)
            val data = mapOf(
                "flashcardId" to flashcardId,
                "repetitions" to sm2State.repetitions,
                "intervalDays" to sm2State.intervalDays,
                "easeFactor" to sm2State.easeFactor,
                "lastReviewed" to sm2State.lastReviewedTimestamp,
                "nextReview" to sm2State.nextReviewTimestamp
            )
            db.collection("users")
                .document(userId)
                .collection("flashcard_progress")
                .document(flashcardId)
                .set(data)
                .await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Records mock exam completion and rubric grades to user profile
     */
    suspend fun recordMockExamEvaluation(
        userId: String,
        paperId: String,
        evaluations: List<StudentAnswerEvaluation>
    ): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            val db = firestore ?: return@withContext Result.success(Unit)
            val attemptData = mapOf(
                "paperId" to paperId,
                "timestamp" to System.currentTimeMillis(),
                "overallScore" to evaluations.map { it.rubricScore }.average(),
                "questionCount" to evaluations.size,
                "details" to evaluations.map { eval ->
                    mapOf(
                        "questionId" to eval.questionId,
                        "score" to eval.rubricScore,
                        "missedKeywords" to eval.missedKeywords,
                        "verdict" to eval.examinerVerdict
                    )
                }
            )
            db.collection("users")
                .document(userId)
                .collection("mock_attempts")
                .add(attemptData)
                .await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
