import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthToken } from "@/lib/use-auth";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  FileText, 
  Zap, 
  ArrowRight, 
  Briefcase, 
  FileCode2, 
  ShieldCheck 
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Resumify",
    meta: [
      {
        name: "description",
        content:
          "Resumify helps you craft ATS-friendly resumes, manage your professional profile, and generate tailored resumes for any job description using AI.",
      },
      {
        name: "keywords",
        content:
          "resume builder, AI resume, ATS friendly resume, resume creator, AI cv builder, Resumify",
      },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "Resumify — Build ATS-friendly resumes with AI",
      },
      {
        property: "og:description",
        content:
          "Modern resume builder with an AI generator tuned for real job descriptions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { ready, isAuthenticated } = useAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  if (!ready || isAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground overflow-x-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-16 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center shadow-soft">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight">
              Resumify
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm font-semibold hover:text-primary transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-5 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-95 transition shadow-soft"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-2 pb-12 lg:pt-6 lg:pb-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-foreground font-sans font-semibold text-xs tracking-wider uppercase mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current text-primary" /> AI Career Accelerator
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground"
            >
              Resumes that get you <span className="underline decoration-primary decoration-wavy underline-offset-8">hired</span>, powered by AI.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground mt-6 text-lg max-w-xl leading-relaxed"
            >
              Resumify helps you craft clean, ATS-compliant resumes, manage your professional history, and instantly tailor descriptions to any job post using custom AI models.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-95 transition shadow-soft cursor-pointer text-sm"
              >
                Create Free Resume <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 h-12 rounded-full border border-border bg-card hover:bg-muted text-foreground font-semibold transition cursor-pointer text-sm"
              >
                Explore Features
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-6 sm:gap-8 border-t border-border/60 pt-8 w-full"
            >
              <div>
                <div className="font-sans font-bold text-2xl sm:text-3xl text-foreground">98%</div>
                <div className="text-xs text-muted-foreground mt-1">ATS Pass Rate</div>
              </div>
              <div>
                <div className="font-sans font-bold text-2xl sm:text-3xl text-foreground">10x</div>
                <div className="text-xs text-muted-foreground mt-1">Faster Drafting</div>
              </div>
              <div>
                <div className="font-sans font-bold text-2xl sm:text-3xl text-foreground">Free</div>
                <div className="text-xs text-muted-foreground mt-1">Basic Resume</div>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Column: Resume Mockup Widget */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            {/* Background Blob decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full max-w-[400px] rounded-3xl border border-border bg-card p-6 shadow-float relative z-10 select-none text-left"
            >
              {/* ATS Indicator floating widget */}
              <div className="absolute -top-4 -right-4 h-14 w-32 rounded-2xl bg-success text-success-foreground border border-border p-3 shadow-soft flex items-center gap-2.5 z-20">
                <ShieldCheck className="h-6 w-6 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">ATS Score</div>
                  <div className="text-sm font-bold leading-none">98 / 100</div>
                </div>
              </div>

              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-border/40 pb-4 mb-4">
                <div>
                  <h3 className="font-sans font-bold text-lg text-foreground leading-none">Sarah Jenkins</h3>
                  <p className="text-xs text-foreground/80 font-bold mt-1">Lead Software Architect</p>
                </div>
                <div className="text-[10px] text-muted-foreground text-right">
                  <div>New York, NY</div>
                  <div>sarah.j@example.com</div>
                </div>
              </div>

              {/* Section 1: Summary */}
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Professional Summary
                </h4>
                <div className="h-2 bg-muted rounded-full w-full mb-1" />
                <div className="h-2 bg-muted rounded-full w-5/6" />
              </div>

              {/* Section 2: Experience */}
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> Experience
                </h4>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-xs font-bold text-foreground">Google — Staff Architect</div>
                  <div className="text-[9px] text-muted-foreground">2022 - Present</div>
                </div>
                <div className="h-1.5 bg-muted rounded-full w-11/12 mb-1" />
                <div className="h-1.5 bg-muted rounded-full w-4/5" />
              </div>

              {/* Section 3: Skills list */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <FileCode2 className="h-3 w-3" /> Skills
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[9px] font-bold bg-primary/20 text-foreground px-2 py-0.5 rounded-full border border-primary/30">React</span>
                  <span className="text-[9px] font-bold bg-primary/20 text-foreground px-2 py-0.5 rounded-full border border-primary/30">FastAPI</span>
                  <span className="text-[9px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">TypeScript</span>
                  <span className="text-[9px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">Docker</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-6 sm:px-8 border-t border-border/40 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold text-foreground/80 uppercase tracking-widest">Built for Results</span>
            <h2 className="font-sans font-bold text-3xl sm:text-4xl text-foreground mt-2">
              Everything you need to land your next interview
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Stop guessing if your resume matches the job description. Our tools align everything to fit ATS guidelines and recruiter expectations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-surface p-6 bg-card flex flex-col items-start text-left hover:-translate-y-1 transition duration-200">
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-5 shadow-soft">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-foreground">ATS-Compliant Structure</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Standard templates formatted specifically to load perfectly inside applicant tracking systems without parse errors.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-surface p-6 bg-card flex flex-col items-start text-left hover:-translate-y-1 transition duration-200">
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-5 shadow-soft">
                <Sparkles className="h-5 w-5 fill-current" />
              </div>
              <h3 className="font-sans font-bold text-lg text-foreground">AI Resume Tailoring</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Instantly adjust bullet points, write summaries, and add matching skills based directly on the job description you copy in.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-surface p-6 bg-card flex flex-col items-start text-left hover:-translate-y-1 transition duration-200">
              <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-5 shadow-soft">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-foreground">Polished UI Controls</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Enter details fast with dynamic inputs, rich error notifications, and a premium custom Month-Year selection calendar dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 relative overflow-hidden text-center flex flex-col items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-primary/15 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-foreground relative z-10 max-w-lg">
            Ready to design a CV that captures attention?
          </h2>
          <p className="text-muted-foreground mt-4 text-sm max-w-md relative z-10 leading-relaxed">
            Create a profile, enter your details step-by-step, and generate targeted applications today. Free basic tier, no credit card required.
          </p>
          <div className="mt-8 relative z-10">
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-8 h-12 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-95 transition shadow-soft cursor-pointer text-sm"
            >
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-sans font-bold text-base tracking-tight text-foreground">
              Resumify
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Resumify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
