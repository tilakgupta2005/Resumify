import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthToken } from "@/lib/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Resumify — Build ATS-friendly resumes with AI",
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
    if (!ready) return;
    navigate({ to: isAuthenticated ? "/dashboard" : "/auth", replace: true });
  }, [ready, isAuthenticated, navigate]);
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
    </div>
  );
}
