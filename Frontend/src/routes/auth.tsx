import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { PillButton } from "@/components/ui-kit";
import { apiErrorMessage, setStoredToken, USER_KEY } from "@/lib/api";
import { useLogin, useSignup, useForgotPassword } from "@/lib/queries";
import { notifyAuthChange, useAuthToken } from "@/lib/use-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    title: "Sign in — Resumify",
    meta: [
      {
        name: "description",
        content:
          "Sign in or create an account to start building your AI-powered resume.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
  remember: z.boolean().optional(),
});

const signupSchema = z
  .object({
    name: z.string().min(2, "Required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirm: z.string().min(6, "Required"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const { ready, isAuthenticated } = useAuthToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [ready, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-primary grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display font-bold text-xl">Resumify</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h1 className="font-display font-bold text-4xl leading-tight">
            Build ATS-friendly resumes.{" "}
            <span className="bg-primary px-2 rounded-lg">Tailored by AI.</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            One profile. Endless job-ready resumes generated from any job
            description.
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
            {mode !== "forgot" && (
              <div className="flex gap-2 pill bg-muted p-1 mb-8">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex-1 pill h-9 text-sm font-semibold transition",
                      mode === m
                        ? "bg-card shadow-soft text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {m === "login" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>
            )}
            {mode === "login" ? (
              <LoginForm forgotPassword={() => setMode("forgot")} />
            ) : mode === "signup" ? (
              <SignupForm switchMode={() => setMode("login")} />
            ) : (
              <ForgotPasswordForm switchMode={() => setMode("login")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function persistAuth(data: {
  access_token?: string;
  token?: string;
  user?: any;
  email?: string;
  user_id?: string;
}) {
  const token = data.access_token || data.token;
  if (!token) throw new Error("No token returned from server");
  setStoredToken(token);
  const user =
    data.user || (data.email ? { email: data.email, id: data.user_id } : null);
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
}

function LoginForm({ forgotPassword }: { forgotPassword: () => void }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await mutateAsync({
        email: values.email,
        password: values.password,
      });
      persistAuth(data);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Login failed"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          className={inputCls}
          {...register("email")}
        />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            autoComplete="current-password"
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
      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 text-muted-foreground">
          <input
            type="checkbox"
            defaultChecked
            {...register("remember")}
            className="accent-primary"
          />
          Remember me
        </label>
        <button
          type="button"
          onClick={forgotPassword}
          className="text-foreground font-medium hover:underline"
        >
          Forgot password?
        </button>
      </div>
      <PillButton
        type="submit"
        disabled={isPending}
        className="w-full justify-center"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </PillButton>
    </form>
  );
}

function SignupForm({ switchMode }: { switchMode: () => void }) {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const isPending = signupMutation.isPending || loginMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await signupMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      // Some APIs return a token immediately; if not, perform login.
      if (data?.access_token || data?.token) {
        persistAuth(data);
        toast.success("Account created!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        toast.info("Account created. Logging in...");
        const loginData = await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });
        persistAuth(loginData);
        toast.success("Welcome to Resumify!");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Signup failed"));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Full name" error={errors.name?.message}>
        <input type="text" className={inputCls} {...register("name")} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          autoComplete="email"
          className={inputCls}
          {...register("email")}
        />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <input type="password" className={inputCls} {...register("password")} />
      </Field>
      <Field label="Confirm password" error={errors.confirm?.message}>
        <input type="password" className={inputCls} {...register("confirm")} />
      </Field>
      <PillButton
        type="submit"
        disabled={isPending}
        className="w-full justify-center"
      >
        {isPending ? "Creating account…" : "Create account"}
      </PillButton>
    </form>
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

function ForgotPasswordForm({ switchMode }: { switchMode: () => void }) {
  const { mutateAsync, isPending } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await mutateAsync(values.email);
      toast.success(
        response.message || "Password reset email sent. Check your inbox.",
      );
    } catch (err) {
      toast.error(apiErrorMessage(err, "Failed to send password reset email"));
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Forgot password?
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className={inputCls}
            {...register("email")}
          />
        </Field>
        <PillButton
          type="submit"
          disabled={isPending}
          className="w-full justify-center"
        >
          {isPending ? "Sending link…" : "Send reset link"}
        </PillButton>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={switchMode}
            className="text-sm text-muted-foreground hover:text-foreground transition hover:underline"
          >
            Back to Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
