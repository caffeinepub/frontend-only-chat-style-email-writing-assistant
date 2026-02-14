import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import type { Message } from '@/lib/assistant/types';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="px-4 py-6 space-y-4 max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
}
