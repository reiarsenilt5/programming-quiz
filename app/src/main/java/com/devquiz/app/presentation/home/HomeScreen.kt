package com.devquiz.app.presentation.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.devquiz.app.domain.model.CategoryType
import com.devquiz.app.domain.model.GameMode

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    streakDays: Int = 5,
    onCategorySelected: (CategoryType, GameMode) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("DevQuiz", fontWeight = FontWeight.Bold)
                        Text("Master Modern Coding", style = MaterialTheme.typography.bodySmall)
                    }
                },
                actions = {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = MaterialTheme.colorScheme.primaryContainer,
                        modifier = Modifier.padding(end = 16.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text("🔥", modifier = Modifier.padding(end = 4.dp))
                            Text(
                                "$streakDays días",
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    "Modos de Juego",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp)
                )
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    GameModeCard(
                        title = "Práctica",
                        subtitle = "Sin límite",
                        emoji = "📖",
                        modifier = Modifier.weight(1f),
                        onClick = { onCategorySelected(CategoryType.MODERN_FUNDAMENTALS, GameMode.Practice) }
                    )
                    GameModeCard(
                        title = "Contrarreloj",
                        subtitle = "60 Segundos",
                        emoji = "⏱",
                        modifier = Modifier.weight(1f),
                        onClick = { onCategorySelected(CategoryType.SQL, GameMode.TimeTrial) }
                    )
                    GameModeCard(
                        title = "Diario",
                        subtitle = "5 Retos",
                        emoji = "📅",
                        modifier = Modifier.weight(1f),
                        onClick = { onCategorySelected(CategoryType.SOLID, GameMode.DailyChallenge) }
                    )
                }
            }

            item {
                Text(
                    "Categorías Técnicas",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(CategoryType.entries) { category ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onCategorySelected(category, GameMode.Practice) },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .padding(16.dp)
                            .fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(category.displayName, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
                        Text("➔", color = MaterialTheme.colorScheme.outline, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun GameModeCard(
    title: String,
    subtitle: String,
    emoji: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(emoji, fontSize = 24.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(title, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelLarge)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.outline)
        }
    }
}
