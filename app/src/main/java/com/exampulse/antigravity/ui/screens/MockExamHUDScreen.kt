package com.exampulse.antigravity.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.exampulse.antigravity.model.ExamQuestion
import com.exampulse.antigravity.theme.*
import com.exampulse.antigravity.ui.components.ConfidenceScoreBadge
import com.exampulse.antigravity.ui.components.FloatingBadge
import com.exampulse.antigravity.ui.components.GlassmorphicCard
import com.exampulse.antigravity.viewmodel.AntigravityViewModel

/**
 * Interactive Mock Exam Mode (Live Timed HUD) Screen
 * Features Zero-G Exam Environment, floating countdown timer, section switcher,
 * bookmarking, and Instant AI Answer Grading with 10-point rubric breakdown.
 */
@Composable
fun MockExamHUDScreen(viewModel: AntigravityViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val allQuestions = remember(uiState.currentPaper) {
        uiState.currentPaper.sectionA + uiState.currentPaper.sectionB + uiState.currentPaper.sectionC
    }

    if (allQuestions.isEmpty()) return

    var currentQuestionIndex by remember { mutableIntStateOf(0) }
    val currentQuestion = allQuestions[currentQuestionIndex.coerceIn(0, allQuestions.lastIndex)]
    val currentAnswerText = uiState.mockAnswers[currentQuestion.id] ?: ""
    val isBookmarked = uiState.bookmarkedQuestionIds.contains(currentQuestion.id)

    // Format remaining time (HH:MM:SS)
    val hours = uiState.mockTimeRemainingSeconds / 3600
    val minutes = (uiState.mockTimeRemainingSeconds % 3600) / 60
    val seconds = uiState.mockTimeRemainingSeconds % 60
    val timeFormatted = String.format("%02d:%02d:%02d", hours, minutes, seconds)
    val isTimeLow = uiState.mockTimeRemainingSeconds < 1800 // less than 30 mins

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Floating Countdown Timer & HUD Controls Bar
        GlassmorphicCard(
            borderColor = if (isTimeLow) CyberCrimson.copy(alpha = 0.7f) else CyberCyan.copy(alpha = 0.5f),
            elevation = AntigravityPhysics.ZeroGElevationHover
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        Icons.Default.Timer,
                        contentDescription = null,
                        tint = if (isTimeLow) CyberCrimson else CyberCyan,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = timeFormatted,
                        color = if (isTimeLow) CyberCrimson else CyberCyan,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.sp
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    IconButton(
                        onClick = { viewModel.toggleQuestionBookmark(currentQuestion.id) }
                    ) {
                        Icon(
                            if (isBookmarked) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                            contentDescription = "Bookmark",
                            tint = if (isBookmarked) CyberAmber else TextMuted
                        )
                    }

                    Button(
                        onClick = { viewModel.toggleMockTimer() },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (uiState.isMockRunning) CyberAmber.copy(alpha = 0.2f) else EmeraldHyper.copy(alpha = 0.2f)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (uiState.isMockRunning) CyberAmber else EmeraldHyper
                        )
                    ) {
                        Text(
                            text = if (uiState.isMockRunning) "PAUSE" else "START HUD",
                            color = if (uiState.isMockRunning) CyberAmber else EmeraldHyper,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        // Section & Question Horizontal Quick Switcher
        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            itemsIndexed(allQuestions) { index, q ->
                val isSelected = index == currentQuestionIndex
                val hasAnswer = !uiState.mockAnswers[q.id].isNullOrBlank()
                val isMarked = uiState.bookmarkedQuestionIds.contains(q.id)

                val borderColor = when {
                    isSelected -> CyberCyan
                    isMarked -> CyberAmber
                    hasAnswer -> EmeraldHyper
                    else -> CyberBorderStroke
                }

                Surface(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .clickable { currentQuestionIndex = index },
                    color = if (isSelected) CyberCyan.copy(alpha = 0.2f) else CosmicSurfaceVariant.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(8.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = q.number,
                            color = if (isSelected) CyberCyan else TextHighContrast,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                        if (isMarked) {
                            Box(modifier = Modifier.size(5.dp).clip(RoundedCornerShape(99.dp)).background(CyberAmber))
                        }
                    }
                }
            }
        }

        // Question Details & Interactive Answer Workspace
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            GlassmorphicCard(
                borderColor = CyberCyan.copy(alpha = 0.4f)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${currentQuestion.number} • ${currentQuestion.section.title.split(":").first()}",
                        color = CyberCyan,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                    ConfidenceScoreBadge(badge = currentQuestion.confidenceBadge)
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = currentQuestion.text,
                    color = TextHighContrast,
                    fontSize = 15.sp,
                    lineHeight = 22.sp,
                    fontWeight = FontWeight.Medium
                )
            }

            // Student Answer Typing Input Area
            OutlinedTextField(
                value = currentAnswerText,
                onValueChange = { viewModel.updateStudentAnswer(currentQuestion.id, it) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp),
                placeholder = {
                    Text(
                        text = "Type or bullet-point your technical answer here. Include step-by-step reasoning, mathematical equations, or protocol flows...",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CyberCyan,
                    unfocusedBorderColor = CyberBorderStroke,
                    focusedTextColor = TextHighContrast,
                    unfocusedTextColor = TextHighContrast,
                    focusedContainerColor = CosmicSurfaceVariant.copy(alpha = 0.5f),
                    unfocusedContainerColor = CosmicSurfaceVariant.copy(alpha = 0.3f)
                ),
                shape = RoundedCornerShape(12.dp)
            )

            // Instant AI Answer Grading Button
            Button(
                onClick = {
                    viewModel.submitAnswerForAIGrading(currentQuestion, currentAnswerText)
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = CyberCyan),
                shape = RoundedCornerShape(10.dp),
                enabled = !uiState.isGradingAnswer
            ) {
                if (uiState.isGradingAnswer) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        color = CosmicDeep,
                        strokeWidth = 2.dp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "EVALUATING VIA GEMINI RUBRIC...",
                        color = CosmicDeep,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                } else {
                    Icon(Icons.Default.Bolt, contentDescription = null, tint = CosmicDeep, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "INSTANT AI ANSWER GRADING",
                        color = CosmicDeep,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // AI Answer Grading Evaluation Report Card
            uiState.latestEvaluation?.let { evaluation ->
                EvaluationResultCard(
                    evaluation = evaluation,
                    onDismiss = { viewModel.dismissEvaluationDialog() }
                )
            }
        }
    }
}

/**
 * Detailed 10-Point Rubric AI Score & Feedback Card
 */
@Composable
fun EvaluationResultCard(
    evaluation: com.exampulse.antigravity.model.StudentAnswerEvaluation,
    onDismiss: () -> Unit
) {
    GlassmorphicCard(
        borderColor = EmeraldHyper.copy(alpha = 0.7f),
        backgroundColor = CosmicSurface.copy(alpha = 0.95f),
        elevation = AntigravityPhysics.ZeroGElevationHover
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "GEMINI AI RUBRIC EVALUATION",
                    color = EmeraldHyper,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
                Text(
                    text = "Score: ${evaluation.rubricScore} / 10.0",
                    color = TextHighContrast,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            IconButton(onClick = onDismiss) {
                Icon(Icons.Default.Close, contentDescription = "Close", tint = TextMuted)
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Rubric Breakdown Metrics (Technical Accuracy /4, Completeness /3, Diagrams /2, Presentation /1)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            RubricMetricPill("Tech Accuracy", "${evaluation.technicalAccuracyScore}/4", CyberCyan)
            RubricMetricPill("Completeness", "${evaluation.conceptualCompletenessScore}/3", ElectricViolet)
            RubricMetricPill("Diagram/Syntax", "${evaluation.diagramSyntaxScore}/2", EmeraldHyper)
            RubricMetricPill("Clarity", "${evaluation.presentationClarityScore}/1", CyberAmber)
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Missed Keywords
        if (evaluation.missedKeywords.isNotEmpty()) {
            Text(
                text = "MISSED UNIVERSITY KEYWORDS:",
                color = CyberCrimson,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
            Text(
                text = evaluation.missedKeywords.joinToString(" • "),
                color = TextHighContrast,
                fontSize = 12.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        // Examiner Verdict
        Text(
            text = "EXAMINER VERDICT: ${evaluation.examinerVerdict}",
            color = CyberCyan,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Bulletproof Model Answer
        Text(
            text = "BENCHMARK MODEL ANSWER:",
            color = EmeraldHyper,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )
        Text(
            text = evaluation.modelAnswer,
            color = TextMuted,
            fontSize = 12.sp,
            lineHeight = 18.sp
        )
    }
}

@Composable
fun RubricMetricPill(label: String, value: String, color: Color) {
    Surface(
        color = color.copy(alpha = 0.1f),
        shape = RoundedCornerShape(6.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(label, color = TextMuted, fontSize = 9.sp, fontFamily = FontFamily.Monospace)
            Text(value, color = color, fontSize = 11.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
        }
    }
}
