import type { EmailType } from './types';

/**
 * Template variant generator function type
 */
type TemplateGenerator = (data: Record<string, string>) => string;

/**
 * Registry of additional template variants for each email type
 */
const variantRegistry: Partial<Record<EmailType, TemplateGenerator[]>> = {
  'follow-up': [
    // Variant 1: User-provided follow-up template
    (d) => `Subject: Following Up - ${d.context || '[Original Topic]'}

Dear ${d.recipient || '[Name]'},

I hope you're doing well. I wanted to follow up on my previous email regarding ${d.context || '[topic/request]'}${d.previousContact ? ` sent on ${d.previousContact}` : ''}.

I understand you have a busy schedule, but I would appreciate any update you can provide when you have a moment.

Please let me know if you need any additional information from my end.

Thank you for your time.

${getToneClosing(d.tone)}
[Your Name]`,
  ],
  'thank-you': [
    // Variant 1: User-provided thank you template
    (d) => `Subject: Thank You - ${d.reason || '[Reason]'}

Dear ${d.recipient || '[Name]'},

I wanted to take a moment to thank you for ${d.reason || '[specific thing - your help, your time, the opportunity, etc.]'}.

${d.details ? `${d.details}` : '[Optional: Add specific detail about how it helped you or what impact it had]'}

I truly appreciate your ${d.reason ? 'support' : '[support/guidance/assistance]'}, and I look forward to ${d.future || '[continuing to work together/future opportunities]'}.

Thank you once again.

${getToneClosing(d.tone, 'Warm regards,')}
[Your Name]`,
  ],
  'complaint': [
    // Variant 1: User-provided complaint/feedback template
    (d) => `Subject: Feedback Regarding ${d.issue || '[Issue]'}

Dear ${d.recipient || '[Name/Team]'},

I am writing to bring to your attention an issue I recently experienced with ${d.issue || '[product/service/situation]'}.

${d.details || '[Describe the issue clearly and objectively]'}

I would appreciate it if this matter could be addressed, and I would like to request ${d.resolution || '[specific resolution - refund/replacement/explanation]'}.

I value ${d.relationship || '[company/relationship]'} and hope we can resolve this promptly.

Thank you for your attention to this matter.

${getToneClosing(d.tone)}
[Your Name]`,
  ],
};

/**
 * Get all available template generators for a given email type
 * Returns an array with the default template first, followed by any variants
 */
export function getTemplateVariants(emailType: EmailType): TemplateGenerator[] {
  const variants = variantRegistry[emailType] || [];
  return variants;
}

/**
 * Check if an email type has additional variants beyond the default
 */
export function hasVariants(emailType: EmailType): boolean {
  return (variantRegistry[emailType]?.length || 0) > 0;
}

/**
 * Generate a draft using a specific variant index
 * @param emailType The type of email
 * @param data The collected data
 * @param variantIndex The variant to use (0 = first variant, etc.)
 * @returns The generated draft or null if variant doesn't exist
 */
export function generateVariantDraft(
  emailType: EmailType,
  data: Record<string, string>,
  variantIndex: number
): string | null {
  const variants = variantRegistry[emailType];
  if (!variants || variantIndex < 0 || variantIndex >= variants.length) {
    return null;
  }
  return variants[variantIndex](data);
}

/**
 * Helper function for tone-based closing
 */
function getToneClosing(tone?: string, defaultClosing?: string): string {
  const t = tone?.toLowerCase() || 'formal';
  if (t.includes('casual')) return 'Best,';
  if (t.includes('semi')) return 'Best regards,';
  return defaultClosing || 'Sincerely,';
}
