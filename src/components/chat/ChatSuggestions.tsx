interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function ChatSuggestions({ suggestions, onSelect, disabled }: ChatSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 pb-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          disabled={disabled}
          className="text-xs border border-border rounded-full px-3 py-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-40 disabled:pointer-events-none bg-background text-foreground-secondary truncate max-w-[200px]"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
