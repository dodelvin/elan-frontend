/**
 * stepCounter.ts
 * --------------
 * Counts steps from the device accelerometer.
 *
 * Detects a "step" as a peak in the magnitude of the acceleration vector
 * exceeding STEP_THRESHOLD, debounced by MIN_STEP_INTERVAL_MS.
 *
 * iOS Safari requires explicit permission via DeviceMotionEvent.requestPermission().
 * Calling start() will request it the first time.
 */

const STEP_THRESHOLD = 11;          // m/s² — tune higher to count fewer noisy "steps"
const MIN_STEP_INTERVAL_MS = 300;   // minimum gap between two counted steps

let listening = false;
let lastStepAt = 0;
let stepCount = 0;
let onStepCb: ((total: number) => void) | null = null;

function handleMotion(e: DeviceMotionEvent) {
  const a = e.accelerationIncludingGravity;
  if (!a || a.x == null || a.y == null || a.z == null) return;

  const magnitude = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);

  const now = Date.now();
  if (magnitude > STEP_THRESHOLD && (now - lastStepAt) > MIN_STEP_INTERVAL_MS) {
    lastStepAt = now;
    stepCount++;
    onStepCb?.(stepCount);
  }
}

/** Start listening. Returns true on success, false if permission denied. */
export async function startStepCounter(onStep: (total: number) => void): Promise<boolean> {
  if (listening) return true;
  onStepCb = onStep;

  // iOS 13+ requires explicit permission
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
  listening = true;
  return true;
}

/** Stop listening. */
export function stopStepCounter() {
  window.removeEventListener('devicemotion', handleMotion);
  listening = false;
}

/** Get current count without resetting. */
export function getStepCount(): number {
  return stepCount;
}

/** Reset counter to zero (e.g. at start of new day). */
export function resetStepCount() {
  stepCount = 0;
}