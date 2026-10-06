package com.devquiz.app.data.local.entity

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
    val optionsJson: String,
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
}
