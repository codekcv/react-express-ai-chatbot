import { useRef, useState } from 'react';
import { TypingIndicator } from './typing-indicator';
import { ChatMessage, type Message } from './chat-messages';
import { ChatInput, type ChatFormData } from './chat-input';
import axios from 'axios';

type ChatResponse = {
  reply: string;
};

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');
  const conversationId = useRef(crypto.randomUUID());

  async function onSubmit({ prompt }: ChatFormData) {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      setError('');

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages((prev) => [...prev, { content: data.reply, role: 'bot' }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setError('Something went wrong, try again!');
    } finally {
      setIsBotTyping(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessage messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <ChatInput onSubmit={onSubmit} />
    </div>
  );
}
