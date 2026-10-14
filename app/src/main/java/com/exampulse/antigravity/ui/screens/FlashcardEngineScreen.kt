package com.exampulse.antigravity.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Autorenew
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.exampulse.antigravity.model.SM2Rating
import com.exampulse.antigravity.theme.*
import com.exampulse.antigravity.ui.components.FloatingBadge
import com.exampulse.antigravity.ui.components.GlassmorphicCard
import com.exampulse.antigravity.ui.components.ProgressRing
import com.exampulse.antigravity.viewmodel.AntigravityViewModel

/**
 * Antigravity Active Recall & Spaced Repetition (SRS) Engine Screen
 * Features 3D Card Flip physics, SM-2 algorithmic review buttons,
 * and Recall Mastery Meter dashboard.
 */
@Composable
fun FlashcardEngineScreen(viewModel: AntigravityViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val flashcards = uiState.flashcards

    if (flashcards.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No active recall flashcards in deck.", color = TextMuted)
        }
        return
    }

    val currentCard = flashcards[uiState.currentCardIndex % flashcards.size]

    // 3D Flip Physics Animation using Spring spec
    val rotationY by animateFloatAsState(
        targetValue = if (uiState.isCardFlipped) 180f else 0f,
        animationSpec = AntigravityPhysics.CardFlipSpring,
        label = "cardFlipRotation"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Recall Mastery Meter Dashboard Card
        GlassmorphicCard(
            borderColor = ElectricViolet.copy(alpha = 0.4f),
            elevation = AntigravityPhysics.ZeroGElevationHover
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Icon(Icons.Default.Psychology, contentDescription = null, tint = ElectricViolet, modifier = Modifier.size(18.dp))
                        Text(
                            text = "RECALL MASTERY METER",
                            color = ElectricViolet,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Text(
                        text = currentCard.subjectName,
                        color = TextHighContrast,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "Card ${uiState.currentCardIndex + 1} of ${flashcards.size} | Repetition interval: ${currentCard.sm2State.intervalDays}d",
                        color = TextMuted,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Smooth Progress Ring for Recall Mastery
                ProgressRing(
                    progress = uiState.masteryPercentage / 100f,
                    modifier = Modifier.size(68.dp),
                    strokeWidth = 6.dp,
                    accentColor = ElectricViolet
                ) {
                    Text(
                        text = "${uiState.masteryPercentage.toInt()}%",
                        color = TextHighContrast,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        // 3D Flip Card Container with Spring Physics
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .graphicsLayer {
                    this.rotationY = rotationY
                    cameraDistance = 16f * density
                }
                .clickable { viewModel.flipCard() },
            contentAlignment = Alignment.Center
        ) {
            if (rotationY <= 90f) {
                // FRONT OF CARD: Question / Prompt
                GlassmorphicCard(
                    modifier = Modifier.fillMaxSize(),
                    borderColor = CyberCyan.copy(alpha = 0.6f),
                    elevation = AntigravityPhysics.ZeroGElevationHover
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            FloatingBadge(
                                text = "UNIT ${currentCard.unitNumber} • ${currentCard.tag.uppercase()}",
                                accentColor = CyberCyan
                            )
                            FloatingBadge(
                                text = "${currentCard.pyqProbability}% PYQ FREQUENCY",
                                accentColor = EmeraldHyper,
                                isPulsing = true
                            )
                        }

                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = currentCard.frontPrompt,
                                color = TextHighContrast,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.SemiBold,
                                textAlign = TextAlign.Center,
                                lineHeight = 26.sp
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "TAP TO FLIP TO ANSWER",
                                color = CyberCyan.copy(alpha = 0.7f),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace,
                                letterSpacing = 1.sp
                            )
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = "SuperMemo SM-2 Active Recall Engine",
                                color = TextMuted,
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            } else {
                // BACK OF CARD: Model Answer & Formula Note (Mirrored rotation)
                GlassmorphicCard(
                    modifier = Modifier
                        .fillMaxSize()
                        .graphicsLayer { this.rotationY = 180f },
                    borderColor = EmeraldHyper.copy(alpha = 0.6f),
                    elevation = AntigravityPhysics.ZeroGElevationHover
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            FloatingBadge(
                                text = "BENCHMARK ANSWER",
                                accentColor = EmeraldHyper
                            )
                            Text(
                                text = "E-Factor: ${String.format("%.2f", currentCard.sm2State.easeFactor)}",
                                color = TextMuted,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = currentCard.backAnswer,
                                color = TextHighContrast,
                                fontSize = 15.sp,
                                lineHeight = 22.sp,
                                fontWeight = FontWeight.Normal
                            )

                            currentCard.keyFormulasOrDiagramNotes?.let { notes ->
                                Surface(
                                    modifier = Modifier.fillMaxWidth(),
                                    color = CosmicSurface.copy(alpha = 0.9f),
                                    shape = RoundedCornerShape(8.dp),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorderSubtle)
                                ) {
                                    Text(
                                        text = "Formula / Exam Note: $notes",
                                        color = CyberCyan,
                                        fontSize = 11.sp,
                                        fontFamily = FontFamily.Monospace,
                                        modifier = Modifier.padding(8.dp)
                                    )
                                }
                            }
                        }

                        Text(
                            text = "Rate your recall quality below to schedule next review interval",
                            color = TextMuted,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }

        // SM-2 Spaced Repetition Buttons: Again, Hard, Good, Easy
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val sm2Buttons = listOf(
                SM2Rating.AGAIN to CyberCrimson,
                SM2Rating.HARD to CyberAmber,
                SM2Rating.GOOD to CyberCyan,
                SM2Rating.EASY to EmeraldHyper
            )

            sm2Buttons.forEach { (rating, color) ->
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { viewModel.reviewFlashcard(rating) },
                    color = color.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.7f))
                ) {
                    Column(
                        modifier = Modifier.padding(vertical = 12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = rating.label.uppercase(),
                            color = color,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }
    }
}
