/**
 * lib/api.ts
 * ----------
 * Thin fetch wrapper for talking to the Express backend.
 *
 *  - Prepends the API base URL (VITE_API_URL, default http://localhost:4000).
 *  - Automatically attaches the current Firebase user's ID token to the
 *    Authorization header so the backend can verify the request.
 *  - Throws an Error containing the server's error message on non-2xx
 *    responses, so callers can write `try { ... } catch (err) { ... }`.
 *
 * Contains:
 *   - apiGet()       GET request
 *   - apiPost()      POST request
 *   - apiPut()       PUT request
 *   - apiDelete()    DELETE request
 *   - request()      shared core called by all four
 */

import { auth } from './firebase';

// Variables related to the API base configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * request
 * Takes an HTTP method, path (e.g. "/api/community/posts"), and optional
 * JSON body. Returns the parsed JSON response. Throws on non-2xx.
 */
async function request<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const fullUrl = `${API_URL}${path}`;

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await res.text();
    let data: any;
    try { data = text ? JSON.parse(text) : {}; }
    catch { data = { error: text }; }

    if (!res.ok) {
      alert(`HTTP ${res.status}\nURL: ${fullUrl}\nBody: ${text.slice(0, 200)}`);
      throw new Error(data.error || `Request failed: ${res.status}`);
    }

    return data as T;
  } catch (err: any) {
    alert(`FETCH FAILED\nURL: ${fullUrl}\nError: ${err.message || err}`);
    throw err;
  }
}

/** GET — wrapper around request('GET'). */
export const apiGet    = <T = unknown>(path: string): Promise<T> => request<T>('GET', path);

/** POST — wrapper around request('POST'). */
export const apiPost   = <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('POST', path, body);

/** PUT — wrapper around request('PUT'). */
export const apiPut    = <T = unknown>(path: string, body?: unknown): Promise<T> => request<T>('PUT', path, body);

/** DELETE — wrapper around request('DELETE'). */
export const apiDelete = <T = unknown>(path: string): Promise<T> => request<T>('DELETE', path);
