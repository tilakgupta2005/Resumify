import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Eye, EyeOff, FileText } from "lucide-react";
import { PillButton } from "@/components/ui-kit";
import { apiErrorMessage } from "@/lib/api";
import { useResetPassword } from "@/lib/queries";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    title: "Reset Password — Resumify",
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: ResetPasswordPage,
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirm: z.string().min(8, "Required"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function ResetPasswordPage() {
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useResetPassword();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const hash = window.location.hash;
        if (hash) {
          const params = new URLSearchParams(hash.replace("#", "?"));
          const token = params.get("access_token");
          const refresh = params.get("refresh_token");
          if (token) setAccessToken(token);
          if (refresh) setRefreshToken(refresh);
          toast.info("Session initialized. You can now reset your password.");
        }
      } catch (e) {
        console.error("Error parsing supabase reset token:", e);
      }
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!accessToken || !refreshToken) {
      toast.error(
        "Recovery session is missing or invalid. Please request a new password reset email.",
      );
      return;
    }
    try {
      await mutateAsync({
        password: values.password,
        accessToken,
        refreshToken,
      });
      toast.success("Password updated successfully! Redirecting to sign in...");
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/auth", replace: true });
      }, 3000);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to update password"));
    }
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center shadow-soft">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Resumify
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h1 className="font-display font-bold text-4xl leading-tight">
            Reset Password.{" "}
            <span className="bg-primary px-2 rounded-lg">Access Restored.</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Choose a strong password to secure your Resumify account.
          </p>
        </motion.div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Resumify · Crafted with care.
        </div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-warning/40 blur-3xl" />
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="card-surface p-8 md:p-10">
            {success ? (
              <div className="space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Success!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your password has been updated successfully. Redirecting...
                  </p>
                </div>
                <PillButton
                  onClick={() => navigate({ to: "/auth", replace: true })}
                  className="w-full justify-center"
                >
                  Go to Sign in
                </PillButton>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Reset Password
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Please choose a new password for your account.
                  </p>
                </div>
                <form onSubmit={onSubmit} className="space-y-4">
                  <Field label="New Password" error={errors.password?.message}>
                    <div className="relative">
                      <input
                        type={show ? "text" : "password"}
                        autoComplete="new-password"
                        className={inputCls}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShow((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-label="Toggle password"
                      >
                        {show ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </Field>
                  <Field
                    label="Confirm Password"
                    error={errors.confirm?.message}
                  >
                    <input
                      type="password"
                      autoComplete="new-password"
                      className={inputCls}
                      {...register("confirm")}
                    />
                  </Field>
                  <PillButton
                    type="submit"
                    disabled={isPending}
                    className="w-full justify-center"
                  >
                    {isPending ? "Updating password…" : "Update Password"}
                  </PillButton>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full h-11 px-4 rounded-2xl bg-muted/60 border border-transparent focus:bg-card focus:border-border outline-none text-sm transition";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </div>
      {children}
      {error && <div className="text-xs text-destructive mt-1">{error}</div>}
    </label>
  );
}
