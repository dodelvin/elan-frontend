import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text }; }

  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data as T;
}

export const apiGet    = <T = unknown>(p: string)              => request<T>('GET', p);
export const apiPost   = <T = unknown>(p: string, b?: unknown) => request<T>('POST', p, b);
export const apiPut    = <T = unknown>(p: string, b?: unknown) => request<T>('PUT', p, b);
export const apiDelete = <T = unknown>(p: string)              => request<T>('DELETE', p);
