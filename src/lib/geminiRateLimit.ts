// Shared Gemini rate limiter — persists across page navigation within the same session.
// Module-level state means navigating between pages does NOT reset the cooldown.

const COOLDOWN_MS = 8000;

let lastCallTime = 0;
let activeRequest = false;

export function canCallGemini(): boolean {
  return !activeRequest && Date.now() - lastCallTime >= COOLDOWN_MS;
}

export function markGeminiStart(): void {
  lastCallTime = Date.now();
  activeRequest = true;
}

export function markGeminiEnd(): void {
  activeRequest = false;
}

/** Returns how many milliseconds remain in the cooldown (0 if ready). */
export function cooldownRemaining(): number {
  return Math.max(0, COOLDOWN_MS - (Date.now() - lastCallTime));
}