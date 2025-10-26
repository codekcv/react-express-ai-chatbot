import type { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';

import { Button } from '../ui/button';

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => void;
};

export function ChatInput({ onSubmit }: Props) {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const handleFormSubmit = handleSubmit((data: ChatFormData) => {
    reset({ prompt: '' });
    onSubmit(data);
  });

  function handleOnKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  }

  return (
    <form
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-lg"
      onSubmit={handleFormSubmit}
      onKeyDown={handleOnKeyDown}
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
  );
}
