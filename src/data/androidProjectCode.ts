import { QUESTIONS_DATA } from './questionsData';

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
  workflow_dispatch:
    inputs:
      log_level:
        description: 'Nivel de logging de Gradle (info, debug, lifecycle)'
        required: false
        default: 'info'
        type: choice
        options:
          - 'info'
          - 'debug'
          - 'lifecycle'

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
            echo "Aviso: gradlew no encontrado. Generando wrapper automáticamente con Gradle 8.6..."
            gradle wrapper --gradle-version 8.6
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

      - name: 🔨 Compilar APK Debug con Logging Detallado
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          GRADLE_LOG_LEVEL: \${{ inputs.log_level || 'info' }}
        run: |
          echo "=== INICIANDO COMPILACIÓN GRADLE CON LOGGING DETALLADO ==="
          echo "Nivel: --\${GRADLE_LOG_LEVEL} --full-stacktrace --warning-mode all --no-daemon"
          ./gradlew assembleDebug --\${GRADLE_LOG_LEVEL} --full-stacktrace --warning-mode all --no-daemon

      - name: 📋 Diagnóstico y Extracción de Errores (si falla la compilación)
        if: failure()
        run: |
          echo "================================================================="
          echo "❌ ERROR DETECTADO DURANTE LA COMPILACIÓN DE GRADLE"
          echo "================================================================="
          if [ -d "app/build/reports" ]; then
            find app/build/reports -type f -exec echo ">>> Reporte: {}" \; -exec head -n 120 {} \;
          fi
          if [ -d "$HOME/.gradle/daemon" ]; then
            find "$HOME/.gradle/daemon" -type f -name "*.log" -exec echo ">>> Daemon log: {}" \; -exec tail -n 100 {} \;
          fi
          echo "================================================================="

      - name: 📦 Subir Reportes de Error como Artifact (si falla)
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: DevQuiz-Gradle-Failure-Logs
          path: |
            app/build/reports/
            **/build/reports/
            ~/.gradle/daemon/*.log
          retention-days: 7

      - name: 📦 Subir APK Debug como Artefacto Descargable
        if: success()
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
    path: 'app/src/main/java/com/devquiz/app/ui/theme/Theme.kt',
    name: 'Theme.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Tema oscuro permanente idéntico a la demo web con tokens Material 3.',
    content: `package com.devquiz.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val DarkBackground = Color(0xFF090D16)
val DarkSurface = Color(0xFF0F172A)
val DarkSurfaceVariant = Color(0xFF1E293B)
val EmeraldPrimary = Color(0xFF10B981)
val EmeraldDark = Color(0xFF059669)
val EmeraldAccent = Color(0xFF34D399)
val RoseBlitz = Color(0xFFF43F5E)
val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = EmeraldPrimary,
    onPrimary = Color(0xFF090D16),
    primaryContainer = Color(0xFF064E3B),
    onPrimaryContainer = Color(0xFFA7F3D0),
    secondary = EmeraldAccent,
    background = DarkBackground,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceVariant,
    onSurfaceVariant = TextSecondary,
    outline = Color(0xFF334155),
    error = RoseBlitz
)

@Composable
fun DevQuizTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/data/ApiKeyManager.kt',
    name: 'ApiKeyManager.kt',
    category: 'architecture',
    language: 'kotlin',
    description: 'Gestor seguro de clave Gemini API en SharedPreferences locales con fallback a BuildConfig.',
    content: `package com.devquiz.app.data

import android.content.Context
import android.content.SharedPreferences
import com.devquiz.app.BuildConfig

class ApiKeyManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("devquiz_prefs", Context.MODE_PRIVATE)

    fun getGeminiApiKey(): String {
        val userKey = getUserSavedKey()
        if (userKey.isNotEmpty()) {
            return userKey
        }
        val buildKey = BuildConfig.GEMINI_API_KEY.trim()
        if (buildKey.isNotEmpty() && buildKey != "YOUR_GEMINI_KEY_HERE") {
            return buildKey
        }
        return ""
    }

    fun getUserSavedKey(): String = prefs.getString(KEY_GEMINI, "")?.trim() ?: ""

    fun saveGeminiApiKey(key: String) {
        prefs.edit().putString(KEY_GEMINI, key.trim()).apply()
    }

    fun clearUserKey() {
        prefs.edit().remove(KEY_GEMINI).apply()
    }

    fun hasValidKey(): Boolean = getGeminiApiKey().isNotEmpty()

    fun isConfiguredViaBuildConfig(): Boolean {
        val buildKey = BuildConfig.GEMINI_API_KEY.trim()
        return buildKey.isNotEmpty() && buildKey != "YOUR_GEMINI_KEY_HERE"
    }

    companion object {
        private const val KEY_GEMINI = "gemini_api_key"
    }
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/data/FailedQuestionsManager.kt',
    name: 'FailedQuestionsManager.kt',
    category: 'architecture',
    language: 'kotlin',
    description: 'Gestor persistente de preguntas falladas en SharedPreferences con historial de errores, reintentos y eliminación al acertar.',
    content: `package com.devquiz.app.data

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

data class FailedQuestionItem(
    val questionId: String,
    val selectedOptionIndex: Int,
    val timestamp: Long = System.currentTimeMillis(),
    val failCount: Int = 1
)

class FailedQuestionsManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("devquiz_failed_prefs", Context.MODE_PRIVATE)

    fun getFailedQuestions(): List<FailedQuestionItem> {
        val jsonStr = prefs.getString(KEY_FAILED_LIST, "[]") ?: "[]"
        val list = mutableListOf<FailedQuestionItem>()
        try {
            val arr = JSONArray(jsonStr)
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                list.add(
                    FailedQuestionItem(
                        questionId = obj.getString("questionId"),
                        selectedOptionIndex = obj.optInt("selectedOptionIndex", -1),
                        timestamp = obj.optLong("timestamp", System.currentTimeMillis()),
                        failCount = obj.optInt("failCount", 1)
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return list
    }

    fun recordFailure(questionId: String, selectedOptionIndex: Int) {
        val currentList = getFailedQuestions().toMutableList()
        val existingIndex = currentList.indexOfFirst { it.questionId == questionId }
        if (existingIndex >= 0) {
            val existing = currentList[existingIndex]
            currentList[existingIndex] = existing.copy(
                selectedOptionIndex = selectedOptionIndex,
                failCount = existing.failCount + 1,
                timestamp = System.currentTimeMillis()
            )
        } else {
            currentList.add(
                FailedQuestionItem(
                    questionId = questionId,
                    selectedOptionIndex = selectedOptionIndex,
                    timestamp = System.currentTimeMillis(),
                    failCount = 1
                )
            )
        }
        saveList(currentList)
    }

    fun removeFailure(questionId: String) {
        val currentList = getFailedQuestions().filter { it.questionId != questionId }
        saveList(currentList)
    }

    fun clearAllFailures() {
        prefs.edit().remove(KEY_FAILED_LIST).apply()
    }

    fun getFailedCount(): Int = getFailedQuestions().size

    fun getFailedIds(): Set<String> = getFailedQuestions().map { it.questionId }.toSet()

    fun getFailureDetails(questionId: String): FailedQuestionItem? {
        return getFailedQuestions().find { it.questionId == questionId }
    }

    private fun saveList(list: List<FailedQuestionItem>) {
        val arr = JSONArray()
        for (item in list) {
            val obj = JSONObject()
            obj.put("questionId", item.questionId)
            obj.put("selectedOptionIndex", item.selectedOptionIndex)
            obj.put("timestamp", item.timestamp)
            obj.put("failCount", item.failCount)
            arr.put(obj)
        }
        prefs.edit().putString(KEY_FAILED_LIST, arr.toString()).apply()
    }

    companion object {
        private const val KEY_FAILED_LIST = "failed_questions_list"
    }
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Punto de entrada Activity con DevQuizTheme y MainScreen con soporte para Repaso de Errores y Blitz.',
    content: `package com.devquiz.app

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

                Surface(modifier = Modifier.fillMaxSize()) {
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

  {
    path: 'app/src/main/java/com/devquiz/app/presentation/home/HomeScreen.kt',
    name: 'HomeScreen.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Pantalla principal con Material 3, NavigationBar inferior con 4 pestañas y soporte para Blitz 60s.',
    content: `package com.devquiz.app.presentation.home

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
                        Text("DevQuiz", fontWeight = FontWeight.ExtraBold)
                        Text("Master Modern Coding", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                actions = {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Color(0xFFF59E0B).copy(alpha = 0.18f),
                        modifier = Modifier.padding(end = 16.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) {
                            Text("🔥", modifier = Modifier.padding(end = 4.dp))
                            Text("\${streakDays} días", fontWeight = FontWeight.Bold, color = Color(0xFFFBBF24), fontSize = 12.sp)
                        }
                    }
                }
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
                    val tabColor = if (tab == MainNavTab.BLITZ) Color(0xFFF43F5E) else MaterialTheme.colorScheme.primary

                    NavigationBarItem(
                        selected = isSelected,
                        onClick = {
                            if (tab == MainNavTab.BLITZ) onStartBlitz() else selectedTab = tab
                        },
                        icon = { Icon(tab.icon, contentDescription = tab.title, tint = if (isSelected) tabColor else MaterialTheme.colorScheme.outline) },
                        label = { Text(tab.title, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal, color = if (isSelected) tabColor else MaterialTheme.colorScheme.outline, fontSize = 11.sp) }
                    )
                }
            }
        }
    ) { padding ->
        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            when (selectedTab) {
                MainNavTab.HOME -> HomeContent(onCategorySelected = onCategorySelected, failedCount = viewModel.getFailedCount(), onStartFailedReview = onStartFailedReview)
                MainNavTab.BLITZ -> HomeContent(onCategorySelected = onCategorySelected, failedCount = viewModel.getFailedCount(), onStartFailedReview = onStartFailedReview)
                MainNavTab.STATS -> StatsScreen(viewModel = viewModel, streakDays = streakDays, onStartFailedReview = onStartFailedReview)
                MainNavTab.SETTINGS -> SettingsScreen(apiKeyManager = viewModel.apiKeyManager)
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
    LazyColumn(modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        item {
            Text("MODOS DE JUEGO", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
            Row(modifier = Modifier.fillMaxWidth().padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                GameModeCard("Práctica", "Sin reloj", "📖", Color(0xFF6366F1), Modifier.weight(1f)) { onCategorySelected(CategoryType.MODERN_FUNDAMENTALS, GameMode.Practice) }
                GameModeCard("Blitz 60s", "Contrarreloj", "⏱", Color(0xFFF43F5E), Modifier.weight(1f)) { onCategorySelected(CategoryType.SQL, GameMode.TimeTrial) }
                GameModeCard("Diario", "5 retos", "📅", Color(0xFF10B981), Modifier.weight(1f)) { onCategorySelected(CategoryType.SOLID, GameMode.DailyChallenge) }
                GameModeCard("Reintentar", if (failedCount > 0) "$failedCount pendientes" else "0 al día", "🎯", if (failedCount > 0) Color(0xFFF59E0B) else Color(0xFF10B981), Modifier.weight(1f)) { onStartFailedReview() }
            }
        }
        item {
            Text("CATEGORÍAS TÉCNICAS (13)", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
        }
        items(CategoryType.values().toList()) { category ->
            Card(
                modifier = Modifier.fillMaxWidth().clickable { onCategorySelected(category, GameMode.Practice) },
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Row(modifier = Modifier.padding(14.dp).fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Text(category.displayName, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f), fontSize = 13.sp)
                    Icon(Icons.Default.ChevronRight, contentDescription = null, tint = MaterialTheme.colorScheme.outline)
                }
            }
        }
    }
}

@Composable
fun GameModeCard(title: String, subtitle: String, emoji: String, color: Color, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(modifier = modifier.clickable { onClick() }, colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(14.dp), border = CardDefaults.outlinedCardBorder()) {
        Column(modifier = Modifier.padding(vertical = 12.dp, horizontal = 8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(emoji, fontSize = 20.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(title, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            Text(subtitle, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/presentation/settings/SettingsScreen.kt',
    name: 'SettingsScreen.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Pantalla de configuración para guardar la clave de Gemini en SharedPreferences y ver guía de CI/CD.',
    content: `package com.devquiz.app.presentation.settings

import android.content.Intent
import android.net.Uri
import android.widget.Toast
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.devquiz.app.data.ApiKeyManager

@Composable
fun SettingsScreen(apiKeyManager: ApiKeyManager) {
    val context = LocalContext.current
    var inputKey by remember { mutableStateOf(apiKeyManager.getUserSavedKey()) }
    val hasKey = apiKeyManager.hasValidKey()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Configuración", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)

        Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), border = CardDefaults.outlinedCardBorder()) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text("Tutor de IA (Gemini)", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Surface(shape = RoundedCornerShape(20.dp), color = if (hasKey) Color(0xFF10B981).copy(alpha = 0.2f) else Color(0xFFF59E0B).copy(alpha = 0.2f)) {
                        Text(if (hasKey) "● Activo" else "○ Clave Pendiente", color = if (hasKey) Color(0xFF34D399) else Color(0xFFFBBF24), fontSize = 11.sp, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                    }
                }
                Text("Ingresa tu clave de Google AI Studio para activar explicaciones técnicas en tu teléfono:", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                OutlinedTextField(
                    value = inputKey,
                    onValueChange = { inputKey = it },
                    label = { Text("Clave Gemini API") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )
                Button(
                    onClick = {
                        apiKeyManager.saveGeminiApiKey(inputKey)
                        Toast.makeText(context, "Clave guardada exitosamente", Toast.LENGTH_SHORT).show()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("Guardar Clave en Teléfono")
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/devquiz/app/presentation/stats/StatsScreen.kt',
    name: 'StatsScreen.kt',
    category: 'ui',
    language: 'kotlin',
    description: 'Pantalla de estadísticas con dominio técnico, aciertos y medallas.',
    content: `package com.devquiz.app.presentation.stats

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.devquiz.app.presentation.quiz.QuizViewModel

@Composable
fun StatsScreen(viewModel: QuizViewModel, streakDays: Int = 5) {
    val total = viewModel.getTotalAnswered()
    val correct = viewModel.getTotalCorrect()
    val accuracy = if (total > 0) (correct * 100) / total else 0

    Column(modifier = Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Estadísticas", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(14.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Total", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                    Text("$total", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                }
            }
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(14.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Precisión", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                    Text("$accuracy%", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF10B981))
                }
            }
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(14.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Racha", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                    Text("🔥 $streakDays", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFFF59E0B))
                }
            }
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
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding(),
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "\${state.currentIndex + 1}/\${state.questions.size}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(
                        onClick = onNavigateBack,
                        modifier = Modifier.size(48.dp)
                    ) {
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
            Surface(
                tonalElevation = 8.dp,
                modifier = Modifier.navigationBarsPadding()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (state.isAnswerConfirmed) {
                        OutlinedButton(
                            onClick = { onEvent(QuizUiEvent.RequestAiExplanation) },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Tutor IA", fontWeight = FontWeight.SemiBold)
                        }
                        Button(
                            onClick = { onEvent(QuizUiEvent.NextQuestion) },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.primary,
                                contentColor = Color(0xFF090D16)
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Siguiente ➔", fontWeight = FontWeight.Bold)
                        }
                    } else {
                        Button(
                            onClick = { onEvent(QuizUiEvent.ConfirmAnswer) },
                            enabled = state.selectedOptionIndex != null,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = MaterialTheme.colorScheme.primary,
                                contentColor = Color(0xFF090D16)
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Comprobar Respuesta", fontWeight = FontWeight.Bold)
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
                    .clip(RoundedCornerShape(3.dp)),
                color = MaterialTheme.colorScheme.primary
            )

            // Zero-Pill Typography Kicker (Anti-Slop Discipline)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.padding(vertical = 2.dp)
            ) {
                Text(
                    text = currentQuestion.category.displayName,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "·",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                )
                Text(
                    text = when (currentQuestion.difficulty.name) {
                        "Junior" -> "Nivel Inicial"
                        "Mid" -> "Nivel Medio"
                        else -> "Nivel Senior"
                    },
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
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
    description: 'Dataset preempaquetado para Room con 13 categorías técnicas (mínimo 20 preguntas por categoría) y formato offline.',
    content: JSON.stringify(QUESTIONS_DATA, null, 2)
  }
];
