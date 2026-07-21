import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  ChevronRight,
  Circle,
  Code2,
  FileText,
  GraduationCap,
  Handshake,
  Heart,
  Sparkles,
  Trophy,
  User,
  Wrench,
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { Card, PillButton, Stat } from "@/components/ui-kit";
import { useBaseResume, getResumeWithUserFallback } from "@/lib/queries";
import { computeCompletion } from "@/lib/resume-schema";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    title: "Resumify",
    meta: [
      {
        name: "description",
        content: "Your resume overview, completion score, and recent activity.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const SECTIONS: {
  key: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}[] = [
  {
    key: "personal",
    title: "Personal Information",
    desc: "Contact, links, and location.",
    icon: User,
    accent: "bg-muted",
  },
  {
    key: "education",
    title: "Education",
    desc: "Institutions, degrees, and grades.",
    icon: GraduationCap,
    accent: "bg-warning/40",
  },
  {
    key: "experience",
    title: "Experience",
    desc: "Roles, companies, and impact.",
    icon: Briefcase,
    accent: "bg-success/40",
  },
  {
    key: "projects",
    title: "Projects",
    desc: "Highlight what you've built.",
    icon: Code2,
    accent: "bg-primary/40",
  },
  {
    key: "skills",
    title: "Skills",
    desc: "Technical and soft skills.",
    icon: Wrench,
    accent: "bg-muted",
  },
  {
    key: "certifications",
    title: "Certifications",
    desc: "Credentials and licenses.",
    icon: Award,
    accent: "bg-warning/40",
  },
  {
    key: "achievements",
    title: "Achievements",
    desc: "Awards and recognition.",
    icon: Trophy,
    accent: "bg-primary/40",
  },
  {
    key: "tech",
    title: "Technical Participation",
    desc: "Hackathons, conferences.",
    icon: BookOpen,
    accent: "bg-success/40",
  },
  {
    key: "co",
    title: "Co Curricular",
    desc: "Clubs and team activities.",
    icon: Handshake,
    accent: "bg-danger/40",
  },
  {
    key: "extra",
    title: "Extra Curricular",
    desc: "Hobbies and interests.",
    icon: Heart,
    accent: "bg-danger/40",
  },
];

function DashboardPage() {
  const { data: resumeData, isLoading } = useBaseResume();
  const resume = resumeData ?? getResumeWithUserFallback();
  const completion = computeCompletion(resume);
  const pi = resume.personal_info;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const firstName = pi.first_name || "there";

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Hero */}
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 !p-8 md:!p-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-warning/30 blur-3xl" />
            <div className="relative">
              <div className="text-sm text-muted-foreground">{greeting} 👋</div>
              <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 leading-tight">
                Let's build your next opportunity, {firstName}.
              </h1>
              <p className="text-muted-foreground mt-3 max-w-lg">
                Create ATS-friendly resumes powered by AI and manage your
                professional profile.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/ai">
                  <PillButton>
                    <Sparkles className="h-4 w-4" /> Generate Resume
                  </PillButton>
                </Link>
                <Link to="/builder">
                  <PillButton variant="secondary">
                    <FileText className="h-4 w-4" /> Edit Resume
                  </PillButton>
                </Link>
              </div>
            </div>
          </Card>

          <CompletionCard
            pct={completion.pct}
            checks={completion.checks}
            loading={isLoading}
          />
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Stat
            label="Projects"
            value={resume.projects.length}
            icon={<Code2 className="h-4 w-4" />}
            accent="bg-primary/50"
          />
          <Stat
            label="Experience"
            value={resume.experience.length}
            icon={<Briefcase className="h-4 w-4" />}
            accent="bg-success/50"
          />
          <Stat
            label="Skills"
            value={resume.skills.length}
            icon={<Wrench className="h-4 w-4" />}
            accent="bg-warning/50"
          />
          <Stat
            label="Education"
            value={resume.education.length}
            icon={<GraduationCap className="h-4 w-4" />}
            accent="bg-danger/50"
          />
          <Stat
            label="Certifications"
            value={resume.certifications.length}
            icon={<Award className="h-4 w-4" />}
            accent="bg-muted"
          />
        </section>

        {/* Resume Sections */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Sections
              </div>
              <h2 className="font-display font-bold text-2xl">
                Your resume, one block at a time
              </h2>
            </div>
            <Link
              to="/builder"
              className="text-sm font-medium text-foreground/70 hover:text-foreground inline-flex items-center gap-1"
            >
              Open builder <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card hover className="!p-5 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={cn(
                        "h-11 w-11 rounded-2xl grid place-items-center",
                        s.accent,
                      )}
                    >
                      <s.icon className="h-5 w-5" />
                    </div>
                    <Link
                      to="/builder"
                      search={{ step: s.key }}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground pill border border-border px-3 h-8 inline-flex items-center"
                    >
                      Edit
                    </Link>
                  </div>
                  <div className="mt-4">
                    <div className="font-semibold">{s.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {s.desc}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function CompletionCard({
  pct,
  checks,
  loading,
}: {
  pct: number;
  checks: boolean[];
  loading?: boolean;
}) {
  const labels = [
    "Personal Info",
    "Education",
    "Skills",
    "Experience",
    "Projects",
    "Certifications",
    "Achievements",
  ];
  const circumference = 2 * Math.PI * 42;
  const dash = (pct / 100) * circumference;

  return (
    <Card className="!p-6">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
        Resume Score
      </div>
      <div className="flex items-center gap-5 mt-3">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              strokeWidth="8"
              className="stroke-muted"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              className="stroke-[color:var(--color-primary)]"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - dash }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-2xl font-display font-bold">
              {loading ? "…" : `${pct}%`}
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <div className="font-semibold">Almost there</div>
          <div className="text-sm text-muted-foreground">
            Complete each section to boost your ATS score.
          </div>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {labels.map((label, i) => (
          <li key={label} className="flex items-center gap-2 text-sm">
            {checks[i] ? (
              <span className="h-5 w-5 rounded-full bg-success text-success-foreground grid place-items-center">
                <Check className="h-3 w-3" />
              </span>
            ) : (
              <span className="h-5 w-5 rounded-full border border-border grid place-items-center text-muted-foreground">
                <Circle className="h-2 w-2" />
              </span>
            )}
            <span
              className={
                checks[i] ? "text-foreground" : "text-muted-foreground"
              }
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
