export function detectUpdate(message: string): {
  field: string | null;
  value: string | null;
} {
  const lowerMessage = message.toLowerCase();

  // Detect tone changes
  if (lowerMessage.includes('change tone') || lowerMessage.includes('make it more')) {
    if (lowerMessage.includes('formal')) {
      return { field: 'tone', value: 'formal' };
    }
    if (lowerMessage.includes('casual')) {
      return { field: 'tone', value: 'casual' };
    }
  }

  // Detect date changes
  if (lowerMessage.includes('new date') || lowerMessage.includes('change date')) {
    const dateMatch = message.match(/\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Z][a-z]+ \d{1,2}/);
    if (dateMatch) {
      return { field: 'startDate', value: dateMatch[0] };
    }
  }

  // Detect recipient changes
  if (lowerMessage.includes('recipient is') || lowerMessage.includes('send to')) {
    const recipientMatch = message.match(/(?:recipient is|send to) (.+)/i);
    if (recipientMatch) {
      return { field: 'recipient', value: recipientMatch[1].trim() };
    }
  }

  return { field: null, value: null };
}
