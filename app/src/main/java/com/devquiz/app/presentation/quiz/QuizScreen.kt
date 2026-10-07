package com.devquiz.app.presentation.quiz

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
import com.devquiz.app.domain.model.GameMode

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuizScreen(
    state: QuizUiState,
    onEvent: (QuizUiEvent) -> Unit,
    onNavigateBack: () -> Unit
) {
    val currentQuestion = state.currentQuestion ?: return

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "${state.currentIndex + 1}/${state.questions.size}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.Close, contentDescription = "Salir")
                    }
                },
                actions = {
                    if (state.gameMode == GameMode.TimeTrial) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (state.timeRemainingSeconds <= 10) 
                                MaterialTheme.colorScheme.error.copy(alpha = 0.2f) 
                            else 
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                            modifier = Modifier.padding(end = 16.dp)
                        ) {
                            Text(
                                "⏱ ${state.timeRemainingSeconds}s",
                                fontWeight = FontWeight.Bold,
                                color = if (state.timeRemainingSeconds <= 10) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            )
        },
        bottomBar = {
            Surface(
                tonalElevation = 8.dp,
                color = MaterialTheme.colorScheme.surface,
                modifier = Modifier.navigationBarsPadding()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (state.isAnswerConfirmed) {
                        Button(
                            onClick = { onEvent(QuizUiEvent.RequestAiExplanation) },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF7C3AED),
                                contentColor = Color.White
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(
                                Icons.Default.AutoAwesome,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Tutor de IA", fontWeight = FontWeight.SemiBold)
                        }
                        Button(
                            onClick = { onEvent(QuizUiEvent.NextQuestion) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Siguiente ➔", fontWeight = FontWeight.SemiBold)
                        }
                    } else {
                        Button(
                            onClick = { onEvent(QuizUiEvent.ConfirmAnswer) },
                            enabled = state.selectedOptionIndex != null,
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Comprobar Respuesta", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            LinearProgressIndicator(
                progress = { state.progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp)),
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        currentQuestion.category.displayName,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        currentQuestion.difficulty.name,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Text(
                text = currentQuestion.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            currentQuestion.codeSnippet?.let { code ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF020617))
                ) {
                    Text(
                        text = code,
                        color = Color(0xFFCDD6F4),
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(14.dp)
                    )
                }
            }

            currentQuestion.options.forEachIndexed { index, optionText ->
                val isSelected = state.selectedOptionIndex == index
                val isCorrectAnswer = index == currentQuestion.correctAnswerIndex

                val borderColor = when {
                    state.isAnswerConfirmed && isCorrectAnswer -> Color(0xFF10B981)
                    state.isAnswerConfirmed && isSelected -> Color(0xFFEF4444)
                    isSelected -> MaterialTheme.colorScheme.primary
                    else -> MaterialTheme.colorScheme.outlineVariant
                }

                val containerColor = when {
                    state.isAnswerConfirmed && isCorrectAnswer -> Color(0xFF10B981).copy(alpha = 0.15f)
                    state.isAnswerConfirmed && isSelected -> Color(0xFFEF4444).copy(alpha = 0.15f)
                    isSelected -> MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                    else -> MaterialTheme.colorScheme.surface
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(enabled = !state.isAnswerConfirmed) { 
                            onEvent(QuizUiEvent.SelectOption(index)) 
                        }
                        .border(1.5.dp, borderColor, RoundedCornerShape(12.dp)),
                    colors = CardDefaults.cardColors(containerColor = containerColor),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.size(26.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    "${('A' + index)}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            optionText,
                            modifier = Modifier.weight(1f),
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    }
                }
            }

            if (state.isAnswerConfirmed) {
                val isCorrect = state.selectedOptionIndex == currentQuestion.correctAnswerIndex
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isCorrect) 
                            Color(0xFF10B981).copy(alpha = 0.12f) 
                        else 
                            Color(0xFFEF4444).copy(alpha = 0.12f)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            1.dp,
                            if (isCorrect) Color(0xFF10B981).copy(alpha = 0.4f) else Color(0xFFEF4444).copy(alpha = 0.4f),
                            RoundedCornerShape(12.dp)
                        )
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                if (isCorrect) Icons.Default.CheckCircle else Icons.Default.Cancel,
                                contentDescription = null,
                                tint = if (isCorrect) Color(0xFF10B981) else Color(0xFFEF4444),
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isCorrect) "¡Respuesta Correcta! (+100 pts)" else "Respuesta Incorrecta",
                                fontWeight = FontWeight.Bold,
                                color = if (isCorrect) Color(0xFF34D399) else Color(0xFFF87171),
                                fontSize = 14.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            currentQuestion.explanation,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    // Modal / Diálogo del Tutor de IA (Manejo visual robusto para carga, error y éxito)
    if (state.isAiLoading || state.aiExplanationText != null || state.aiError != null) {
        AlertDialog(
            onDismissRequest = { onEvent(QuizUiEvent.DismissAiDialog) },
            icon = {
                when {
                    state.isAiLoading -> CircularProgressIndicator(
                        modifier = Modifier.size(28.dp),
                        strokeWidth = 3.dp,
                        color = Color(0xFF8B5CF6)
                    )
                    state.aiError != null -> Icon(
                        Icons.Default.Warning,
                        contentDescription = "Error",
                        tint = Color(0xFFF43F5E),
                        modifier = Modifier.size(32.dp)
                    )
                    else -> Icon(
                        Icons.Default.AutoAwesome,
                        contentDescription = "Tutor IA",
                        tint = Color(0xFF8B5CF6),
                        modifier = Modifier.size(32.dp)
                    )
                }
            },
            title = {
                Text(
                    text = when {
                        state.isAiLoading -> "Consultando Tutor Gemini..."
                        state.aiError != null -> "Aviso del Tutor de IA"
                        else -> "Tutor Gemini 1.5 Flash"
                    },
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 380.dp)
                        .verticalScroll(rememberScrollState())
                ) {
                    when {
                        state.isAiLoading -> {
                            Text(
                                "El modelo está analizando el código y elaborando la explicación técnica detallada para esta pregunta...",
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        state.aiError != null -> {
                            Card(
                                colors = CardDefaults.cardColors(
                                    containerColor = Color(0xFFF43F5E).copy(alpha = 0.12f)
                                ),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, Color(0xFFF43F5E).copy(alpha = 0.3f), RoundedCornerShape(10.dp))
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(
                                        text = state.aiError,
                                        fontSize = 13.sp,
                                        color = Color(0xFFFECDD3),
                                        lineHeight = 18.sp
                                    )
                                }
                            }
                        }
                        state.aiExplanationText != null -> {
                            Text(
                                text = state.aiExplanationText,
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onSurface,
                                lineHeight = 20.sp
                            )
                        }
                    }
                }
            },
            confirmButton = {
                if (state.aiError != null) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        TextButton(onClick = { onEvent(QuizUiEvent.DismissAiDialog) }) {
                            Text("Cerrar")
                        }
                        Button(
                            onClick = { onEvent(QuizUiEvent.RequestAiExplanation) },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF8B5CF6))
                        ) {
                            Text("Reintentar")
                        }
                    }
                } else if (!state.isAiLoading) {
                    Button(
                        onClick = { onEvent(QuizUiEvent.DismissAiDialog) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF6366F1))
                    ) {
                        Text("Entendido")
                    }
                }
            },
            dismissButton = {
                if (state.isAiLoading) {
                    TextButton(onClick = { onEvent(QuizUiEvent.DismissAiDialog) }) {
                        Text("Cancelar")
                    }
                }
            }
        )
    }
}
