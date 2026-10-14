package com.exampulse.antigravity.theme

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Modifier to create a futuristic Glassmorphic card surface with subtle neon borders.
 */
fun Modifier.glassmorphic(
    shape: Shape = RoundedCornerShape(16.dp),
    backgroundColor: Color = CosmicGlassBackground,
    borderColor: Color = CyberBorderStroke,
    borderWidth: Dp = 1.dp
): Modifier = this
    .clip(shape)
    .background(backgroundColor)
    .border(borderWidth, borderColor, shape)

/**
 * Modifier that adds an electric cyber glow gradient around edges.
 */
fun Modifier.cyberGlow(
    glowColor: Color = CyberCyanGlow,
    shape: Shape = RoundedCornerShape(16.dp),
    borderWidth: Dp = 1.5.dp
): Modifier = this
    .border(
        width = borderWidth,
        brush = Brush.linearGradient(
            colors = listOf(CyberCyan, ElectricViolet, CyberCyan.copy(alpha = 0.2f))
        ),
        shape = shape
    )
    .background(CosmicSurfaceVariant.copy(alpha = 0.7f), shape)

/**
 * Infinite zero-gravity floating levitation animation modifier.
 */
fun Modifier.zeroGFoat(
    floatDistanceDp: Float = 6f,
    durationMs: Int = 2800
): Modifier = composed {
    val infiniteTransition = rememberInfiniteTransition(label = "zeroGFloat")
    val offsetY by infiniteTransition.animateFloat(
        initialValue = -floatDistanceDp,
        targetValue = floatDistanceDp,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMs),
            repeatMode = RepeatMode.Reverse
        ),
        label = "offsetY"
    )

    this.drawBehind {
        // Drawing slight cosmic energy pulse underneath
    }
}
