type DotProps = {
  className?: string;
};

function Dot({ className }: DotProps) {
  return (
    <div
      className={`${className} w-2 h-2 rounded-full bg-gray-800 animate-pulse`}
    />
  );
}

export function TypingIndicator() {
  return (
    <div className="flex self-start gap-1 p-3 bg-gray-200 rounded-xl">
      <Dot />
      <Dot className="[animation-delay:0.2s]" />
      <Dot className="[animation-delay:0.4s]" />
    </div>
  );
}
