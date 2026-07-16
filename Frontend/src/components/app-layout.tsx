import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FileEdit,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { clearAuth } from "@/lib/api";
import { notifyAuthChange, useAuthToken } from "@/lib/use-auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/builder", label: "Resume Builder", icon: FileEdit },
  { to: "/ai", label: "AI Resume", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { ready, isAuthenticated } = useAuthToken();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("resumeai_theme");
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("resumeai_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      navigate({ to: "/auth", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleLogout = () => {
    clearAuth();
    notifyAuthChange();
    navigate({ to: "/auth", replace: true });
  };

  if (!ready || !isAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-52 flex-col border-r border-border bg-card">
        <SidebarInner
          pathname={pathname}
          onLogout={handleLogout}
          theme={theme}
          setTheme={setTheme}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/20"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col"
            >
              <SidebarInner
                pathname={pathname}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="lg:pl-52">
        {/* Topbar */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-3">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted flex-shrink-0"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary grid place-items-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-base tracking-tight">
                  Resumify
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-10 pb-24 lg:pb-10">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border">
        <div className="grid grid-cols-4">
          {NAV.slice(0, 4).map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center py-2 gap-1 text-[11px]",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-9 w-9 grid place-items-center rounded-full transition",
                    active && "bg-primary text-primary-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate">{label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function SidebarInner({
  pathname,
  onLogout,
  theme,
  setTheme,
}: {
  pathname: string;
  onLogout: () => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}) {
  return (
    <>
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
        <div className="h-8 w-8 rounded-xl bg-primary grid place-items-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">
          Resumify
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground px-3 pb-2">
          Workspace
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 px-3 h-10 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground/80 hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-3 border-t border-border space-y-2">
        <div className="flex gap-1 p-1 bg-muted rounded-full text-xs">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full font-medium transition",
              theme === "light"
                ? "bg-card shadow-soft text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Sun className="h-3.5 w-3.5" /> Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-full font-medium transition",
              theme === "dark"
                ? "bg-card shadow-soft text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Moon className="h-3.5 w-3.5" /> Dark
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 h-10 rounded-full text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </>
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 w-8 rounded-full grid place-items-center hover:bg-muted"
      aria-label="Close"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
