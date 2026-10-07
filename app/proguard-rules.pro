# DevQuiz Android Proguard Rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.annotation.Keep *;
}
-keep class com.devquiz.app.domain.model.** { *; }
-dontwarn com.google.ai.client.generativeai.**
