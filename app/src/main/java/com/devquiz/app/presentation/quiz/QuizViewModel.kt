package com.devquiz.app.presentation.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devquiz.app.domain.model.GameMode
import com.devquiz.app.domain.model.Question
import com.google.ai.client.generativeai.GenerativeModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class QuizViewModel @Inject constructor(
    private val geminiModel: GenerativeModel
) : ViewModel() {

    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null

    fun loadQuiz(categoryId: String, mode: GameMode) {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    currentIndex = 0,
                    selectedOptionIndex = null,
                    isAnswerConfirmed = false,
                    score = 0,
                    gameMode = mode,
                    timeRemainingSeconds = if (mode == GameMode.TimeTrial) 60 else 0,
                    isGameOver = false,
                    userAnswers = emptyList()
                )
            }

            if (mode == GameMode.TimeTrial) {
                startTimer()
            }
        }
    }

    private fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (_uiState.value.timeRemainingSeconds > 0 && !_uiState.value.isGameOver) {
                delay(1000L)
                _uiState.update { state ->
                    val newTime = state.timeRemainingSeconds - 1
                    if (newTime <= 0) {
                        state.copy(timeRemainingSeconds = 0, isGameOver = true)
                    } else {
                        state.copy(timeRemainingSeconds = newTime)
                    }
                }
            }
        }
    }

    fun onEvent(event: QuizUiEvent) {
        when (event) {
            is QuizUiEvent.SelectOption -> {
                if (!_uiState.value.isAnswerConfirmed) {
                    _uiState.update { it.copy(selectedOptionIndex = event.index) }
                }
            }
            is QuizUiEvent.ConfirmAnswer -> confirmCurrentAnswer()
            is QuizUiEvent.NextQuestion -> moveToNextQuestion()
            is QuizUiEvent.RequestAiExplanation -> fetchAiExplanation()
            is QuizUiEvent.DismissAiDialog -> _uiState.update { it.copy(aiExplanationText = null, aiError = null) }
            is QuizUiEvent.RestartQuiz -> {
                val mode = _uiState.value.gameMode
                loadQuiz("all", mode)
            }
        }
    }

    private fun confirmCurrentAnswer() {
        val state = _uiState.value
        val currentQ = state.currentQuestion ?: return
        val selectedIdx = state.selectedOptionIndex ?: return

        val isCorrect = selectedIdx == currentQ.correctAnswerIndex
        val updatedAnswers = state.userAnswers + UserAnswerRecord(currentQ, selectedIdx, isCorrect)

        _uiState.update {
            it.copy(
                isAnswerConfirmed = true,
                score = if (isCorrect) it.score + 100 else it.score,
                streak = if (isCorrect) it.streak + 1 else 0,
                userAnswers = updatedAnswers
            )
        }
    }

    private fun moveToNextQuestion() {
        val state = _uiState.value
        val nextIdx = state.currentIndex + 1

        if (nextIdx >= state.questions.size) {
            timerJob?.cancel()
            _uiState.update { it.copy(isGameOver = true) }
        } else {
            _uiState.update {
                it.copy(
                    currentIndex = nextIdx,
                    selectedOptionIndex = null,
                    isAnswerConfirmed = false,
                    aiExplanationText = null
                )
            }
        }
    }

    private fun fetchAiExplanation() {
        val currentQ = _uiState.value.currentQuestion ?: return
        val selectedIdx = _uiState.value.selectedOptionIndex

        viewModelScope.launch {
            _uiState.update { it.copy(isAiLoading = true, aiError = null) }
            try {
                val prompt = """
                    Actúa como un Senior Android & Software Architect.
                    Explica de forma didáctica esta pregunta de examen técnico:
                    Categoría: ${currentQ.category.displayName}
                    Pregunta: "${currentQ.title}"
                    Código: ${currentQ.codeSnippet ?: "N/A"}
                    Respuesta del usuario: ${selectedIdx?.let { currentQ.options.getOrNull(it) } ?: "Ninguna"}
                    Respuesta Correcta: ${currentQ.options[currentQ.correctAnswerIndex]}
                    Explicación breve: ${currentQ.explanation}

                    Estructura tu respuesta en 3 secciones concisas:
                    1. ¿Por qué es correcta?
                    2. Concepto o trampa común.
                    3. Pro-Tip para entrevistas técnicas.
                """.trimIndent()

                val response = geminiModel.generateContent(prompt)
                _uiState.update { it.copy(isAiLoading = false, aiExplanationText = response.text) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isAiLoading = false, aiError = e.localizedMessage ?: "Error de conexión") }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}
