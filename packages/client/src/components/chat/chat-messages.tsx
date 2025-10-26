import { type ClipboardEvent, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

type Props = {
  messages: Message[];
};

export function ChatMessage({ messages }: Props) {
  const lastMessageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function onCopyMessage(e: ClipboardEvent<HTMLDivElement>) {
    const selection = window.getSelection()?.toString().trim();

    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  }

  return (
    <>
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
    </>
  );
}
