import { FaArrowUp } from 'react-icons/fa';
import { Button } from './button';
import { useForm } from 'react-hook-form';
import type { KeyboardEvent } from 'react';

type FormData = {
  prompt: string;
};

export function ChatBot() {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  function onSubmit(data: FormData) {
    console.log(data);
    reset();
  }

  function onKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={onKeyDown}
      className="flex flex-col gap-2 items-end border-2 p-4 rounded-lg"
    >
      <textarea
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder="Ask anything..."
        maxLength={1000}
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
