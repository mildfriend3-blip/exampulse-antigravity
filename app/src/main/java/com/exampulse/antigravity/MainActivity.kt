package com.exampulse.antigravity

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.exampulse.antigravity.theme.*
import com.exampulse.antigravity.ui.components.CosmicBackground
import com.exampulse.antigravity.ui.components.FloatingBadge
import com.exampulse.antigravity.ui.screens.*
import com.exampulse.antigravity.viewmodel.AntigravityTab
import com.exampulse.antigravity.viewmodel.AntigravityViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: AntigravityViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AntigravityTheme {
                CosmicBackground {
                    AntigravityApp(viewModel = viewModel)
                }
            }
        }
    }
}

@Composable
fun AntigravityApp(viewModel: AntigravityViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        containerColor = Color.Transparent,
        topBar = {
            // Futuristic Zero-G HUD Header
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                color = CosmicSurface.copy(alpha = 0.85f),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorderStroke)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(RoundedCornerShape(99.dp))
                                .background(CyberCyan)
                        )
                        Text(
                            text = "EXAMPULSE // ANTIGRAVITY",
                            color = TextHighContrast,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            letterSpacing = 1.sp
                        )
                    }

                    FloatingBadge(
                        text = "CUJAMMU CSE CYBER",
                        accentColor = ElectricViolet
                    )
                }
            }
        },
        bottomBar = {
            // Floating HUD Tab Bar
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                color = CosmicSurface.copy(alpha = 0.95f),
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, CyberBorderStroke)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val tabs = listOf(
                        AntigravityTab.PREDICTION_RADAR to Icons.Default.Analytics,
                        AntigravityTab.EXAM_SIMULATOR to Icons.Default.Description,
                        AntigravityTab.FLASHCARDS_SRS to Icons.Default.Psychology,
                        AntigravityTab.LIVE_MOCK_HUD to Icons.Default.Timer,
                        AntigravityTab.VIVA_PREP to Icons.Default.RecordVoiceOver,
                        AntigravityTab.PRINT_EXPORT to Icons.Default.Print
                    )

                    tabs.forEach { (tab, icon) ->
                        val isSelected = uiState.currentTab == tab
                        val accentColor = when (tab) {
                            AntigravityTab.PREDICTION_RADAR -> CyberCyan
                            AntigravityTab.EXAM_SIMULATOR -> ElectricViolet
                            AntigravityTab.FLASHCARDS_SRS -> EmeraldHyper
                            AntigravityTab.LIVE_MOCK_HUD -> CyberAmber
                            AntigravityTab.VIVA_PREP -> CyberCyan
                            AntigravityTab.PRINT_EXPORT -> ElectricViolet
                        }

                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .clickable { viewModel.selectTab(tab) },
                            color = if (isSelected) accentColor.copy(alpha = 0.2f) else Color.Transparent,
                            shape = RoundedCornerShape(10.dp),
                            border = if (isSelected) androidx.compose.foundation.BorderStroke(1.dp, accentColor) else null
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = tab.title,
                                    tint = if (isSelected) accentColor else TextMuted,
                                    modifier = Modifier.size(16.dp)
                                )
                                Text(
                                    text = tab.title,
                                    color = if (isSelected) accentColor else TextMuted,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            AnimatedContent(
                targetState = uiState.currentTab,
                transitionSpec = {
                    fadeIn(animationSpec = AntigravityPhysics.CardExpansionSpring) togetherWith
                            fadeOut(animationSpec = AntigravityPhysics.CardExpansionSpring)
                },
                label = "tabTransition"
            ) { targetTab ->
                when (targetTab) {
                    AntigravityTab.PREDICTION_RADAR -> RadarPredictionScreen(viewModel = viewModel)
                    AntigravityTab.EXAM_SIMULATOR -> SectionedPaperScreen(viewModel = viewModel)
                    AntigravityTab.FLASHCARDS_SRS -> FlashcardEngineScreen(viewModel = viewModel)
                    AntigravityTab.LIVE_MOCK_HUD -> MockExamHUDScreen(viewModel = viewModel)
                    AntigravityTab.VIVA_PREP -> VivaQuizScreen(viewModel = viewModel)
                    AntigravityTab.PRINT_EXPORT -> PrintableViewScreen(viewModel = viewModel)
                }
            }
        }
    }
}
