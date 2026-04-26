/**
 * stepCounter.ts
 * --------------
 * Always-on step counter using device motion. Single shared instance —
 * starts on first call to ensureStarted(), keeps counting until the page
 * is closed. iOS requires explicit user gesture for permission, so
 * ensureStarted() must be called from a click handler.
 */

const STEP_THRESHOLD = 15; // acceleration magnitude threshold to count a step (tuned experimentally)
const MIN_STEP_INTERVAL_MS = 800; // minimum time between steps to prevent double-counting (tuned experimentally)

let started = false;
let lastStepAt = 0;
let stepCount = 0;
const listeners = new Set<(total: number) => void>();

function handleMotion(e: DeviceMotionEvent) {
  const a = e.accelerationIncludingGravity;
  if (!a || a.x == null || a.y == null || a.z == null) return;
  const magnitude = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
  const now = Date.now();
  if (magnitude > STEP_THRESHOLD && (now - lastStepAt) > MIN_STEP_INTERVAL_MS) {
    lastStepAt = now;
    stepCount++;
    listeners.forEach(cb => cb(stepCount));
  }
}

/** Subscribe to step updates. Returns an unsubscribe function. */
export function subscribeToSteps(cb: (total: number) => void): () => void {
  listeners.add(cb);
  cb(stepCount);  // immediately give current value
  return () => listeners.delete(cb);
}

/** Must be called from a user gesture on iOS to grant permission. */
export async function ensureStarted(): Promise<boolean> {
  if (started) return true;
  const DM = (DeviceMotionEvent as any);
  if (typeof DM.requestPermission === 'function') {
    try {
      const result = await DM.requestPermission();
      if (result !== 'granted') return false;
    } catch {
      return false;
    }
  }
  window.addEventListener('devicemotion', handleMotion);
  started = true;
  return true;
}

export function getStepCount(): number {
  return stepCount;
}