import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail } from 'lucide-react';
import type { Message } from '@/lib/assistant/types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <Avatar className="h-8 w-8 border border-primary/20 shrink-0">
          <AvatarImage src="/assets/generated/email-bot-avatar.dim_256x256.png" alt="Assistant" />
          <AvatarFallback className="bg-primary/10">
            <Mail className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isBot
            ? 'bg-card border border-border/50 text-card-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <div className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </div>
      </div>
      {!isBot && <div className="w-8 shrink-0" />}
    </div>
  );
}
