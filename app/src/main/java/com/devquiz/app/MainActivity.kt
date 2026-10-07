package com.devquiz.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.devquiz.app.domain.model.GameMode
import com.devquiz.app.presentation.home.MainScreen
import com.devquiz.app.presentation.quiz.QuizScreen
import com.devquiz.app.presentation.quiz.QuizViewModel
import com.devquiz.app.presentation.result.ResultScreen
import com.devquiz.app.ui.theme.DevQuizTheme

class MainActivity : ComponentActivity() {

    private val viewModel by lazy { QuizViewModel(application) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DevQuizTheme {
                val uiState by viewModel.uiState.collectAsState()

                Surface(
                    modifier = Modifier.fillMaxSize()
                ) {
                    when {
                        uiState.isGameOver -> {
                            ResultScreen(
                                state = uiState,
                                onRestart = { viewModel.loadQuiz("all", uiState.gameMode) },
                                onGoHome = { viewModel.resetToHome() },
                                onReviewFailed = { viewModel.loadFailedQuiz() }
                            )
                        }
                        uiState.questions.isNotEmpty() -> {
                            QuizScreen(
                                state = uiState,
                                onEvent = viewModel::onEvent,
                                onNavigateBack = { viewModel.resetToHome() }
                            )
                        }
                        else -> {
                            MainScreen(
                                viewModel = viewModel,
                                streakDays = uiState.streak,
                                onCategorySelected = { category, mode ->
                                    viewModel.loadQuiz(category.id, mode)
                                },
                                onStartBlitz = {
                                    viewModel.loadQuiz("all", GameMode.TimeTrial)
                                },
                                onStartFailedReview = {
                                    viewModel.loadFailedQuiz()
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
