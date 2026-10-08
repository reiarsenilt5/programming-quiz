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
  Check,
  Eye,
  EyeOff,
  Key,
  ExternalLink,
  Save,
  RefreshCw,
  AlertTriangle,
  Target
} from 'lucide-react';
import { CategoryId, FailedQuestionRecord, GameMode, Question, QuizUserAnswer } from './types/quiz';
import { CATEGORIES, QUESTIONS_DATA } from './data/questionsData';

export default function App() {
  // Navigation Tabs in Mobile App
  const [activeTab, setActiveTab] = useState<'home' | 'blitz' | 'stats' | 'settings'>('home');
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const tabOrder: Record<'home' | 'blitz' | 'stats' | 'settings', number> = {
    home: 0,
    blitz: 1,
    stats: 2,
    settings: 3,
  };

  const handleTabChange = (newTab: 'home' | 'blitz' | 'stats' | 'settings') => {
    if (newTab === activeTab) return;
    const currentIdx = tabOrder[activeTab];
    const newIdx = tabOrder[newTab];
    setSlideDirection(newIdx > currentIdx ? 'right' : 'left');
    setActiveTab(newTab);
  };

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

  // Failed questions persistent state
  const [failedQuestions, setFailedQuestions] = useState<FailedQuestionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('devquiz_failed_questions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { questionId: 'mf-1', selectedOptionIndex: 1, timestamp: Date.now() - 3600000, failCount: 1 },
      { questionId: 'sql-1', selectedOptionIndex: 0, timestamp: Date.now() - 7200000, failCount: 2 },
    ];
  });

  // Sync failed questions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('devquiz_failed_questions', JSON.stringify(failedQuestions));
    } catch (e) {
      console.error('Error saving failed questions', e);
    }
  }, [failedQuestions]);

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

  // Gemini API Key management in Settings
  const [customApiKey, setCustomApiKey] = useState(() => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [showApiKeyText, setShowApiKeyText] = useState(false);
  const [keySaveMessage, setKeySaveMessage] = useState<string | null>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<{ valid: boolean; message: string } | null>(null);

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

    let filtered: Question[] = [];
    if (mode === 'failed_review') {
      const failedIds = new Set(failedQuestions.map((f) => f.questionId));
      filtered = QUESTIONS_DATA.filter((q) => failedIds.has(q.id));
      if (filtered.length === 0) {
        filtered = [...QUESTIONS_DATA].sort(() => 0.5 - Math.random()).slice(0, 5);
      }
    } else if (mode === 'daily_challenge') {
      filtered = [...QUESTIONS_DATA].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else if (mode === 'time_trial') {
      filtered = [...QUESTIONS_DATA].sort(() => 0.5 - Math.random());
    } else {
      filtered = QUESTIONS_DATA.filter((q) => q.categoryId === categoryId);
      if (filtered.length === 0) {
        filtered = [...QUESTIONS_DATA].slice(0, 5);
      }
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

    // Record failure or remove mastered question
    if (!isCorrect) {
      setFailedQuestions((prev) => {
        const existing = prev.find((f) => f.questionId === currentQ.id);
        if (existing) {
          return prev.map((f) =>
            f.questionId === currentQ.id
              ? { ...f, selectedOptionIndex: selectedOption, failCount: f.failCount + 1, timestamp: Date.now() }
              : f
          );
        }
        return [
          ...prev,
          { questionId: currentQ.id, selectedOptionIndex: selectedOption, timestamp: Date.now(), failCount: 1 },
        ];
      });
    } else if (selectedMode === 'failed_review') {
      // Correct in review mode: eliminate from failed list!
      setFailedQuestions((prev) => prev.filter((f) => f.questionId !== currentQ.id));
    }

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
          customApiKey: customApiKey || undefined
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.details || data.error || 'Error de conexión con el tutor virtual.');
      }

      setAiExplanation(data.explanation);
    } catch (err: any) {
      setAiError(err.message || 'No se pudo obtener la explicación de IA.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    try {
      localStorage.setItem('gemini_api_key', customApiKey.trim());
      setKeySaveMessage('¡Clave guardada exitosamente en este navegador!');
      setKeyTestResult(null);
      setTimeout(() => setKeySaveMessage(null), 4000);
    } catch (e) {
      setKeySaveMessage('No se pudo guardar en almacenamiento local.');
    }
  };

  const handleClearApiKey = () => {
    try {
      localStorage.removeItem('gemini_api_key');
      setCustomApiKey('');
      setKeySaveMessage('Clave personal eliminada. Usando configuración por defecto.');
      setKeyTestResult(null);
      setTimeout(() => setKeySaveMessage(null), 3000);
    } catch (e) {
      setCustomApiKey('');
    }
  };

  const handleTestApiKey = async () => {
    setIsTestingKey(true);
    setKeyTestResult(null);
    try {
      const response = await fetch('/api/verify-gemini-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: customApiKey }),
      });
      const data = await response.json();
      if (response.ok && data.valid) {
        setKeyTestResult({ valid: true, message: data.message || '¡Clave válida y conectada con Gemini!' });
      } else {
        setKeyTestResult({ valid: false, message: data.error || 'La clave proporcionada no es válida o fue rechazada.' });
      }
    } catch (e: any) {
      setKeyTestResult({ valid: false, message: e.message || 'Error al conectar con el servidor de pruebas.' });
    } finally {
      setIsTestingKey(false);
    }
  };

  const currentQ = activeQuestions[currentIndex];
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const quizTitle = selectedMode === 'time_trial'
    ? 'Blitz 60s'
    : selectedMode === 'daily_challenge'
    ? 'Desafío Diario'
    : selectedMode === 'failed_review'
    ? 'Repaso de Fallos'
    : (activeCategoryObj?.name || currentQ?.categoryName || 'DevQuiz');

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex items-center justify-center p-0 sm:p-4 font-sans select-none selection:bg-emerald-500 selection:text-slate-950">
      {/* Native Mobile Frame (Material 3 Mobile Screen) */}
      <div className="w-full sm:max-w-[420px] h-screen sm:h-[860px] sm:max-h-[96vh] bg-[#090D16] sm:rounded-[44px] shadow-2xl sm:border-4 border-slate-800/90 ring-0 sm:ring-1 ring-slate-700/50 flex flex-col overflow-hidden relative">
        
        {/* Android Punch Hole & Speaker with generous clearance (visible on desktop mockup, hidden on real small-screen mobile to avoid double punch-hole) */}
        <div className="hidden sm:flex absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 items-center justify-between px-3.5 ring-1 ring-slate-800/60 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-700/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 animate-pulse" />
        </div>

        {/* Status Bar with generous safe area height preventing notch / camera clipping */}
        <div className="pt-safe pb-2.5 px-5 sm:px-6 flex items-center justify-between text-[11px] text-slate-400 font-medium z-40 bg-[#090D16]/95 backdrop-blur-md shrink-0 border-b border-slate-850/80 min-h-[58px] sm:h-14 sm:pt-4">
          <span className="font-semibold tracking-tight text-slate-300">09:41</span>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] font-bold">5G</span>
            <div className="w-5 h-2.5 border border-slate-400/80 rounded-xs relative p-0.5">
              <div className="h-full w-2.5 bg-slate-300 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Main Mobile App Content */}
        <div className="flex-1 overflow-y-auto px-4.5 sm:px-5 pb-3 flex flex-col">
          
          {/* ==================== QUIZ ACTIVE VIEW ==================== */}
          {inQuiz && !quizFinished && currentQ && (
            <div className="flex-1 flex flex-col justify-between pt-3 pb-2 space-y-3.5 animate-in fade-in duration-150">
              {/* Quiz Header with safe margin and accessible touch target */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 gap-2">
                  <button
                    onClick={exitQuiz}
                    className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
                    title="Salir del examen"
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
                        timeLeft <= 10 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-slate-900 text-emerald-400 border-slate-800'
                      }`}>
                        ⏱ {timeLeft}s
                      </span>
                    )}
                  </div>
                </div>

                {/* Linear Progress Indicator */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Clean Zero-Pill Metadata Kicker (Anti-Slop Discipline) */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 select-none flex-wrap">
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
                  {selectedMode === 'failed_review' && (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-amber-400 font-medium">Repaso de Fallo</span>
                    </>
                  )}
                </div>

                {/* Banner de Repaso de Fallo si aplica */}
                {selectedMode === 'failed_review' && (
                  <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-2.5 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold text-amber-300 block text-[11px]">Pregunta Pendiente de Superar</span>
                        {(() => {
                          const failRecord = failedQuestions.find((f) => f.questionId === currentQ.id);
                          if (failRecord && failRecord.selectedOptionIndex >= 0) {
                            return (
                              <span className="text-[10px] text-slate-300">
                                En tu intento anterior elegiste la <strong className="text-rose-400">Opción {String.fromCharCode(65 + failRecord.selectedOptionIndex)}</strong>
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                      {failedQuestions.length} por corregir
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-100 leading-snug tracking-tight">
                  {currentQ.title}
                </h3>

                {/* Code Block */}
                {currentQ.codeSnippet && (
                  <div className="mt-2 bg-[#070b12] border border-slate-800/90 rounded-xl p-2.5 overflow-x-auto text-[10px] font-mono text-emerald-200/90 shadow-inner">
                    <pre className="leading-relaxed whitespace-pre font-mono">
                      {currentQ.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>

              {/* Options */}
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

                  const prevFail = failedQuestions.find((f) => f.questionId === currentQ.id);
                  const isPreviousWrong = selectedMode === 'failed_review' && prevFail?.selectedOptionIndex === idx;

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
                      {isPreviousWrong && !isAnswerConfirmed && (
                        <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-semibold shrink-0">
                          Tu fallo previo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Card */}
              <div className="space-y-2 pt-1 pb-1">
                {isAnswerConfirmed && (
                  <>
                    {selectedMode === 'failed_review' && selectedOption === currentQ.correctAnswerIndex && (
                      <div className="p-2.5 rounded-xl border bg-emerald-950/60 border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                        <span className="text-base">🎉</span>
                        <div>
                          <span className="font-bold text-emerald-300 block text-[11px]">¡Concepto Dominado!</span>
                          <span className="text-[10px] text-slate-300">Esta pregunta ha sido retirada automáticamente de tu lista de fallos pendientes.</span>
                        </div>
                      </div>
                    )}

                    <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                      selectedOption === currentQ.correctAnswerIndex
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold">
                        {selectedOption === currentQ.correctAnswerIndex ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300">¡Correcto! (+100 pts)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span className="text-rose-300">Incorrecto</span>
                          </>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-normal pl-5.5">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </>
                )}

                {/* Bottom Action Buttons (Primary Emerald CTA vs Secondary Glass Tutor) */}
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
                {userAnswers.some((a) => !a.isCorrect) && (
                  <button
                    onClick={() => startQuiz(selectedCategory, 'failed_review')}
                    className="w-full bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 active:scale-98"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Repasar Fallos de este Examen ({userAnswers.filter((a) => !a.isCorrect).length})</span>
                  </button>
                )}
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
            <div key="tab-home" className={`space-y-4 pt-1 ${slideDirection === 'right' ? 'tab-slide-right' : 'tab-slide-left'}`}>
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
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => startQuiz(selectedCategory, 'practice')}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">Práctica</span>
                    <span className="text-[8px] text-slate-400">Sin reloj</span>
                  </button>

                  <button
                    onClick={() => startQuiz(selectedCategory, 'time_trial')}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">Blitz 60s</span>
                    <span className="text-[8px] text-slate-400">60 seg</span>
                  </button>

                  <button
                    onClick={() => startQuiz(selectedCategory, 'daily_challenge')}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-2 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">Diario</span>
                    <span className="text-[8px] text-slate-400">5 retos</span>
                  </button>

                  <button
                    onClick={() => startQuiz(selectedCategory, 'failed_review')}
                    className={`border p-2 rounded-2xl flex flex-col items-center text-center transition cursor-pointer group active:scale-95 ${
                      failedQuestions.length > 0
                        ? 'bg-amber-950/30 hover:bg-amber-900/40 border-amber-500/40'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1 group-hover:scale-110 transition ${
                      failedQuestions.length > 0
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200">Reintentar</span>
                    <span className={`text-[8px] font-medium truncate max-w-full ${
                      failedQuestions.length > 0 ? 'text-amber-300 font-bold' : 'text-slate-400'
                    }`}>
                      {failedQuestions.length > 0 ? `${failedQuestions.length} retos` : 'Al día'}
                    </span>
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

          {/* ==================== 2. TAB: BLITZ ==================== */}
          {!inQuiz && activeTab === 'blitz' && (
            <div key="tab-blitz" className={`space-y-4 pt-2 ${slideDirection === 'right' ? 'tab-slide-right' : 'tab-slide-left'}`}>
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
            <div key="tab-stats" className={`space-y-4 pt-1 ${slideDirection === 'right' ? 'tab-slide-right' : 'tab-slide-left'}`}>
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

              {/* Banco de Errores Técnicos */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                        Banco de Errores Técnicos
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        {failedQuestions.length > 0
                          ? `${failedQuestions.length} preguntas pendientes de superar`
                          : '¡Todos los conceptos al día!'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      failedQuestions.length > 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {failedQuestions.length} pendientes
                  </span>
                </div>

                {failedQuestions.length > 0 ? (
                  <>
                    <button
                      onClick={() => startQuiz(selectedCategory, 'failed_review')}
                      className="w-full bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold py-2.5 px-3 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-950/40 active:scale-98"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Iniciar Sesión de Repaso ({failedQuestions.length} fallos)</span>
                    </button>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {failedQuestions.map((item) => {
                        const q = QUESTIONS_DATA.find((x) => x.id === item.questionId);
                        if (!q) return null;
                        return (
                          <div
                            key={item.questionId}
                            className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl space-y-1.5 text-left"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {q.categoryName}
                              </span>
                              <span className="text-[9px] text-rose-400 font-semibold">
                                Fallada {item.failCount} {item.failCount === 1 ? 'vez' : 'veces'}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-200 line-clamp-2 leading-tight">
                              {q.title}
                            </p>
                            <div className="text-[10px] text-slate-400 pt-0.5 flex flex-col gap-0.5">
                              <span className="text-rose-400">
                                ✗ Tu error: {q.options[item.selectedOptionIndex] || `Opción ${String.fromCharCode(65 + item.selectedOptionIndex)}`}
                              </span>
                              <span className="text-emerald-400">
                                ✓ Correcta: {q.options[q.correctAnswerIndex]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          setFailedQuestions([]);
                          localStorage.removeItem('devquiz_failed_questions');
                        }}
                        className="text-[10px] text-slate-500 hover:text-rose-400 transition cursor-pointer underline"
                      >
                        Limpiar registro de fallos
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-950/60 border border-slate-800/60 p-3 rounded-xl flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-xs font-bold text-slate-200">¡Excelente disciplina!</p>
                      <p className="text-[10px] text-slate-400">
                        No tienes preguntas pendientes en tu banco de errores. Cualquier fallo futuro se registrará aquí para que puedas repasarlo.
                      </p>
                    </div>
                  </div>
                )}
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
            <div key="tab-settings" className={`space-y-4 pt-1 ${slideDirection === 'right' ? 'tab-slide-right' : 'tab-slide-left'}`}>
              <h2 className="text-base font-bold text-white">Configuración</h2>

              {/* Gemini AI Key Configuration Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-lg shadow-purple-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Tutor de IA (Google Gemini)</span>
                      <span className="text-[10px] text-purple-300">Modelo Gemini Flash Lite (gemini-3.1-flash-lite)</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    customApiKey ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {customApiKey ? '● Clave Personal' : '● Servidor Activo'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ingresa tu clave de API de Gemini para usar tu cuota personal o probarla antes de compilar en tu celular físico:
                </p>

                {/* API Key Input */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showApiKeyText ? 'text' : 'password'}
                      placeholder="Pega tu clave Gemini aquí (AIzaSy...)"
                      value={customApiKey}
                      onChange={(e) => {
                        setCustomApiKey(e.target.value);
                        setKeySaveMessage(null);
                        setKeyTestResult(null);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKeyText(!showApiKeyText)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                    >
                      {showApiKeyText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveApiKey}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-950/40 active:scale-98"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Clave</span>
                    </button>

                    <button
                      onClick={handleTestApiKey}
                      disabled={isTestingKey}
                      className="bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-200 font-medium py-2 px-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 active:scale-98"
                    >
                      {isTestingKey ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                          <span>Probando...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Probar Conexión</span>
                        </>
                      )}
                    </button>

                    {customApiKey && (
                      <button
                        onClick={handleClearApiKey}
                        className="bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 font-medium py-2 px-2.5 rounded-xl transition text-xs cursor-pointer border border-slate-700"
                        title="Limpiar clave"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>

                  {/* Feedback Messages */}
                  {keySaveMessage && (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{keySaveMessage}</span>
                    </div>
                  )}

                  {keyTestResult && (
                    <div className={`p-2.5 rounded-xl text-[11px] flex items-center gap-1.5 animate-in fade-in ${
                      keyTestResult.valid
                        ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                    }`}>
                      {keyTestResult.valid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>{keyTestResult.message}</span>
                    </div>
                  )}
                </div>

                {/* Link to AI Studio */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">¿No tienes clave de Gemini?</span>
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-semibold underline inline-flex items-center gap-1"
                  >
                    Crear en Google AI Studio (Gratis) <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Guía APK & GitHub Actions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Key className="w-4 h-4" />
                  <span>Para que funcione en tu celular físico:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  1. <strong>En la app de tu teléfono</strong>: Ve a la pestaña Ajustes e introduce tu clave exactamente igual que aquí.
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  2. <strong>Al compilar el APK</strong>: En tu repositorio de GitHub, añade un secreto llamado <code className="text-indigo-300 font-mono bg-slate-950 px-1 py-0.5 rounded">GEMINI_API_KEY</code> en <em>Settings ➔ Secrets and variables ➔ Actions</em>. El APK generado incluirá la clave automáticamente.
                </p>
              </div>

              {/* Other settings */}
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
                    <span className="font-semibold text-slate-200 block">Base de Datos Local</span>
                    <span className="text-[10px] text-slate-400">Room SQLite (Offline)</span>
                  </div>
                  <span className="text-indigo-400 font-mono text-[10px]">
                    13 Categorías (150+ Preguntas)
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
          <nav className="border-t border-slate-800/80 bg-[#090D16]/95 backdrop-blur-md px-4 pt-1 pb-safe min-h-[60px] sm:h-16 flex items-center justify-around z-40">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer min-w-[48px] py-1 ${
                activeTab === 'home' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Home className="w-4.5 h-4.5" />
              <span className="text-[10px]">Inicio</span>
            </button>

            <button
              onClick={() => handleTabChange('blitz')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer min-w-[48px] py-1 ${
                activeTab === 'blitz' ? 'text-rose-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Zap className="w-4.5 h-4.5" />
              <span className="text-[10px]">Blitz 60s</span>
            </button>

            <button
              onClick={() => handleTabChange('stats')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer min-w-[48px] py-1 ${
                activeTab === 'stats' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span className="text-[10px]">Estadísticas</span>
            </button>

            <button
              onClick={() => handleTabChange('settings')}
              className={`flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer min-w-[48px] py-1 ${
                activeTab === 'settings' ? 'text-purple-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span className="text-[10px]">Ajustes</span>
            </button>
          </nav>
        )}

        {/* Android Simulated Home Indicator Bar (Desktop Mockup only) */}
        <div className="hidden sm:flex h-4 items-center justify-center bg-[#090D16]">
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
                    <div className="text-rose-300 text-xs p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Aviso del Tutor de IA</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{aiError}</p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-300 space-y-1">
                      <span className="font-semibold text-white block">Posibles soluciones:</span>
                      <p>• Comprueba tu conexión a internet (Wi-Fi o datos).</p>
                      <p>• Configura o verifica tu clave gratuita en la pestaña <strong>Ajustes</strong>.</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={requestAiExplanation}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-950/40"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reintentar</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowAiModal(false);
                          setInQuiz(false);
                          handleTabChange('settings');
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-xl font-medium cursor-pointer border border-slate-700"
                      >
                        Ir a Ajustes
                      </button>
                    </div>
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
