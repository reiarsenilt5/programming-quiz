import React, { useState } from 'react';
import { 
  Smartphone, 
  FileCode, 
  GitBranch, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  Terminal, 
  Flame, 
  Github, 
  Download, 
  CheckCircle2, 
  Code2,
  Cpu,
  Info
} from 'lucide-react';
import PhoneSimulator from './components/PhoneSimulator';
import CodeExplorer from './components/CodeExplorer';
import CiCdGuide from './components/CiCdGuide';
import ArchitectureView from './components/ArchitectureView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'cicd' | 'architecture' | 'stack'>('simulator');
  const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>(undefined);

  const handleOpenCode = (path?: string) => {
    setSelectedFilePath(path);
    setActiveTab('code');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  DevQuiz
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold px-2 py-0.5 rounded-full font-mono">
                  Android Native + Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Master Modern Coding • Jetpack Compose & Clean Architecture
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Código Kotlin</span>
            </button>

            <button
              onClick={() => setActiveTab('cicd')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'cicd'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>CI/CD APK</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Arquitectura</span>
            </button>

            <button
              onClick={() => setActiveTab('stack')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'stack'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Stack Explicado</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: PHONE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Android Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneSimulator onOpenCode={handleOpenCode} />
            </div>

            {/* Right side: Interactive Assistant & Quick Code Jump */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Feature highlight card */}
              <div className="bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Experiencia Interactiva 100% Funcional</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Prueba DevQuiz y Consulta al Tutor Gemini en Tiempo Real
                </h2>
                <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                  Puedes interactuar con los 3 modos de juego (Práctica sin límite, Contrarreloj 60s y Desafío Diario),
                  responder preguntas de las 7 categorías técnicas (Python, PHP, JavaScript, TypeScript, React, Arquitectura e IA),
                  ver el feedback inmediato y presionar <strong className="text-purple-300">"Tutor IA"</strong> para generar explicaciones con Google Gemini 3.8 Flash.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  <span className="bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300">
                    🐍 Python 3.12+ (TaskGroup, Decorators)
                  </span>
                  <span className="bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300">
                    🐘 PHP 8.3 (Constructor promotion, match)
                  </span>
                  <span className="bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300">
                    ⚡ JS Event Loop & Closures
                  </span>
                  <span className="bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300">
                    🔷 TS satisfies & infer
                  </span>
                  <span className="bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300">
                    ⚛️ React RSC & Closures
                  </span>
                  <span className="bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300">
                    🏛️ Clean Architecture & Git
                  </span>
                  <span className="bg-slate-900/80 border border-slate-700/60 px-2.5 py-1 rounded-lg text-slate-300">
                    🤖 AI Prompting & Hallucinations
                  </span>
                </div>
              </div>

              {/* Quick links to code files */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    Acceso Rápido al Código Fuente Nativo de Android
                  </h3>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Ver todos los archivos ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleOpenCode('app/src/main/java/com/devquiz/app/presentation/quiz/QuizViewModel.kt')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 block">
                      QuizViewModel.kt
                    </span>
                    <span className="text-[10px] text-slate-400">
                      StateFlow, Coroutines & llamadas a Gemini
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenCode('app/src/main/java/com/devquiz/app/presentation/quiz/QuizScreen.kt')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 block">
                      QuizScreen.kt
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Jetpack Compose con bloque de código y feedback
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenCode('app/src/main/assets/questions.json')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-left transition cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 block">
                      questions.json
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Dataset offline de las 7 categorías para Room
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cicd')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-emerald-400 block flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5" />
                      CI/CD build-apk.yml
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Compilación automática de APK en GitHub
                    </span>
                  </button>
                </div>
              </div>

              {/* Offline Room Persistence highlight */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Persistencia Offline Garantizada con Room
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Las preguntas se preempaquetan en SQLite o se leen desde assets en el primer inicio de la app.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenCode('app/src/main/java/com/devquiz/app/data/local/entity/QuestionEntity.kt')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap"
                >
                  Ver Room Entity
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CODE EXPLORER */}
        {activeTab === 'code' && (
          <CodeExplorer initialFilePath={selectedFilePath} />
        )}

        {/* TAB 3: CI/CD PIPELINE */}
        {activeTab === 'cicd' && (
          <CiCdGuide />
        )}

        {/* TAB 4: ARCHITECTURE VIEW */}
        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}

        {/* TAB 5: STACK EXPLAINED */}
        {activeTab === 'stack' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" />
                Explicación del Stack Tecnológico
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Para responder con total transparencia a tu pregunta: <strong className="text-white">"¿En qué stack arrancaste esta app?"</strong>,
                aquí te explicamos exactamente cómo se compone el proyecto en dos dimensiones: el <strong className="text-indigo-400">Stack Nativo de Android</strong> (el que compilas como APK) y el <strong className="text-purple-400">Stack de Simulación y Entorno de Desarrollo</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stack Nativo Android */}
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                  <Smartphone className="w-5 h-5" />
                  Stack Nativo Móvil (Target de la APK Android)
                </div>
                <p className="text-xs text-slate-300">
                  Es el código fuente Kotlin generado en la pestaña <strong>"Código Kotlin"</strong>, preparado para compilarse en Android Studio y en el CI de GitHub:
                </p>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Lenguaje:</strong> Kotlin 1.9+ (100% nativo).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">UI Toolkit:</strong> Jetpack Compose con Material Design 3 (Material You).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Arquitectura:</strong> Clean Architecture + MVVM + UDF (StateFlow/SharedFlow).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Persistencia:</strong> Room Database (SQLite offline) con pre-seed desde <code className="text-indigo-300">questions.json</code>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Inyección de Dependencias:</strong> Hilt / Dagger.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">IA Móvil:</strong> Google Generative AI Client SDK para Android (<code className="text-indigo-300">com.google.ai.client.generativeai</code>).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Automatización CI/CD:</strong> GitHub Actions con Gradle 8.3 & JDK 17.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Stack Web Simulator */}
              <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                  <Cpu className="w-5 h-5" />
                  Stack del Entorno Interactivo & Web Studio
                </div>
                <p className="text-xs text-slate-300">
                  Es la aplicación que estás viendo en tu navegador en este momento, diseñada para que puedas probar el juego y exportar el código sin esperar a abrir Android Studio:
                </p>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Frontend Web:</strong> React 19 + TypeScript + Vite.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Estilos:</strong> Tailwind CSS v4 con tipografía JetBrains Mono y diseño Material You.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Backend Proxy:</strong> Express.js en Node.js (<code className="text-purple-300">server.ts</code>) con endpoint <code className="text-purple-300">/api/ai-explain</code>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">SDK de Inteligencia Artificial:</strong> <code className="text-purple-300">@google/genai</code> oficial con el modelo <strong className="text-emerald-400">gemini-3.8-flash</strong>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Iconos & UI:</strong> Lucide Icons + animaciones CSS nativas.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Why this dual approach */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">¿Por qué esta solución es ideal?</strong>
              Porque te entrega <strong className="text-emerald-400">todo el código Kotlin, Jetpack Compose, Room y Gradle</strong> listo para copiar o compilar en GitHub Actions para obtener tu APK nativo, y al mismo tiempo te permite <strong className="text-indigo-400">jugarlo de inmediato en el navegador</strong>, comprobar las preguntas técnicas y ver al tutor Gemini en acción sin ninguna fricción de instalación previa.
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        DevQuiz: Master Modern Coding • Jetpack Compose + Clean Architecture + GitHub Actions CI • Powered by Google Gemini 3.8 Flash
      </footer>
    </div>
  );
}
