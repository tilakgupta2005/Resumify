import axios, { AxiosError } from "axios";

const BASE_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8000";

export const TOKEN_KEY = "resumeai_token";
export const USER_KEY = "resumeai_user";
export const LLM_KEY = "resumeai_llm_key";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    const llmKey = window.localStorage.getItem(LLM_KEY);
    if (llmKey) {
      config.headers = config.headers ?? {};
      (config.headers as any)["X-Google-Api-Key"] = llmKey;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const data = JSON.parse(text);
        error.response.data = data;
      } catch (e) {
        // Not JSON
      }
    }
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const detail = (error.response?.data as any)?.detail || "";
      const detailStr = typeof detail === "string" ? detail : JSON.stringify(detail);
      const isGoogleApiKeyError =
        detailStr.toLowerCase().includes("google api key") ||
        detailStr.toLowerCase().includes("google_api_key") ||
        error.config?.url?.includes("/jd_resume/validate_key");

      if (!isGoogleApiKeyError) {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
        window.dispatchEvent(new Event("resumeai:auth"));
      }
    }
    return Promise.reject(error);
  },
);

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getStoredLlmKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LLM_KEY);
}

export function setStoredLlmKey(key: string) {
  window.localStorage.setItem(LLM_KEY, key);
}

export function removeStoredLlmKey() {
  window.localStorage.removeItem(LLM_KEY);
}

export function apiErrorMessage(
  err: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError(err)) {
    const data: any = err.response?.data;
    return data?.detail || data?.message || err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export { BASE_URL as API_BASE_URL };

