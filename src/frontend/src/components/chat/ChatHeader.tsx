import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail } from 'lucide-react';

export default function ChatHeader() {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/20">
          <AvatarImage src="/assets/generated/email-bot-avatar.dim_256x256.png" alt="Email Assistant" />
          <AvatarFallback className="bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
            Email Writing Assistant
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Professional emails, crafted with care
          </p>
        </div>
      </div>
    </header>
  );
}
