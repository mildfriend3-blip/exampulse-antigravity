package com.exampulse.antigravity.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.Analytics
import androidx.compose.material.icons.filled.School
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
import com.exampulse.antigravity.data.CUJammuCurriculumRepository
import com.exampulse.antigravity.model.BadgeType
import com.exampulse.antigravity.model.ConfidenceBadge
import com.exampulse.antigravity.theme.*
import com.exampulse.antigravity.ui.components.*
import com.exampulse.antigravity.viewmodel.AntigravityViewModel

/**
 * 60-70% Exam Prediction & Probability Heatmap Screen
 * Provides University Topic Weightage Radar and past 5-10 years PYQ frequency analysis.
 */
@Composable
fun RadarPredictionScreen(viewModel: AntigravityViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        // University & Department Header
        item {
            GlassmorphicCard(
                borderColor = CyberCyan.copy(alpha = 0.4f),
                elevation = AntigravityPhysics.ZeroGElevationHover
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Default.School, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(18.dp))
                            Text(
                                text = uiState.selectedUniversity.shortName,
                                color = CyberCyan,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Text(
                            text = "B.Tech CSE (Cyber Security) - 10-Yr PYQ Prediction Engine",
                            color = TextHighContrast,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    FloatingBadge(
                        text = "RADAR ACTIVE",
                        accentColor = EmeraldHyper,
                        isPulsing = true
                    )
                }
            }
        }

        // Semester 1 to 8 Pill Bar
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "SELECT SEMESTER (1 - 8)",
                    color = TextMuted,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    (1..8).forEach { sem ->
                        val isSelected = uiState.selectedSemester == sem
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .clickable { viewModel.selectSemester(sem) },
                            color = if (isSelected) CyberCyan.copy(alpha = 0.2f) else CosmicSurfaceVariant.copy(alpha = 0.5f),
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isSelected) CyberCyan else CyberBorderStroke
                            )
                        ) {
                            Text(
                                text = "SEM $sem",
                                color = if (isSelected) CyberCyan else TextMuted,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                fontFamily = FontFamily.Monospace,
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
                            )
                        }
                    }
                }
            }
        }

        // Subject Selector
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "ACTIVE SUBJECT CURRICULUM",
                    color = TextMuted,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    uiState.availableSubjects.forEach { subject ->
                        val isSelected = uiState.selectedSubject.id == subject.id
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .clickable { viewModel.selectSubject(subject) },
                            color = if (isSelected) ElectricViolet.copy(alpha = 0.25f) else CosmicSurfaceVariant.copy(alpha = 0.6f),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isSelected) ElectricViolet else CyberBorderStroke
                            )
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(
                                    text = subject.code,
                                    color = if (isSelected) ElectricViolet else TextMuted,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                                Text(
                                    text = subject.name,
                                    color = TextHighContrast,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }
                }
            }
        }

        // University Topic Weightage Radar Canvas
        item {
            GlassmorphicCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(Icons.Default.Analytics, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(16.dp))
                        Text(
                            text = "TOPIC WEIGHTAGE RADAR",
                            color = TextHighContrast,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Text(
                        text = "${uiState.selectedSubject.pyqAnalyzedYears}-Year PYQs",
                        color = EmeraldHyper,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                UniversityTopicWeightageRadar(
                    axes = uiState.radarAxes,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        // 60-70% Exam Prediction & Probability Heatmap
        item {
            Text(
                text = "PREDICTED HIGH-YIELD TOPICS (PROBABILITY HEATMAP)",
                color = TextMuted,
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold
            )
        }

        // High Probability Topics List with Confidence Badges
        val samplePredictions = listOf(
            Triple("Extended Euclidean Algorithm & RSA Key Synthesis", 97, BadgeType.HIGH_FREQUENT),
            Triple("AES Round Operations: SubBytes, ShiftRows, MixColumns", 96, BadgeType.HIGH_FREQUENT),
            Triple("Diffie-Hellman Key Exchange & MITM Attack Vulnerability", 92, BadgeType.HIGH_FREQUENT),
            Triple("RFC 3227 Volatility Order in Digital Forensic Imaging", 92, BadgeType.HIGH_FREQUENT),
            Triple("TLS 1.3 1-RTT Handshake vs TLS 1.2 Forward Secrecy", 85, BadgeType.CORE_CONCEPT),
            Triple("Birthday Paradox & Collision Search in SHA-2 / SHA-3", 88, BadgeType.CORE_CONCEPT),
            Triple("Zero-Trust Architecture (ZTNA) Perimeter Enforcement", 76, BadgeType.HIGH_YIELD_CRITICAL)
        )

        items(samplePredictions) { (topic, probability, badgeType) ->
            GlassmorphicCard(
                borderColor = if (probability >= 90) CyberCyan.copy(alpha = 0.4f) else CyberBorderStroke
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        GlowingIndicator(
                            color = if (probability >= 90) EmeraldHyper else CyberCyan
                        )
                        Column {
                            Text(
                                text = topic,
                                color = TextHighContrast,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = "Appeared in 6 of last 7 end-sem question papers",
                                color = TextMuted,
                                fontSize = 11.sp
                            )
                        }
                    }

                    ConfidenceScoreBadge(
                        badge = ConfidenceBadge(
                            text = "$probability% Probability",
                            percentage = probability,
                            badgeType = badgeType
                        )
                    )
                }
            }
        }
    }
}
