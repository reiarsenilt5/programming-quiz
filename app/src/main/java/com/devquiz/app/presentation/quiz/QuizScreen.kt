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
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding(),
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
                    IconButton(
                        onClick = onNavigateBack,
                        modifier = Modifier.size(48.dp)
                    ) {
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
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (state.isAnswerConfirmed) {
                        OutlinedButton(
                            onClick = { onEvent(QuizUiEvent.RequestAiExplanation) },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(
                                Icons.Default.AutoAwesome,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                "Tutor IA", 
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                        Button(
                            onClick = { onEvent(QuizUiEvent.NextQuestion) },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.primary,
                                contentColor = Color(0xFF090D16)
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Siguiente ➔", fontWeight = FontWeight.Bold)
                        }
                    } else {
                        Button(
                            onClick = { onEvent(QuizUiEvent.ConfirmAnswer) },
                            enabled = state.selectedOptionIndex != null,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.primary,
                                contentColor = Color(0xFF090D16)
                            ),
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

            // Zero-Pill Typography Kicker (Anti-Slop Discipline)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.padding(vertical = 2.dp)
            ) {
                Text(
                    text = currentQuestion.category.displayName,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "·",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                )
                Text(
                    text = when (currentQuestion.difficulty.name) {
                        "Junior" -> "Nivel Inicial"
                        "Mid" -> "Nivel Medio"
                        else -> "Nivel Senior"
                    },
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (state.gameMode == GameMode.FailedReview) {
                    Text(
                        text = "·",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                    )
                    Text(
                        text = "Repaso de Fallo",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFFFBBF24)
                    )
                }
            }

            if (state.gameMode == GameMode.FailedReview) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFF59E0B).copy(alpha = 0.15f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Refresh,
                            contentDescription = null,
                            tint = Color(0xFFFBBF24),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                "Modo Repaso de Errores",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = Color(0xFFFBBF24)
                            )
                            state.previousWrongOptionIndex?.let { wrongIdx ->
                                val wrongOpt = currentQuestion.options.getOrNull(wrongIdx)
                                Text(
                                    "En tu intento anterior elegiste la Opción ${('A' + wrongIdx)}${if (wrongOpt != null) ": \"$wrongOpt\"" else ""}",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
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

                val isPreviousWrong = state.gameMode == GameMode.FailedReview && state.previousWrongOptionIndex == index

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
                        modifier = Modifier
                            .padding(14.dp)
                            .defaultMinSize(minHeight = 44.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.size(28.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    "${('A' + index)}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = if (isSelected) Color(0xFF090D16) else MaterialTheme.colorScheme.onSurfaceVariant
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
                        if (isPreviousWrong && !state.isAnswerConfirmed) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color(0xFFEF4444).copy(alpha = 0.2f),
                                modifier = Modifier.padding(start = 6.dp)
                            ) {
                                Text(
                                    "Tu fallo previo",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFF87171),
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }

            if (state.justMasteredQuestion) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFF10B981).copy(alpha = 0.2f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("🎉", fontSize = 20.sp, modifier = Modifier.padding(end = 8.dp))
                        Column {
                            Text(
                                "¡Concepto Dominado!",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = Color(0xFF34D399)
                            )
                            Text(
                                "Esta pregunta ha sido eliminada automáticamente de tu lista de fallos pendientes.",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
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

    // Modal / Diálogo del Tutor de IA
    if (state.isAiLoading || state.aiExplanationText != null || state.aiError != null) {
        AlertDialog(
            onDismissRequest = { onEvent(QuizUiEvent.DismissAiDialog) },
            icon = {
                when {
                    state.isAiLoading -> CircularProgressIndicator(
                        modifier = Modifier.size(28.dp),
                        strokeWidth = 3.dp,
                        color = MaterialTheme.colorScheme.primary
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
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(32.dp)
                    )
                }
            },
            title = {
                Text(
                    text = when {
                        state.isAiLoading -> "Consultando Tutor Gemini..."
                        state.aiError != null -> "Aviso del Tutor de IA"
                        else -> "Tutor Gemini 3.8 Flash"
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
                                        fontSize = 12.sp,
                                        color = Color(0xFFFCA5A5)
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = "Revisa tu conexión de red o ingresa tu clave API personal en Ajustes.",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                        state.aiExplanationText != null -> {
                            Text(
                                text = state.aiExplanationText,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface,
                                lineHeight = 20.sp
                            )
                        }
                    }
                }
            },
            confirmButton = {
                if (state.aiError != null) {
                    Button(
                        onClick = { onEvent(QuizUiEvent.RequestAiExplanation) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = Color(0xFF090D16)
                        )
                    ) {
                        Text("Reintentar", fontWeight = FontWeight.Bold)
                    }
                } else {
                    Button(
                        onClick = { onEvent(QuizUiEvent.DismissAiDialog) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = Color(0xFF090D16)
                        )
                    ) {
                        Text("Entendido", fontWeight = FontWeight.Bold)
                    }
                }
            },
            dismissButton = {
                if (state.aiError != null) {
                    TextButton(onClick = { onEvent(QuizUiEvent.DismissAiDialog) }) {
                        Text("Cerrar")
                    }
                }
            }
        )
    }
}
