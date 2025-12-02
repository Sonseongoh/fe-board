const API_BASE_URL = "https://fe-hiring-rest-api.vercel.app";

const TOKEN_KEY = "accessToken";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function apiRequest<T>(
  path: string,
  { auth = true, headers, ...options }: RequestOptions = {}
): Promise<T> {
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: finalHeaders,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  let data: unknown = null;
  const text = await res.text().catch(() => "");

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    if (typeof data === "string" && data.trim().length > 0) {
      message = data;
    } else if (isRecord(data)) {
      const maybeMessage = data.message ?? data.error;
      if (typeof maybeMessage === "string") {
        message = maybeMessage;
      } else {
        message = JSON.stringify(data);
      }
    }

    throw new Error(message);
  }

  return data as T;
}
