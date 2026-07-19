import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, PillButton } from "@/components/ui-kit";
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Key,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useBaseResume, getResumeWithUserFallback, useValidateKey } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getStoredLlmKey, setStoredLlmKey, removeStoredLlmKey, apiErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/profile")({
  head: () => ({
    title: "Profile — Resumify",
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data } = useBaseResume();
  const r = data ?? getResumeWithUserFallback();
  const pi = r.personal_info;
  const fullName =
    [pi.first_name, pi.middle_name, pi.last_name].filter(Boolean).join(" ") ||
    "Your name";

  let displayName = fullName;
  if (displayName.length > 18) {
    displayName = pi.first_name || "Your name";
    if (displayName.length > 18) {
      displayName = displayName.substring(0, 15) + "...";
    }
  }

  const fontSizeClass =
    displayName.length > 12
      ? "text-xl sm:text-2xl md:text-3xl"
      : "text-2xl md:text-3xl";

  const [llmKey, setLlmKey] = useState<string>("");
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);
  const validateKey = useValidateKey();

  useEffect(() => {
    const stored = getStoredLlmKey();
    if (stored) {
      setIsKeySaved(true);
      setLlmKey(stored);
    }
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        <Card className="!p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-warning grid place-items-center font-display text-2xl font-bold shrink-0">
                {(pi.first_name?.[0] || "R").toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1
                  className={cn(
                    "font-display font-bold truncate",
                    fontSizeClass,
                  )}
                >
                  {displayName}
                </h1>
                <div className="text-muted-foreground text-sm truncate">
                  {pi.email || "Add your email"}
                </div>
              </div>
            </div>
            <Link to="/builder" className="w-full sm:w-auto">
              <PillButton variant="secondary" className="w-full justify-center">
                <Pencil className="h-4 w-4" /> Edit profile
              </PillButton>
            </Link>
          </div>
        </Card>
        <Card className="overflow-hidden w-full">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Row
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              v={pi.email}
              shouldTruncate={false}
            />
            <Row
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              v={pi.phone}
            />
            <Row
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              v={[pi.city, pi.country].filter(Boolean).join(", ")}
            />
            <Row
              icon={<Linkedin className="h-4 w-4" />}
              label="LinkedIn"
              v={pi.linkedin}
            />
            <Row
              icon={<Github className="h-4 w-4" />}
              label="GitHub"
              v={pi.github}
            />
            <Row
              icon={<Globe className="h-4 w-4" />}
              label="Portfolio"
              v={pi.portfolio}
            />
          </div>
        </Card>

        {/* LLM Key Management */}
        <Card className="!p-6 w-full relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-2xl bg-primary/10 grid place-items-center text-primary shrink-0">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Gemini API Key</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Required for AI-powered resume generation. This key is stored securely in your browser's local storage and is never saved to our servers.
              </p>
              <div className="bg-muted/40 border border-border/50 rounded-2xl p-4 text-xs space-y-2 mb-2 max-w-md">
                <div className="font-semibold text-foreground">How to get your free key:</div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>
                    Open{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      Google AI Studio
                    </a>
                  </li>
                  <li>Sign in with your Google account</li>
                  <li>Click <strong className="text-foreground">Create API key</strong> in the sidebar</li>
                  <li>Copy the key and paste it below</li>
                </ol>
              </div>
            </div>
          </div>

          {isKeySaved ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-border/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-success/10 text-success grid place-items-center shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground">API Key Active</div>
                  <div className="text-xs font-mono text-muted-foreground truncate">
                    {showKey ? llmKey : "••••••••••••••••••••••••••••••••"}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-center shrink-0">
                <PillButton
                  variant="ghost"
                  onClick={() => setShowKey(!showKey)}
                  className="!h-9 !px-3 text-xs"
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showKey ? "Hide" : "Show"}
                </PillButton>
                <PillButton
                  variant="ghost"
                  onClick={() => {
                    removeStoredLlmKey();
                    setIsKeySaved(false);
                    setLlmKey("");
                    setShowKey(false);
                    toast.success("API Key removed");
                  }}
                  className="!h-9 !px-3 text-xs text-danger hover:text-danger-foreground hover:bg-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </PillButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative flex items-center">
                <input
                  type={showKey ? "text" : "password"}
                  value={llmKey}
                  onChange={(e) => setLlmKey(e.target.value)}
                  placeholder="Enter your Gemini API key (AIzaSy...)"
                  className="w-full h-11 pl-4 pr-12 rounded-2xl bg-muted/60 focus:bg-card border border-transparent focus:border-border outline-none text-sm transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <PillButton
                  onClick={async () => {
                    if (!llmKey.trim()) {
                      toast.error("Please enter a key first.");
                      return;
                    }
                    try {
                      await validateKey.mutateAsync(llmKey.trim());
                      setStoredLlmKey(llmKey.trim());
                      setIsKeySaved(true);
                      setShowKey(false);
                      toast.success("API Key validated and saved successfully!");
                    } catch (err) {
                      toast.error(apiErrorMessage(err, "Invalid API Key"));
                    }
                  }}
                  disabled={validateKey.isPending}
                  className="!h-9 !px-4 text-xs"
                >
                  {validateKey.isPending ? "Validating..." : "Validate & Save"}
                </PillButton>
                {llmKey && (
                  <PillButton
                    variant="ghost"
                    onClick={() => {
                      setLlmKey("");
                    }}
                    disabled={validateKey.isPending}
                    className="!h-9 !px-4 text-xs"
                  >
                    Clear
                  </PillButton>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

function Row({
  icon,
  label,
  v,
  shouldTruncate = true,
}: {
  icon: React.ReactNode;
  label: string;
  v?: string;
  shouldTruncate?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 min-w-0 w-full">
      <div className="h-9 w-9 rounded-2xl bg-muted grid place-items-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1 w-full">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={cn(
            "text-sm text-foreground/80 w-full",
            shouldTruncate ? "truncate" : "break-all whitespace-pre-wrap",
          )}
        >
          {v || "—"}
        </div>
      </div>
    </div>
  );
}
