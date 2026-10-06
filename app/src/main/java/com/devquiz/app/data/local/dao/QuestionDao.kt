package com.devquiz.app.data.local.dao

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
}
