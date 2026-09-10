const ADMIN_KEY = "wedding-admin-key";

export function getStoredAdminKey(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_KEY);
}

export function setStoredAdminKey(key: string): void {
  sessionStorage.setItem(ADMIN_KEY, key);
}

export function clearStoredAdminKey(): void {
  sessionStorage.removeItem(ADMIN_KEY);
}

export function adminAuthHeader(): HeadersInit {
  const key = getStoredAdminKey();
  return key ? { "x-admin-key": key } : {};
}

export function adminHeaders(isJson = true): HeadersInit {
  const key = getStoredAdminKey();
  const headers: Record<string, string> = {};
  if (key) headers["x-admin-key"] = key;
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
}
