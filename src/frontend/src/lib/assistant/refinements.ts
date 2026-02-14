import type { EmailType } from './types';
import { generateDraft, generateAlternativeDraft } from './templates';

export type RefinementType = 'more-formal' | 'more-casual' | 'shorter' | 'longer' | 'alternative';

export function applyRefinement(
  refinementType: RefinementType,
  emailType: EmailType,
  data: Record<string, string>,
  currentDraft: string
): string {
  const updatedData = { ...data };

  switch (refinementType) {
    case 'more-formal':
      updatedData.tone = 'formal';
      break;
    case 'more-casual':
      updatedData.tone = 'casual';
      break;
    case 'shorter':
      // Generate with a note to be concise
      return makeEmailShorter(currentDraft);
    case 'longer':
      // Generate with more detail
      return makeEmailLonger(currentDraft, data);
    case 'alternative':
      // Use the new alternative draft generator that prefers variants
      return generateAlternativeDraft(emailType, updatedData, currentDraft);
  }

  return generateDraft(emailType, updatedData);
}

function makeEmailShorter(draft: string): string {
  const lines = draft.split('\n').filter((line) => line.trim());
  const subject = lines.find((l) => l.startsWith('Subject:')) || '';
  const greeting = lines.find((l) => l.startsWith('Dear')) || '';
  const closing = lines.slice(-2).join('\n');

  // Extract main body and condense
  const bodyStart = lines.findIndex((l) => l.startsWith('Dear')) + 1;
  const bodyEnd = lines.length - 2;
  const body = lines.slice(bodyStart, bodyEnd).join(' ').trim();

  // Take first 2 sentences
  const sentences = body.split(/[.!?]+/).filter((s) => s.trim());
  const condensed = sentences.slice(0, 2).join('. ') + '.';

  return `${subject}\n\n${greeting}\n\n${condensed}\n\n${closing}`;
}

function makeEmailLonger(draft: string, data: Record<string, string>): string {
  const lines = draft.split('\n');
  const bodyStartIndex = lines.findIndex((l) => l.startsWith('Dear')) + 2;
  const closingIndex = lines.findIndex((l, i) => i > bodyStartIndex && (l.includes('Best') || l.includes('Sincerely')));

  const additionalContext = `\nI wanted to provide some additional context. ${data.details || 'I believe this opportunity aligns well with my goals and I am excited about the possibility of contributing to your team.'}\n`;

  lines.splice(closingIndex, 0, additionalContext);
  return lines.join('\n');
}
