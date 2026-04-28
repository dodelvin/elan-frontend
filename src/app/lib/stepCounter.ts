/**
 * Always-on step counter using device motion. Subscribes are listeners,
 * one shared count. ensureStarted() must be called from a user gesture
 * on iOS for permission.
 */

const STEP_THRESHOLD = 6;
const MIN_STEP_INTERVAL_MS = 250;
const MIN_HORIZONTAL_RATIO = 0.4;

let started = false;
let lastStepAt = 0;
let stepCount = 0;
const listeners = new Set<(total: number) => void>();

function handleMotion(e: DeviceMotionEvent) {
  // Use acceleration WITHOUT gravity so a still phone reads ~0 on all axes.
  const a = e.acceleration || e.accelerationIncludingGravity;
  if (!a || a.x == null || a.y == null || a.z == null) return;

  const ax = Math.abs(a.x);
  const ay = Math.abs(a.y);
  const az = Math.abs(a.z);
  const magnitude = Math.sqrt(ax * ax + ay * ay + az * az);

  // Reject pure vertical motion (e.g. picking phone up off a table).
  // Real walking has noticeable horizontal forward/back component.
  const horizontal = Math.sqrt(ax * ax + az * az);
  if (horizontal < MIN_HORIZONTAL_RATIO * ay) return;

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
