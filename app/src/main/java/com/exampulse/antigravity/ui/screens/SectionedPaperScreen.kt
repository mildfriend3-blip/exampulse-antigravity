package com.exampulse.antigravity.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Info
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
import com.exampulse.antigravity.model.ExamSectionType
import com.exampulse.antigravity.theme.*
import com.exampulse.antigravity.ui.components.ConfidenceScoreBadge
import com.exampulse.antigravity.ui.components.FloatingBadge
import com.exampulse.antigravity.ui.components.GlassmorphicCard
import com.exampulse.antigravity.viewmodel.AntigravityViewModel

/**
 * Sectioned Exam Simulator Screen
 * Official university format (Section A: 2-mark compulsory, Section B: 5-mark conceptual,
 * Section C: 10-mark architectural/numerical with internal choices).
 */
@Composable
fun SectionedPaperScreen(viewModel: AntigravityViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    var selectedSectionFilter by remember { mutableStateOf<ExamSectionType?>(null) }

    val currentPaper = uiState.currentPaper

    val displayedQuestions = remember(selectedSectionFilter, currentPaper) {
        when (selectedSectionFilter) {
            ExamSectionType.SECTION_A -> currentPaper.sectionA
            ExamSectionType.SECTION_B -> currentPaper.sectionB
            ExamSectionType.SECTION_C -> currentPaper.sectionC
            null -> currentPaper.sectionA + currentPaper.sectionB + currentPaper.sectionC
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        // University Exam Header Card
        item {
            GlassmorphicCard(
                borderColor = CyberCyan.copy(alpha = 0.5f)
            ) {
                Text(
                    text = currentPaper.university.uppercase(),
                    color = CyberCyan,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace,
                    letterSpacing = 1.sp
                )
                Text(
                    text = currentPaper.degree,
                    color = TextHighContrast,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${currentPaper.subjectCode}: ${currentPaper.subjectTitle}",
                    color = ElectricViolet,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.height(10.dp))
                HorizontalDivider(color = CyberBorderStroke)
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Time Allowed: ${currentPaper.durationMinutes / 60} Hours",
                        color = TextMuted,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "Maximum Marks: ${currentPaper.maximumMarks}",
                        color = EmeraldHyper,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        // Section Quick Switcher Filter Bar
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val filters = listOf(
                    null to "All Sections",
                    ExamSectionType.SECTION_A to "Sec A (2M)",
                    ExamSectionType.SECTION_B to "Sec B (5M)",
                    ExamSectionType.SECTION_C to "Sec C (10M)"
                )

                filters.forEach { (filterType, label) ->
                    val isSelected = selectedSectionFilter == filterType
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { selectedSectionFilter = filterType },
                        color = if (isSelected) CyberCyan.copy(alpha = 0.25f) else CosmicSurfaceVariant.copy(alpha = 0.5f),
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSelected) CyberCyan else CyberBorderStroke
                        )
                    ) {
                        Text(
                            text = label,
                            color = if (isSelected) CyberCyan else TextMuted,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            fontFamily = FontFamily.Monospace,
                            modifier = Modifier.padding(vertical = 8.dp),
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        }

        // Section Rules & Description
        item {
            val description = when (selectedSectionFilter) {
                ExamSectionType.SECTION_A -> ExamSectionType.SECTION_A.description
                ExamSectionType.SECTION_B -> ExamSectionType.SECTION_B.description
                ExamSectionType.SECTION_C -> ExamSectionType.SECTION_C.description
                null -> "Official CUJammu BTech format: Section A compulsory short notes (2M), Section B conceptual analytical (5M), Section C architectural & numerical with internal choices (10M)."
            }
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = CosmicSurfaceVariant.copy(alpha = 0.35f),
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorderSubtle)
            ) {
                Row(
                    modifier = Modifier.padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(16.dp))
                    Text(
                        text = description,
                        color = TextMuted,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.SansSerif
                    )
                }
            }
        }

        // Question Cards
        items(displayedQuestions) { question ->
            QuestionItemCard(question = question)
        }
    }
}

@Composable
fun QuestionItemCard(question: ExamQuestion) {
    var isExpanded by remember { mutableStateOf(false) }

    GlassmorphicCard(
        borderColor = if (question.section == ExamSectionType.SECTION_C) ElectricViolet.copy(alpha = 0.4f) else CyberBorderStroke
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
                FloatingBadge(
                    text = question.number,
                    accentColor = CyberCyan
                )
                Text(
                    text = "[${question.marks} Marks]",
                    color = EmeraldHyper,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }

            ConfidenceScoreBadge(badge = question.confidenceBadge)
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Question Text
        Text(
            text = question.text,
            color = TextHighContrast,
            fontSize = 14.sp,
            lineHeight = 20.sp,
            fontWeight = FontWeight.Medium
        )

        // Internal Choice Question (Section C)
        if (question.hasInternalChoice && question.alternativeQuestion != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = ElectricViolet.copy(alpha = 0.08f),
                shape = RoundedCornerShape(8.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, ElectricViolet.copy(alpha = 0.25f))
            ) {
                Text(
                    text = question.alternativeQuestion,
                    color = TextHighContrast,
                    fontSize = 13.sp,
                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                    modifier = Modifier.padding(10.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Model Answer Reveal Button
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(6.dp))
                .clickable { isExpanded = !isExpanded }
                .padding(vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (isExpanded) "Hide Model Answer & Rubric" else "View Model Answer & Key Concepts",
                color = CyberCyan,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                fontFamily = FontFamily.Monospace
            )
            Icon(
                Icons.Default.ExpandMore,
                contentDescription = null,
                tint = CyberCyan,
                modifier = Modifier.size(16.dp)
            )
        }

        AnimatedVisibility(visible = isExpanded) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .background(CosmicSurface.copy(alpha = 0.8f), RoundedCornerShape(8.dp))
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "OFFICIAL BENCHMARK ANSWER:",
                    color = EmeraldHyper,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
                Text(
                    text = question.modelAnswer,
                    color = TextHighContrast,
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )

                HorizontalDivider(color = CyberBorderSubtle)

                Text(
                    text = "CRITICAL MARKING KEYWORDS: " + question.keyConcepts.joinToString(" | "),
                    color = CyberAmber,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}
