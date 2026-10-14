package com.exampulse.antigravity.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.exampulse.antigravity.model.BadgeType
import com.exampulse.antigravity.model.ConfidenceBadge
import com.exampulse.antigravity.theme.*

/**
 * Glassmorphic Translucent Card with surfaceVariant, subtle border stroke,
 * and zero-gravity elevation shift.
 */
@Composable
fun GlassmorphicCard(
    modifier: Modifier = Modifier,
    cornerRadius: Dp = AntigravityPhysics.GlassCornerRadius,
    borderColor: Color = CyberBorderStroke,
    backgroundColor: Color = CosmicSurfaceVariant.copy(alpha = 0.65f),
    elevation: Dp = AntigravityPhysics.ZeroGElevationResting,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val shape = RoundedCornerShape(cornerRadius)

    val cardModifier = if (onClick != null) {
        modifier
            .shadow(elevation, shape, spotColor = CyberCyanGlow)
            .clip(shape)
            .background(backgroundColor)
            .border(1.dp, borderColor, shape)
            .clickable { onClick() }
    } else {
        modifier
            .shadow(elevation, shape, spotColor = CyberCyanGlow)
            .clip(shape)
            .background(backgroundColor)
            .border(1.dp, borderColor, shape)
    }

    Column(
        modifier = cardModifier.padding(16.dp),
        content = content
    )
}

/**
 * Floating cyber badge with glowing indicator
 */
@Composable
fun FloatingBadge(
    text: String,
    modifier: Modifier = Modifier,
    accentColor: Color = CyberCyan,
    isPulsing: Boolean = false
) {
    val infiniteTransition = rememberInfiniteTransition(label = "badgePulse")
    val alpha by if (isPulsing) {
        infiniteTransition.animateFloat(
            initialValue = 0.4f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(1200, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "pulseAlpha"
        )
    } else {
        remember { mutableFloatStateOf(1f) }
    }

    Surface(
        modifier = modifier
            .border(1.dp, accentColor.copy(alpha = alpha), RoundedCornerShape(999.dp)),
        color = accentColor.copy(alpha = 0.12f),
        shape = RoundedCornerShape(999.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(6.dp)
                    .clip(CircleShape)
                    .background(accentColor.copy(alpha = alpha))
            )
            Text(
                text = text,
                color = accentColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                fontFamily = FontFamily.Monospace,
                letterSpacing = 0.5.sp
            )
        }
    }
}

/**
 * Confidence Badge with probability percentage and color mapping
 */
@Composable
fun ConfidenceScoreBadge(
    badge: ConfidenceBadge,
    modifier: Modifier = Modifier
) {
    val color = when (badge.badgeType) {
        BadgeType.HIGH_FREQUENT -> EmeraldHyper
        BadgeType.CORE_CONCEPT -> CyberCyan
        BadgeType.HIGH_YIELD_CRITICAL -> ElectricViolet
        BadgeType.CONCEPTUAL_VIVA -> CyberAmber
    }

    FloatingBadge(
        text = badge.text,
        modifier = modifier,
        accentColor = color,
        isPulsing = badge.badgeType == BadgeType.HIGH_FREQUENT
    )
}

/**
 * Smooth Animated Progress Ring for Syllabus Coverage & Mastery Meter
 */
@Composable
fun ProgressRing(
    progress: Float, // 0.0f to 1.0f
    modifier: Modifier = Modifier,
    strokeWidth: Dp = 8.dp,
    trackColor: Color = CosmicSurfaceVariant,
    accentColor: Color = CyberCyan,
    centerContent: @Composable () -> Unit = {}
) {
    val animatedProgress by animateFloatAsState(
        targetValue = progress.coerceIn(0f, 1f),
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "progressAnimation"
    )

    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val sweep = animatedProgress * 360f

            // Background Track
            drawArc(
                color = trackColor,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                style = Stroke(width = strokeWidth.toPx(), cap = StrokeCap.Round)
            )

            // Neon Progress Gradient Arc
            drawArc(
                brush = Brush.sweepGradient(
                    colors = listOf(CyberCyan, ElectricViolet, EmeraldHyper, CyberCyan)
                ),
                startAngle = -90f,
                sweepAngle = sweep,
                useCenter = false,
                style = Stroke(width = strokeWidth.toPx(), cap = StrokeCap.Round)
            )
        }

        centerContent()
    }
}

/**
 * Glowing pulsating indicator for high-yield PYQ topics
 */
@Composable
fun GlowingIndicator(
    color: Color = EmeraldHyper,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "indicatorGlow")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.35f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = modifier.size(14.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(10.dp * scale)
                .clip(CircleShape)
                .background(color.copy(alpha = 0.25f))
        )
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(color)
        )
    }
}

/**
 * Deep Cosmic Midnight Scaffold Background with subtle starfield depth
 */
@Composable
fun CosmicBackground(
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        CosmicDeep,
                        CosmicSurface,
                        Color(0xFF060910)
                    )
                )
            ),
        content = content
    )
}
