/**
 * Always-on step counter using device motion. Subscribes are listeners,
 * one shared count. ensureStarted() must be called from a user gesture
 * on iOS for permission.
 */

const STEP_THRESHOLD = 13;
const MIN_STEP_INTERVAL_MS = 700;

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

export function subscribeToSteps(cb: (total: number) => void): () => void {
  listeners.add(cb);
  cb(stepCount);
  return () => { listeners.delete(cb); };
}

export async function ensureStarted(): Promise<boolean> {
  if (started) return true;
  const DM = (DeviceMotionEvent as any);
  if (typeof DM.requestPermission === 'function') {
    try {
      const result = await DM.requestPermission();
      if (result !== 'granted') return false;
    } catch { return false; }
  }
  window.addEventListener('devicemotion', handleMotion);
  started = true;
  return true;
}

export function getStepCount(): number { return stepCount; }
export function resetStepCount() { stepCount = 0; }
