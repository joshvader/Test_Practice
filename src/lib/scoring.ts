import { Question } from '@/lib/questions';

function scoreTextComplexity(value: unknown): number {
  const text = String(value ?? '').trim();
  if (!text) return 0;

  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceCount = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
  const hasList = /(^|\n)\s*([-*•]|\d+\.)\s+\S+/m.test(text);
  const hasConnectors = /\b(porque|por\s+ejemplo|adem[aá]s|sin\s+embargo|por\s+lo\s+tanto|en\s+conclusi[oó]n|entonces)\b/i.test(text);
  const hasTechTerms =
    /\b(scrum|kanban|sprint|git|pull request|code review|debug|pruebas|testing|documentaci[oó]n|comunicaci[oó]n|feedback|conflicto|prioridad|plazo|deadline|stakeholder)\b/i.test(
      text
    );

  let score = 2;
  if (wordCount >= 20) score += 2;
  if (wordCount >= 50) score += 2;
  if (sentenceCount >= 2) score += 1;
  if (sentenceCount >= 4) score += 1;
  if (hasList) score += 1;
  if (hasConnectors) score += 1;
  if (hasTechTerms) score += 2;

  return Math.min(10, score);
}

function scoreCodeComplexity(value: unknown): number {
  const code = String(value ?? '').trim();
  if (!code) return 0;

  const hasStructure = /[{()[\]}]/.test(code);
  const hasKeywords = /\b(function|const|let|class|interface|type|return|if|for|while)\b/.test(code);
  const hasHtml = /<([a-z]+)(\s[^>]*)?>/i.test(code);
  const lines = code.split('\n').length;
  const length = code.length;

  let score = 2;
  if (hasStructure) score += 2;
  if (hasKeywords || hasHtml) score += 2;
  if (lines >= 6) score += 2;
  if (length >= 160) score += 2;
  if (/(\/\/|\/\*|\*\/)/.test(code)) score += 1;

  return Math.min(10, score);
}

export function maxPointsForQuestion(question: Question): number {
  if (question.type === 'multiple_choice') return question.correctOption === undefined ? 0 : 10;
  if (question.type === 'text') return 10;
  if (question.type === 'code') return 10;
  return 0;
}

export function pointsForQuestionAnswer(question: Question, value: unknown): number {
  if (question.type === 'multiple_choice') {
    if (question.correctOption === undefined) return 0;
    const idx = parseInt(String(value), 10);
    return Number.isFinite(idx) && idx === question.correctOption ? 10 : 0;
  }

  if (question.type === 'text') return scoreTextComplexity(value);
  if (question.type === 'code') return scoreCodeComplexity(value);
  return 0;
}
