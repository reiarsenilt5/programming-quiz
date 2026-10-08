import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Flame, 
  Clock, 
  Calendar, 
  BookOpen, 
  Code2, 
  ArrowRight, 
  Trophy, 
  HelpCircle,
  Loader2,
  X,
  Volume2,
  Share2,
  Home,
  Zap,
  BarChart3,
  Settings,
  ExternalLink,
  Save,
  AlertTriangle,
  RefreshCw,
  Key
} from 'lucide-react';
import { CategoryId, GameMode, Question, QuizUserAnswer } from '../types/quiz';
import { CATEGORIES, QUESTIONS_DATA } from '../data/questionsData';

interface PhoneSimulatorProps {
  onOpenCode?: (path?: string) => void;
}

export default function PhoneSimulator({ onOpenCode }: PhoneSimulatorProps) {
  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<'home' | 'quiz' | 'result'>('home');
  const [currentTab, setCurrentTab] = useState<'home' | 'stats' | 'settings'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('modern_fundamentals');
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');

  // Quiz state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizUserAnswer[]>([]);
  
  // Stats tracking
  const [totalAnswered, setTotalAnswered] = useState(24);
  const [totalCorrect, setTotalCorrect] = useState(20);

  // Timer for Time Trial
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Gamification
  const [streakDays, setStreakDays] = useState(5);

  // AI Tutor Modal state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Gemini Settings state
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [savedKeyFeedback, setSavedKeyFeedback] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer tick effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Start Quiz
  const startQuiz = (categoryId: CategoryId, mode: GameMode) => {
    setSelectedCategory(categoryId);
    setSelectedMode(mode);

    let filtered = QUESTIONS_DATA.filter((q) => q.categoryId === categoryId);
    if (mode === 'daily_challenge' || filtered.length === 0) {
      filtered = [...QUESTIONS_DATA].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else if (mode === 'time_trial') {
      filtered = [...QUESTIONS_DATA].sort(() => 0.5 - Math.random());
    }

    setActiveQuestions(filtered);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerConfirmed(false);
    setScore(0);
    setUserAnswers([]);
    setAiExplanation(null);
    setAiError(null);
    setCurrentScreen('quiz');

    if (mode === 'time_trial') {
      setTimeLeft(60);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    const currentQ = activeQuestions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswerIndex;

    const answerRecord: QuizUserAnswer = {
      questionId: currentQ.id,
      question: currentQ,
      selectedOptionIndex: selectedOption,
      isCorrect,
      timeSpentSeconds: 5,
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
    setIsAnswerConfirmed(true);
    setTotalAnswered((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setStreakDays((prev) => prev + 1);
      setTotalCorrect((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= activeQuestions.length) {
      finishQuiz();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerConfirmed(false);
      setAiExplanation(null);
      setAiError(null);
      setShowAiModal(false);
    }
  };

  const finishQuiz = () => {
    setIsTimerRunning(false);
    setCurrentScreen('result');
  };

  // Call Gemini API via our Express server endpoint
  const requestAiExplanation = async () => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ || selectedOption === null) return;

    setShowAiModal(true);
    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: currentQ.title,
          codeSnippet: currentQ.codeSnippet,
          selectedAnswer: currentQ.options[selectedOption],
          correctAnswer: currentQ.options[currentQ.correctAnswerIndex],
          explanation: currentQ.explanation,
          category: currentQ.categoryName,
          difficulty: currentQ.difficulty,
          customApiKey: geminiApiKey || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Error de conexión con el Tutor Gemini. Verifica tu conexión de red o clave API.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.details || data.error);
      }
      setAiExplanation(data.explanation);
    } catch (err: any) {
      setAiError(err.message || 'No se pudo obtener la respuesta del Tutor de IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentQ = activeQuestions[currentIndex];
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const quizTitle = selectedMode === 'time_trial'
    ? 'Blitz 60s'
    : selectedMode === 'daily_challenge'
    ? 'Desafío Diario'
    : (activeCategoryObj?.name || currentQ?.categoryName || 'DevQuiz');

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Phone Hardware Mockup (Pixel 9 Pro / Modern Smartphone style) */}
      <div className="relative w-[385px] h-[800px] bg-slate-950 rounded-[50px] p-3 shadow-2xl ring-1 ring-slate-800 shadow-slate-950/80 border-4 border-slate-800/90 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Front Camera Pill Cutout */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3.5 ring-1 ring-slate-800/60 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-700/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 animate-pulse" />
        </div>

        {/* Screen Bezel Frame */}
        <div className="w-full h-full bg-[#090D16] rounded-[40px] overflow-hidden flex flex-col relative text-slate-100 select-none">
          
          {/* Status Bar with generous safe area height avoiding notch crowding */}
          <div className="h-14 pt-4 px-6 flex items-center justify-between text-[11px] text-slate-400 font-medium z-40 bg-[#090D16]/95 backdrop-blur-sm shrink-0 border-b border-slate-850/80">
            <span className="font-semibold tracking-tight text-slate-300">09:41</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-[10px] font-bold">5G</span>
              <div className="w-5 h-2.5 border border-slate-400/80 rounded-xs relative p-0.5">
                <div className="h-full w-2.5 bg-slate-300 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-1 flex flex-col">
            
            {/* 1. HOME & TABS VIEW */}
            {currentScreen === 'home' && (
              <div className="flex-1 flex flex-col justify-between">
                
                {/* TAB 1: INICIO */}
                {currentTab === 'home' && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          DevQuiz
                        </h1>
                        <p className="text-[11px] text-slate-400">Master Modern Coding</p>
                      </div>
                      {/* Streak Chip */}
                      <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-300 text-xs font-semibold">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{streakDays} días</span>
                      </div>
                    </div>

                    {/* Game Modes */}
                    <div>
                      <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        MODOS DE JUEGO
                      </h2>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => startQuiz(selectedCategory, 'practice')}
                          className="bg-slate-900 hover:bg-slate-800/90 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                        >
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">Práctica</span>
                          <span className="text-[9px] text-slate-400">Sin reloj</span>
                        </button>

                        <button
                          onClick={() => startQuiz(selectedCategory, 'time_trial')}
                          className="bg-slate-900 hover:bg-slate-800/90 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                        >
                          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">Contrarreloj</span>
                          <span className="text-[9px] text-slate-400">60s blitz</span>
                        </button>

                        <button
                          onClick={() => startQuiz(selectedCategory, 'daily_challenge')}
                          className="bg-slate-900 hover:bg-slate-800/90 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">Diario</span>
                          <span className="text-[9px] text-slate-400">5 retos</span>
                        </button>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          CATEGORÍAS TÉCNICAS ({CATEGORIES.length})
                        </h2>
                        <span className="text-[10px] text-indigo-400 font-medium">Room Offline</span>
                      </div>
                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {CATEGORIES.map((cat) => (
                          <div
                            key={cat.id}
                            onClick={() => startQuiz(cat.id, 'practice')}
                            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition active:scale-[0.98] group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-1 bg-slate-950 rounded-xl border border-slate-800/60">
                                {cat.icon}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-slate-100">{cat.name}</span>
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-medium">
                                    {QUESTIONS_DATA.filter((q) => q.categoryId === cat.id).length} preguntas
                                  </span>
                                  <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                                    {cat.tag}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                  {cat.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ESTADÍSTICAS */}
                {currentTab === 'stats' && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                    <h2 className="text-base font-extrabold text-white">Estadísticas</h2>
                    
                    {/* Summary row */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                        <span className="text-[10px] text-slate-400 block">Total</span>
                        <span className="text-xl font-extrabold text-indigo-400">{totalAnswered}</span>
                        <span className="text-[9px] text-slate-500 block">Preguntas</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                        <span className="text-[10px] text-slate-400 block">Precisión</span>
                        <span className="text-xl font-extrabold text-emerald-400">
                          {totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%
                        </span>
                        <span className="text-[9px] text-slate-500 block">{totalCorrect} correctas</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                        <span className="text-[10px] text-slate-400 block">Racha</span>
                        <span className="text-xl font-extrabold text-amber-400">🔥 {streakDays}</span>
                        <span className="text-[9px] text-slate-500 block">Días seguidos</span>
                      </div>
                    </div>

                    {/* Dominio por categoría */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Dominio Técnico
                      </h3>
                      <div className="space-y-2 text-xs">
                        {CATEGORIES.slice(0, 6).map((cat, i) => {
                          const pct = [85, 75, 90, 65, 80, 70][i % 6];
                          return (
                            <div key={cat.id} className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-slate-300 font-medium truncate max-w-[190px]">
                                  {cat.name}
                                </span>
                                <span className="text-indigo-400 font-bold">{pct}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${pct}%` }} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Logros */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Logros Desbloqueados
                      </h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <span className="text-xl">🎯</span>
                          <span className="text-[10px] font-bold block mt-1 text-slate-200">Junior Ready</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <span className="text-xl">⚡</span>
                          <span className="text-[10px] font-bold block mt-1 text-slate-200">Blitz Runner</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <span className="text-xl">🤖</span>
                          <span className="text-[10px] font-bold block mt-1 text-slate-200">AI Tutor Pro</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: AJUSTES */}
                {currentTab === 'settings' && (
                  <div className="space-y-3.5 pt-1 animate-in fade-in duration-200">
                    <h2 className="text-base font-extrabold text-white">Configuración</h2>

                    {/* Gemini AI Key Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">Tutor Gemini Flash</span>
                            <span className="text-[10px] text-slate-400">Google AI Studio API (gemini-1.5-flash)</span>
                          </div>
                        </div>
                        <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          ● Activo
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Ingresa tu clave de Gemini API si deseas usar tu propia cuota o probarla en el teléfono:
                      </p>

                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="AIzaSy..."
                            value={geminiApiKey}
                            onChange={(e) => {
                              setGeminiApiKey(e.target.value);
                              setSavedKeyFeedback(null);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSavedKeyFeedback('¡Clave guardada en el dispositivo!');
                              setTimeout(() => setSavedKeyFeedback(null), 3000);
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1.5 px-3 rounded-xl transition text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Guardar Clave</span>
                          </button>
                        </div>

                        {savedKeyFeedback && (
                          <p className="text-[10px] text-emerald-400 font-medium">
                            {savedKeyFeedback}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                        <span>¿No tienes clave? Consíguela gratis en </span>
                        <a 
                          href="https://aistudio.google.com/apikey" 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-400 font-medium underline inline-flex items-center gap-0.5"
                        >
                          Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* CI/CD Hint */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[11px]">
                        <Key className="w-3.5 h-3.5" />
                        <span>Clave en compilación APK</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Al compilar en GitHub Actions, agrega el secreto <code className="text-indigo-300 font-mono">GEMINI_API_KEY</code> en tu repositorio para que el APK venga listo sin escribir nada.
                      </p>
                    </div>

                    {/* Sound Settings */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200 block">Efectos de Sonido</span>
                        <span className="text-[10px] text-slate-400">Sonido de acierto/error</span>
                      </div>
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                          soundEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                            soundEnabled ? 'left-5' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* App info */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-[10px] text-slate-500 font-mono text-center">
                      DevQuiz Android 1.0.0 (Jetpack Compose & Gemini)
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 2. QUIZ SCREEN */}
            {currentScreen === 'quiz' && currentQ && (
              <div className="flex-1 flex flex-col justify-between pt-2 pb-2 space-y-3 animate-in fade-in duration-150">
                {/* Top bar in quiz with generous spacing and accessible touch target */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-300 gap-2">
                    <button
                      onClick={() => setCurrentScreen('home')}
                      className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
                      title="Salir del quiz"
                      aria-label="Salir del examen"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Título de Quiz Centrado en una sola línea */}
                    <div className="flex-1 min-w-0 text-center px-1">
                      <span 
                        className="text-xs font-semibold text-slate-200 tracking-tight truncate block"
                        title={quizTitle}
                      >
                        {quizTitle}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-xs font-semibold text-slate-300 tracking-tight">
                        {currentIndex + 1} <span className="text-slate-500 font-normal">/</span> {activeQuestions.length}
                      </span>
                      {selectedMode === 'time_trial' && (
                        <span className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold border ${
                          timeLeft <= 10 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                            : 'bg-slate-900 text-emerald-400 border-slate-800'
                        }`}>
                          ⏱ {timeLeft}s
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Linear Progress indicator */}
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Clean Zero-Pill Metadata Kicker (Anti-Slop Discipline) */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 select-none flex-wrap">
                    <span className="font-semibold text-emerald-400">{currentQ.categoryName}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300">
                      {currentQ.difficulty === 'Junior' ? 'Nivel Inicial' : currentQ.difficulty === 'Mid' ? 'Nivel Medio' : 'Nivel Senior'}
                    </span>
                    {currentQ.type === 'find_the_bug' && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-amber-400 font-medium">Búsqueda de Bug</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-100 leading-snug tracking-tight">
                    {currentQ.title}
                  </h3>

                  {/* Code block if any */}
                  {currentQ.codeSnippet && (
                    <div className="mt-2 bg-[#070b12] border border-slate-800/90 rounded-xl p-2.5 overflow-x-auto text-[10px] font-mono text-emerald-200/90 shadow-inner">
                      <pre className="leading-relaxed whitespace-pre font-mono">
                        {currentQ.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2 my-auto">
                  {currentQ.options.map((opt, idx) => {
                    let borderClass = 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700/80';
                    let textClass = 'text-slate-200';
                    let badgeClass = 'bg-slate-800/90 text-slate-300 border border-slate-700/50';

                    if (selectedOption === idx) {
                      borderClass = 'border-emerald-500/80 bg-emerald-500/10 text-white';
                      badgeClass = 'bg-emerald-500 text-slate-950 font-black border-transparent';
                    }

                    if (isAnswerConfirmed) {
                      if (idx === currentQ.correctAnswerIndex) {
                        borderClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-100';
                        badgeClass = 'bg-emerald-500 text-slate-950 font-black border-transparent';
                      } else if (selectedOption === idx) {
                        borderClass = 'border-rose-500/80 bg-rose-950/40 text-rose-100';
                        badgeClass = 'bg-rose-500 text-white font-black border-transparent';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerConfirmed}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full text-left p-3 rounded-xl border ${borderClass} transition flex items-center gap-3 text-xs cursor-pointer active:scale-[0.99] min-h-[48px]`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${badgeClass}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`text-[12px] leading-snug ${textClass} flex-1`}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box & Actions */}
                <div className="space-y-2.5 pt-1 pb-1">
                  {isAnswerConfirmed && (
                    <div className={`p-3.5 rounded-xl border text-[11px] space-y-1.5 ${
                      selectedOption === currentQ.correctAnswerIndex
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}>
                      <div className="flex items-center gap-2 font-bold">
                        {selectedOption === currentQ.correctAnswerIndex ? (
                          <>
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300 text-xs">¡Respuesta Correcta! (+100 pts)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                            <span className="text-rose-300 text-xs">Respuesta Incorrecta</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed pl-6.5">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}

                  {/* Buttons with clear hierarchy (Primary Emerald CTA vs Secondary Glass Tutor) */}
                  {!isAnswerConfirmed ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleConfirmAnswer}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-900 disabled:text-slate-500 disabled:border-slate-800 border border-emerald-400/50 text-slate-950 font-bold py-3.5 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-98 disabled:cursor-not-allowed disabled:shadow-none min-h-[48px]"
                    >
                      Comprobar Respuesta
                    </button>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={requestAiExplanation}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-slate-200 py-3 rounded-xl font-semibold text-xs transition cursor-pointer active:scale-98 min-h-[48px]"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Tutor IA</span>
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-98 min-h-[48px]"
                      >
                        <span>Siguiente</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. RESULT SCREEN */}
            {currentScreen === 'result' && (
              <div className="flex-1 flex flex-col justify-between py-2 text-center animate-in zoom-in-95 duration-200">
                <div className="space-y-4 pt-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-white">¡Examen Completado!</h2>
                    <p className="text-xs text-slate-400">
                      {selectedMode === 'time_trial' ? 'Modo Contrarreloj 60s' : 'Modo Práctica'}
                    </p>
                  </div>

                  {/* Score Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <div className="text-3xl font-extrabold text-indigo-400">
                      {userAnswers.length > 0
                        ? Math.round(
                            (userAnswers.filter((a) => a.isCorrect).length /
                              userAnswers.length) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      {userAnswers.filter((a) => a.isCorrect).length} de {userAnswers.length}{' '}
                      correctas
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex justify-around text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Puntaje</span>
                        <span className="font-bold text-amber-300">{score} pts</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Racha actual</span>
                        <span className="font-bold text-emerald-400">🔥 {streakDays}</span>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown List */}
                  <div className="text-left">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Desglose de Preguntas
                    </h4>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {userAnswers.map((ans, i) => (
                        <div
                          key={i}
                          className="bg-slate-900/60 border border-slate-800 p-2 rounded-xl flex items-center justify-between text-xs"
                        >
                          <span className="truncate max-w-[210px] text-[10px] text-slate-300">
                            {ans.question.title}
                          </span>
                          {ans.isCorrect ? (
                            <span className="text-[10px] font-bold text-emerald-400">✓</span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-400">✗</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => startQuiz(selectedCategory, selectedMode)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Jugar de Nuevo</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 py-2 rounded-xl font-medium text-xs transition cursor-pointer"
                  >
                    Volver al Menú
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Android Bottom Navigation Bar (Visible in Home Screen) */}
          {currentScreen === 'home' && (
            <nav className="h-14 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md px-3 flex items-center justify-around z-40 shrink-0">
              <button
                onClick={() => setCurrentTab('home')}
                className={`flex flex-col items-center gap-0.5 transition cursor-pointer min-w-[44px] py-1 ${
                  currentTab === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="text-[10px]">Inicio</span>
              </button>

              <button
                onClick={() => startQuiz(selectedCategory, 'time_trial')}
                className="flex flex-col items-center gap-0.5 transition cursor-pointer min-w-[44px] py-1 text-rose-400 hover:text-rose-300 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-rose-500/20" />
                <span className="text-[10px] font-semibold">Blitz 60s</span>
              </button>

              <button
                onClick={() => setCurrentTab('stats')}
                className={`flex flex-col items-center gap-0.5 transition cursor-pointer min-w-[44px] py-1 ${
                  currentTab === 'stats' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-[10px]">Estadísticas</span>
              </button>

              <button
                onClick={() => setCurrentTab('settings')}
                className={`flex flex-col items-center gap-0.5 transition cursor-pointer min-w-[44px] py-1 ${
                  currentTab === 'settings' ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="text-[10px]">Ajustes</span>
              </button>
            </nav>
          )}

          {/* Android Gesture Bar */}
          <div className="h-4 flex items-center justify-center bg-slate-950">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>

        {/* AI Tutor BottomSheet / Modal con manejo visual de estados y errores */}
        {showAiModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-[48px] z-50 p-4 flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-4 shadow-2xl max-h-[85%] flex flex-col text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Tutor Gemini Flash Lite</h4>
                    <p className="text-[9px] text-purple-300">Explicación técnica en profundidad (gemini-3.1-flash-lite)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 text-xs text-slate-300 space-y-2 leading-relaxed">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                    <p className="text-xs text-purple-200 font-medium">
                      Consultando al tutor de IA sobre esta pregunta...
                    </p>
                  </div>
                ) : aiError ? (
                  <div className="space-y-3">
                    <div className="text-rose-300 text-xs p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Aviso del Tutor de IA</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{aiError}</p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                      <span className="text-slate-300 font-semibold block">¿Cómo solucionarlo?</span>
                      <span>1. Verifica tu conexión a internet (Wi-Fi o datos).</span>
                      <br />
                      <span>2. En la pestaña Ajustes puedes ingresar tu clave gratuita de Google AI Studio.</span>
                    </div>

                    <button
                      onClick={requestAiExplanation}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs py-2 rounded-xl font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reintentar Consulta</span>
                    </button>
                  </div>
                ) : (
                  <div className="whitespace-pre-line font-sans text-[11px] text-slate-200">
                    {aiExplanation}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl font-medium mt-2 cursor-pointer"
              >
                Cerrar Tutor
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          Simulador Nativo Pixel 9 Pro
        </span>
        <span>•</span>
        <span>Material You 3 Dark</span>
      </div>
    </div>
  );
}
