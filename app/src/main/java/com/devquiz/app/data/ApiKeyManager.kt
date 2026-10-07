package com.devquiz.app.data

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

    fun getUserSavedKey(): String {
        return prefs.getString(KEY_GEMINI, "")?.trim() ?: ""
    }

    fun saveGeminiApiKey(key: String) {
        prefs.edit().putString(KEY_GEMINI, key.trim()).apply()
    }

    fun clearUserKey() {
        prefs.edit().remove(KEY_GEMINI).apply()
    }

    fun hasValidKey(): Boolean {
        return getGeminiApiKey().isNotEmpty()
    }

    fun isConfiguredViaBuildConfig(): Boolean {
        val buildKey = BuildConfig.GEMINI_API_KEY.trim()
        return buildKey.isNotEmpty() && buildKey != "YOUR_GEMINI_KEY_HERE"
    }

    companion object {
        private const val KEY_GEMINI = "gemini_api_key"
    }
}
