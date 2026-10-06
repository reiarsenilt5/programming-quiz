import React from 'react';
import { 
  Boxes, 
  Layers, 
  Database, 
  Cpu, 
  Smartphone, 
  GitBranch, 
  ShieldCheck, 
  Workflow, 
  ArrowDown, 
  CheckCircle,
  ExternalLink,
  Code
} from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          Clean Architecture & MVVM (Android Moderno)
        </div>
        <h2 className="text-2xl font-bold text-white">
          Arquitectura del Sistema: DevQuiz Android
        </h2>
        <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
          Diseñado bajo las directrices oficiales de Google (Modern Android Development - MAD),
          siguiendo separación estricta de responsabilidades, flujo unidireccional de datos (UDF)
          y total desacoplamiento para facilitar testing unitario y escalabilidad.
        </p>
      </div>

      {/* Architecture Layers Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Presentation Layer */}
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Presentation Layer</h3>
            <span className="text-[10px] text-indigo-400 font-mono">
              Jetpack Compose • Material 3 • ViewModel
            </span>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">▸</span>
                <span><strong>HomeScreen:</strong> Selección de categorías y modos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">▸</span>
                <span><strong>QuizScreen:</strong> Tarjeta de código, temporizador y feedback.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">▸</span>
                <span><strong>ResultScreen:</strong> Desglose analítico de aciertos y rachas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">▸</span>
                <span><strong>QuizViewModel:</strong> Expone <code className="text-indigo-300">StateFlow&lt;QuizUiState&gt;</code> y maneja eventos reactivos.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Regla: Solo observa el estado, no contiene lógica de persistencia.
          </div>
        </div>

        {/* 2. Domain Layer */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Domain Layer</h3>
            <span className="text-[10px] text-emerald-400 font-mono">
              Pure Kotlin • Entities • Use Cases
            </span>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">▸</span>
                <span><strong>GetQuestionsUseCase:</strong> Orquesta filtros por dificultad y modo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">▸</span>
                <span><strong>SubmitAnswerUseCase:</strong> Calcula puntajes y rachas consecutivas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">▸</span>
                <span><strong>Modelos Puros:</strong> <code className="text-emerald-300">Question</code>, <code className="text-emerald-300">CategoryType</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">▸</span>
                <span><strong>QuizRepository (Interface):</strong> Contrato abstracto de datos.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Regla de oro: Cero dependencias de Android SDK ni librerías de UI.
          </div>
        </div>

        {/* 3. Data Layer */}
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-3">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Data Layer</h3>
            <span className="text-[10px] text-purple-400 font-mono">
              Room SQLite • JSON Assets • Gemini SDK
            </span>
            <ul className="mt-4 space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▸</span>
                <span><strong>Room Database:</strong> Almacena preguntas e historial local con soporte 100% offline.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▸</span>
                <span><strong>Room Prepackage:</strong> Carga inicial desde <code className="text-purple-300">questions.json</code> en assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▸</span>
                <span><strong>QuizRepositoryImpl:</strong> Implementa la interfaz del dominio.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">▸</span>
                <span><strong>Google Generative AI SDK:</strong> Genera explicaciones técnicas bajo demanda.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Regla: Mapea entidades de Room y respuestas de API a modelos de dominio.
          </div>
        </div>
      </div>

      {/* Package Structure Tree */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-indigo-400" />
          Estructura de Carpetas Recomendada (Package-by-Feature)
        </h3>
        <pre className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80">
{`com.devquiz.app/
│
├── di/                                # Inyección de Dependencias (Hilt)
│   ├── DatabaseModule.kt              # Provee Room Database y QuestionDao
│   ├── RepositoryModule.kt            # Binds QuizRepository -> QuizRepositoryImpl
│   └── NetworkModule.kt               # Provee cliente GenerativeModel (Gemini)
│
├── domain/                            # Capa de Dominio (Kotlin puro)
│   ├── model/                         # Question, Category, DifficultyLevel
│   ├── repository/                    # QuizRepository (interfaz)
│   └── usecase/                       # GetQuestionsUseCase, SubmitAnswerUseCase
│
├── data/                              # Capa de Datos (Persistencia y APIs)
│   ├── local/
│   │   ├── dao/                       # QuestionDao.kt
│   │   ├── entity/                    # QuestionEntity.kt & Converters.kt
│   │   └── QuizDatabase.kt            # RoomDatabase con RoomDatabase.Callback pre-seed
│   └── repository/
│       └── QuizRepositoryImpl.kt      # Implementación del repositorio
│
├── presentation/                      # Capa de UI (Jetpack Compose)
│   ├── home/                          # HomeScreen.kt & HomeViewModel.kt
│   ├── quiz/                          # QuizScreen.kt, QuizViewModel.kt, QuizUiState.kt
│   ├── result/                        # ResultScreen.kt
│   └── components/                    # CodeHighlightCard.kt, OptionCard.kt, AiTutorSheet.kt
│
├── ui/theme/                          # Material Design 3 Theme, Color, Type
└── DevQuizApp.kt                      # @HiltAndroidApp Application class`}
        </pre>
      </div>
    </div>
  );
}
