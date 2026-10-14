package com.exampulse.antigravity.data

import com.exampulse.antigravity.model.Flashcard
import com.exampulse.antigravity.model.SM2Rating
import com.exampulse.antigravity.model.SM2State
import kotlin.math.max
import kotlin.math.roundToInt

/**
 * Pure SuperMemo-2 (SM-2) Spaced Repetition Algorithm Engine.
 * Computes next review intervals, repetition counts, and Easiness Factor (E-Factor).
 */
object SpacedRepetitionEngine {

    private const val MIN_EASE_FACTOR = 1.3f
    private const val ONE_DAY_MILLIS = 24 * 60 * 60 * 1000L

    /**
     * Calculates the updated SM2State based on the user's review rating:
     * AGAIN (1): Failed recall - reset streak to 0, review again tomorrow.
     * HARD (2): Significant struggle - interval increases slightly, E-Factor decreases.
     * GOOD (3): Standard correct recall - normal exponential interval progression.
     * EASY (4): Perfect instant recall - bonus interval, E-Factor increases.
     */
    fun review(currentState: SM2State, rating: SM2Rating): SM2State {
        val q = when (rating) {
            SM2Rating.AGAIN -> 1
            SM2Rating.HARD -> 2
            SM2Rating.GOOD -> 4
            SM2Rating.EASY -> 5
        }

        val newRepetitions: Int
        val newIntervalDays: Int

        if (q < 3) {
            // Failed recall: reset repetitions count
            newRepetitions = 0
            newIntervalDays = 1
        } else {
            // Successful recall
            when (currentState.repetitions) {
                0 -> {
                    newRepetitions = 1
                    newIntervalDays = 1
                }
                1 -> {
                    newRepetitions = 2
                    newIntervalDays = if (rating == SM2Rating.HARD) 3 else 6
                }
                else -> {
                    newRepetitions = currentState.repetitions + 1
                    val multiplier = when (rating) {
                        SM2Rating.HARD -> 1.2f
                        SM2Rating.GOOD -> currentState.easeFactor
                        SM2Rating.EASY -> currentState.easeFactor * 1.3f
                        SM2Rating.AGAIN -> 1.0f
                    }
                    newIntervalDays = max(1, (currentState.intervalDays * multiplier).roundToInt())
                }
            }
        }

        // Updated E-Factor formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        val delta = 0.1f - (5 - q) * (0.08f + (5 - q) * 0.02f)
        val newEaseFactor = max(MIN_EASE_FACTOR, currentState.easeFactor + delta)

        val currentTime = System.currentTimeMillis()
        val nextReviewTime = currentTime + (newIntervalDays * ONE_DAY_MILLIS)

        return SM2State(
            repetitions = newRepetitions,
            intervalDays = newIntervalDays,
            easeFactor = newEaseFactor,
            lastReviewedTimestamp = currentTime,
            nextReviewTimestamp = nextReviewTime
        )
    }

    /**
     * Determines whether a flashcard is currently due for review.
     */
    fun isDue(card: Flashcard, currentTime: Long = System.currentTimeMillis()): Boolean {
        return card.sm2State.nextReviewTimestamp <= currentTime
    }

    /**
     * Computes subject mastery score (0-100%) based on repetitions and ease factor.
     */
    fun computeMastery(cards: List<Flashcard>): Float {
        if (cards.isEmpty()) return 0f
        val masteredScore = cards.map { card ->
            val reps = card.sm2State.repetitions
            when {
                reps >= 4 -> 1.0f
                reps == 3 -> 0.75f
                reps == 2 -> 0.50f
                reps == 1 -> 0.25f
                else -> 0.0f
            }
        }.sum()

        return (masteredScore / cards.size) * 100f
    }
}
