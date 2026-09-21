import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

export interface PasswordCriterion {
  id: string;
  label: string;
  met: boolean;
}

export function checkPasswordCriteria(password: string): PasswordCriterion[] {
  const pwd = password || "";
  return [
    {
      id: "length",
      label: "At least 8 characters",
      met: pwd.length >= 8,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A-Z)",
      met: /[A-Z]/.test(pwd),
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter (a-z)",
      met: /[a-z]/.test(pwd),
    },
    {
      id: "special",
      label: "At least one special character (!@#$%^&*)",
      met: /[!@#$%^&*(),.?":{}|<>_~\-+=\[\]\\\/]/.test(pwd),
    },
  ];
}

export function getPasswordStrength(criteria: PasswordCriterion[]): {
  score: number;
  label: string;
  colorClass: string;
  barColor: string;
} {
  const metCount = criteria.filter((c) => c.met).length;
  if (metCount === 0) {
    return { score: 0, label: "Very Weak", colorClass: "text-muted-foreground", barColor: "bg-muted" };
  }
  if (metCount === 1) {
    return { score: 25, label: "Weak", colorClass: "text-destructive", barColor: "bg-destructive" };
  }
  if (metCount === 2) {
    return { score: 50, label: "Fair", colorClass: "text-amber-500", barColor: "bg-amber-500" };
  }
  if (metCount === 3) {
    return { score: 75, label: "Good", colorClass: "text-blue-500", barColor: "bg-blue-500" };
  }
  return { score: 100, label: "Strong", colorClass: "text-emerald-500", barColor: "bg-emerald-500" };
}

interface PasswordRequirementsProps {
  password: string;
  isVisible?: boolean;
  className?: string;
  title?: string;
}

export function PasswordRequirementsPopover({
  password,
  isVisible = true,
  className = "",
  title = "Password Requirements",
}: PasswordRequirementsProps) {
  const criteria = useMemo(() => checkPasswordCriteria(password), [password]);
  const strength = useMemo(() => getPasswordStrength(criteria), [criteria]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className={`card-surface border border-border/80 p-3.5 rounded-2xl shadow-lg bg-card/95 backdrop-blur-md text-xs space-y-2.5 z-20 ${className}`}
        >
          <div className="flex items-center justify-between font-medium text-foreground pb-1 border-b border-border/50">
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              {strength.score === 100 ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              )}
              {title}
            </span>
            <span className={`font-semibold ${strength.colorClass}`}>
              {strength.label}
            </span>
          </div>

          {/* Strength Bar */}
          <div className="w-full bg-muted/80 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${strength.barColor} transition-all duration-300`}
              style={{ width: `${strength.score}%` }}
            />
          </div>

          {/* Criteria List */}
          <ul className="space-y-1.5 pt-0.5">
            {criteria.map((c) => (
              <li
                key={c.id}
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  c.met ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
                    c.met
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.met ? <Check className="w-3 h-3" /> : <X className="w-2.5 h-2.5" />}
                </span>
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
