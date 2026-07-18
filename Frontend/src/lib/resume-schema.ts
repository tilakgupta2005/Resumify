import { z } from "zod";

/* Zod schemas map to backend base_resume shape. */

export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(3, "First Name must be at least 3 characters")
    .max(50, "First Name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First Name can only contain letters and spaces"),
  middle_name: z
    .string()
    .optional()
    .default("")
    .refine(
      (val) => !val || (val.length >= 1 && val.length <= 50 && /^[a-zA-Z\s]+$/.test(val)),
      "Middle Name must be between 1 and 50 characters and only contain letters and spaces"
    ),
  last_name: z
    .string()
    .min(3, "Last Name must be at least 3 characters")
    .max(100, "Last Name must be at most 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last Name can only contain letters and spaces"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .regex(/^\+\d{1,3}\d{7,14}$/, "Phone number must start with country code (e.g., +1) and contain only digits"),
  address: z
    .string()
    .optional()
    .default("")
    .refine(
      (val) => !val || (val.trim().length >= 5 && val.trim().length <= 200),
      "Address must be between 5 and 200 characters"
    ),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  postal_code: z.string().optional().default(""),
  linkedin: z
    .string()
    .optional()
    .default("")
    .refine(
      (val) => !val || val.startsWith("https://www.linkedin.com/in/"),
      "URL must start with https://www.linkedin.com/in/"
    ),
  github: z
    .string()
    .optional()
    .default("")
    .refine(
      (val) => !val || val.startsWith("https://github.com/"),
      "URL must start with https://github.com/"
    ),
  portfolio: z
    .string()
    .optional()
    .default("")
    .refine(
      (val) => !val || val.startsWith("http://") || val.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
}).superRefine((data, ctx) => {
  const hasAnyLocation = !!(
    data.address?.trim() ||
    data.city?.trim() ||
    data.state?.trim() ||
    data.country?.trim() ||
    data.postal_code?.trim()
  );

  if (hasAnyLocation) {
    if (!data.city || data.city.trim().length < 2 || data.city.trim().length > 100 || !/^[A-Za-z\s]+$/.test(data.city)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required, must be 2-100 characters, and contain only letters/spaces",
        path: ["city"],
      });
    }
    if (!data.state || data.state.trim().length < 2 || data.state.trim().length > 100 || !/^[A-Za-z\s]+$/.test(data.state)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State is required, must be 2-100 characters, and contain only letters/spaces",
        path: ["state"],
      });
    }
    if (!data.country || data.country.trim().length < 2 || data.country.trim().length > 100 || !/^[A-Za-z\s]+$/.test(data.country)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Country is required, must be 2-100 characters, and contain only letters/spaces",
        path: ["country"],
      });
    }
    if (!data.postal_code || !/^[A-Za-z0-9\s\-]{3,12}$/.test(data.postal_code.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Postal code must be 3-12 characters and alphanumeric",
        path: ["postal_code"],
      });
    }
  }
});

const notInFuture = (val: string | null | undefined): boolean => {
  if (!val) return true;
  const trimmed = val.trim();
  if (!trimmed) return true;
  const parts = trimmed.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1] || "1", 10) - 1;
  const dateObj = new Date(year, month, 1);
  const now = new Date();
  const currentYearMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return dateObj <= currentYearMonth;
};

export const experienceSchema = z
  .object({
    company: z.string().min(1, "Required").max(150, "Company name must be at most 150 characters"),
    designation: z.string().min(1, "Required").max(100, "Designation must be at most 100 characters"),
    ctc: z.string().refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "CTC must be a positive number"),
    location: z.string().min(1, "Required"),
    start_date: z.string().min(1, "Required").refine(notInFuture, "Date cannot be in the future"),
    end_date: z.string().optional().default("").refine(notInFuture, "Date cannot be in the future"),
    description: z.string().min(1, "Required").max(1000, "Description must be at most 1000 characters"),
    skills: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["end_date"],
    }
  );

export const educationSchema = z
  .object({
    institution: z.string().min(1, "Required").max(150, "Institution name must be at most 150 characters"),
    degree: z.string().min(1, "Required").max(100, "Degree must be at most 100 characters"),
    field_of_study: z.string().min(1, "Required").max(100, "Field of study must be at most 100 characters"),
    start_date: z.string().min(1, "Required").refine(notInFuture, "Date cannot be in the future"),
    end_date: z.string().optional().default("").refine(notInFuture, "Date cannot be in the future"),
    grade: z.string().max(20, "Grade must be at most 20 characters").optional().default(""),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["end_date"],
    }
  );

export const projectSchema = z
  .object({
    project_name: z.string().min(1, "Required").max(150, "Project name must be at most 150 characters"),
    team_size: z.string().refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    }, "Team size must be a positive integer"),
    project_url: z.string().url("Must be a valid URL"),
    technologies: z.array(z.string()).min(1, "At least one technology required").max(500, "Technologies must be at most 500 items"),
    description: z.string().min(1, "Required").max(1000, "Description must be at most 1000 characters"),
    start_date: z.string().min(1, "Required").refine(notInFuture, "Date cannot be in the future"),
    end_date: z.string().optional().default("").refine(notInFuture, "Date cannot be in the future"),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["end_date"],
    }
  );

export const certificationSchema = z.object({
  title: z.string().min(1, "Required").max(150, "Title must be at most 150 characters"),
  issuer: z.string().max(150, "Issuer must be at most 150 characters").optional().default(""),
  issue_date: z.string().optional().default("").refine(notInFuture, "Date cannot be in the future"),
  skills: z.array(z.string()).default([]),
});

export const listItemSchema = z.object({
  title: z.string().min(1, "Required").max(200, "Title must be at most 200 characters"),
  description: z.string().max(300, "Description must be at most 300 characters").optional().default(""),
});

export const resumeSchema = z.object({
  personal_info: personalInfoSchema,
  skills: z.array(z.string()).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  achievements: z.array(listItemSchema).default([]),
  technical_participation: z.array(listItemSchema).default([]),
  co_curricular: z.array(listItemSchema).default([]),
  extra_curricular: z.array(listItemSchema).default([]),
});

export type Resume = z.infer<typeof resumeSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type ListItem = z.infer<typeof listItemSchema>;

export const emptyResume = (): Resume => ({
  personal_info: {
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
  technical_participation: [],
  co_curricular: [],
  extra_curricular: [],
});

export function computeCompletion(r: Resume) {
  const checks = [
    !!(
      r.personal_info.first_name &&
      r.personal_info.email &&
      r.personal_info.phone
    ),
    r.education.length > 0,
    r.skills.length > 0,
    r.experience.length > 0,
    r.projects.length > 0,
    r.certifications.length > 0,
    r.achievements.length > 0,
  ];
  const done = checks.filter(Boolean).length;
  return {
    done,
    total: checks.length,
    pct: Math.round((done / checks.length) * 100),
    checks,
  };
}
