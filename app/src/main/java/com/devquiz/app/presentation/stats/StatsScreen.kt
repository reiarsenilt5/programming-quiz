package com.devquiz.app.presentation.stats

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.devquiz.app.domain.model.CategoryType
import com.devquiz.app.presentation.quiz.QuizViewModel
import com.devquiz.app.presentation.quiz.VirtualMedalData

@Composable
fun StatsScreen(
    viewModel: QuizViewModel,
    streakDays: Int = 5,
    onStartFailedReview: () -> Unit = {}
) {
    val totalAnswered = viewModel.getTotalAnswered()
    val totalCorrect = viewModel.getTotalCorrect()
    val accuracy = if (totalAnswered > 0) (totalCorrect * 100) / totalAnswered else 0
    val failedCount = viewModel.getFailedCount()
    val failedQuestionsList = viewModel.getFailedQuestionsWithDetails()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(modifier = Modifier.height(4.dp))

        Text(
            "Estadísticas",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )

        // Resumen de 3 tarjetas de métricas
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("Total", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("$totalAnswered", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
                    Text("Preguntas", fontSize = 10.sp, color = MaterialTheme.colorScheme.outline)
                }
            }

            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("Precisión", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("$accuracy%", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF10B981))
                    Text("$totalCorrect correctas", fontSize = 10.sp, color = MaterialTheme.colorScheme.outline)
                }
            }

            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("Racha", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("🔥 $streakDays", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFFF59E0B))
                    Text("Días seguidos", fontSize = 10.sp, color = MaterialTheme.colorScheme.outline)
                }
            }
        }

        // Dominio por Categoría
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = CardDefaults.outlinedCardBorder()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    "Dominio por Categoría",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )

                CategoryType.values().forEach { cat ->
                    val (catTotal, catCorrect) = viewModel.getCategoryStats(cat.id)
                    val catAcc = if (catTotal > 0) (catCorrect * 100) / catTotal else 0
                    val progressFloat = if (catTotal > 0) catCorrect.toFloat() / catTotal else 0f

                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                cat.displayName,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                if (catTotal > 0) "$catAcc% ($catCorrect/$catTotal)" else "0%",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (catTotal > 0) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                            )
                        }

                        LinearProgressIndicator(
                            progress = { progressFloat },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(5.dp)
                                .clip(RoundedCornerShape(3.dp)),
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    }
                }
            }
        }

        // Banco de Errores Técnicos
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = CardDefaults.outlinedCardBorder()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFF59E0B).copy(alpha = 0.18f),
                            modifier = Modifier.size(28.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Default.Refresh,
                                    contentDescription = null,
                                    tint = Color(0xFFFBBF24),
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                "Banco de Errores Técnicos",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                if (failedCount > 0) "$failedCount preguntas por corregir" else "Sin errores pendientes",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.outline
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (failedCount > 0) Color(0xFFF59E0B).copy(alpha = 0.2f) else Color(0xFF10B981).copy(alpha = 0.2f)
                    ) {
                        Text(
                            "$failedCount pendientes",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (failedCount > 0) Color(0xFFFBBF24) else Color(0xFF34D399),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                if (failedCount > 0) {
                    Button(
                        onClick = onStartFailedReview,
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(
                            Icons.Default.Refresh,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                            tint = Color.Black
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            "Iniciar Repaso Interactivo ($failedCount fallos)",
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        failedQuestionsList.take(5).forEach { (q, item) ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = MaterialTheme.colorScheme.background,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            q.category.displayName,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                        Text(
                                            "Fallada ${item.failCount} vez",
                                            fontSize = 9.sp,
                                            color = Color(0xFFF87171)
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        q.title,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        maxLines = 2
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    val wrongOpt = q.options.getOrNull(item.selectedOptionIndex)
                                    if (wrongOpt != null) {
                                        Text(
                                            "✗ Tu error: $wrongOpt",
                                            fontSize = 10.sp,
                                            color = Color(0xFFF87171)
                                        )
                                    }
                                    Text(
                                        "✓ Correcta: ${q.options[q.correctAnswerIndex]}",
                                        fontSize = 10.sp,
                                        color = Color(0xFF34D399)
                                    )
                                }
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        TextButton(onClick = { viewModel.failedQuestionsManager.clearAllFailures() }) {
                            Text("Limpiar registro de fallos", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                        }
                    }
                } else {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.background,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("🎉", fontSize = 24.sp, modifier = Modifier.padding(end = 10.dp))
                            Column {
                                Text(
                                    "¡Excelente disciplina!",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    "No tienes preguntas pendientes en tu banco de errores. Cualquier fallo se registrará aquí para repasarlo.",
                                    fontSize = 10.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }

        val medals = viewModel.getVirtualMedals(streakDays)
        val unlockedCount = medals.count { it.isUnlocked }

        // Medallas Virtuales & Hitos
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            border = CardDefaults.outlinedCardBorder()
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            "Medallas Virtuales & Hitos",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            "Recompensas por disciplina y dominio",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFF59E0B).copy(alpha = 0.18f)
                    ) {
                        Text(
                            "$unlockedCount / ${medals.size}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            color = Color(0xFFFBBF24),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                // Overall Medals Progress Bar
                LinearProgressIndicator(
                    progress = { if (medals.isNotEmpty()) unlockedCount.toFloat() / medals.size else 0f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp)),
                    color = Color(0xFFF59E0B),
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )

                // Grid of Medals (chunks of 2)
                medals.chunked(2).forEach { rowMedals ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        rowMedals.forEach { medal ->
                            MedalCardItem(
                                medal = medal,
                                modifier = Modifier.weight(1f)
                            )
                        }
                        if (rowMedals.size == 1) {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}

@Composable
fun MedalCardItem(
    medal: VirtualMedalData,
    modifier: Modifier = Modifier
) {
    val tierColor = when (medal.tier) {
        "Diamante" -> Color(0xFF06B6D4)
        "Oro" -> Color(0xFFF59E0B)
        "Plata" -> Color(0xFF94A3B8)
        else -> Color(0xFFF97316)
    }

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        color = if (medal.isUnlocked) tierColor.copy(alpha = 0.08f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (medal.isUnlocked) tierColor.copy(alpha = 0.45f) else MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)
        )
    ) {
        Column(
            modifier = Modifier.padding(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    medal.emoji,
                    fontSize = 22.sp
                )
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = tierColor.copy(alpha = 0.15f)
                ) {
                    Text(
                        medal.tier,
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        color = tierColor,
                        modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                medal.title,
                fontWeight = FontWeight.Bold,
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 1,
                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis
            )

            Text(
                medal.description,
                fontSize = 9.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                lineHeight = 12.sp,
                modifier = Modifier.padding(top = 2.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (medal.isUnlocked) {
                    Text("✓ Desbloqueada", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                } else {
                    Icon(
                        Icons.Default.Lock,
                        contentDescription = null,
                        modifier = Modifier.size(10.dp),
                        tint = MaterialTheme.colorScheme.outline
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Text(medal.progressText, fontSize = 9.sp, color = MaterialTheme.colorScheme.outline)
                }
            }
        }
    }
}
