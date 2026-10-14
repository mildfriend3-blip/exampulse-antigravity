package com.exampulse.antigravity.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.RecordVoiceOver
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.exampulse.antigravity.theme.*
import com.exampulse.antigravity.ui.components.FloatingBadge
import com.exampulse.antigravity.ui.components.GlassmorphicCard
import com.exampulse.antigravity.viewmodel.AntigravityViewModel

/**
 * Smart Viva & Rapid-Fire Quiz Mode Screen
 * Designed for university laboratory viva and end-semester oral examinations.
 */
@Composable
fun VivaQuizScreen(viewModel: AntigravityViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val vivaList = uiState.vivaQuestions

    if (vivaList.isEmpty()) return

    val currentViva = vivaList[uiState.currentVivaIndex % vivaList.size]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Viva Mode Header
        GlassmorphicCard(
            borderColor = CyberAmber.copy(alpha = 0.5f)
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
                    Icon(Icons.Default.RecordVoiceOver, contentDescription = null, tint = CyberAmber, modifier = Modifier.size(18.dp))
                    Text(
                        text = "RAPID-FIRE VIVA HUD",
                        color = CyberAmber,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
                FloatingBadge(
                    text = currentViva.difficulty.label.uppercase(),
                    accentColor = CyberAmber
                )
            }
            Text(
                text = "${currentViva.subjectName} (${currentViva.labOrCourseName})",
                color = TextHighContrast,
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold
            )
            Text(
                text = "Question ${uiState.currentVivaIndex + 1} of ${vivaList.size} • Unit ${currentViva.unitNumber}",
                color = TextMuted,
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace
            )
        }

        // Viva Examiner Question Card
        GlassmorphicCard(
            modifier = Modifier.weight(1f),
            borderColor = CyberCyan.copy(alpha = 0.5f),
            elevation = AntigravityPhysics.ZeroGElevationHover
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        text = "EXAMINER PROMPT:",
                        color = CyberCyan,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = currentViva.question,
                        color = TextHighContrast,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.SemiBold,
                        lineHeight = 24.sp
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // 1-Tap Reveal Instant Answer
                    Button(
                        onClick = { viewModel.toggleVivaReveal() },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (uiState.isVivaAnswerRevealed) EmeraldHyper.copy(alpha = 0.2f) else CyberCyan.copy(alpha = 0.15f)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (uiState.isVivaAnswerRevealed) EmeraldHyper else CyberCyan
                        )
                    ) {
                        Text(
                            text = if (uiState.isVivaAnswerRevealed) "HIDE EXPECTED ANSWER" else "ONE-TAP REVEAL PUNCHLINE",
                            color = if (uiState.isVivaAnswerRevealed) EmeraldHyper else CyberCyan,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    AnimatedVisibility(visible = uiState.isVivaAnswerRevealed) {
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            color = EmeraldHyper.copy(alpha = 0.08f),
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldHyper.copy(alpha = 0.3f))
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text(
                                    text = "EXPECTED CANDIDATE PUNCHLINE:",
                                    color = EmeraldHyper,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                                Text(
                                    text = currentViva.expectedQuickPunchline,
                                    color = TextHighContrast,
                                    fontSize = 13.sp,
                                    lineHeight = 19.sp
                                )
                            }
                        }
                    }

                    // Examiner Trap Warning
                    Button(
                        onClick = { viewModel.toggleVivaTrapReveal() },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (uiState.isVivaTrapRevealed) CyberCrimson.copy(alpha = 0.2f) else CyberBorderStroke.copy(alpha = 0.3f)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (uiState.isVivaTrapRevealed) CyberCrimson else CyberBorderStroke
                        )
                    ) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = if (uiState.isVivaTrapRevealed) CyberCrimson else TextMuted, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (uiState.isVivaTrapRevealed) "HIDE EXAMINER TRAP" else "REVEAL EXAMINER FOLLOW-UP TRAP",
                            color = if (uiState.isVivaTrapRevealed) CyberCrimson else TextMuted,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    AnimatedVisibility(visible = uiState.isVivaTrapRevealed) {
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            color = CyberCrimson.copy(alpha = 0.08f),
                            shape = RoundedCornerShape(8.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, CyberCrimson.copy(alpha = 0.3f))
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Text(
                                    text = "CRITICAL VIVA COUNTER-QUESTION:",
                                    color = CyberCrimson,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                                Text(
                                    text = currentViva.examinerFollowUpTrap,
                                    color = TextHighContrast,
                                    fontSize = 13.sp,
                                    lineHeight = 19.sp
                                )
                            }
                        }
                    }
                }

                // Next Viva Question Button
                Button(
                    onClick = { viewModel.nextVivaQuestion() },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = CyberCyan),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("NEXT RAPID-FIRE QUESTION", color = CosmicDeep, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(Icons.Default.ArrowForward, contentDescription = null, tint = CosmicDeep, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}
