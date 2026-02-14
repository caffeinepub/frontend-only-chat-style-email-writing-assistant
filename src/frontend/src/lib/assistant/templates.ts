import type { EmailType } from './types';
import { generateVariantDraft, hasVariants } from './templateVariants';

export function generateDraft(
  emailType: EmailType,
  data: Record<string, string>
): string {
  const templates: Record<EmailType, (data: Record<string, string>) => string> = {
    'job-application': (d) => `Subject: Application for ${d.position || '[Position]'} - [Your Name]

Dear ${d.recipient || 'Hiring Manager'},

I am writing to express my interest in the ${d.position || '[Position]'} position at ${d.company || '[Company Name]'}${d.source ? `, as advertised on ${d.source}` : ''}.

${d.qualifications || '[Your key qualifications and experience]'}. I am particularly drawn to this opportunity because it aligns perfectly with my skills and career goals.

I have attached my resume for your review. I would welcome the opportunity to discuss how my background and skills align with your team's needs.

Thank you for your consideration. I look forward to hearing from you.

${getToneClosing(d.tone)}
[Your Name]
[Your Phone]
[Your Email]`,

    'meeting-request': (d) => `Subject: Request for Meeting - ${d.topic || '[Topic]'}

Dear ${d.recipient || '[Name]'},

I hope this message finds you well. I wanted to reach out regarding ${d.topic || '[topic]'}. I believe a brief meeting would help us ${d.topic ? 'discuss this further' : '[purpose/benefit]'}.

Would you be available for a ${d.duration || '30-minute'} meeting${d.availability ? ` ${d.availability}` : ' sometime this week'}? I'm flexible with timing and happy to work around your schedule.

Please let me know what works best for you.

Thank you for your time.

${getToneClosing(d.tone)}
[Your Name]`,

    'leave-request': (d) => `Subject: Request for Time Off - ${d.startDate || '[Dates]'}${d.endDate ? ` to ${d.endDate}` : ''}

Dear ${d.recipient || '[Manager Name]'},

I am writing to request time off from ${d.startDate || '[start date]'} to ${d.endDate || '[end date]'} for ${d.reason || '[personal/family/medical]'} reasons.

I have ensured that all my current projects will be completed before my leave${d.coverage ? `, and I will brief ${d.coverage} to handle any urgent matters during my absence` : ', and I will make arrangements for any urgent matters'}.

Please let me know if you need any additional information or if these dates pose any concerns.

Thank you for your understanding.

${getToneClosing(d.tone)}
[Your Name]`,

    'follow-up': (d) => `Subject: Following Up - ${d.context || '[Topic]'}

Dear ${d.recipient || '[Name]'},

I hope this email finds you well. I wanted to follow up on ${d.context || '[previous topic/conversation]'}${d.previousContact ? ` from ${d.previousContact}` : ''}.

I wanted to check in and see if you had any updates or if there's anything I can provide to help move things forward.

I look forward to hearing from you.

${getToneClosing(d.tone)}
[Your Name]`,

    'thank-you': (d) => `Subject: Thank You

Dear ${d.recipient || '[Name]'},

I wanted to take a moment to express my sincere gratitude for ${d.reason || '[what you are thanking them for]'}.

Your ${d.reason ? 'support' : '[help/support/guidance]'} has been invaluable, and I truly appreciate it.

Thank you again.

${getToneClosing(d.tone)}
[Your Name]`,

    'complaint': (d) => `Subject: Concern Regarding ${d.issue || '[Issue]'}

Dear ${d.recipient || '[Name]'},

I am writing to bring to your attention ${d.issue || '[the issue/concern]'}.

${d.resolution ? `I would appreciate it if we could ${d.resolution}.` : 'I would appreciate your assistance in resolving this matter.'}

Thank you for your attention to this matter. I look forward to your response.

${getToneClosing(d.tone)}
[Your Name]`,

    'introduction': (d) => `Subject: Introduction - [Your Name]

Dear ${d.recipient || '[Name]'},

I hope this email finds you well. I wanted to reach out to introduce myself${d.purpose ? ` regarding ${d.purpose}` : ''}.

${d.background || '[Brief background about yourself and your role/interests]'}.

I would love to connect and learn more about your work${d.purpose ? ` and explore how we might collaborate on ${d.purpose}` : ''}.

Looking forward to connecting.

${getToneClosing(d.tone)}
[Your Name]`,

    'resignation': (d) => `Subject: Resignation - [Your Name]

Dear ${d.recipient || '[Manager Name]'},

I am writing to formally notify you of my resignation from my position at [Company Name]. My last day of work will be ${d.lastDay || '[date]'}.

${d.reason ? `I have decided to ${d.reason}.` : ''} I want to thank you for the opportunities and experiences I have gained during my time here.

I am committed to ensuring a smooth transition and will do everything I can to wrap up my current projects and assist in training my replacement.

Thank you for your understanding.

${getToneClosing(d.tone)}
[Your Name]`,

    'apology': (d) => `Subject: My Apologies

Dear ${d.recipient || '[Name]'},

I am writing to sincerely apologize for ${d.situation || '[what happened]'}.

I understand that this may have caused inconvenience, and I take full responsibility. ${d.action ? `To make this right, I will ${d.action}.` : 'I am committed to ensuring this does not happen again.'}

Thank you for your understanding.

${getToneClosing(d.tone)}
[Your Name]`,

    'invitation': (d) => `Subject: Invitation to ${d.event || '[Event]'}

Dear ${d.recipient || '[Name]'},

I would like to invite you to ${d.event || '[event name]'} on ${d.date || '[date]'}${d.location ? ` at ${d.location}` : ''}.

It would be wonderful to have you join us. Please let me know if you can make it.

Looking forward to seeing you there!

${getToneClosing(d.tone)}
[Your Name]`,

    'congratulations': (d) => `Subject: Congratulations!

Dear ${d.recipient || '[Name]'},

I wanted to reach out to congratulate you on ${d.achievement || '[your achievement]'}!

This is a wonderful accomplishment, and you should be very proud. Wishing you continued success!

${getToneClosing(d.tone)}
[Your Name]`,

    'decline-offer': (d) => `Subject: Re: ${d.offer || '[Offer]'}

Dear ${d.recipient || '[Name]'},

Thank you so much for offering me ${d.offer || '[the opportunity]'}. I truly appreciate you thinking of me.

After careful consideration, I have decided to decline${d.reason ? ` as ${d.reason}` : ''}. This was not an easy decision, and I hope we can stay in touch for future opportunities.

Thank you again for your understanding.

${getToneClosing(d.tone)}
[Your Name]`,

    'custom': (d) => `Subject: ${d.purpose || '[Subject]'}

Dear ${d.recipient || '[Name]'},

${d.purpose || '[State the purpose of your email]'}.

${d.details || '[Include relevant details and information]'}.

${getToneClosing(d.tone)}
[Your Name]`,
  };

  const template = templates[emailType];
  return template ? template(data) : 'Unable to generate draft.';
}

/**
 * Generate an alternative draft for the given email type
 * Prefers using a variant if available and different from current draft
 */
export function generateAlternativeDraft(
  emailType: EmailType,
  data: Record<string, string>,
  currentDraft: string
): string {
  // Check if this email type has variants
  if (hasVariants(emailType)) {
    // Try to generate a variant draft
    const variantDraft = generateVariantDraft(emailType, data, 0);
    
    // If variant exists and is different from current draft, use it
    if (variantDraft && variantDraft !== currentDraft) {
      return variantDraft;
    }
    
    // If variant matches current draft, fall back to default
    const defaultDraft = generateDraft(emailType, data);
    if (defaultDraft !== currentDraft) {
      return defaultDraft;
    }
  }
  
  // For email types without variants, regenerate the default
  return generateDraft(emailType, data);
}

function getToneClosing(tone?: string): string {
  const t = tone?.toLowerCase() || 'formal';
  if (t.includes('casual')) return 'Best,';
  if (t.includes('semi')) return 'Best regards,';
  return 'Sincerely,';
}
