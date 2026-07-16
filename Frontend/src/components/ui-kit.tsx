import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  const el = (
    <div className={cn("card-surface p-6", className)}>{children}</div>
  );
  if (!hover) return el;
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.10)" }}
      transition={{ type: "tween", duration: 0.2 }}
      className={cn("card-surface p-6", className)}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display font-bold text-2xl md:text-3xl">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm max-w-xl">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function PillButton({
  variant = "primary",
  className,
  children,
  ...rest
}: {
  variant?: "primary" | "secondary" | "ghost" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary:
      "bg-primary text-primary-foreground hover:brightness-95 shadow-soft",
    secondary: "bg-card text-foreground border border-border hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
    danger: "bg-danger text-danger-foreground hover:brightness-95",
  };
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center gap-2 pill h-11 px-5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Stat({
  label,
  value,
  icon,
  accent = "bg-muted",
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
}) {
  return (
    <Card hover className="!p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-2xl grid place-items-center",
            accent,
          )}
        >
          {icon}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-display font-bold">{value}</div>
        </div>
      </div>
    </Card>
  );
}
