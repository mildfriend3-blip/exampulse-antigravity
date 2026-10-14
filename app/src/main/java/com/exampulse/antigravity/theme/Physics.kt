package com.exampulse.antigravity.theme

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.SpringSpec
import androidx.compose.animation.core.spring
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Antigravity Zero-G Physics Specifications
 * Features dampening, subtle float elevations, and snappy spring transitions for cards and flips.
 */
object AntigravityPhysics {
    // Spring physics for card expansion & modal snaps
    val CardExpansionSpring: SpringSpec<Float> = spring(
        dampingRatio = Spring.DampingRatioLowBouncy,
        stiffness = Spring.StiffnessMediumLow
    )

    // Snappy zero-gravity card flip for SM-2 active recall
    val CardFlipSpring: SpringSpec<Float> = spring(
        dampingRatio = 0.78f,
        stiffness = 380f
    )

    // Subtle floating levitation elevations
    val ZeroGElevationResting: Dp = 4.dp
    val ZeroGElevationHover: Dp = 12.dp
    val ZeroGElevationPressed: Dp = 2.dp

    // Border radius standard
    val GlassCornerRadius: Dp = 16.dp
    val FloatingBadgeRadius: Dp = 999.dp
    val HUDContainerRadius: Dp = 20.dp
}
