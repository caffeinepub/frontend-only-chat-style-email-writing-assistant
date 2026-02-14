import type { EmailType } from './types';

export interface EmailTypeInfo {
  id: EmailType;
  label: string;
  triggers: string[];
}

export const EMAIL_TYPES: EmailTypeInfo[] = [
  {
    id: 'job-application',
    label: 'Job Application',
    triggers: ['job application', 'apply for job', 'application email', 'job apply'],
  },
  {
    id: 'meeting-request',
    label: 'Meeting Request',
    triggers: ['meeting request', 'schedule meeting', 'ask for meeting', 'book meeting'],
  },
  {
    id: 'leave-request',
    label: 'Leave / Time Off',
    triggers: ['leave request', 'day off', 'time off', 'vacation request', 'pto'],
  },
  {
    id: 'follow-up',
    label: 'Follow-up',
    triggers: ['follow up', 'followup', 'checking in'],
  },
  {
    id: 'thank-you',
    label: 'Thank You',
    triggers: ['thank you', 'thanks', 'appreciation'],
  },
  {
    id: 'complaint',
    label: 'Complaint / Feedback',
    triggers: ['complaint', 'feedback', 'issue', 'problem'],
  },
  {
    id: 'introduction',
    label: 'Introduction',
    triggers: ['introduction', 'introduce myself', 'intro email'],
  },
  {
    id: 'resignation',
    label: 'Resignation',
    triggers: ['resignation', 'resign', 'quit', 'leaving job'],
  },
  {
    id: 'apology',
    label: 'Apology',
    triggers: ['apology', 'apologize', 'sorry'],
  },
  {
    id: 'invitation',
    label: 'Invitation',
    triggers: ['invitation', 'invite'],
  },
  {
    id: 'congratulations',
    label: 'Congratulations',
    triggers: ['congratulations', 'congrats', 'celebrate'],
  },
  {
    id: 'decline-offer',
    label: 'Decline Offer',
    triggers: ['decline offer', 'turn down', 'reject offer'],
  },
  {
    id: 'custom',
    label: 'Custom Email',
    triggers: ['custom', 'other'],
  },
];

export function getEmailTypeById(id: EmailType): EmailTypeInfo | undefined {
  return EMAIL_TYPES.find((type) => type.id === id);
}
