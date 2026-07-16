import { z } from "zod";

/* Zod schemas map to backend base_resume shape. */

export const personalInfoSchema = z.object({
  first_name: z.string().min(1, "Required"),
  middle_name: z.string().optional().default(""),
  last_name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(3, "Required"),
  address: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  postal_code: z.string().optional().default(""),
  linkedin: z.string().url("Must be a URL").optional().or(z.literal("")),
  github: z.string().url("Must be a URL").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a URL").optional().or(z.literal("")),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Required"),
  designation: z.string().min(1, "Required"),
  ctc: z.string().optional().default(""),
  location: z.string().optional().default(""),
  start_date: z.string().optional().default(""),
  end_date: z.string().optional().default(""),
  description: z.string().optional().default(""),
  skills: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Required"),
  degree: z.string().min(1, "Required"),
  field_of_study: z.string().optional().default(""),
  start_date: z.string().optional().default(""),
  end_date: z.string().optional().default(""),
  grade: z.string().optional().default(""),
});

export const projectSchema = z.object({
  project_name: z.string().min(1, "Required"),
  team_size: z.string().optional().default(""),
  project_url: z.string().url("Must be a URL").optional().or(z.literal("")),
  technologies: z.array(z.string()).default([]),
  description: z.string().optional().default(""),
  start_date: z.string().optional().default(""),
  end_date: z.string().optional().default(""),
});

export const certificationSchema = z.object({
  title: z.string().min(1, "Required"),
  issuer: z.string().min(1, "Required"),
  issue_date: z.string().optional().default(""),
  skills: z.array(z.string()).default([]),
});

export const listItemSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional().default(""),
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
