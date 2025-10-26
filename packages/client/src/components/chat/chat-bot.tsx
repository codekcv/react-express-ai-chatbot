import axios from 'axios';
import { useRef, useState } from 'react';

import notificationSound from '../../assets/sounds/notification.mp3';
// import popSound from '/assets/sounds/pop.mp3';
import popSound from '../../assets/sounds/pop.mp3';
import { type ChatFormData, ChatInput } from './chat-input';
import { ChatMessage, type Message } from './chat-messages';
import { TypingIndicator } from './typing-indicator';

const popAudio = new Audio(popSound);
const notificationAudio = new Audio(notificationSound);

popAudio.volume = 0.2;
notificationAudio.volume = 0.2;

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
      popAudio.play();

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages((prev) => [...prev, { content: data.reply, role: 'bot' }]);
      notificationAudio.play();
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
