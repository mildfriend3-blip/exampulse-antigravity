package com.exampulse.antigravity.ui.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.exampulse.antigravity.model.RadarAxisData
import com.exampulse.antigravity.theme.*
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/**
 * Custom Compose Canvas Radar Chart for University Exam Topic Weightage & PYQ Frequency.
 */
@Composable
fun UniversityTopicWeightageRadar(
    axes: List<RadarAxisData>,
    modifier: Modifier = Modifier
) {
    if (axes.isEmpty()) return

    // Spring animation for smooth expansion of radar vertices
    val animatedProgress by animateFloatAsState(
        targetValue = 1f,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioLowBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "radarExpansion"
    )

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(320.dp)
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val center = Offset(size.width / 2f, size.height / 2f)
                val radius = (minOf(size.width, size.height) / 2f) * 0.85f
                val count = axes.size
                val angleStep = (2 * PI / count).toFloat()

                // 1. Draw Concentric Web Rings (25%, 50%, 75%, 100%)
                val ringLevels = listOf(0.25f, 0.50f, 0.75f, 1.0f)
                ringLevels.forEach { level ->
                    val ringPath = Path()
                    for (i in 0 until count) {
                        val angle = (i * angleStep) - (PI / 2).toFloat()
                        val x = center.x + (radius * level) * cos(angle)
                        val y = center.y + (radius * level) * sin(angle)
                        if (i == 0) ringPath.moveTo(x, y) else ringPath.lineTo(x, y)
                    }
                    ringPath.close()

                    drawPath(
                        path = ringPath,
                        color = CyberBorderStroke.copy(alpha = if (level == 1f) 0.5f else 0.25f),
                        style = Stroke(width = if (level == 1f) 1.5f else 1.0f)
                    )
                }

                // 2. Draw Radial Spokes
                for (i in 0 until count) {
                    val angle = (i * angleStep) - (PI / 2).toFloat()
                    val endX = center.x + radius * cos(angle)
                    val endY = center.y + radius * sin(angle)

                    drawLine(
                        color = CyberBorderStroke.copy(alpha = 0.35f),
                        start = center,
                        end = Offset(endX, endY),
                        strokeWidth = 1f
                    )
                }

                // 3. Draw Topic Weightage Polygon
                val dataPath = Path()
                val dataPoints = mutableListOf<Offset>()

                axes.forEachIndexed { i, axis ->
                    val angle = (i * angleStep) - (PI / 2).toFloat()
                    val r = radius * (axis.score * animatedProgress)
                    val px = center.x + r * cos(angle)
                    val py = center.y + r * sin(angle)
                    dataPoints.add(Offset(px, py))

                    if (i == 0) dataPath.moveTo(px, py) else dataPath.lineTo(px, py)
                }
                dataPath.close()

                // Translucent Neon Fill
                drawPath(
                    path = dataPath,
                    color = CyberCyan.copy(alpha = 0.22f),
                    style = Fill
                )

                // Neon Stroke
                drawPath(
                    path = dataPath,
                    color = CyberCyan,
                    style = Stroke(width = 2.5f)
                )

                // 4. Draw glowing vertex points
                dataPoints.forEach { pt ->
                    drawCircle(
                        color = ElectricViolet,
                        radius = 5f,
                        center = pt
                    )
                    drawCircle(
                        color = CyberCyan,
                        radius = 2.5f,
                        center = pt
                    )
                }
            }
        }

        // Radar Legends / Axis Metrics
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            axes.take(3).forEach { axis ->
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = axis.category.label.split("&").first().trim(),
                        color = TextMuted,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = "${(axis.score * 100).toInt()}% PYQ Weight",
                        color = CyberCyan,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
