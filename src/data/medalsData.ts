import { VirtualMedal } from '../types/quiz';

export interface MilestoneContext {
  streakDays: number;
  totalAnswered: number;
  totalCorrect: number;
  hasPerfectTest: boolean;
  blitzHighScore: number;
  masteredBugsCount: number;
  hasUsedAiTutor: boolean;
}

export interface MedalDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  checkUnlocked: (ctx: MilestoneContext) => boolean;
  getProgress: (ctx: MilestoneContext) => string;
}

export const MEDAL_DEFINITIONS: MedalDefinition[] = [
  {
    id: 'streak_7_days',
    title: 'Racha de 7 Días',
    description: 'Mantén una racha activa de estudio de 7 días consecutivos.',
    emoji: '🔥',
    tier: 'gold',
    checkUnlocked: (ctx) => ctx.streakDays >= 7,
    getProgress: (ctx) => `${Math.min(ctx.streakDays, 7)} / 7 días`,
  },
  {
    id: 'perfect_score_100',
    title: '100% de Precisión',
    description: 'Completa un test de examen con 100% de aciertos sin ningún error.',
    emoji: '🎯',
    tier: 'diamond',
    checkUnlocked: (ctx) => ctx.hasPerfectTest,
    getProgress: (ctx) => ctx.hasPerfectTest ? '100% logrado' : '0 / 1 test perfecto',
  },
  {
    id: 'blitz_master',
    title: 'Relámpago Blitz',
    description: 'Consigue 5 o más respuestas correctas en una sola ronda de Blitz 60s.',
    emoji: '⚡',
    tier: 'silver',
    checkUnlocked: (ctx) => ctx.blitzHighScore >= 5,
    getProgress: (ctx) => `${Math.min(ctx.blitzHighScore, 5)} / 5 aciertos`,
  },
  {
    id: 'veteran_dev',
    title: 'Veterano del Código',
    description: 'Responde un total acumulado de al menos 50 preguntas técnicas.',
    emoji: '🚀',
    tier: 'gold',
    checkUnlocked: (ctx) => ctx.totalAnswered >= 50,
    getProgress: (ctx) => `${Math.min(ctx.totalAnswered, 50)} / 50 preguntas`,
  },
  {
    id: 'bug_hunter',
    title: 'Cazador de Bugs',
    description: 'Domina y retira al menos 1 concepto fallado del banco de errores.',
    emoji: '🐛',
    tier: 'bronze',
    checkUnlocked: (ctx) => ctx.masteredBugsCount >= 1,
    getProgress: (ctx) => ctx.masteredBugsCount >= 1 ? 'Dominado' : '0 / 1 fallo superado',
  },
  {
    id: 'ai_collaborator',
    title: 'Poder de la IA',
    description: 'Profundiza en un concepto con el Mentor Técnico Gemini Flash Lite.',
    emoji: '🤖',
    tier: 'bronze',
    checkUnlocked: (ctx) => ctx.hasUsedAiTutor,
    getProgress: (ctx) => ctx.hasUsedAiTutor ? 'Consultado' : '0 / 1 tutoría',
  },
];

const MEDALS_STORAGE_KEY = 'devquiz_virtual_medals_unlocked';

export function loadUnlockedMedals(): Record<string, number> {
  try {
    const raw = localStorage.getItem(MEDALS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveUnlockedMedal(medalId: string): void {
  try {
    const current = loadUnlockedMedals();
    if (!current[medalId]) {
      current[medalId] = Date.now();
      localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(current));
    }
  } catch {}
}

export function evaluateAndAwardMedals(
  ctx: MilestoneContext,
  currentUnlocked: Record<string, number>,
  onNewMedalAwarded?: (medal: MedalDefinition) => void
): Record<string, number> {
  const updated = { ...currentUnlocked };
  let newlyAwarded = false;

  for (const def of MEDAL_DEFINITIONS) {
    if (!updated[def.id] && def.checkUnlocked(ctx)) {
      updated[def.id] = Date.now();
      newlyAwarded = true;
      if (onNewMedalAwarded) {
        onNewMedalAwarded(def);
      }
    }
  }

  if (newlyAwarded) {
    try {
      localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  return updated;
}
