const DEFAULT_API_BASE_URL = "https://prn232-ass1-qe180122.onrender.com";

function resolveApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (envUrl && envUrl.trim().length > 0 ? envUrl : DEFAULT_API_BASE_URL).trim();
}

export const API_BASE_URL = resolveApiBaseUrl();

const ACCESS_TOKEN_KEY = "accessToken";

export function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAccessToken(token: string | null) {
  try {
    if (!token) localStorage.removeItem(ACCESS_TOKEN_KEY);
    else localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}


export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function readErrorMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  if (!("message" in payload)) return undefined;
  const message = (payload as { message?: unknown }).message;
  return typeof message === "string" ? message : undefined;
}

export async function apiRequest<T>(
  path: string,
  options: {
    method?: HttpMethod;
    query?: Record<string, string | number | boolean | null | undefined>;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const method = options.method ?? "GET";

  const url = new URL(path, API_BASE_URL);
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  const isFormDataBody = (body: unknown): body is FormData =>
    typeof FormData !== "undefined" && body instanceof FormData;

  const isBodyInitBody = (body: unknown): body is BodyInit =>
    body != null &&
    (typeof body === "string" ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      body instanceof URLSearchParams ||
      isFormDataBody(body));

  const rawBody = options.body;

  const isFormData = isFormDataBody(rawBody);
  const isBodyInit = isBodyInitBody(rawBody);

  const headers: Record<string, string> = {
    ...(!isFormData && rawBody != null && !isBodyInit ? { "Content-Type": "application/json" } : {}),
    ...(options.headers ?? {}),
  };

  const token = getStoredAccessToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const body: BodyInit | undefined =
    rawBody == null
      ? undefined
      : isFormDataBody(rawBody)
        ? rawBody
        : isBodyInitBody(rawBody)
          ? rawBody
          : JSON.stringify(rawBody);

  const response = await fetch(url.toString(), {
    method,
    headers,
    body,
    signal: options.signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => undefined) : await response.text();

  if (!response.ok) {
    const message =
      ((isJson ? readErrorMessage(payload) : undefined) ?? response.statusText) || "Request failed";

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
