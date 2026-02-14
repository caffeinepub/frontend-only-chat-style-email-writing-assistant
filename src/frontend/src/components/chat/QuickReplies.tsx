import { Button } from '@/components/ui/button';
import type { QuickReply } from '@/lib/assistant/types';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
}

export default function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 max-w-4xl mx-auto">
      {replies.map((reply) => (
        <Button
          key={reply.id}
          onClick={() => onSelect(reply)}
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm"
        >
          {reply.label}
        </Button>
      ))}
    </div>
  );
}
