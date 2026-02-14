import { EMAIL_TYPES } from './emailTypes';
import type { EmailType } from './types';

const GENERIC_EMAIL_KEYWORDS = ['email', 'write', 'draft', 'help me email', 'compose'];

export function detectIntent(message: string): {
  isEmailIntent: boolean;
  detectedType: EmailType | null;
} {
  const lowerMessage = message.toLowerCase();

  // Check for specific email type triggers first
  for (const emailType of EMAIL_TYPES) {
    for (const trigger of emailType.triggers) {
      if (lowerMessage.includes(trigger)) {
        return {
          isEmailIntent: true,
          detectedType: emailType.id,
        };
      }
    }
  }

  // Check for generic email intent
  const hasGenericIntent = GENERIC_EMAIL_KEYWORDS.some((keyword) =>
    lowerMessage.includes(keyword)
  );

  return {
    isEmailIntent: hasGenericIntent,
    detectedType: null,
  };
}
