export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export type EmailType =
  | 'job-application'
  | 'meeting-request'
  | 'leave-request'
  | 'follow-up'
  | 'thank-you'
  | 'complaint'
  | 'introduction'
  | 'resignation'
  | 'apology'
  | 'invitation'
  | 'congratulations'
  | 'decline-offer'
  | 'custom';

export type Phase = 'idle' | 'selecting-type' | 'collecting-data' | 'draft-ready' | 'refining';

export interface AssistantState {
  phase: Phase;
  emailType: EmailType | null;
  collectedData: Record<string, string>;
  lastDraft: string | null;
}

export interface QuickReply {
  id: string;
  label: string;
  value: string;
}

export interface ProcessResult {
  responses: string[];
  quickReplies?: QuickReply[];
  newState: AssistantState;
}
