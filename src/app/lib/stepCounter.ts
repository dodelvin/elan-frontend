let listening = false;
let lastStepAt = 0;
let stepCount = 0;
let onStepCb: ((total: number) => void) | null = null;
let debugCb: ((info: string) => void) | null = null;

const STEP_THRESHOLD = 11;
const MIN_STEP_INTERVAL_MS = 300;

function handleMotion(e: DeviceMotionEvent) {
  const a = e.accelerationIncludingGravity;
  if (!a || a.x == null || a.y == null || a.z == null) {
    debugCb?.('Motion event but no acceleration data');
    return;
  }

  const magnitude = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
  debugCb?.(`mag: ${magnitude.toFixed(1)} | steps: ${stepCount}`);

  const now = Date.now();
  if (magnitude > STEP_THRESHOLD && (now - lastStepAt) > MIN_STEP_INTERVAL_MS) {
    lastStepAt = now;
    stepCount++;
    onStepCb?.(stepCount);
  }
}

export async function startStepCounter(
  onStep: (total: number) => void,
  onDebug?: (info: string) => void
): Promise<boolean> {
  if (listening) return true;
  onStepCb = onStep;
  debugCb = onDebug || null;

  const DM = (DeviceMotionEvent as any);
  if (typeof DM.requestPermission === 'function') {
    debugCb?.('Requesting permission...');
    try {
      const result = await DM.requestPermission();
      debugCb?.(`Permission: ${result}`);
      if (result !== 'granted') return false;
    } catch (err: any) {
      debugCb?.(`Permission error: ${err.message}`);
      return false;
    }
  } else {
    debugCb?.('No requestPermission API — adding listener directly');
  }

  window.addEventListener('devicemotion', handleMotion);
  listening = true;
  debugCb?.('Listener attached');
  return true;
}

export function stopStepCounter() {
  window.removeEventListener('devicemotion', handleMotion);
  listening = false;
}

export function resetStepCount() {
  stepCount = 0;
}