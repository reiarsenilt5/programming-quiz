export interface AndroidCodeFile {
  path: string;
  name: string;
  category: 'architecture' | 'model' | 'viewmodel' | 'ui' | 'gradle' | 'json';
  language: 'kotlin' | 'groovy' | 'json' | 'toml' | 'xml';
  content: string;
  description: string;
}

export const ANDROID_FILES: AndroidCodeFile[] = [
  // 0. CI/CD GITHUB ACTIONS (RESILIENTE & AUTO-REPARADOR)
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml',
    category: 'gradle',
    language: 'yaml' as any,
    description: 'Pipeline de GitHub Actions con auto-reparación y generación automática de gradlew para garantizar la APK.',
    content: `name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch: # Permite compilar manualmente con un clic en GitHub Actions

jobs:
  build:
    name: Compilar APK (Debug)
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Clonar repositorio
        uses: actions/checkout@v4

      - name: ☕ Configurar JDK 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: 🐘 Configurar Gradle Oficial
        uses: gradle/actions/setup-gradle@v3

      - name: 🛡️ Auto-generar Gradle Wrapper si no fue subido a Git
        run: |
          if [ ! -f "gradlew" ]; then
            echo "Aviso: gradlew no encontrado. Generando wrapper automáticamente..."
            gradle wrapper --gradle-version 8.3
          fi
          chmod +x gradlew

      - name: ⚙️ Configurar local.properties seguro
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
        run: |
          touch local.properties
          echo "sdk.dir=\${ANDROID_HOME}" >> local.properties
          if [ -n "\${GEMINI_API_KEY}" ]; then
            echo "gemini.api.key=\${GEMINI_API_KEY}" >> local.properties
          fi

      - name: 🔨 Compilar APK Debug
        run: ./gradlew assembleDebug --stacktrace

      - name: 📦 Subir APK Debug como Artefacto Descargable
        uses: actions/upload-artifact@v4
        with:
          name: DevQuiz-Debug-APK
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
`
  },

  // 1. PROJECT STRUCTURE & GRADLE
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'gradle',
    language: 'kotlin',
    description: 'Configuración global de repositorios y módulos del proyecto Gradle.',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "DevQuiz"
include(":app")`
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Raíz)',
    category: 'gradle',
    language: 'kotlin',
    description: 'Build script raíz que orquesta los plugins de Android, Kotlin, Hilt y KSP.',
    content: `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.hilt.android) apply false
    alias(libs.plugins.ksp) apply false
}`
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    name: 'gradle-wrapper.properties',
    category: 'gradle',
    language: 'groovy',
    description: 'Versión de Gradle fijada en 8.6 para compatibilidad garantizada con AGP 8.3.',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.6-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
  },
  {
    path: 'gradle.properties',
    name: 'gradle.properties',
    category: 'gradle',
    language: 'groovy',
    description: 'Configuración crítica de Gradle: activa android.useAndroidX=true para resolver compilación en CI.',
    content: `# Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8

# AndroidX enabled (Obligatorio para evitar fallo de CI)
android.useAndroidX=true
android.nonTransitiveRClass=true

# Kotlin settings
kotlin.code.style=official`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'ui',
    language: 'xml',
    description: 'Manifiesto de Android con permisos de Internet y configuración de Activity.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".DevQuizApp"
        android:allowBackup="true"
        android:icon="@android:drawable/sym_def_app_icon"
        android:label="DevQuiz"
        android:roundIcon="@android:drawable/sym_def_app_icon"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@android:style/Theme.Material.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/DevQuizApp.kt',
    name: 'DevQuizApp.kt',
    category: 'architecture',
    language: 'kotlin',
    description: 'Clase de aplicación con @HiltAndroidApp para inicializar la inyección de dependencias.',
    content: `package com.devquiz.app

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class DevQuizApp : Application()`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Punto de entrada Activity que enlaza Jetpack Compose con el ViewModel de Hilt.',
    content: `package com.devquiz.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
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
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val viewModel: QuizViewModel by viewModels()

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
}`
  },
  {
    path: 'gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    category: 'gradle',
    language: 'toml',
    description: 'Gradle Version Catalog moderno con dependencias estandarizadas.',
    content: `[versions]
agp = "8.3.1"
kotlin = "1.9.23"
coreKtx = "1.12.0"
lifecycleRuntimeKtx = "2.7.0"
activityCompose = "1.8.2"
composeBom = "2024.02.02"
room = "2.6.1"
hilt = "2.51"
hiltNavigationCompose = "1.2.0"
navigationCompose = "2.7.7"
coroutines = "1.8.0"
kotlinxSerialization = "1.6.3"
generativeAi = "0.2.2"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }

# Room Database
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

# Hilt Dependency Injection
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-compiler", version.ref = "hilt" }
androidx-hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }

# Kotlinx Coroutines & Serialization
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
kotlinx-serialization-json = { group = "org.jetbrains.kotlinx", name = "kotlinx-serialization-json", version.ref = "kotlinxSerialization" }

# Google Generative AI (Gemini SDK para Android)
google-generativeai = { group = "com.google.ai.client.generativeai", name = "generativeai", version.ref = "generativeAi" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
hilt-android = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
ksp = { id = "com.google.devtools.ksp", version = "1.9.23-1.0.20" }`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'gradle',
    language: 'kotlin',
    description: 'Configuración del módulo principal de la app Android con Jetpack Compose y dependencias.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.devquiz.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.devquiz.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Variable para Gemini API Key definida en local.properties
        buildConfigField("String", "GEMINI_API_KEY", "\"YOUR_GEMINI_KEY_HERE\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.11"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Hilt DI
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.hilt.navigation.compose)

    // Coroutines & Serialization
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)

    // Gemini AI Client SDK (Android)
    implementation(libs.google.generativeai)
}`
  },

  // 2. DOMAIN & DATA MODELS
  {
    path: 'app/src/main/java/com/devquiz/app/domain/model/Question.kt',
    name: 'Question.kt',
    category: 'model',
    language: 'kotlin',
    description: 'Modelo de Dominio inmutable para Preguntas, Categorías y Dificultad.',
    content: `package com.devquiz.app.domain.model

enum class CategoryType(val id: String, val displayName: String) {
    PYTHON("python", "Python Moderno"),
    PHP("php", "PHP 8+ & OOP"),
    JAVASCRIPT("javascript", "JavaScript Core"),
    TYPESCRIPT("typescript", "TypeScript Avanzado"),
    REACT("react", "React & Ecosystem"),
    SQL("sql", "SQL & Bases de Datos"),
    SOLID("solid", "Principios SOLID"),
    MODERN_FUNDAMENTALS("modern_fundamentals", "Fundamentos & Git"),
    AI_ASSISTANCE("ai_assistance", "IA para Programadores"),
    SENIOR_FULLSTACK("senior_fullstack", "Fullstack Senior (React, Python, Laravel)"),
    DEVOPS_CLOUD("devops_cloud", "DevOps & Cloud (Linux, Docker, K8s)"),
    SUBTLE_ENGINEERING("subtle_engineering", "Sutilezas Pro & Trucos de Producción"),
    DOCKER_MASTERY("docker_mastery", "Docker & Containers Mastery");

    companion object {
        fun fromId(id: String): CategoryType =
            values().find { it.id == id } ?: MODERN_FUNDAMENTALS
    }
}

enum class DifficultyLevel {
    Junior, Mid, Senior
}

enum class QuestionType {
    MultipleChoice, FindTheBug, TrueFalse
}

enum class GameMode {
    Practice, TimeTrial, DailyChallenge
}

data class Question(
    val id: String,
    val category: CategoryType,
    val difficulty: DifficultyLevel,
    val type: QuestionType,
    val title: String,
    val codeSnippet: String? = null,
    val codeLanguage: String? = null,
    val options: List<String>,
    val correctAnswerIndex: Int,
    val explanation: String,
    val proTip: String? = null
)`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/data/local/entity/QuestionEntity.kt',
    name: 'QuestionEntity.kt',
    category: 'model',
    language: 'kotlin',
    description: 'Entidad de persistencia Room con soporte offline y TypeConverters para listas.',
    content: `package com.devquiz.app.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverter
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Entity(tableName = "questions")
data class QuestionEntity(
    @PrimaryKey
    val id: String,
    val categoryId: String,
    val difficulty: String,
    val type: String,
    val title: String,
    val codeSnippet: String?,
    val codeLanguage: String?,
    val optionsJson: String, // Almacenado como JSON en SQLite
    val correctAnswerIndex: Int,
    val explanation: String,
    val proTip: String?,
    val isAnswered: Boolean = false,
    val isCorrect: Boolean = false
)

class Converters {
    private val json = Json { ignoreUnknownKeys = true }

    @TypeConverter
    fun fromStringList(value: List<String>): String = json.encodeToString(value)

    @TypeConverter
    fun toStringList(value: String): List<String> = json.decodeFromString(value)
}`
  },

  // 3. ROOM DATABASE & DAO
  {
    path: 'app/src/main/java/com/devquiz/app/data/local/dao/QuestionDao.kt',
    name: 'QuestionDao.kt',
    category: 'model',
    language: 'kotlin',
    description: 'Data Access Object (DAO) con consultas reactivas con Flow y filtros.',
    content: `package com.devquiz.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.devquiz.app.data.local.entity.QuestionEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface QuestionDao {
    @Query("SELECT * FROM questions WHERE categoryId = :categoryId")
    fun getQuestionsByCategory(categoryId: String): Flow<List<QuestionEntity>>

    @Query("SELECT * FROM questions WHERE categoryId = :categoryId AND difficulty = :difficulty")
    fun getQuestionsByFilter(categoryId: String, difficulty: String): Flow<List<QuestionEntity>>

    @Query("SELECT * FROM questions ORDER BY RANDOM() LIMIT :limit")
    suspend fun getRandomQuestions(limit: Int): List<QuestionEntity>

    @Query("SELECT COUNT(*) FROM questions")
    suspend fun getCount(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(questions: List<QuestionEntity>)
}`
  },

  // 4. VIEWMODEL & STATE MANAGEMENT
  {
    path: 'app/src/main/java/com/devquiz/app/presentation/quiz/QuizUiState.kt',
    name: 'QuizUiState.kt',
    category: 'viewmodel',
    language: 'kotlin',
    description: 'Estados de UI y eventos de usuario (MVI / Unidirectional Data Flow).',
    content: `package com.devquiz.app.presentation.quiz

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
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/presentation/quiz/QuizViewModel.kt',
    name: 'QuizViewModel.kt',
    category: 'viewmodel',
    language: 'kotlin',
    description: 'ViewModel con Hilt, StateFlow, Coroutines, gestión de temporizador y llamada al tutor de Gemini.',
    content: `package com.devquiz.app.presentation.quiz

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devquiz.app.domain.model.GameMode
import com.devquiz.app.domain.model.Question
import com.devquiz.app.domain.repository.QuizRepository
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
    private val repository: QuizRepository,
    private val geminiModel: GenerativeModel // Inyectado con "gemini-3.8-flash"
) : ViewModel() {

    private val _uiState = MutableStateFlow(QuizUiState())
    val uiState: StateFlow<QuizUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null

    fun loadQuiz(categoryId: String, mode: GameMode) {
        viewModelScope.launch {
            val questions = repository.getQuestionsForGame(categoryId, mode)
            _uiState.update {
                it.copy(
                    questions = questions,
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
                    Categoría: ${'$'}{currentQ.category.displayName}
                    Pregunta: "${'$'}{currentQ.title}"
                    Código: ${'$'}{currentQ.codeSnippet ?: "N/A"}
                    Respuesta del usuario: ${'$'}{selectedIdx?.let { currentQ.options.getOrNull(it) } ?: "Ninguna"}
                    Respuesta Correcta: ${'$'}{currentQ.options[currentQ.correctAnswerIndex]}
                    Explicación breve: ${'$'}{currentQ.explanation}

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
}`
  },

  // 5. JETPACK COMPOSE SCREENS
  {
    path: 'app/src/main/java/com/devquiz/app/presentation/home/HomeScreen.kt',
    name: 'HomeScreen.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Pantalla principal con Material Design 3, selector de modos, racha y categorías.',
    content: `package com.devquiz.app.presentation.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.devquiz.app.domain.model.CategoryType
import com.devquiz.app.domain.model.GameMode

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    streakDays: Int = 5,
    accuracyPercent: Int = 84,
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
                    // Chip de Racha (Streak)
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
                                "\${streakDays} días",
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
            // Sección: Selector de Modos de Juego
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
                        icon = Icons.Default.MenuBook,
                        modifier = Modifier.weight(1f),
                        onClick = { onCategorySelected(CategoryType.MODERN_FUNDAMENTALS, GameMode.Practice) }
                    )
                    GameModeCard(
                        title = "Contrarreloj",
                        subtitle = "60 Segundos",
                        icon = Icons.Default.Timer,
                        modifier = Modifier.weight(1f),
                        onClick = { onCategorySelected(CategoryType.MODERN_FUNDAMENTALS, GameMode.TimeTrial) }
                    )
                    GameModeCard(
                        title = "Diario",
                        subtitle = "5 Retos",
                        icon = Icons.Default.CalendarToday,
                        modifier = Modifier.weight(1f),
                        onClick = { onCategorySelected(CategoryType.AI_ASSISTANCE, GameMode.DailyChallenge) }
                    )
                }
            }

            // Sección: Categorías
            item {
                Text(
                    "Categorías de Conocimiento",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(CategoryType.entries) { category ->
                CategoryRowItem(
                    category = category,
                    onClick = { onCategorySelected(category, GameMode.Practice) }
                )
            }
        }
    }
}

@Composable
fun GameModeCard(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
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
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.height(6.dp))
            Text(title, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelLarge)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.outline)
        }
    }
}

@Composable
fun CategoryRowItem(
    category: CategoryType,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(category.displayName, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
            Icon(Icons.Default.ChevronRight, contentDescription = null)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/presentation/quiz/QuizScreen.kt',
    name: 'QuizScreen.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Pantalla de Pregunta con bloque de código sintáctico, opciones interactivas y Tutor de IA.',
    content: `package com.devquiz.app.presentation.quiz

import androidx.compose.foundation.background
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
                        "\${state.currentIndex + 1}/\${state.questions.size}",
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
                            "⏱ \${state.timeRemainingSeconds}s",
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

            // Dificultad y Tipo
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AssistChip(
                    onClick = {},
                    label = { Text(currentQuestion.difficulty.name) }
                )
                AssistChip(
                    onClick = {},
                    label = { Text(currentQuestion.category.displayName) }
                )
            }

            // Pregunta
            Text(
                text = currentQuestion.title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            // Bloque de Código (si existe)
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

            // Opciones
            currentQuestion.options.forEachIndexed { index, optionText ->
                OptionItemCard(
                    index = index,
                    text = optionText,
                    isSelected = state.selectedOptionIndex == index,
                    isConfirmed = state.isAnswerConfirmed,
                    isCorrect = index == currentQuestion.correctAnswerIndex,
                    onClick = { onEvent(QuizUiEvent.SelectOption(index)) }
                )
            }

            // Explicación Inmediata al confirmar
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

    // Modal / BottomSheet de Tutor con Gemini IA
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

@Composable
fun OptionItemCard(
    index: Int,
    text: String,
    isSelected: Boolean,
    isConfirmed: Boolean,
    isCorrect: Boolean,
    onClick: () -> Unit
) {
    val borderColor = when {
        isConfirmed && isCorrect -> Color(0xFF4CAF50)
        isConfirmed && isSelected && !isCorrect -> Color(0xFFE53935)
        isSelected -> MaterialTheme.colorScheme.primary
        else -> MaterialTheme.colorScheme.outlineVariant
    }

    val backgroundColor = when {
        isConfirmed && isCorrect -> Color(0xFFE8F5E9)
        isConfirmed && isSelected && !isCorrect -> Color(0xFFFFEBEE)
        isSelected -> MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
        else -> MaterialTheme.colorScheme.surface
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = !isConfirmed) { onClick() }
            .border(1.5.dp, borderColor, RoundedCornerShape(12.dp)),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "\${('A' + index)}.",
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(end = 12.dp)
            )
            Text(text, modifier = Modifier.weight(1f))
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/presentation/result/ResultScreen.kt',
    name: 'ResultScreen.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Pantalla de Resultados con desglose analítico de aciertos y revisión de errores.',
    content: `package com.devquiz.app.presentation.result

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
                    Text("\$percentage%", style = MaterialTheme.typography.displayLarge, fontWeight = FontWeight.ExtraBold)
                    Text("\$correct de \$total respuestas correctas", style = MaterialTheme.typography.bodyLarge)
                    Text("Puntos totales: \${state.score} pts", fontWeight = FontWeight.SemiBold)
                }
            }

            // Desglose de respuestas
            Text("Desglose del Examen", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)

            state.userAnswers.forEachIndexed { i, record ->
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
                            Text("Tu resp: \${record.question.options.getOrNull(record.selectedIndex) ?: \"-\"}", style = MaterialTheme.typography.bodySmall)
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
}`
  },

  // 6. JSON ASSET FILE
  {
    path: 'app/src/main/assets/questions.json',
    name: 'questions.json',
    category: 'json',
    language: 'json',
    description: 'Dataset preempaquetado para Room con las 7 categorías requeridas y formato offline.',
    content: JSON.stringify(
      [
        {
          id: "py-01",
          categoryId: "python",
          categoryName: "Python Moderno",
          difficulty: "Mid",
          type: "find_the_bug",
          title: "¿Cuál es el bug de diseño en la siguiente función con parámetros por defecto?",
          codeLanguage: "python",
          codeSnippet: "def registrar_evento(evento: str, log: list[str] = []) -> list[str]:\n    log.append(evento)\n    return log",
          options: [
            "Lanza un TypeError porque list[str] no se puede instanciar.",
            "Imprime ['A', 'B'] en la segunda llamada porque la lista por defecto es mutable y compartida.",
            "Imprime solo ['B'] porque se reevalúa en cada invocación.",
            "Genera un MemoryLeak en garbage collection."
          ],
          correctAnswerIndex: 1,
          explanation: "En Python, los argumentos por defecto se evalúan una sola vez al definir la función. Si es mutable, todas las llamadas sin argumento comparten la misma instancia."
        },
        {
          id: "php-01",
          categoryId: "php",
          categoryName: "PHP 8+ & OOP",
          difficulty: "Mid",
          type: "multiple_choice",
          title: "¿Qué característica moderna de PHP 8.0 simplifica la inicialización de propiedades en clases?",
          codeLanguage: "php",
          codeSnippet: "class UsuarioDTO {\n    public function __construct(\n        public readonly string $id,\n        public readonly string $email\n    ) {}\n}",
          options: [
            "Property Promotion (Constructor Promotion) junto con propiedades readonly.",
            "Anonymous Classes con auto-getters del motor Zend.",
            "Dynamic Attribute Binding de PHP 7.4.",
            "Virtual Properties de Symfony."
          ],
          correctAnswerIndex: 0,
          explanation: "Constructor Property Promotion permite definir visibilidad en los parámetros del constructor y asignarlos automáticamente."
        },
        {
          id: "js-01",
          categoryId: "javascript",
          categoryName: "JavaScript Core",
          difficulty: "Senior",
          type: "multiple_choice",
          title: "¿Cuál es el orden de salida en consola según la especificación del Event Loop?",
          codeLanguage: "javascript",
          codeSnippet: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
          options: [
            "1, 4, 2, 3",
            "1, 4, 3, 2",
            "1, 2, 3, 4",
            "1, 3, 4, 2"
          ],
          correctAnswerIndex: 1,
          explanation: "Síncrono (1, 4) > Microtasks de Promise (3) > Macrotasks de setTimeout (2)."
        },
        {
          id: "ts-01",
          categoryId: "typescript",
          categoryName: "TypeScript Avanzado",
          difficulty: "Senior",
          type: "multiple_choice",
          title: "¿Cuál es el propósito del operador satisfies introducido en TypeScript 4.9?",
          codeLanguage: "typescript",
          codeSnippet: "const theme = {\n  primary: [255, 0, 0],\n} satisfies Palette;",
          options: [
            "Valida compatibilidad con un tipo preservando el tipo inferido exacto de sus propiedades.",
            "Es un alias idéntico al type casting 'as Palette'.",
            "Convierte el objeto en inmutable en runtime.",
            "Valida esquemas en tiempo de ejecución."
          ],
          correctAnswerIndex: 0,
          explanation: "El operador satisfies valida sin ensanchar (widening) los tipos, permitiendo autocompletado y métodos específicos de array."
        },
        {
          id: "react-01",
          categoryId: "react",
          categoryName: "React & Ecosystem",
          difficulty: "Mid",
          type: "find_the_bug",
          title: "¿Qué ocurre si llamas 3 veces consecutivas a setCount(count + 1) en el mismo handler?",
          codeLanguage: "tsx",
          codeSnippet: "const handleClick = () => {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n};",
          options: [
            "Incrementa en 3.",
            "Solo incrementa en 1, porque todas leen el mismo valor de count del render actual.",
            "Lanza un error de recursión infinita.",
            "El componente se desmonta."
          ],
          correctAnswerIndex: 1,
          explanation: "En cada frame, count es constante. Para encadenar updates dependientes del estado previo, usa setCount(prev => prev + 1)."
        },
        {
          id: "fund-01",
          categoryId: "modern_fundamentals",
          categoryName: "Fundamentos Modernos",
          difficulty: "Mid",
          type: "multiple_choice",
          title: "En Clean Architecture, ¿hacia dónde deben apuntar siempre las dependencias del código?",
          options: [
            "Hacia adentro, hacia las entidades y reglas de negocio del dominio.",
            "Hacia afuera, hacia los frameworks y bases de datos.",
            "Hacia la base de datos SQL para optimizar consultas.",
            "Entre capas de forma bidireccional."
          ],
          correctAnswerIndex: 0,
          explanation: "La Dependency Rule estipula que las dependencias solo pueden apuntar hacia adentro: el Dominio nunca debe conocer Room, UI ni APIs externas."
        },
        {
          id: "ai-01",
          categoryId: "ai_assistance",
          categoryName: "IA para Programadores",
          difficulty: "Mid",
          type: "multiple_choice",
          title: "¿Qué es un Package Hallucination Attack generado por LLMs?",
          options: [
            "Atacantes registran nombres de paquetes inventados por LLMs con malware en npm/PyPI.",
            "Un error de cache en el package-lock.json.",
            "Una degradación de memoria del modelo de lenguaje.",
            "Un fallo de GPU en el servidor de inferencia."
          ],
          correctAnswerIndex: 0,
          explanation: "Los atacantes publican paquetes maliciosos usando nombres ficticios que los LLMs recomiendan con frecuencia en sus respuestas."
        }
      ],
      null,
      2
    )
  }
];
