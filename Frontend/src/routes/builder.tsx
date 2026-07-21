import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { Card, PillButton } from "@/components/ui-kit";
import { apiErrorMessage } from "@/lib/api";
import {
  useBaseResume,
  useSaveResume,
  getResumeWithUserFallback,
} from "@/lib/queries";
import { emptyResume, resumeSchema, type Resume } from "@/lib/resume-schema";
import { cn } from "@/lib/utils";
import { MonthYearPicker } from "@/components/month-year-picker";

import { z } from "zod";

const builderSearchSchema = z.object({
  step: z.string().optional().catch(""),
});

export const Route = createFileRoute("/builder")({
  validateSearch: builderSearchSchema,
  head: () => ({
    title: "Resumify",
    meta: [
      {
        name: "description",
        content: "Complete every section of your resume in a guided wizard.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BuilderPage,
});

const STEPS = [
  "Personal Information",
  "Skills",
  "Experience",
  "Education",
  "Projects",
  "Certifications",
  "Achievements",
  "Technical Participation",
  "Co Curricular",
  "Extra Curricular",
];

function BuilderPage() {
  const { step: searchStep } = Route.useSearch();
  const { data, isLoading } = useBaseResume();
  const exists = !!data;
  const save = useSaveResume();

  const stepIndex = useMemo(() => {
    if (!searchStep) return 0;
    const lowerSearch = searchStep.toLowerCase();
    const keyMap: Record<string, number> = {
      personal: 0,
      skills: 1,
      experience: 2,
      education: 3,
      projects: 4,
      certifications: 5,
      achievements: 6,
      tech: 7,
      co: 8,
      extra: 9,
    };
    if (lowerSearch in keyMap) return keyMap[lowerSearch];
    const index = STEPS.findIndex(
      (s) => s.toLowerCase().replace(/\s+/g, "-") === lowerSearch,
    );
    return index !== -1 ? index : 0;
  }, [searchStep]);

  const [step, setStep] = useState(stepIndex);

  useEffect(() => {
    setStep(stepIndex);
  }, [stepIndex]);

  const methods = useForm<Resume>({
    resolver: zodResolver(resumeSchema as any),
    defaultValues: emptyResume(),
    mode: "onBlur",
  });

  useEffect(() => {
    if (data) {
      methods.reset(data);
    } else if (!isLoading) {
      methods.reset(getResumeWithUserFallback());
    }
  }, [data, isLoading, methods]);

  const submit = async (values: Resume, finish = false) => {
    try {
      await save.mutateAsync({ resume: values, exists });
      toast.success(finish ? "Resume saved!" : "Draft saved");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save"));
    }
  };

  const getStepForErrorPath = (path: string): number => {
    if (path.startsWith("personal_info")) return 0;
    if (path.startsWith("skills")) return 1;
    if (path.startsWith("experience")) return 2;
    if (path.startsWith("education")) return 3;
    if (path.startsWith("projects")) return 4;
    if (path.startsWith("certifications")) return 5;
    if (path.startsWith("achievements")) return 6;
    if (path.startsWith("technical_participation")) return 7;
    if (path.startsWith("co_curricular")) return 8;
    if (path.startsWith("extra_curricular")) return 9;
    return 0;
  };

  const onInvalid = (errors: any) => {
    console.log("Validation errors:", errors);
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const errorStep = getStepForErrorPath(firstErrorKey);
      setStep(errorStep);
      toast.error(`Please correct the errors in the ${STEPS[errorStep]} section.`);
    }
  };

  const handleNext = async () => {
    const stepFields: Record<number, any> = {
      0: "personal_info",
      1: "skills",
      2: "experience",
      3: "education",
      4: "projects",
      5: "certifications",
      6: "achievements",
      7: "technical_participation",
      8: "co_curricular",
      9: "extra_curricular",
    };

    const fieldToValidate = stepFields[step];
    if (fieldToValidate) {
      const isValid = await methods.trigger(fieldToValidate);
      if (!isValid) {
        toast.error("Please correct the errors in this section before proceeding.");
        return;
      }
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  return (
    <AppLayout>
      <div className="max-w-5xl">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            Resume Builder
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mt-1">
            Fill out your story, step by step
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Complete each section. You can save a draft at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Stepper step={step} setStep={setStep} />

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit((values) => submit(values, true), onInvalid)}
            >
              <Card className="!p-4 sm:!p-6 md:!p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6">
                  <PillButton
                    type="button"
                    variant="ghost"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </PillButton>
                  <div className="flex flex-wrap gap-2">
                    <PillButton
                      type="button"
                      variant="secondary"
                      onClick={() => methods.handleSubmit((values) => submit(values, false), onInvalid)()}
                      disabled={save.isPending}
                    >
                      <Save className="h-4 w-4" /> Save draft
                    </PillButton>
                    {step < STEPS.length - 1 ? (
                      <PillButton
                        type="button"
                        onClick={handleNext}
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </PillButton>
                    ) : (
                      <PillButton type="submit" disabled={save.isPending}>
                        {save.isPending ? "Saving…" : "Finish & save"}
                      </PillButton>
                    )}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading ? (
                      <div className="h-64 grid place-items-center text-muted-foreground">
                        Loading resume…
                      </div>
                    ) : (
                      <StepContent step={step} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Card>
            </form>
          </FormProvider>
        </div>
      </div>
    </AppLayout>
  );
}

function Stepper({
  step,
  setStep,
}: {
  step: number;
  setStep: (n: number) => void;
}) {
  const containerRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current[step]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [step]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLOListElement>) => {
    if (containerRef.current && Math.abs(e.deltaY) > 0) {
      containerRef.current.scrollBy({ left: e.deltaY, behavior: "auto" });
    }
  };

  return (
    <Card className="!p-3 h-fit sticky top-16 lg:top-6 z-20 overflow-hidden w-full">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="h-9 w-9 shrink-0 grid place-items-center rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <ol
          ref={containerRef}
          onWheel={handleWheel}
          className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth flex-1"
        >
          {STEPS.map((label, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <li
                key={label}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3.5 h-10 rounded-full text-sm font-medium transition whitespace-nowrap",
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                        ? "text-foreground hover:bg-muted"
                        : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "h-6 w-6 grid place-items-center rounded-full text-[11px] font-semibold shrink-0",
                      active
                        ? "bg-foreground text-primary"
                        : done
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="truncate">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="h-9 w-9 shrink-0 grid place-items-center rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <PersonalStep />;
    case 1:
      return <SkillsStep />;
    case 2:
      return <ExperienceStep />;
    case 3:
      return <EducationStep />;
    case 4:
      return <ProjectsStep />;
    case 5:
      return <CertificationsStep />;
    case 6:
      return (
        <ListStep
          name="achievements"
          heading="Achievements"
          desc="Awards, recognitions, notable outcomes."
        />
      );
    case 7:
      return (
        <ListStep
          name="technical_participation"
          heading="Technical Participation"
          desc="Hackathons, conferences, workshops."
        />
      );
    case 8:
      return (
        <ListStep
          name="co_curricular"
          heading="Co Curricular"
          desc="Clubs, societies, team activities."
        />
      );
    case 9:
      return (
        <ListStep
          name="extra_curricular"
          heading="Extra Curricular"
          desc="Hobbies, sports, volunteering."
        />
      );
    default:
      return null;
  }
}

/* ---------- Shared field components ---------- */

const inputCls =
  "w-full h-11 px-4 rounded-2xl bg-muted/60 border border-transparent focus:bg-card focus:border-border outline-none text-sm transition";
const textareaCls = inputCls.replace("h-11", "min-h-[120px] py-3");

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <div className="text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </div>
      {children}
      {error && <div className="text-xs text-destructive mt-1">{error}</div>}
    </label>
  );
}

function StepHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="font-display font-bold text-2xl">{title}</h2>
        {desc && <p className="text-muted-foreground text-sm mt-1">{desc}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* ---------- Steps ---------- */

function PersonalStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<Resume>();
  const e = errors.personal_info as any;
  return (
    <div>
      <StepHeader
        title="Personal information"
        desc="Your contact details and profile links."
      />
      <div className="grid lg:grid-cols-2 gap-4">
        <Field label="First name" error={e?.first_name?.message}>
          <input
            className={inputCls}
            {...register("personal_info.first_name")}
          />
        </Field>
        <Field label="Middle name" error={e?.middle_name?.message}>
          <input
            className={inputCls}
            {...register("personal_info.middle_name")}
          />
        </Field>
        <Field label="Last name" error={e?.last_name?.message}>
          <input
            className={inputCls}
            {...register("personal_info.last_name")}
          />
        </Field>
        <Field label="Email" error={e?.email?.message}>
          <input
            type="email"
            className={inputCls}
            {...register("personal_info.email")}
          />
        </Field>
        <Field label="Phone" error={e?.phone?.message}>
          <input className={inputCls} {...register("personal_info.phone")} />
        </Field>
        <Field
          label="Address"
          error={e?.address?.message}
          className="lg:col-span-2"
        >
          <input className={inputCls} {...register("personal_info.address")} />
        </Field>
        <Field label="City" error={e?.city?.message}>
          <input className={inputCls} {...register("personal_info.city")} />
        </Field>
        <Field label="State" error={e?.state?.message}>
          <input className={inputCls} {...register("personal_info.state")} />
        </Field>
        <Field label="Country" error={e?.country?.message}>
          <input className={inputCls} {...register("personal_info.country")} />
        </Field>
        <Field label="Postal code" error={e?.postal_code?.message}>
          <input
            className={inputCls}
            {...register("personal_info.postal_code")}
          />
        </Field>
        <Field label="LinkedIn URL" error={e?.linkedin?.message}>
          <input
            className={inputCls}
            placeholder="https://linkedin.com/in/…"
            {...register("personal_info.linkedin")}
          />
        </Field>
        <Field label="GitHub URL" error={e?.github?.message}>
          <input
            className={inputCls}
            placeholder="https://github.com/…"
            {...register("personal_info.github")}
          />
        </Field>
        <Field
          label="Portfolio URL"
          error={e?.portfolio?.message}
          className="lg:col-span-2"
        >
          <input
            className={inputCls}
            placeholder="https://…"
            {...register("personal_info.portfolio")}
          />
        </Field>
      </div>
    </div>
  );
}

function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      query
        ? value.filter((t) => t.toLowerCase().includes(query.toLowerCase()))
        : value,
    [value, query],
  );
  const add = () => {
    const v = input.trim();
    if (!v) return;
    if (value.map((t) => t.toLowerCase()).includes(v.toLowerCase())) {
      setInput("");
      return;
    }
    onChange([...value, v]);
    setInput("");
  };
  return (
    <div>
      <div className="flex gap-2">
        <input
          className={cn(inputCls, "flex-1")}
          placeholder={placeholder ?? "Type and press Enter"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
        />
        <PillButton type="button" onClick={add} variant="secondary">
          <Plus className="h-4 w-4" /> Add
        </PillButton>
      </div>
      {value.length > 0 && (
        <>
          <input
            className={cn(inputCls, "mt-3")}
            placeholder="Search added…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {filtered.map((t) => (
              <span
                key={t}
                className="pill inline-flex items-center gap-2 pl-3 pr-1 h-8 text-sm bg-primary/70 text-primary-foreground"
              >
                {t}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((x) => x !== t))}
                  className="h-6 w-6 rounded-full grid place-items-center hover:bg-black/10"
                  aria-label={`Remove ${t}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SkillsStep() {
  const { control } = useFormContext<Resume>();
  return (
    <div>
      <StepHeader
        title="Skills"
        desc="Add technologies and skills. Press Enter to add."
      />
      <Controller
        control={control}
        name="skills"
        render={({ field }) => (
          <TagsInput
            value={field.value}
            onChange={field.onChange}
            placeholder="e.g. TypeScript, React, PostgreSQL"
          />
        )}
      />
    </div>
  );
}

function RepeatableSection<
  K extends "experience" | "education" | "projects" | "certifications",
>({
  name,
  heading,
  desc,
  defaultItem,
  renderItem,
  itemLabel,
}: {
  name: K;
  heading: string;
  desc?: string;
  defaultItem: Resume[K][number];
  renderItem: (index: number) => React.ReactNode;
  itemLabel: (i: number) => string;
}) {
  const { control } = useFormContext<Resume>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const addButton = (
    <PillButton
      type="button"
      variant="secondary"
      onClick={() => append(defaultItem as any)}
    >
      <Plus className="h-4 w-4" /> Add {heading.replace(/s$/, "")}
    </PillButton>
  );

  return (
    <div>
      <StepHeader title={heading} desc={desc} action={addButton} />
      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="text-sm text-muted-foreground border border-dashed border-border rounded-2xl p-8 text-center">
            Nothing here yet. Add your first entry.
          </div>
        )}
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="rounded-2xl border border-border p-5 bg-muted/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-sm">{itemLabel(i)}</div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="h-8 w-8 rounded-full grid place-items-center hover:bg-danger/40 text-muted-foreground hover:text-foreground"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {renderItem(i)}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceStep() {
  const { register, control, formState: { errors } } = useFormContext<Resume>();
  return (
    <RepeatableSection
      name="experience"
      heading="Experience"
      desc="Your roles and impact."
      itemLabel={(i) => `Experience #${i + 1}`}
      defaultItem={{
        company: "",
        designation: "",
        ctc: "",
        location: "",
        start_date: "",
        end_date: "",
        description: "",
        skills: [],
      }}
      renderItem={(i) => {
        const e = (errors.experience as any)?.[i];
        return (
          <div className="grid lg:grid-cols-2 gap-4">
            <Field label="Company" error={e?.company?.message}>
              <input
                className={inputCls}
                {...register(`experience.${i}.company`)}
              />
            </Field>
            <Field label="Designation" error={e?.designation?.message}>
              <input
                className={inputCls}
                {...register(`experience.${i}.designation`)}
              />
            </Field>
            <Field label="CTC" error={e?.ctc?.message}>
              <input className={inputCls} {...register(`experience.${i}.ctc`)} />
            </Field>
            <Field label="Location" error={e?.location?.message}>
              <input
                className={inputCls}
                {...register(`experience.${i}.location`)}
              />
            </Field>
            <Field label="Start date" error={e?.start_date?.message}>
              <Controller
                control={control}
                name={`experience.${i}.start_date`}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={e?.start_date?.message}
                  />
                )}
              />
            </Field>
            <Field label="End date" error={e?.end_date?.message}>
              <Controller
                control={control}
                name={`experience.${i}.end_date`}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    showPresent={true}
                    error={e?.end_date?.message}
                  />
                )}
              />
            </Field>
            <Field label="Description" error={e?.description?.message} className="lg:col-span-2">
              <textarea
                className={textareaCls}
                {...register(`experience.${i}.description`)}
              />
            </Field>
            <Field label="Skills used" error={e?.skills?.message} className="lg:col-span-2">
              <Controller
                control={control}
                name={`experience.${i}.skills`}
                render={({ field }) => (
                  <TagsInput value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          </div>
        );
      }}
    />
  );
}

function EducationStep() {
  const { register, control, formState: { errors } } = useFormContext<Resume>();
  return (
    <RepeatableSection
      name="education"
      heading="Education"
      itemLabel={(i) => `Education #${i + 1}`}
      defaultItem={{
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        grade: "",
      }}
      renderItem={(i) => {
        const e = (errors.education as any)?.[i];
        return (
          <div className="grid lg:grid-cols-2 gap-4">
            <Field label="Institution" error={e?.institution?.message} className="lg:col-span-2">
              <input
                className={inputCls}
                {...register(`education.${i}.institution`)}
              />
            </Field>
            <Field label="Degree" error={e?.degree?.message}>
              <input
                className={inputCls}
                {...register(`education.${i}.degree`)}
              />
            </Field>
            <Field label="Field of study" error={e?.field_of_study?.message}>
              <input
                className={inputCls}
                {...register(`education.${i}.field_of_study`)}
              />
            </Field>
            <Field label="Start date" error={e?.start_date?.message}>
              <Controller
                control={control}
                name={`education.${i}.start_date`}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={e?.start_date?.message}
                  />
                )}
              />
            </Field>
            <Field label="End date" error={e?.end_date?.message}>
              <Controller
                control={control}
                name={`education.${i}.end_date`}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    showPresent={true}
                    error={e?.end_date?.message}
                  />
                )}
              />
            </Field>
            <Field label="Grade / GPA" error={e?.grade?.message} className="lg:col-span-2">
              <input className={inputCls} {...register(`education.${i}.grade`)} />
            </Field>
          </div>
        );
      }}
    />
  );
}

function ProjectsStep() {
  const { register, control, formState: { errors } } = useFormContext<Resume>();
  return (
    <RepeatableSection
      name="projects"
      heading="Projects"
      itemLabel={(i) => `Project #${i + 1}`}
      defaultItem={{
        project_name: "",
        team_size: "1",
        project_url: "",
        technologies: [],
        description: "",
        start_date: "",
        end_date: "",
      }}
      renderItem={(i) => {
        const e = (errors.projects as any)?.[i];
        return (
          <div className="grid lg:grid-cols-2 gap-4">
            <Field label="Project name" error={e?.project_name?.message}>
              <input
                className={inputCls}
                {...register(`projects.${i}.project_name`)}
              />
            </Field>
            <Field label="Team size" error={e?.team_size?.message}>
              <input
                className={inputCls}
                {...register(`projects.${i}.team_size`)}
              />
            </Field>
            <Field label="Project URL" error={e?.project_url?.message} className="lg:col-span-2">
              <input
                className={inputCls}
                placeholder="https://…"
                {...register(`projects.${i}.project_url`)}
              />
            </Field>
            <Field label="Start date" error={e?.start_date?.message}>
              <Controller
                control={control}
                name={`projects.${i}.start_date`}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={e?.start_date?.message}
                  />
                )}
              />
            </Field>
            <Field label="End date" error={e?.end_date?.message}>
              <Controller
                control={control}
                name={`projects.${i}.end_date`}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    showPresent={true}
                    error={e?.end_date?.message}
                  />
                )}
              />
            </Field>
            <Field label="Description" error={e?.description?.message} className="lg:col-span-2">
              <textarea
                className={textareaCls}
                {...register(`projects.${i}.description`)}
              />
            </Field>
            <Field label="Technologies" error={e?.technologies?.message} className="lg:col-span-2">
              <Controller
                control={control}
                name={`projects.${i}.technologies`}
                render={({ field }) => (
                  <TagsInput value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          </div>
        );
      }}
    />
  );
}

function CertificationsStep() {
  const { register, control, formState: { errors } } = useFormContext<Resume>();
  return (
    <RepeatableSection
      name="certifications"
      heading="Certifications"
      itemLabel={(i) => `Certification #${i + 1}`}
      defaultItem={{ title: "", issuer: "", issue_date: "", skills: [] }}
      renderItem={(i) => {
        const e = (errors.certifications as any)?.[i];
        return (
          <div className="grid lg:grid-cols-2 gap-4">
            <Field label="Title" error={e?.title?.message}>
              <input
                className={inputCls}
                {...register(`certifications.${i}.title`)}
              />
            </Field>
            <Field label="Issuer" error={e?.issuer?.message}>
              <input
                className={inputCls}
                {...register(`certifications.${i}.issuer`)}
              />
            </Field>
            <Field label="Issue date" error={e?.issue_date?.message}>
              <Controller
                control={control}
                name={`certifications.${i}.issue_date`}
                render={({ field }) => (
                  <MonthYearPicker
                    value={field.value}
                    onChange={field.onChange}
                    error={e?.issue_date?.message}
                  />
                )}
              />
            </Field>
            <Field label="Skills" error={e?.skills?.message} className="lg:col-span-2">
              <Controller
                control={control}
                name={`certifications.${i}.skills`}
                render={({ field }) => (
                  <TagsInput value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          </div>
        );
      }}
    />
  );
}

function ListStep({
  name,
  heading,
  desc,
}: {
  name:
    | "achievements"
    | "technical_participation"
    | "co_curricular"
    | "extra_curricular";
  heading: string;
  desc?: string;
}) {
  const { control, register, formState: { errors } } = useFormContext<Resume>();
  const { fields, append, remove } = useFieldArray({ control, name });
  const listErrors = errors[name] as any;

  const addButton = (
    <PillButton
      type="button"
      variant="secondary"
      onClick={() => append({ title: "", description: "" })}
    >
      <Plus className="h-4 w-4" /> Add item
    </PillButton>
  );

  return (
    <div>
      <StepHeader title={heading} desc={desc} action={addButton} />
      <div className="space-y-3">
        {fields.length === 0 && (
          <div className="text-sm text-muted-foreground border border-dashed border-border rounded-2xl p-8 text-center">
            Nothing here yet.
          </div>
        )}
        {fields.map((f, i) => (
          <div key={f.id} className="mb-3">
            <div className="flex items-center gap-2">
              <input
                className={cn(inputCls, "flex-1")}
                placeholder={
                  name === "achievements"
                    ? "Achievement (e.g. Won first place in XYZ coding competition)"
                    : name === "technical_participation"
                      ? "Participation (e.g. Attended AWS re:Invent)"
                      : name === "co_curricular"
                        ? "Activity (e.g. Member of the university coding club)"
                        : "Activity (e.g. Captain of the university basketball team)"
                }
                {...register(`${name}.${i}.title` as const)}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="h-11 w-11 rounded-2xl grid place-items-center hover:bg-danger/10 text-destructive border border-transparent hover:border-danger/20 transition shrink-0"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {listErrors?.[i]?.title?.message && (
              <div className="text-xs text-destructive mt-1">
                {listErrors[i].title.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
