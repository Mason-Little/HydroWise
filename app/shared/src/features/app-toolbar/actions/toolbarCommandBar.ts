import type { RefObject } from "react";

/**
 * macOS ⌘K and Windows/Linux Ctrl+K. Alt is never part of the combo (caller
 * should not combine with other modifiers unless product needs it).
 */
export function isModKShortcut(e: KeyboardEvent): boolean {
  return (
    e.key.toLowerCase() === "k" &&
    (e.metaKey || e.ctrlKey) &&
    !e.altKey
  );
}

const NON_TEXT_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "file",
  "hidden",
  "image",
  "month",
  "radio",
  "range",
  "reset",
  "submit",
  "time",
  "week",
]);

function getDeepActiveElement(): HTMLElement | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) {
    el = el.shadowRoot.activeElement;
  }
  return el instanceof HTMLElement ? el : null;
}

function isLikelyTextEntryFocus(el: HTMLElement): boolean {
  if (el.isContentEditable) return true;

  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLSelectElement) return true;

  if (el instanceof HTMLInputElement) {
    return !NON_TEXT_INPUT_TYPES.has(el.type.toLowerCase());
  }

  const textbox = el.closest('[role="textbox"]');
  if (textbox instanceof HTMLElement && textbox.matches(":not(input):not(textarea)")) {
    return true;
  }

  return false;
}

/**
 * Skip the global palette shortcut when focus is already in a typing surface
 * outside the toolbar. Focus inside `toolbarRoot` always allows the shortcut
 * (toggle / open) so ⌘K still works in the command field itself.
 */
export function shouldIgnoreGlobalToolbarCommandShortcut(
  toolbarRoot: HTMLElement | null,
): boolean {
  const focused = getDeepActiveElement();
  return (
    focused != null &&
    !toolbarRoot?.contains(focused) &&
    isLikelyTextEntryFocus(focused)
  );
}

const COMMAND_INPUT_SLOT = '[data-slot="command-input"]' as const;

/**
 * Prefer the ref React passes through to `CommandPrimitive.Input`. If it is
 * unset at runtime, fall back once to the stable cmdk slot (feature-only;
 * does not change shared primitives).
 */
export function focusToolbarCommandInput(
  inputRef: RefObject<HTMLInputElement | null>,
  toolbarRoot: HTMLElement | null,
): void {
  requestAnimationFrame(() => {
    const input = inputRef.current;
    input?.focus();
    if (input && document.activeElement === input) return;
    toolbarRoot?.querySelector<HTMLInputElement>(COMMAND_INPUT_SLOT)?.focus();
  });
}
