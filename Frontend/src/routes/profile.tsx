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
} from "lucide-react";
import { useBaseResume, getResumeWithUserFallback } from "@/lib/queries";
import { cn } from "@/lib/utils";

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
