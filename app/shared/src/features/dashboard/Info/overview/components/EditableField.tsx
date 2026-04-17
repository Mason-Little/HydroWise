import { useEffect, useRef, useState } from "react";

// TODO: Polish interactive states — hover/focus/active on the display buttons and editing input
// feel rough; refine so the click-to-edit affordance looks intentional and cohesive.

type EditableFieldProps = {
  value: string | null;
  placeholder: string;
  className: string;
  onSave: (next: string | null) => void;
};

export const EditableField = ({
  value,
  placeholder,
  className,
  onSave,
}: EditableFieldProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    setDraft(value ?? "");
    setEditing(true);
  };

  const commit = () => {
    const trimmed = draft.trim();
    onSave(trimmed === "" ? null : trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value ?? "");
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={cancel}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        placeholder={placeholder}
        className={`-mx-1 rounded bg-muted/50 px-1 text-xs outline-none ring-1 ring-ring ${className}`}
      />
    );
  }

  return value ? (
    <button
      type="button"
      onClick={startEditing}
      className={`-mx-1 cursor-text rounded px-1 text-left text-xs hover:bg-muted/40 ${className}`}
    >
      {value}
    </button>
  ) : (
    <button
      type="button"
      onClick={startEditing}
      className={`-mx-1 cursor-text rounded border-b border-dotted border-muted-foreground/40 px-1 pb-0.5 text-left text-xs italic text-muted-foreground/50 hover:bg-muted/40 ${className}`}
    >
      {placeholder}
    </button>
  );
};
