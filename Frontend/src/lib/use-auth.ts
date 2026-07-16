import { useEffect, useState } from "react";
import { getStoredToken } from "./api";

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setToken(getStoredToken());
    setReady(true);
    const handler = () => setToken(getStoredToken());
    window.addEventListener("storage", handler);
    window.addEventListener("resumeai:auth", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("resumeai:auth", handler);
    };
  }, []);
  return { token, ready, isAuthenticated: !!token };
}

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("resumeai:auth"));
  }
}
