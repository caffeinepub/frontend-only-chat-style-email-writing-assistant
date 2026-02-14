import { useState, useEffect, useRef } from 'react';
import ChatHeader from './components/chat/ChatHeader';
import MessageList from './components/chat/MessageList';
import Composer from './components/chat/Composer';
import QuickReplies from './components/chat/QuickReplies';
import { processUserMessage } from './lib/assistant/engine';
import type { Message, AssistantState, QuickReply } from './lib/assistant/types';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hi! I'm your Email Writing Assistant. I can help you draft professional emails for any occasion. What would you like to write today?",
      timestamp: new Date(),
    },
  ]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [assistantState, setAssistantState] = useState<AssistantState>({
    phase: 'idle',
    emailType: null,
    collectedData: {},
    lastDraft: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const result = processUserMessage(content, assistantState);

    setAssistantState(result.newState);

    const botMessages = result.responses.map((response, index) => ({
      id: `${Date.now()}-bot-${index}`,
      role: 'bot' as const,
      content: response,
      timestamp: new Date(),
    }));

    setTimeout(() => {
      setMessages((prev) => [...prev, ...botMessages]);
      setQuickReplies(result.quickReplies || []);
    }, 300);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.value);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div
        className="absolute inset-0 opacity-[0.03] bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/chat-background.dim_1600x900.png)',
        }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>
        {quickReplies.length > 0 && (
          <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm px-4 py-3">
            <QuickReplies replies={quickReplies} onSelect={handleQuickReply} />
          </div>
        )}
        <Composer onSend={handleSendMessage} />
      </div>
    </div>
  );
}
