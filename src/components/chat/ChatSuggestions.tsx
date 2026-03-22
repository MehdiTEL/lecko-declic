interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function ChatSuggestions({ suggestions, onSelect, disabled }: ChatSuggestionsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 pb-2 pt-1">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          disabled={disabled}
          className="text-xs rounded-full px-3 py-1.5 text-foreground-secondary bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none truncate max-w-[200px]"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
