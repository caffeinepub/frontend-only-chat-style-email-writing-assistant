import type { AssistantState, EmailType } from './types';
import { getNextMissingQuestion } from './questions';

export function updateStateField(
  state: AssistantState,
  field: string,
  value: string
): AssistantState {
  return {
    ...state,
    collectedData: {
      ...state.collectedData,
      [field]: value,
    },
  };
}

export function isDataCollectionComplete(state: AssistantState): boolean {
  if (!state.emailType) return false;
  const nextQuestion = getNextMissingQuestion(state.emailType, state.collectedData);
  return nextQuestion === null;
}

export function resetState(): AssistantState {
  return {
    phase: 'idle',
    emailType: null,
    collectedData: {},
    lastDraft: null,
  };
}
