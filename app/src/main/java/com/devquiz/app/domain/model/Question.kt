package com.devquiz.app.domain.model

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
    Practice, TimeTrial, DailyChallenge, FailedReview
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
)
