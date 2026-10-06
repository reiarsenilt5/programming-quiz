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
                        style = MaterialTheme.typography.titleMedium
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.Close, contentDescription = "Salir")
                    }
                },
                actions = {
                    if (state.gameMode == GameMode.TimeTrial) {
                        Text(
                            "⏱ ${state.timeRemainingSeconds}s",
                            fontWeight = FontWeight.Bold,
                            color = if (state.timeRemainingSeconds <= 10) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(end = 16.dp)
                        )
                    }
                }
            )
        },
        bottomBar = {
            Surface(tonalElevation = 8.dp) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (state.isAnswerConfirmed) {
                        OutlinedButton(
                            onClick = { onEvent(QuizUiEvent.RequestAiExplanation) },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("✨ Explicar con IA")
                        }
                        Button(
                            onClick = { onEvent(QuizUiEvent.NextQuestion) },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Siguiente ➔")
                        }
                    } else {
                        Button(
                            onClick = { onEvent(QuizUiEvent.ConfirmAnswer) },
                            enabled = state.selectedOptionIndex != null,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Comprobar Respuesta")
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
                    .clip(RoundedCornerShape(3.dp))
            )

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AssistChip(onClick = {}, label = { Text(currentQuestion.difficulty.name) })
                AssistChip(onClick = {}, label = { Text(currentQuestion.category.displayName) })
            }

            Text(
                text = currentQuestion.title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            currentQuestion.codeSnippet?.let { code ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E2E))
                ) {
                    Text(
                        text = code,
                        color = Color(0xFFCDD6F4),
                        fontFamily = FontFamily.Monospace,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(14.dp)
                    )
                }
            }

            currentQuestion.options.forEachIndexed { index, optionText ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(enabled = !state.isAnswerConfirmed) { onEvent(QuizUiEvent.SelectOption(index)) }
                        .border(
                            1.5.dp,
                            if (state.selectedOptionIndex == index) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outlineVariant,
                            RoundedCornerShape(12.dp)
                        ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("${('A' + index)}.", fontWeight = FontWeight.Bold, modifier = Modifier.padding(end = 12.dp))
                        Text(optionText, modifier = Modifier.weight(1f))
                    }
                }
            }

            if (state.isAnswerConfirmed) {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (state.selectedOptionIndex == currentQuestion.correctAnswerIndex)
                            Color(0xFFE8F5E9) else Color(0xFFFFEBEE)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = if (state.selectedOptionIndex == currentQuestion.correctAnswerIndex)
                                "✅ ¡Correcto!" else "❌ Incorrecto",
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(currentQuestion.explanation, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }

    if (state.aiExplanationText != null || state.isAiLoading) {
        AlertDialog(
            onDismissRequest = { onEvent(QuizUiEvent.DismissAiDialog) },
            title = { Text("Tutor Virtual Gemini") },
            text = {
                if (state.isAiLoading) {
                    CircularProgressIndicator(modifier = Modifier.padding(16.dp))
                } else {
                    Text(state.aiExplanationText ?: "")
                }
            },
            confirmButton = {
                TextButton(onClick = { onEvent(QuizUiEvent.DismissAiDialog) }) {
                    Text("Cerrar")
                }
            }
        )
    }
}
