import type { EmailType } from './types';

export interface Question {
  key: string;
  question: string;
  required: boolean;
}

const COMMON_QUESTIONS: Question[] = [
  { key: 'recipient', question: "Who is this email for? (e.g., 'Hiring Manager', 'John Smith')", required: true },
  { key: 'tone', question: "What tone would you prefer? (formal, semi-formal, or casual)", required: true },
];

const TYPE_SPECIFIC_QUESTIONS: Record<EmailType, Question[]> = {
  'job-application': [
    { key: 'position', question: 'What position are you applying for?', required: true },
    { key: 'company', question: 'What is the company name?', required: true },
    { key: 'qualifications', question: 'What are your key qualifications or skills? (brief summary)', required: true },
    { key: 'source', question: 'Where did you find this job posting? (optional)', required: false },
  ],
  'meeting-request': [
    { key: 'topic', question: 'What is the meeting about?', required: true },
    { key: 'duration', question: 'How long should the meeting be? (e.g., 15 minutes, 30 minutes, 1 hour)', required: true },
    { key: 'availability', question: 'When are you available? (e.g., "this week", "next Tuesday")', required: false },
  ],
  'leave-request': [
    { key: 'startDate', question: 'What is the start date of your leave?', required: true },
    { key: 'endDate', question: 'What is the end date of your leave?', required: true },
    { key: 'reason', question: 'What is the reason? (personal, medical, family, vacation)', required: true },
    { key: 'coverage', question: 'Who will cover your responsibilities? (optional)', required: false },
  ],
  'follow-up': [
    { key: 'context', question: 'What are you following up on?', required: true },
    { key: 'previousContact', question: 'When did you last contact them? (optional)', required: false },
  ],
  'thank-you': [
    { key: 'reason', question: 'What are you thanking them for?', required: true },
  ],
  'complaint': [
    { key: 'issue', question: 'What is the issue or concern?', required: true },
    { key: 'resolution', question: 'What resolution are you seeking? (optional)', required: false },
  ],
  'introduction': [
    { key: 'purpose', question: 'What is the purpose of this introduction?', required: true },
    { key: 'background', question: 'Brief background about yourself (optional)', required: false },
  ],
  'resignation': [
    { key: 'lastDay', question: 'What will be your last day of work?', required: true },
    { key: 'reason', question: 'Brief reason for leaving (optional)', required: false },
  ],
  'apology': [
    { key: 'situation', question: 'What are you apologizing for?', required: true },
    { key: 'action', question: 'What action will you take to make it right? (optional)', required: false },
  ],
  'invitation': [
    { key: 'event', question: 'What is the event?', required: true },
    { key: 'date', question: 'When is it?', required: true },
    { key: 'location', question: 'Where is it? (optional)', required: false },
  ],
  'congratulations': [
    { key: 'achievement', question: 'What are you congratulating them for?', required: true },
  ],
  'decline-offer': [
    { key: 'offer', question: 'What offer are you declining?', required: true },
    { key: 'reason', question: 'Brief reason (optional)', required: false },
  ],
  'custom': [
    { key: 'purpose', question: 'What is the purpose of this email?', required: true },
    { key: 'details', question: 'Any specific details to include?', required: false },
  ],
};

export function getQuestionsForType(emailType: EmailType): Question[] {
  return [...COMMON_QUESTIONS, ...(TYPE_SPECIFIC_QUESTIONS[emailType] || [])];
}

export function getNextMissingQuestion(
  emailType: EmailType,
  collectedData: Record<string, string>
): Question | null {
  const questions = getQuestionsForType(emailType);
  return questions.find((q) => q.required && !collectedData[q.key]) || null;
}
