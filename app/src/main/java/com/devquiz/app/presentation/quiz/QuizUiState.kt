package com.devquiz.app.presentation.quiz

import com.devquiz.app.domain.model.GameMode
import com.devquiz.app.domain.model.Question

data class QuizUiState(
    val questions: List<Question> = emptyList(),
    val currentIndex: Int = 0,
    val selectedOptionIndex: Int? = null,
    val isAnswerConfirmed: Boolean = false,
    val score: Int = 0,
    val streak: Int = 3,
    val timeRemainingSeconds: Int = 60,
    val gameMode: GameMode = GameMode.Practice,
    val isGameOver: Boolean = false,
    val userAnswers: List<UserAnswerRecord> = emptyList(),
    val aiExplanationText: String? = null,
    val isAiLoading: Boolean = false,
    val aiError: String? = null
) {
    val currentQuestion: Question?
        get() = questions.getOrNull(currentIndex)

    val progress: Float
        get() = if (questions.isNotEmpty()) (currentIndex + 1).toFloat() / questions.size else 0f
}

data class UserAnswerRecord(
    val question: Question,
    val selectedIndex: Int,
    val isCorrect: Boolean
)

sealed interface QuizUiEvent {
    data class SelectOption(val index: Int) : QuizUiEvent
    object ConfirmAnswer : QuizUiEvent
    object NextQuestion : QuizUiEvent
    object RequestAiExplanation : QuizUiEvent
    object DismissAiDialog : QuizUiEvent
    object RestartQuiz : QuizUiEvent
}
