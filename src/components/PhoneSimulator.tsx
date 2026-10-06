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
  Share2
} from 'lucide-react';
import { CategoryId, GameMode, Question, QuizUserAnswer } from '../types/quiz';
import { CATEGORIES, QUESTIONS_DATA } from '../data/questionsData';

interface PhoneSimulatorProps {
  onOpenCode?: (path?: string) => void;
}

export default function PhoneSimulator({ onOpenCode }: PhoneSimulatorProps) {
  // App screen state
  const [currentScreen, setCurrentScreen] = useState<'home' | 'quiz' | 'result'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('modern_fundamentals');
  const [selectedMode, setSelectedMode] = useState<GameMode>('practice');

  // Quiz state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<QuizUserAnswer[]>([]);
  
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
      // Pick 5 varied questions across all categories
      filtered = [...QUESTIONS_DATA].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else if (mode === 'time_trial') {
      // Randomize all questions for rapid answering
      filtered = [...QUESTIONS_DATA].sort(() => 0.5 - Math.random());
    }

    setActiveQuestions(filtered);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerConfirmed(false);
    setScore(0);
    setUserAnswers([]);
    setAiExplanation(null);
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

    if (isCorrect) {
      setScore((prev) => prev + 100);
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
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el tutor de IA');
      }

      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (err: any) {
      setAiError(err.message || 'No se pudo obtener la explicación del tutor.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Phone Hardware Mockup (Pixel 9 Pro style) */}
      <div className="relative w-[380px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 shadow-indigo-950/40 border-4 border-slate-800 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Speaker & Front Camera Hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ring-1 ring-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Screen Bezel Frame */}
        <div className="w-full h-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col relative text-slate-100 select-none">
          
          {/* Android Status Bar */}
          <div className="h-9 px-6 flex items-center justify-between text-[11px] text-slate-400 font-medium z-40 bg-slate-950/90 backdrop-blur-sm">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2.5 border border-slate-400 rounded-xs relative">
                <div className="absolute inset-0.5 bg-slate-200 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col">
            
            {/* 1. HOME SCREEN */}
            {currentScreen === 'home' && (
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
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Modos de Juego
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
                      <span className="text-[9px] text-slate-400">5 variadas</span>
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Categorías (7)
                    </h2>
                    <span className="text-[10px] text-indigo-400 font-medium">Room Database</span>
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

            {/* 2. QUIZ SCREEN */}
            {currentScreen === 'quiz' && currentQ && (
              <div className="flex-1 flex flex-col justify-between py-1 space-y-3 animate-in fade-in duration-150">
                {/* Top bar in quiz */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <button
                      onClick={() => setCurrentScreen('home')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span>
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

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Tags */}
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
                  <h3 className="text-xs font-bold text-slate-100 leading-snug">
                    {currentQ.title}
                  </h3>

                  {/* Code block if any */}
                  {currentQ.codeSnippet && (
                    <div className="mt-2 bg-slate-900 border border-slate-800 rounded-xl p-2.5 overflow-x-auto text-[10px] font-mono text-indigo-200">
                      <pre className="leading-relaxed whitespace-pre">
                        {currentQ.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Options List */}
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

                {/* Feedback Box & Actions */}
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
                            <span>¡Respuesta Correcta! (+100 pts)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Respuesta Incorrecta</span>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-normal">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  {!isAnswerConfirmed ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={handleConfirmAnswer}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer active:scale-98"
                    >
                      Comprobar Respuesta
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={requestAiExplanation}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tutor IA</span>
                      </button>
                      <button
                        onClick={handleNextQuestion}
                        className="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                      >
                        <span>Siguiente</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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

          {/* Android Navigation Bar */}
          <div className="h-6 flex items-center justify-center">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>

        {/* AI Tutor BottomSheet / Modal */}
        {showAiModal && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md rounded-[48px] z-50 p-5 flex flex-col justify-end animate-in fade-in duration-200">
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
        <span>Material You 3</span>
      </div>
    </div>
  );
}
