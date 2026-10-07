package com.devquiz.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.devquiz.app.presentation.home.HomeScreen
import com.devquiz.app.presentation.quiz.QuizScreen
import com.devquiz.app.presentation.quiz.QuizViewModel
import com.devquiz.app.presentation.result.ResultScreen
class MainActivity : ComponentActivity() {

    private val viewModel by lazy { QuizViewModel(application) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val uiState by viewModel.uiState.collectAsState()

            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colorScheme.background
            ) {
                when {
                    uiState.isGameOver -> {
                        ResultScreen(
                            state = uiState,
                            onRestart = { viewModel.loadQuiz("all", uiState.gameMode) },
                            onGoHome = { viewModel.loadQuiz("all", uiState.gameMode) }
                        )
                    }
                    uiState.questions.isNotEmpty() -> {
                        QuizScreen(
                            state = uiState,
                            onEvent = viewModel::onEvent,
                            onNavigateBack = { finish() }
                        )
                    }
                    else -> {
                        HomeScreen(
                            onCategorySelected = { category, mode ->
                                viewModel.loadQuiz(category.id, mode)
                            }
                        )
                    }
                }
            }
        }
    }
}
