package com.devquiz.app.presentation.result

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.devquiz.app.presentation.quiz.QuizUiState

@Composable
fun ResultScreen(
    state: QuizUiState,
    onRestart: () -> Unit,
    onGoHome: () -> Unit
) {
    val total = state.questions.size
    val correct = state.userAnswers.count { it.isCorrect }
    val percentage = if (total > 0) (correct * 100) / total else 0

    Scaffold { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                if (percentage >= 80) "🏆 ¡Excelente Desempeño!" else "💪 ¡Buen Intento!",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("$percentage%", style = MaterialTheme.typography.displayLarge, fontWeight = FontWeight.ExtraBold)
                    Text("$correct de $total respuestas correctas", style = MaterialTheme.typography.bodyLarge)
                    Text("Puntos totales: ${state.score} pts", fontWeight = FontWeight.SemiBold)
                }
            }

            Text("Desglose del Examen", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

            state.userAnswers.forEachIndexed { _, record ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(if (record.isCorrect) "✅" else "❌", modifier = Modifier.padding(end = 12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(record.question.title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                            Text("Tu resp: ${record.question.options.getOrNull(record.selectedIndex) ?: "-"}", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(onClick = onGoHome, modifier = Modifier.weight(1f)) {
                    Text("Inicio")
                }
                Button(onClick = onRestart, modifier = Modifier.weight(1f)) {
                    Text("Jugar de Nuevo")
                }
            }
        }
    }
}
