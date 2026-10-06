package com.devquiz.app.presentation.quiz

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.devquiz.app.BuildConfig
import com.devquiz.app.domain.model.CategoryType
import com.devquiz.app.domain.model.DifficultyLevel
import com.devquiz.app.domain.model.GameMode
import com.devquiz.app.domain.model.Question
import com.devquiz.app.domain.model.QuestionType
import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.io.InputStream

class QuizViewModel(application: Application) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null
    private var allQuestionsCache: List<Question> = emptyList()

    private val geminiModel: GenerativeModel by lazy {
        val apiKey = BuildConfig.GEMINI_API_KEY
        GenerativeModel(
            modelName = "gemini-3.8-flash",
            apiKey = apiKey.ifEmpty { "AI_KEY" }
        )
    }

    init {
        loadAllQuestionsFromAssets()
    }

    private fun loadAllQuestionsFromAssets() {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val context = getApplication<Application>()
                val inputStream: InputStream = context.assets.open("questions.json")
                val jsonString = inputStream.bufferedReader().use { it.readText() }
                val jsonArray = JSONArray(jsonString)
                val list = mutableListOf<Question>()

                for (i in 0 until jsonArray.length()) {
                    val obj = jsonArray.getJSONObject(i)
                    val optionsJson = obj.getJSONArray("options")
                    val optionsList = mutableListOf<String>()
                    for (j in 0 until optionsJson.length()) {
                        optionsList.add(optionsJson.getString(j))
                    }

                    val catId = obj.optString("categoryId", "modern_fundamentals")
                    val catType = CategoryType.fromId(catId)

                    val diffStr = obj.optString("difficulty", "Mid")
                    val difficulty = when (diffStr) {
                        "Junior" -> DifficultyLevel.Junior
                        "Senior" -> DifficultyLevel.Senior
                        else -> DifficultyLevel.Mid
                    }

                    val typeStr = obj.optString("type", "multiple_choice")
                    val type = when (typeStr) {
                        "find_the_bug" -> QuestionType.FindTheBug
                        "true_false" -> QuestionType.TrueFalse
                        else -> QuestionType.MultipleChoice
                    }

                    list.add(
                        Question(
                            id = obj.optString("id", "q-$i"),
                            category = catType,
                            difficulty = difficulty,
                            type = type,
                            title = obj.optString("title", ""),
                            codeSnippet = if (obj.has("codeSnippet")) obj.getString("codeSnippet") else null,
                            codeLanguage = if (obj.has("codeLanguage")) obj.getString("codeLanguage") else null,
                            options = optionsList,
                            correctAnswerIndex = obj.optInt("correctAnswerIndex", 0),
                            explanation = obj.optString("explanation", ""),
                            proTip = if (obj.has("proTip")) obj.getString("proTip") else null
                        )
                    )
                }

                allQuestionsCache = list
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun loadQuiz(categoryId: String, mode: GameMode) {
        viewModelScope.launch {
            if (allQuestionsCache.isEmpty()) {
                withContext(Dispatchers.IO) {
                    loadAllQuestionsFromAssets()
                }
            }

            var filtered = if (categoryId == "all") {
                allQuestionsCache.shuffled()
            } else {
                allQuestionsCache.filter { it.category.id == categoryId }
            }

            if (mode == GameMode.DailyChallenge || filtered.isEmpty()) {
                filtered = allQuestionsCache.shuffled().take(5)
            } else if (mode == GameMode.TimeTrial) {
                filtered = allQuestionsCache.shuffled()
            }

            _uiState.update {
                it.copy(
                    questions = filtered,
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
