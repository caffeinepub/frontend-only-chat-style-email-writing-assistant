import type { ProcessResult, AssistantState, QuickReply, EmailType } from './types';
import { detectIntent } from './intent';
import { EMAIL_TYPES, getEmailTypeById } from './emailTypes';
import { getNextMissingQuestion } from './questions';
import { generateDraft } from './templates';
import { applyRefinement, type RefinementType } from './refinements';
import { detectUpdate } from './updates';
import { isDataCollectionComplete, updateStateField } from './state';

export function processUserMessage(
  message: string,
  currentState: AssistantState
): ProcessResult {
  const trimmedMessage = message.trim();

  // Handle refinement phase
  if (currentState.phase === 'refining' || currentState.phase === 'draft-ready') {
    return handleRefinementPhase(trimmedMessage, currentState);
  }

  // Handle data collection phase
  if (currentState.phase === 'collecting-data' && currentState.emailType) {
    return handleDataCollection(trimmedMessage, currentState);
  }

  // Handle type selection phase
  if (currentState.phase === 'selecting-type') {
    return handleTypeSelection(trimmedMessage, currentState);
  }

  // Handle idle phase - detect intent
  const intent = detectIntent(trimmedMessage);

  if (intent.detectedType) {
    // Specific type detected, start collecting data
    return startDataCollection(intent.detectedType);
  }

  if (intent.isEmailIntent) {
    // Generic email intent, show type menu
    return showEmailTypeMenu();
  }

  // No email intent detected
  return {
    responses: [
      "I'm here to help you write professional emails! Would you like to draft an email? I can help with job applications, meeting requests, thank you notes, and more.",
    ],
    quickReplies: [
      { id: 'yes', label: 'Yes, help me write an email', value: 'Yes, help me write an email' },
    ],
    newState: currentState,
  };
}

function showEmailTypeMenu(): ProcessResult {
  const quickReplies: QuickReply[] = EMAIL_TYPES.map((type) => ({
    id: type.id,
    label: type.label,
    value: type.label,
  }));

  return {
    responses: [
      'Great! What type of email would you like to write? Choose from the options below:',
    ],
    quickReplies,
    newState: {
      phase: 'selecting-type',
      emailType: null,
      collectedData: {},
      lastDraft: null,
    },
  };
}

function handleTypeSelection(message: string, state: AssistantState): ProcessResult {
  const lowerMessage = message.toLowerCase();
  const selectedType = EMAIL_TYPES.find(
    (type) =>
      type.label.toLowerCase() === lowerMessage ||
      type.triggers.some((trigger) => lowerMessage.includes(trigger))
  );

  if (selectedType) {
    return startDataCollection(selectedType.id);
  }

  return {
    responses: ["I didn't catch that. Please select one of the email types from the menu."],
    quickReplies: EMAIL_TYPES.map((type) => ({
      id: type.id,
      label: type.label,
      value: type.label,
    })),
    newState: state,
  };
}

function startDataCollection(emailType: EmailType): ProcessResult {
  const newState: AssistantState = {
    phase: 'collecting-data',
    emailType,
    collectedData: {},
    lastDraft: null,
  };

  const nextQuestion = getNextMissingQuestion(emailType, {});
  const typeInfo = getEmailTypeById(emailType);

  if (!nextQuestion) {
    return generateDraftFromState(newState);
  }

  return {
    responses: [
      `Perfect! I'll help you write a ${typeInfo?.label || 'professional email'}. Let me ask you a few questions.`,
      nextQuestion.question,
    ],
    newState,
  };
}

function handleDataCollection(message: string, state: AssistantState): ProcessResult {
  if (!state.emailType) {
    return { responses: ['Something went wrong. Let\'s start over.'], newState: state };
  }

  // Check for updates to existing data
  const update = detectUpdate(message);
  let updatedState = state;

  if (update.field && update.value) {
    updatedState = updateStateField(state, update.field, update.value);
  } else {
    // Store the answer to the current question
    const nextQuestion = getNextMissingQuestion(state.emailType, state.collectedData);
    if (nextQuestion) {
      updatedState = updateStateField(state, nextQuestion.key, message);
    }
  }

  // Check if we have all required data
  if (isDataCollectionComplete(updatedState)) {
    return generateDraftFromState(updatedState);
  }

  // Ask next question - with null check
  if (!updatedState.emailType) {
    return { responses: ['Something went wrong. Let\'s start over.'], newState: updatedState };
  }

  const nextQuestion = getNextMissingQuestion(updatedState.emailType, updatedState.collectedData);
  if (nextQuestion) {
    return {
      responses: [nextQuestion.question],
      newState: updatedState,
    };
  }

  return generateDraftFromState(updatedState);
}

function generateDraftFromState(state: AssistantState): ProcessResult {
  if (!state.emailType) {
    return { responses: ['Unable to generate draft.'], newState: state };
  }

  const draft = generateDraft(state.emailType, state.collectedData);

  const refinementReplies: QuickReply[] = [
    { id: 'more-formal', label: 'Make it more formal', value: 'Make it more formal' },
    { id: 'more-casual', label: 'Make it more casual', value: 'Make it more casual' },
    { id: 'shorter', label: 'Make it shorter', value: 'Make it shorter' },
    { id: 'longer', label: 'Make it longer', value: 'Make it longer' },
    { id: 'alternative', label: 'Generate alternative', value: 'Generate an alternative version' },
    { id: 'new', label: 'Start new email', value: 'Start a new email' },
  ];

  return {
    responses: [
      "Great! Here's your email draft:",
      draft,
      'Would you like me to adjust anything?',
    ],
    quickReplies: refinementReplies,
    newState: {
      ...state,
      phase: 'draft-ready',
      lastDraft: draft,
    },
  };
}

function handleRefinementPhase(message: string, state: AssistantState): ProcessResult {
  const lowerMessage = message.toLowerCase();

  // Check for starting a new email
  if (lowerMessage.includes('new email') || lowerMessage.includes('start over')) {
    return showEmailTypeMenu();
  }

  // Check for refinement requests
  let refinementType: RefinementType | null = null;

  if (lowerMessage.includes('more formal')) {
    refinementType = 'more-formal';
  } else if (lowerMessage.includes('more casual') || lowerMessage.includes('less formal')) {
    refinementType = 'more-casual';
  } else if (lowerMessage.includes('shorter') || lowerMessage.includes('concise')) {
    refinementType = 'shorter';
  } else if (lowerMessage.includes('longer') || lowerMessage.includes('more detail')) {
    refinementType = 'longer';
  } else if (lowerMessage.includes('alternative') || lowerMessage.includes('different version')) {
    refinementType = 'alternative';
  }

  if (refinementType && state.emailType && state.lastDraft) {
    const refinedDraft = applyRefinement(
      refinementType,
      state.emailType,
      state.collectedData,
      state.lastDraft
    );

    const refinementReplies: QuickReply[] = [
      { id: 'more-formal', label: 'Make it more formal', value: 'Make it more formal' },
      { id: 'more-casual', label: 'Make it more casual', value: 'Make it more casual' },
      { id: 'shorter', label: 'Make it shorter', value: 'Make it shorter' },
      { id: 'longer', label: 'Make it longer', value: 'Make it longer' },
      { id: 'alternative', label: 'Generate alternative', value: 'Generate an alternative version' },
      { id: 'new', label: 'Start new email', value: 'Start a new email' },
    ];

    return {
      responses: [
        "Here's the updated version:",
        refinedDraft,
        'Anything else you would like to adjust?',
      ],
      quickReplies: refinementReplies,
      newState: {
        ...state,
        phase: 'refining',
        lastDraft: refinedDraft,
      },
    };
  }

  // Check for specific field updates
  const update = detectUpdate(message);
  if (update.field && update.value && state.emailType) {
    const updatedState = updateStateField(state, update.field, update.value);
    const updatedDraft = generateDraft(state.emailType, updatedState.collectedData);

    return {
      responses: [
        `Updated ${update.field}. Here's the new draft:`,
        updatedDraft,
        'Anything else?',
      ],
      quickReplies: [
        { id: 'more-formal', label: 'Make it more formal', value: 'Make it more formal' },
        { id: 'more-casual', label: 'Make it more casual', value: 'Make it more casual' },
        { id: 'new', label: 'Start new email', value: 'Start a new email' },
      ],
      newState: {
        ...updatedState,
        phase: 'refining',
        lastDraft: updatedDraft,
      },
    };
  }

  return {
    responses: [
      "I can help you adjust the tone, length, or generate an alternative version. What would you like to change?",
    ],
    quickReplies: [
      { id: 'more-formal', label: 'Make it more formal', value: 'Make it more formal' },
      { id: 'more-casual', label: 'Make it more casual', value: 'Make it more casual' },
      { id: 'shorter', label: 'Make it shorter', value: 'Make it shorter' },
      { id: 'longer', label: 'Make it longer', value: 'Make it longer' },
      { id: 'new', label: 'Start new email', value: 'Start a new email' },
    ],
    newState: state,
  };
}
