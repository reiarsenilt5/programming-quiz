package com.devquiz.app.presentation.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.devquiz.app.domain.model.CategoryType
import com.devquiz.app.domain.model.GameMode
import com.devquiz.app.presentation.quiz.QuizViewModel
import com.devquiz.app.presentation.settings.SettingsScreen
import com.devquiz.app.presentation.stats.StatsScreen

enum class MainNavTab(val title: String, val icon: ImageVector) {
    HOME("Inicio", Icons.Default.Home),
    BLITZ("Blitz 60s", Icons.Default.Bolt),
    STATS("Estadísticas", Icons.Default.BarChart),
    SETTINGS("Ajustes", Icons.Default.Settings)
}

fun CategoryType.iconEmoji(): String = when (this) {
    CategoryType.PYTHON -> "🐍"
    CategoryType.PHP -> "🐘"
    CategoryType.JAVASCRIPT -> "⚡"
    CategoryType.TYPESCRIPT -> "🔷"
    CategoryType.REACT -> "⚛️"
    CategoryType.SQL -> "💾"
    CategoryType.SOLID -> "🏛️"
    CategoryType.MODERN_FUNDAMENTALS -> "🐙"
    CategoryType.AI_ASSISTANCE -> "🤖"
    CategoryType.SENIOR_FULLSTACK -> "🚀"
    CategoryType.DEVOPS_CLOUD -> "☁️"
    CategoryType.SUBTLE_ENGINEERING -> "🎯"
    CategoryType.DOCKER_MASTERY -> "🐳"
}

fun CategoryType.techTag(): String = when (this) {
    CategoryType.PYTHON -> "Python 3.12+"
    CategoryType.PHP -> "PHP 8.3"
    CategoryType.JAVASCRIPT -> "ES2024"
    CategoryType.TYPESCRIPT -> "TS 5.4+"
    CategoryType.REACT -> "React 19"
    CategoryType.SQL -> "PostgreSQL/MySQL"
    CategoryType.SOLID -> "Clean Code"
    CategoryType.MODERN_FUNDAMENTALS -> "Git & Linux"
    CategoryType.AI_ASSISTANCE -> "Gemini & LLMs"
    CategoryType.SENIOR_FULLSTACK -> "Senior 2026"
    CategoryType.DEVOPS_CLOUD -> "K8s & CI/CD"
    CategoryType.SUBTLE_ENGINEERING -> "Pro Tricks"
    CategoryType.DOCKER_MASTERY -> "Containers 25+"
}

fun CategoryType.descriptionText(): String = when (this) {
    CategoryType.PYTHON -> "Sintaxis 3.12+, tipado, decoradores, asyncio y GIL"
    CategoryType.PHP -> "PHP 8.3, constructor promotion, readonly y Laravel"
    CategoryType.JAVASCRIPT -> "Event Loop, microtasks, closures y prototipos"
    CategoryType.TYPESCRIPT -> "Generics, conditional types, infer y mapped types"
    CategoryType.REACT -> "React 19, Server Actions, hooks y concurrencia"
    CategoryType.SQL -> "Window functions, índices, transacciones y explain"
    CategoryType.SOLID -> "Single responsibility, open-closed, Liskov, IoC"
    CategoryType.MODERN_FUNDAMENTALS -> "Git rebase, cherry-pick, SSH y Unix CLI"
    CategoryType.AI_ASSISTANCE -> "Prompting avanzado, function calling y agentes"
    CategoryType.SENIOR_FULLSTACK -> "Fullstack Senior: React, Python, Laravel y SQL"
    CategoryType.DEVOPS_CLOUD -> "Linux internals, Kubernetes, Docker y CI/CD"
    CategoryType.SUBTLE_ENGINEERING -> "Comportamientos sutiles de producción y bugs"
    CategoryType.DOCKER_MASTERY -> "Multi-stage builds, rootless containers y cgroups"
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: QuizViewModel,
    streakDays: Int = 5,
    onCategorySelected: (CategoryType, GameMode) -> Unit,
    onStartBlitz: () -> Unit,
    onStartFailedReview: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(MainNavTab.HOME) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            "DevQuiz",
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            "Master Modern Coding",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Color(0xFFF59E0B).copy(alpha = 0.18f),
                        modifier = Modifier.padding(end = 16.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text("🔥", modifier = Modifier.padding(end = 4.dp))
                            Text(
                                "$streakDays días",
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFFBBF24),
                                fontSize = 12.sp
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier.navigationBarsPadding()
            ) {
                MainNavTab.values().forEach { tab ->
                    val isSelected = selectedTab == tab
                    val tabColor = when (tab) {
                        MainNavTab.BLITZ -> Color(0xFFF43F5E)
                        else -> MaterialTheme.colorScheme.primary
                    }

                    NavigationBarItem(
                        selected = isSelected,
                        onClick = {
                            if (tab == MainNavTab.BLITZ) {
                                onStartBlitz()
                            } else {
                                selectedTab = tab
                            }
                        },
                        icon = {
                            Icon(
                                tab.icon,
                                contentDescription = tab.title,
                                tint = if (isSelected) tabColor else MaterialTheme.colorScheme.outline
                            )
                        },
                        label = {
                            Text(
                                tab.title,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) tabColor else MaterialTheme.colorScheme.outline,
                                fontSize = 11.sp
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            indicatorColor = tabColor.copy(alpha = 0.15f)
                        )
                    )
                }
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when (selectedTab) {
                MainNavTab.HOME -> {
                    HomeContent(
                        onCategorySelected = onCategorySelected,
                        failedCount = viewModel.getFailedCount(),
                        onStartFailedReview = onStartFailedReview
                    )
                }
                MainNavTab.BLITZ -> {
                    // Blitz inicia automáticamente el quiz via onStartBlitz()
                    HomeContent(
                        onCategorySelected = onCategorySelected,
                        failedCount = viewModel.getFailedCount(),
                        onStartFailedReview = onStartFailedReview
                    )
                }
                MainNavTab.STATS -> {
                    StatsScreen(
                        viewModel = viewModel,
                        streakDays = streakDays,
                        onStartFailedReview = onStartFailedReview
                    )
                }
                MainNavTab.SETTINGS -> {
                    SettingsScreen(apiKeyManager = viewModel.apiKeyManager)
                }
            }
        }
    }
}

@Composable
fun HomeContent(
    onCategorySelected: (CategoryType, GameMode) -> Unit,
    failedCount: Int = 0,
    onStartFailedReview: () -> Unit = {}
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text(
                "MODOS DE JUEGO",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.outline,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(top = 4.dp)
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                GameModeCard(
                    title = "Práctica",
                    subtitle = "Sin reloj",
                    emoji = "📖",
                    color = Color(0xFF6366F1),
                    modifier = Modifier.weight(1f),
                    onClick = { onCategorySelected(CategoryType.MODERN_FUNDAMENTALS, GameMode.Practice) }
                )
                GameModeCard(
                    title = "Contrarreloj",
                    subtitle = "60s blitz",
                    emoji = "⏱",
                    color = Color(0xFFF43F5E),
                    modifier = Modifier.weight(1f),
                    onClick = { onCategorySelected(CategoryType.SQL, GameMode.TimeTrial) }
                )
                GameModeCard(
                    title = "Diario",
                    subtitle = "5 retos",
                    emoji = "📅",
                    color = Color(0xFF10B981),
                    modifier = Modifier.weight(1f),
                    onClick = { onCategorySelected(CategoryType.SOLID, GameMode.DailyChallenge) }
                )
                GameModeCard(
                    title = "Reintentar",
                    subtitle = if (failedCount > 0) "$failedCount pendientes" else "0 al día",
                    emoji = "🎯",
                    color = if (failedCount > 0) Color(0xFFF59E0B) else Color(0xFF10B981),
                    modifier = Modifier.weight(1f),
                    onClick = onStartFailedReview
                )
            }
        }

        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "CATEGORÍAS TÉCNICAS (13)",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.outline,
                    letterSpacing = 1.sp
                )
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Text(
                        "Room Offline",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }

        items(CategoryType.values().toList()) { category ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onCategorySelected(category, GameMode.Practice) },
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Row(
                    modifier = Modifier
                        .padding(14.dp)
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier.size(42.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(category.iconEmoji(), fontSize = 22.sp)
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                category.displayName,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant
                            ) {
                                Text(
                                    category.techTag(),
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 9.sp,
                                    color = MaterialTheme.colorScheme.outline,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            category.descriptionText(),
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            modifier = Modifier.padding(top = 2.dp)
                        )
                    }

                    Icon(
                        Icons.Default.ChevronRight,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.outline,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun GameModeCard(
    title: String,
    subtitle: String,
    emoji: String,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(14.dp),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Column(
            modifier = Modifier.padding(vertical = 12.dp, horizontal = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = color.copy(alpha = 0.15f),
                modifier = Modifier.size(34.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(emoji, fontSize = 18.sp)
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                title,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                subtitle,
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
