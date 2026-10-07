import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Zap, 
  BarChart3, 
  Settings, 
  Flame, 
  Clock, 
  Calendar, 
  BookOpen, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  ArrowRight,
  Loader2,
  Award,
  Volume2,
  VolumeX,
  Smartphone,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CategoryId, GameMode, Question, QuizUserAnswer } from './types/quiz';
import { CATEGORIES, QUESTIONS_DATA } from './data/questionsData';

export default function App() {
  // Navigation Tabs in Mobile App
  const [activeTab, setActiveTab] = useState<'home' | 'blitz' | 'stats' | 'settings'>('home');

  // Quiz Game State
  const [inQuiz, setInQuiz] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizUserAnswer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('modern_fundamentals');
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');

  // Timer for Time Trial
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Gamification & User Stats
  const [streakDays, setStreakDays] = useState(5);
  const [totalAnswered, setTotalAnswered] = useState(28);
  const [totalCorrect, setTotalCorrect] = useState(24);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Category stats tracking
  const [categoryStats, setCategoryStats] = useState<Record<CategoryId, { answered: number; correct: number }>>({
    python: { answered: 4, correct: 3 },
    php: { answered: 3, correct: 2 },
    javascript: { answered: 5, correct: 5 },
    typescript: { answered: 4, correct: 3 },
    react: { answered: 4, correct: 4 },
    sql: { answered: 5, correct: 4 },
    solid: { answered: 4, correct: 4 },
    modern_fundamentals: { answered: 4, correct: 4 },
    ai_assistance: { answered: 4, correct: 3 },
    senior_fullstack: { answered: 5, correct: 4 },
    devops_cloud: { answered: 5, correct: 4 },
    subtle_engineering: { answered: 4, correct: 4 },
    docker_mastery: { answered: 5, correct: 5 },
  });

  // AI Tutor Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Timer Tick Effect
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
    setQuizFinished(false);
    setInQuiz(true);

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

    // Update Category Stats
    setCategoryStats((prev) => ({
      ...prev,
      [currentQ.categoryId]: {
        answered: (prev[currentQ.categoryId]?.answered || 0) + 1,
        correct: (prev[currentQ.categoryId]?.correct || 0) + (isCorrect ? 1 : 0),
      },
    }));

    if (isCorrect) {
      setScore((prev) => prev + 100);
      setTotalCorrect((prev) => prev + 1);
      setStreakDays((prev) => prev + 1);
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
      setShowAiModal(false);
    }
  };

  const finishQuiz = () => {
    setIsTimerRunning(false);
    setQuizFinished(true);
  };

  const exitQuiz = () => {
    setIsTimerRunning(false);
    setInQuiz(false);
    setQuizFinished(false);
  };

  // Request AI Tutor from Backend Gemini API
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
        }),
      });

      if (!response.ok) {
        throw new Error('Error de conexión con el tutor virtual.');
      }

      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (err: any) {
      setAiError(err.message || 'No se pudo obtener la explicación de IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-2 sm:p-4 font-sans select-none selection:bg-indigo-500 selection:text-white">
      {/* Native Mobile Frame (Material 3 Mobile Screen) */}
      <div className="w-full max-w-[420px] h-[860px] max-h-[96vh] bg-slate-950 rounded-[44px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden relative">
        
        {/* Android Punch Hole & Speaker */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-900 rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ring-1 ring-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Status Bar */}
        <div className="h-8 px-6 flex items-center justify-between text-[11px] text-slate-400 font-medium z-40 bg-slate-950/80 backdrop-blur-sm pt-1">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-slate-400 rounded-xs relative">
              <div className="absolute inset-0.5 bg-slate-200 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Main Mobile App Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-3 flex flex-col">
          
          {/* ==================== QUIZ ACTIVE VIEW ==================== */}
          {inQuiz && !quizFinished && currentQ && (
            <div className="flex-1 flex flex-col justify-between py-1 space-y-3 animate-in fade-in duration-200">
              {/* Quiz Header */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <button
                    onClick={exitQuiz}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-300">
                      {currentIndex + 1} / {activeQuestions.length}
                    </span>
                    {selectedMode === 'time_trial' && (
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        timeLeft <= 10 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-300'
                      }`}>
                        ⏱ {timeLeft}s
                      </span>
                    )}
                  </div>
                </div>

                {/* Linear Progress Indicator */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Chips */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentQ.categoryName}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {currentQ.difficulty}
                  </span>
                  {currentQ.type === 'find_the_bug' && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                      🐛 Bug Hunt
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                  {currentQ.title}
                </h3>

                {/* Code Block */}
                {currentQ.codeSnippet && (
                  <div className="mt-2.5 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-x-auto text-[10px] font-mono text-indigo-200">
                    <pre className="leading-relaxed whitespace-pre">
                      {currentQ.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 my-auto">
                {currentQ.options.map((opt, idx) => {
                  let borderClass = 'border-slate-800 bg-slate-900/80 hover:bg-slate-850';
                  let textClass = 'text-slate-200';
                  let badgeClass = 'bg-slate-800 text-slate-300';

                  if (selectedOption === idx) {
                    borderClass = 'border-indigo-500 bg-indigo-500/15';
                    badgeClass = 'bg-indigo-600 text-white';
                  }

                  if (isAnswerConfirmed) {
                    if (idx === currentQ.correctAnswerIndex) {
                      borderClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-200';
                      badgeClass = 'bg-emerald-600 text-white';
                    } else if (selectedOption === idx) {
                      borderClass = 'border-rose-500 bg-rose-500/20 text-rose-200';
                      badgeClass = 'bg-rose-600 text-white';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerConfirmed}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-2.5 rounded-xl border ${borderClass} transition flex items-start gap-2.5 text-xs cursor-pointer active:scale-[0.99]`}
                    >
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${badgeClass}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-[11px] leading-tight ${textClass}`}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Card */}
              <div className="space-y-2 pt-1">
                {isAnswerConfirmed && (
                  <div className={`p-2.5 rounded-xl border text-[11px] ${
                    selectedOption === currentQ.correctAnswerIndex
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {selectedOption === currentQ.correctAnswerIndex ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>¡Correcto! (+100 pts)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Incorrecto</span>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300 leading-normal">
                      {currentQ.explanation}
                    </p>
                  </div>
                )}

                {/* Bottom Action Buttons */}
                {!isAnswerConfirmed ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleConfirmAnswer}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer active:scale-98 shadow-md shadow-indigo-900/40"
                  >
                    Comprobar Respuesta
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={requestAiExplanation}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-md shadow-purple-900/40"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tutor IA</span>
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-md shadow-indigo-900/40"
                    >
                      <span>Siguiente</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== RESULT VIEW ==================== */}
          {inQuiz && quizFinished && (
            <div className="flex-1 flex flex-col justify-between py-2 text-center animate-in zoom-in-95 duration-200">
              <div className="space-y-4 pt-2">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-900/20">
                  <Trophy className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-white">¡Examen Completado!</h2>
                  <p className="text-xs text-slate-400">
                    {selectedMode === 'time_trial' ? 'Modo Contrarreloj 60s' : 'Modo Práctica'}
                  </p>
                </div>

                {/* Score Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-inner">
                  <div className="text-4xl font-extrabold text-indigo-400">
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
                    {userAnswers.filter((a) => a.isCorrect).length} de {userAnswers.length} correctas
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-800 flex justify-around text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Puntaje obtenido</span>
                      <span className="font-bold text-amber-300">{score} pts</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Racha actual</span>
                      <span className="font-bold text-emerald-400">🔥 {streakDays} días</span>
                    </div>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="text-left">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Desglose de Preguntas
                  </h4>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {userAnswers.map((ans, i) => (
                      <div
                        key={i}
                        className="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs"
                      >
                        <span className="truncate max-w-[240px] text-[10px] text-slate-300">
                          {ans.question.title}
                        </span>
                        {ans.isCorrect ? (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                            ✓
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">
                            ✗
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => startQuiz(selectedCategory, selectedMode)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/40"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Jugar de Nuevo</span>
                </button>
                <button
                  onClick={exitQuiz}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 py-2 rounded-xl font-medium text-xs transition cursor-pointer"
                >
                  Volver al Menú Principal
                </button>
              </div>
            </div>
          )}

          {/* ==================== 1. TAB: HOME ==================== */}
          {!inQuiz && activeTab === 'home' && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-200">
              {/* App Bar Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    DevQuiz
                  </h1>
                  <p className="text-[11px] text-slate-400">Master Modern Coding</p>
                </div>
                {/* Streak Badge */}
                <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{streakDays} días</span>
                </div>
              </div>

              {/* Game Modes */}
              <div>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Modos de Juego
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => startQuiz(selectedCategory, 'practice')}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">Práctica</span>
                    <span className="text-[9px] text-slate-400">Sin reloj</span>
                  </button>

                  <button
                    onClick={() => startQuiz(selectedCategory, 'time_trial')}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">Contrarreloj</span>
                    <span className="text-[9px] text-slate-400">60s blitz</span>
                  </button>

                  <button
                    onClick={() => startQuiz(selectedCategory, 'daily_challenge')}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">Diario</span>
                    <span className="text-[9px] text-slate-400">5 retos</span>
                  </button>
                </div>
              </div>

              {/* 7 Software Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Categorías Técnicas ({CATEGORIES.length})
                  </h2>
                  <span className="text-[10px] text-indigo-400 font-medium">Room Offline</span>
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => startQuiz(cat.id, 'practice')}
                      className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition active:scale-[0.98] group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-slate-950 rounded-xl border border-slate-800/60">
                          {cat.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-100">{cat.name}</span>
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

          {/* ==================== 2. TAB: BLITZ ==================== */}
          {!inQuiz && activeTab === 'blitz' && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-200">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-950/40">
                  <Clock className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-white">Desafío Blitz 60 Segundos</h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Responde la mayor cantidad de preguntas de todas las categorías antes de que el cronómetro llegue a cero.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Tiempo límite</span>
                  <span className="font-bold text-rose-400">60 Segundos</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Puntaje por acierto</span>
                  <span className="font-bold text-emerald-400">+100 Puntos</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Temáticas</span>
                  <span className="font-bold text-indigo-300">Aleatorio (7 categorías)</span>
                </div>
              </div>

              <button
                onClick={() => startQuiz('modern_fundamentals', 'time_trial')}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-2xl text-sm transition cursor-pointer shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>¡Comenzar Desafío Ahora!</span>
              </button>
            </div>
          )}

          {/* ==================== 3. TAB: STATS ==================== */}
          {!inQuiz && activeTab === 'stats' && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-white">Estadísticas & Rendimiento</h2>

              {/* Overview Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Precisión Global</span>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    {totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {totalCorrect} de {totalAnswered} aciertos
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Racha de Días</span>
                  <span className="text-2xl font-extrabold text-amber-400 flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-amber-400" />
                    {streakDays}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Días consecutivos</span>
                </div>
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Dominio por Categoría
                </h3>
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => {
                    const stats = categoryStats[cat.id] || { answered: 0, correct: 0 };
                    const percent = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-300 font-medium">{cat.name}</span>
                          <span className="text-indigo-400 font-bold">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Badges / Medals */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Logros Desbloqueados
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-xl">🎯</span>
                    <span className="text-[10px] font-bold block mt-1 text-slate-200">Junior Ready</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-xl">🐛</span>
                    <span className="text-[10px] font-bold block mt-1 text-slate-200">Bug Hunter</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-xl">🤖</span>
                    <span className="text-[10px] font-bold block mt-1 text-slate-200">AI Prompt Master</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 4. TAB: SETTINGS ==================== */}
          {!inQuiz && activeTab === 'settings' && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-white">Configuración</h2>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 text-xs">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">Efectos de Sonido</span>
                    <span className="text-[10px] text-slate-400">Sonido al acertar o fallar</span>
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

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">Tutor de IA Integrado</span>
                    <span className="text-[10px] text-slate-400">Google Gemini 3.8 Flash</span>
                  </div>
                  <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    Activo
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">Base de Datos Local</span>
                    <span className="text-[10px] text-slate-400">Room SQLite (Offline)</span>
                  </div>
                  <span className="text-indigo-400 font-mono text-[10px]">
                    v1.0 (7 Cat.)
                  </span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  DevQuiz: Master Modern Coding
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Aplicación nativa de Android desarrollada con Jetpack Compose y Clean Architecture.
                  Compilación automatizada en GitHub Actions.
                </p>
                <div className="pt-2 text-[10px] text-slate-500 font-mono">
                  Versión 1.0.0 (Build 2026.1)
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ==================== BOTTOM NAVIGATION BAR ==================== */}
        {!inQuiz && (
          <nav className="h-16 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 flex items-center justify-around z-40">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 transition cursor-pointer ${
                activeTab === 'home' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Home className="w-4.5 h-4.5" />
              <span className="text-[10px]">Inicio</span>
            </button>

            <button
              onClick={() => setActiveTab('blitz')}
              className={`flex flex-col items-center gap-1 transition cursor-pointer ${
                activeTab === 'blitz' ? 'text-rose-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Zap className="w-4.5 h-4.5" />
              <span className="text-[10px]">Blitz 60s</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex flex-col items-center gap-1 transition cursor-pointer ${
                activeTab === 'stats' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span className="text-[10px]">Estadísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 transition cursor-pointer ${
                activeTab === 'settings' ? 'text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span className="text-[10px]">Ajustes</span>
            </button>
          </nav>
        )}

        {/* Android Home Indicator Bar */}
        <div className="h-4.5 flex items-center justify-center bg-slate-950">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>

        {/* ==================== AI TUTOR BOTTOMSHEET ==================== */}
        {showAiModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-[44px] z-50 p-4 flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-4 shadow-2xl max-h-[85%] flex flex-col text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Tutor Gemini 3.8 Flash</h4>
                    <p className="text-[9px] text-purple-300">Explicación técnica en profundidad</p>
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
                  <div className="text-rose-400 text-xs p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl">
                    {aiError}
                  </div>
                ) : (
                  <div className="whitespace-pre-line font-sans text-[11px] text-slate-200">
                    {aiExplanation}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2.5 rounded-xl font-medium mt-2 cursor-pointer"
              >
                Cerrar Tutor
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
