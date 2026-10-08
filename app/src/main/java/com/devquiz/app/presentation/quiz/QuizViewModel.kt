package com.devquiz.app.presentation.quiz

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.devquiz.app.data.ApiKeyManager
import com.devquiz.app.data.FailedQuestionItem
import com.devquiz.app.data.FailedQuestionsManager
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

    val apiKeyManager = ApiKeyManager(application)
    val failedQuestionsManager = FailedQuestionsManager(application)
    private val statsPrefs = application.getSharedPreferences("devquiz_stats", Context.MODE_PRIVATE)

    private var timerJob: Job? = null
    private var allQuestionsCache: List<Question> = emptyList()

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
                            codeSnippet = if (obj.has("codeSnippet") && !obj.isNull("codeSnippet")) obj.getString("codeSnippet") else null,
                            codeLanguage = if (obj.has("codeLanguage") && !obj.isNull("codeLanguage")) obj.getString("codeLanguage") else null,
                            options = optionsList,
                            correctAnswerIndex = obj.optInt("correctAnswerIndex", 0),
                            explanation = obj.optString("explanation", ""),
                            proTip = if (obj.has("proTip") && !obj.isNull("proTip")) obj.getString("proTip") else null
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
                    userAnswers = emptyList(),
                    aiExplanationText = null,
                    isAiLoading = false,
                    aiError = null,
                    previousWrongOptionIndex = null,
                    justMasteredQuestion = false
                )
            }

            if (mode == GameMode.TimeTrial) {
                startTimer()
            }
        }
    }

    fun loadFailedQuiz() {
        viewModelScope.launch {
            if (allQuestionsCache.isEmpty()) {
                withContext(Dispatchers.IO) {
                    loadAllQuestionsFromAssets()
                }
            }

            val failedIds = failedQuestionsManager.getFailedIds()
            val filtered = allQuestionsCache.filter { it.id in failedIds }

            if (filtered.isNotEmpty()) {
                val firstQ = filtered.firstOrNull()
                val prevWrong = firstQ?.let { failedQuestionsManager.getFailureDetails(it.id)?.selectedOptionIndex }

                _uiState.update {
                    it.copy(
                        questions = filtered,
                        currentIndex = 0,
                        selectedOptionIndex = null,
                        isAnswerConfirmed = false,
                        score = 0,
                        gameMode = GameMode.FailedReview,
                        timeRemainingSeconds = 0,
                        isGameOver = false,
                        userAnswers = emptyList(),
                        aiExplanationText = null,
                        isAiLoading = false,
                        aiError = null,
                        previousWrongOptionIndex = prevWrong,
                        justMasteredQuestion = false
                    )
                }
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
            is QuizUiEvent.DismissAiDialog -> _uiState.update { it.copy(aiExplanationText = null, aiError = null, isAiLoading = false) }
            is QuizUiEvent.RestartQuiz -> {
                val mode = _uiState.value.gameMode
                if (mode == GameMode.FailedReview) {
                    loadFailedQuiz()
                } else {
                    loadQuiz("all", mode)
                }
            }
        }
    }

    fun resetToHome() {
        timerJob?.cancel()
        _uiState.update {
            it.copy(
                questions = emptyList(),
                currentIndex = 0,
                selectedOptionIndex = null,
                isAnswerConfirmed = false,
                score = 0,
                isGameOver = false,
                userAnswers = emptyList(),
                aiExplanationText = null,
                isAiLoading = false,
                aiError = null,
                previousWrongOptionIndex = null,
                justMasteredQuestion = false
            )
        }
    }

    private fun confirmCurrentAnswer() {
        val state = _uiState.value
        val currentQ = state.currentQuestion ?: return
        val selectedIdx = state.selectedOptionIndex ?: return

        val isCorrect = selectedIdx == currentQ.correctAnswerIndex
        val updatedAnswers = state.userAnswers + UserAnswerRecord(currentQ, selectedIdx, isCorrect)

        // Registrar fallo o superación
        if (!isCorrect) {
            failedQuestionsManager.recordFailure(currentQ.id, selectedIdx)
        } else if (state.gameMode == GameMode.FailedReview) {
            failedQuestionsManager.removeFailure(currentQ.id)
        }

        // Persist stats
        recordAnswerStat(currentQ.category.id, isCorrect)

        _uiState.update {
            it.copy(
                isAnswerConfirmed = true,
                score = if (isCorrect) it.score + 100 else it.score,
                streak = if (isCorrect) it.streak + 1 else 0,
                userAnswers = updatedAnswers,
                justMasteredQuestion = isCorrect && state.gameMode == GameMode.FailedReview
            )
        }
    }

    private fun recordAnswerStat(categoryId: String, isCorrect: Boolean) {
        val total = statsPrefs.getInt("total_answered", 0) + 1
        val correct = statsPrefs.getInt("total_correct", 0) + (if (isCorrect) 1 else 0)
        val catTotal = statsPrefs.getInt("cat_${categoryId}_total", 0) + 1
        val catCorrect = statsPrefs.getInt("cat_${categoryId}_correct", 0) + (if (isCorrect) 1 else 0)

        statsPrefs.edit()
            .putInt("total_answered", total)
            .putInt("total_correct", correct)
            .putInt("cat_${categoryId}_total", catTotal)
            .putInt("cat_${categoryId}_correct", catCorrect)
            .apply()
    }

    fun getTotalAnswered(): Int = statsPrefs.getInt("total_answered", 0)
    fun getTotalCorrect(): Int = statsPrefs.getInt("total_correct", 0)
    fun getCategoryStats(catId: String): Pair<Int, Int> {
        val total = statsPrefs.getInt("cat_${catId}_total", 0)
        val correct = statsPrefs.getInt("cat_${catId}_correct", 0)
        return Pair(total, correct)
    }

    fun getFailedCount(): Int = failedQuestionsManager.getFailedCount()
    fun getFailedQuestionsWithDetails(): List<Pair<Question, FailedQuestionItem>> {
        val failed = failedQuestionsManager.getFailedQuestions()
        return failed.mapNotNull { item ->
            val q = allQuestionsCache.find { it.id == item.questionId }
            if (q != null) Pair(q, item) else null
        }
    }

    private fun moveToNextQuestion() {
        val state = _uiState.value
        val nextIdx = state.currentIndex + 1

        if (nextIdx >= state.questions.size) {
            timerJob?.cancel()
            _uiState.update { it.copy(isGameOver = true) }
        } else {
            val nextQ = state.questions.getOrNull(nextIdx)
            val prevWrong = if (state.gameMode == GameMode.FailedReview && nextQ != null) {
                failedQuestionsManager.getFailureDetails(nextQ.id)?.selectedOptionIndex
            } else null

            _uiState.update {
                it.copy(
                    currentIndex = nextIdx,
                    selectedOptionIndex = null,
                    isAnswerConfirmed = false,
                    aiExplanationText = null,
                    aiError = null,
                    isAiLoading = false,
                    previousWrongOptionIndex = prevWrong,
                    justMasteredQuestion = false
                )
            }
        }
    }

    private fun fetchAiExplanation() {
        val currentQ = _uiState.value.currentQuestion ?: return
        val selectedIdx = _uiState.value.selectedOptionIndex
        val apiKey = apiKeyManager.getGeminiApiKey()

        if (apiKey.isEmpty()) {
            _uiState.update {
                it.copy(
                    isAiLoading = false,
                    aiExplanationText = null,
                    aiError = "Clave de Gemini no configurada.\n\nPara activar el Tutor de IA en tu dispositivo, ingresa tu clave gratuita de Google AI Studio en la pestaña 'Ajustes' de la app (o inclúyela como secreto GEMINI_API_KEY al compilar el APK)."
                )
            }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isAiLoading = true, aiError = null, aiExplanationText = null) }
            try {
                val prompt = """
                    Actúa como un Senior Software Architect y Tutor Técnico.
                    Explica de forma didáctica esta pregunta de examen técnico para desarrolladores:
                    Categoría: ${currentQ.category.displayName}
                    Pregunta: "${currentQ.title}"
                    Código: ${currentQ.codeSnippet ?: "N/A"}
                    Respuesta seleccionada: ${selectedIdx?.let { currentQ.options.getOrNull(it) } ?: "Ninguna"}
                    Respuesta Correcta: ${currentQ.options[currentQ.correctAnswerIndex]}
                    Explicación técnica: ${currentQ.explanation}

                    Estructura tu respuesta en exactamente 3 secciones concisas en español:
                    1. ¿Por qué es la respuesta correcta?
                    2. Trampa conceptual o error común en entrevistas.
                    3. Pro-Tip para entornos de producción.
                """.trimIndent()

                val text = withContext(Dispatchers.IO) {
                    try {
                        val generativeModel = GenerativeModel(
                            modelName = "gemini-2.5-flash",
                            apiKey = apiKey
                        )
                        generativeModel.generateContent(prompt).text
                    } catch (primaryError: Exception) {
                        // Reintento resiliente con gemini-flash-latest
                        try {
                            val fallbackModel = GenerativeModel(
                                modelName = "gemini-flash-latest",
                                apiKey = apiKey
                            )
                            fallbackModel.generateContent(prompt).text
                        } catch (_: Exception) {
                            throw primaryError
                        }
                    }
                }

                if (text.isNullOrBlank()) {
                    throw IllegalStateException("El Tutor no retornó texto. Por favor reintenta.")
                }

                _uiState.update {
                    it.copy(isAiLoading = false, aiExplanationText = text, aiError = null)
                }
            } catch (e: Exception) {
                e.printStackTrace()
                val friendlyError = when {
                    e is java.net.UnknownHostException || e is java.io.IOException ->
                        "Sin conexión a internet. Verifica que tu teléfono tenga Wi-Fi o datos móviles activos para consultar a Gemini."
                    e.message?.contains("API_KEY_INVALID", ignoreCase = true) == true ||
                    e.message?.contains("API key not valid", ignoreCase = true) == true ->
                        "La clave de Gemini no es válida. Ve a la pestaña 'Ajustes' en la app y escribe una clave válida de Google AI Studio."
                    e.message?.contains("RESOURCE_EXHAUSTED", ignoreCase = true) == true ||
                    e.message?.contains("quota", ignoreCase = true) == true ->
                        "Se ha excedido el límite temporal de solicitudes a Gemini. Espera unos segundos y vuelve a intentar."
                    else ->
                        "Error al consultar al Tutor de IA: ${e.localizedMessage ?: e.message ?: "Fallo de comunicación"}"
                }
                _uiState.update {
                    it.copy(isAiLoading = false, aiError = friendlyError, aiExplanationText = null)
                }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}
