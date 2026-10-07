package com.devquiz.app.data

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
}
