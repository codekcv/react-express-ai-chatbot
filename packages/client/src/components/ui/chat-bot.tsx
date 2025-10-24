import ReactMarkdown from 'react-markdown';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  reply: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');
  const conversationId = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLParagraphElement>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function onSubmit({ prompt }: FormData) {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      setError('');

      reset({ prompt: '' });

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

  function onKeyDownEnter(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  }

  function onCopyMessage(e: ClipboardEvent<HTMLDivElement>) {
    const selection = window.getSelection()?.toString().trim();

    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            className={`px-3 py-1 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            key={index}
            onCopy={onCopyMessage}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex self-start gap-1 p-3 bg-gray-200 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]" />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>

      <form
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDownEnter}
      >
        <textarea
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything..."
          maxLength={1000}
          autoFocus
          {...register('prompt', {
            required: true,
            validate: (str) => str.trim().length > 0,
          })}
        />
        <Button
          type="submit"
          className="rounded-full w-9 h-9"
          disabled={!formState.isValid}
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
}
