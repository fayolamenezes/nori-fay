// Tracks Gemini API calls across the entire app to stay under 15 req/min
// Uses a sliding window — only counts calls in the last 60 seconds

const WINDOW_MS = 60_000; // 1 minute
const MAX_CALLS = 12; // stay under 15 with some buffer

const callTimestamps: number[] = [];

export function canCallGemini(): boolean {
  const now = Date.now();
  // Remove timestamps older than 60 seconds
  const recent = callTimestamps.filter(t => now - t < WINDOW_MS);
  callTimestamps.length = 0;
  callTimestamps.push(...recent);
  return callTimestamps.length < MAX_CALLS;
}

export function markGeminiStart(): void {
  callTimestamps.push(Date.now());
}

export function markGeminiEnd(): void {
  // No-op for now — start is sufficient for tracking
}

export function getRemainingCalls(): number {
  const now = Date.now();
  const recent = callTimestamps.filter(t => now - t < WINDOW_MS);
  return Math.max(0, MAX_CALLS - recent.length);
}