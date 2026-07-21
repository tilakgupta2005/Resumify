import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, RotateCw, Save, Sparkles, Key, Eye, EyeOff, X as CloseIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { Card, PillButton } from "@/components/ui-kit";
import { apiErrorMessage, getStoredLlmKey, setStoredLlmKey } from "@/lib/api";
import { useGenerateResume, useValidateKey } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  head: () => ({
    title: "Resumify",
    meta: [
      {
        name: "description",
        content:
          "Paste a job description and generate an ATS-friendly resume in seconds.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AIPage,
});

function AIPage() {
  const [jd, setJd] = useState("");
  const [pdfData, setPdfData] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  const generate = useGenerateResume();
  const previewRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState("");
  const [showModalKey, setShowModalKey] = useState(false);
  const validateKey = useValidateKey();

  const run = async () => {
    if (jd.trim().length < 20) {
      toast.error("Paste a real job description first.");
      return;
    }

    const key = getStoredLlmKey();
    if (!key) {
      setShowModal(true);
      return;
    }

    // Scroll preview panel into focus on mobile and tablet
    setTimeout(() => {
      previewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    try {
      const data = await generate.mutateAsync(jd.trim());
      if (pdfData?.url) {
        URL.revokeObjectURL(pdfData.url);
      }
      const url = URL.createObjectURL(data.blob);
      setPdfData({ url, filename: data.filename });
      toast.success("Resume generated!");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Generation failed"));
    }
  };

  const handleValidateAndGenerate = async () => {
    if (!modalKey.trim()) {
      toast.error("Please enter a key.");
      return;
    }
    try {
      await validateKey.mutateAsync(modalKey.trim());
      setStoredLlmKey(modalKey.trim());
      setShowModal(false);
      toast.success("API Key validated successfully!");
      // Automatically trigger generation
      setTimeout(() => {
        run();
      }, 100);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Validation failed"));
    }
  };


  useEffect(() => {
    return () => {
      if (pdfData?.url) {
        URL.revokeObjectURL(pdfData.url);
      }
    };
  }, [pdfData?.url]);

  return (
    <AppLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            AI Generator
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mt-1">
            Generate an ATS resume
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Paste any job description and generate an optimized resume using AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="!p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">Job description</div>
              <span className="text-xs text-muted-foreground">
                {jd.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste job description here…"
              className="w-full flex-1 min-h-[400px] rounded-2xl bg-muted/60 focus:bg-card border border-transparent focus:border-border outline-none p-4 text-sm resize-y transition"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <PillButton onClick={run} disabled={generate.isPending}>
                <Sparkles className="h-4 w-4" />
                {generate.isPending ? "Generating…" : "Generate resume"}
              </PillButton>
              {jd && (
                <PillButton
                  variant="ghost"
                  onClick={() => setJd("")}
                  disabled={generate.isPending}
                >
                  Clear
                </PillButton>
              )}
            </div>
          </Card>

          <div ref={previewRef} className="scroll-mt-20 flex flex-col h-full">
            <Card className="!p-6 flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-4 h-11">
                <div>
                  <div className="text-sm font-semibold">Resume preview</div>
                  {pdfData && (
                    <div className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-xs font-mono mt-0.5">
                      {pdfData.filename}
                    </div>
                  )}
                </div>
                {pdfData && (
                  <PillButton
                    variant="secondary"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = pdfData.url;
                      a.download = pdfData.filename;
                      a.click();
                    }}
                    className="!h-9 !px-3 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </PillButton>
                )}
              </div>

              {generate.isPending ? (
                <SkeletonPreview />
              ) : pdfData ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 min-h-[450px] border border-border rounded-2xl overflow-hidden bg-muted/20"
                >
                  <iframe
                    src={pdfData.url}
                    className="w-full h-full min-h-[450px]"
                    title="Resume Preview"
                  />
                </motion.div>
              ) : (
                <EmptyPreview />
              )}
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-foreground/30 backdrop-blur-md"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-float z-10"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <CloseIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-2xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Key className="h-4 w-4" />
                </div>
                <h3 className="font-display font-bold text-lg">
                  Gemini API Key Required
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                To generate resumes using AI, you need to provide your Google Gemini API key. It will be stored safely in your browser.
              </p>

              <div className="bg-muted/40 border border-border/50 rounded-2xl p-4 text-xs space-y-2 mb-6">
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

              <div className="space-y-4">
                <div className="relative flex items-center">
                  <input
                    type={showModalKey ? "text" : "password"}
                    value={modalKey}
                    onChange={(e) => setModalKey(e.target.value)}
                    placeholder="Enter your Gemini API key (AIzaSy...)"
                    className="w-full h-11 pl-4 pr-12 rounded-2xl bg-muted/60 focus:bg-card border border-transparent focus:border-border outline-none text-sm transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalKey(!showModalKey)}
                    className="absolute right-4 text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    {showModalKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <PillButton
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                    disabled={validateKey.isPending}
                  >
                    Cancel
                  </PillButton>
                  <PillButton
                    onClick={handleValidateAndGenerate}
                    disabled={validateKey.isPending}
                  >
                    {validateKey.isPending ? "Validating..." : "Validate & Generate"}
                  </PillButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

function EmptyPreview() {
  return (
    <div className="flex-1 min-h-[400px] rounded-2xl border border-dashed border-border grid place-items-center text-center p-8">
      <div>
        <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/40 grid place-items-center">
          <FileText className="h-6 w-6" />
        </div>
        <div className="mt-4 font-semibold">
          Your generated resume will appear here
        </div>
        <div className="text-sm text-muted-foreground mt-1 max-w-sm">
          Paste a job description on the left and click Generate to see an
          AI-tailored resume.
        </div>
      </div>
    </div>
  );
}

const LOADING_STEPS = [
  "Analyzing Job Description...",
  "Selecting relevant projects...",
  "Rewriting descriptions with ATS keywords...",
  "Formatting PDF structure...",
  "Compiling PDF document...",
];

function SkeletonPreview() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) =>
        prev < LOADING_STEPS.length - 1 ? prev + 1 : prev,
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 min-h-[400px] w-full overflow-hidden rounded-2xl bg-muted/40 border border-border p-4 sm:p-6 flex flex-col justify-center items-center space-y-8">
      {/* Spinner */}
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-primary animate-pulse">
          AI
        </span>
      </div>

      {/* Logs stack */}
      <div className="w-full max-w-xs sm:max-w-sm text-left font-mono text-xs space-y-4">
        {LOADING_STEPS.slice(0, stepIndex + 1).map((label, idx) => {
          const isDone = idx < stepIndex;

          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                isDone
                  ? "text-muted-foreground"
                  : "text-foreground font-semibold",
              )}
            >
              {/* Indicator */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <div className="h-4 w-4 rounded-full bg-success/10 text-success grid place-items-center text-[9px] font-bold">
                    ✓
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-primary/10 grid place-items-center">
                    <RotateCw className="h-2.5 w-2.5 animate-spin text-primary" />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="min-w-0 flex-1 truncate">{label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
