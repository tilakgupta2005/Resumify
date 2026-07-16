type ErrorOptions = {
  mechanism?:
    "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type Events = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __events?: Events;
  }
}

export function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
) {
  console.error("Application Error:", error, context);
  if (typeof window === "undefined") return;
  try {
    const events = window.__events;
    if (events && typeof events.captureException === "function") {
      events.captureException(
        error,
        {
          source: "react_error_boundary",
          route: window.location.pathname,
          ...context,
        },
        {
          mechanism: "react_error_boundary",
          handled: false,
          severity: "error",
        },
      );
    }
  } catch (e) {
    console.error("Failed to report error metadata:", e);
  }
}
