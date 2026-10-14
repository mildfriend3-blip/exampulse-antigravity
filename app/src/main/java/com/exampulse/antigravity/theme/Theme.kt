package com.exampulse.antigravity.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = CyberCyan,
    onPrimary = CosmicDeep,
    primaryContainer = CyberCyanGlow,
    onPrimaryContainer = CyberCyan,

    secondary = ElectricViolet,
    onSecondary = TextHighContrast,
    secondaryContainer = ElectricVioletGlow,
    onSecondaryContainer = ElectricViolet,

    tertiary = EmeraldHyper,
    onTertiary = CosmicDeep,
    tertiaryContainer = EmeraldHyperGlow,
    onTertiaryContainer = EmeraldHyper,

    background = CosmicDeep,
    onBackground = TextHighContrast,

    surface = CosmicSurface,
    onSurface = TextHighContrast,

    surfaceVariant = CosmicSurfaceVariant,
    onSurfaceVariant = TextMuted,

    error = CyberCrimson,
    onError = TextHighContrast
)

@Composable
fun AntigravityTheme(
    content: @Composable () -> Unit
) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = CosmicDeep.toArgb()
                window.navigationBarColor = CosmicDeep.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
                WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = AntigravityTypography,
        content = content
    )
}
