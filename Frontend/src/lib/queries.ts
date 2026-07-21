import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getStoredToken } from "./api";
import type { Resume } from "./resume-schema";
import { useAuthToken } from "./use-auth";
import { emptyResume } from "./resume-schema";

function formatToBackendDate(d: string | null | undefined): string | null {
  if (!d) return null;
  const trimmed = d.trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{4}-\d{2}$/.test(trimmed)) return `${trimmed}-01`;
  return trimmed;
}

function formatFromBackendDate(d: string | null | undefined): string {
  if (!d) return "";
  const trimmed = d.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed.slice(0, 7);
  return trimmed;
}

function toBackendResume(r: Resume) {
  const hasLocation = !!(
    r.personal_info.address?.trim() ||
    r.personal_info.city?.trim() ||
    r.personal_info.state?.trim() ||
    r.personal_info.country?.trim() ||
    r.personal_info.postal_code?.trim()
  );

  return {
    personal_info: {
      name: {
        first_name: r.personal_info.first_name.trim(),
        middle_name: r.personal_info.middle_name?.trim() || null,
        last_name: r.personal_info.last_name.trim(),
      },
      email: r.personal_info.email.trim(),
      phone: r.personal_info.phone.trim(),
      location: hasLocation
        ? {
            address: r.personal_info.address?.trim() || null,
            city: r.personal_info.city.trim(),
            state: r.personal_info.state.trim(),
            country: r.personal_info.country.trim(),
            postal_code: r.personal_info.postal_code.trim(),
          }
        : null,
      linkedin: r.personal_info.linkedin?.trim() || null,
      github: r.personal_info.github?.trim() || null,
      portfolio: r.personal_info.portfolio?.trim() || null,
    },
    skills: r.skills,
    experience: r.experience.map((e) => ({
      company: e.company.trim(),
      designation: e.designation.trim(),
      ctc: parseFloat(e.ctc) || 0,
      location: e.location.trim(),
      start_date: formatToBackendDate(e.start_date) || "2000-01-01",
      end_date: formatToBackendDate(e.end_date),
      skills: e.skills,
      description: e.description.trim(),
    })),
    education: r.education.map((e) => ({
      institution_name: e.institution.trim(),
      degree: e.degree.trim(),
      field_of_study: e.field_of_study.trim(),
      start_date: formatToBackendDate(e.start_date) || "2000-01-01",
      end_date: formatToBackendDate(e.end_date),
      grade: e.grade?.trim() || null,
    })),
    projects: r.projects.map((p) => ({
      project_name: p.project_name.trim(),
      team_size: parseInt(p.team_size, 10) || 1,
      start_date: formatToBackendDate(p.start_date) || "2000-01-01",
      end_date: formatToBackendDate(p.end_date),
      project_url: p.project_url.trim(),
      technologies_used: p.technologies,
      description: p.description.trim(),
    })),
    certifications: r.certifications.map((c) => ({
      title: c.title.trim(),
      issuing_organization: c.issuer?.trim() || null,
      issue_date: formatToBackendDate(c.issue_date),
      skills: c.skills,
    })),
    technical_participation: r.technical_participation.map(
      (t) => t.title + (t.description ? ` - ${t.description}` : ""),
    ),
    co_curricular: r.co_curricular.map(
      (c) => c.title + (c.description ? ` - ${c.description}` : ""),
    ),
    extra_curricular: r.extra_curricular.map(
      (e) => e.title + (e.description ? ` - ${e.description}` : ""),
    ),
    achievements: r.achievements.map(
      (a) => a.title + (a.description ? ` - ${a.description}` : ""),
    ),
  };
}

export function getResumeWithUserFallback(): Resume {
  const resume = emptyResume();
  if (typeof window !== "undefined") {
    try {
      const userStr = window.localStorage.getItem("resumeai_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const name = user?.Name || user?.name || "";
        const email = user?.Email || user?.email || "";
        if (name) {
          const parts = name.trim().split(/\s+/);
          resume.personal_info.first_name = parts[0] || "";
          resume.personal_info.last_name = parts.slice(1).join(" ") || "";
        } else if (email) {
          const prefix = email.split("@")[0];
          const parts = prefix.split(/[\._-]/);
          resume.personal_info.first_name = parts[0]
            ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
            : "";
          resume.personal_info.last_name = parts
            .slice(1)
            .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
        }
        resume.personal_info.email = email;
      }
    } catch (e) {
      console.error("Error reading stored user for fallback:", e);
    }
  }
  return resume;
}

function fromBackendResume(payload: any): Resume {
  console.log("Raw backend resume payload:", payload);
  const b = payload?.personal_info
    ? payload
    : payload?.data?.personal_info
      ? payload.data
      : null;
  if (!b || !b.personal_info) {
    console.warn("No personal_info found in payload, returning user fallback.");
    return getResumeWithUserFallback();
  }
  const def = emptyResume();
  try {
    return {
      ...def,
      personal_info: {
        first_name: b.personal_info?.name?.first_name || "",
        middle_name: b.personal_info?.name?.middle_name || "",
        last_name: b.personal_info?.name?.last_name || "",
        email: b.personal_info?.email || "",
        phone: b.personal_info?.phone || "",
        address: b.personal_info?.location?.address || "",
        city: b.personal_info?.location?.city || "",
        state: b.personal_info?.location?.state || "",
        country: b.personal_info?.location?.country || "",
        postal_code: b.personal_info?.location?.postal_code || "",
        linkedin: b.personal_info?.linkedin || "",
        github: b.personal_info?.github || "",
        portfolio: b.personal_info?.portfolio || "",
      },
      skills: Array.isArray(b.skills) ? b.skills : [],
      experience: Array.isArray(b.experience)
        ? b.experience.map((e: any) => ({
            company: e?.company || "",
            designation: e?.designation || "",
            ctc: e?.ctc ? e.ctc.toString() : "",
            location: e?.location || "",
            start_date: formatFromBackendDate(e?.start_date),
            end_date: formatFromBackendDate(e?.end_date),
            description: e?.description || "",
            skills: Array.isArray(e?.skills) ? e.skills : [],
          }))
        : [],
      education: Array.isArray(b.education)
        ? b.education.map((e: any) => ({
            institution: e?.institution_name || "",
            degree: e?.degree || "",
            field_of_study: e?.field_of_study || "",
            start_date: formatFromBackendDate(e?.start_date),
            end_date: formatFromBackendDate(e?.end_date),
            grade: e?.grade || "",
          }))
        : [],
      projects: Array.isArray(b.projects)
        ? b.projects.map((p: any) => ({
            project_name: p?.project_name || "",
            team_size: p?.team_size ? p.team_size.toString() : "1",
            project_url: p?.project_url || "",
            technologies: Array.isArray(p?.technologies_used)
              ? p.technologies_used
              : [],
            description: p?.description || "",
            start_date: formatFromBackendDate(p?.start_date),
            end_date: formatFromBackendDate(p?.end_date),
          }))
        : [],
      certifications: Array.isArray(b.certifications)
        ? b.certifications.map((c: any) => ({
            title: c?.title || "",
            issuer: c?.issuing_organization || "",
            issue_date: formatFromBackendDate(c?.issue_date),
            skills: Array.isArray(c?.skills) ? c.skills : [],
          }))
        : [],
      technical_participation: Array.isArray(b.technical_participation)
        ? b.technical_participation.map((t: any) =>
            typeof t === "string"
              ? { title: t, description: "" }
              : { title: t?.title || "", description: t?.description || "" },
          )
        : [],
      co_curricular: Array.isArray(b.co_curricular)
        ? b.co_curricular.map((c: any) =>
            typeof c === "string"
              ? { title: c, description: "" }
              : { title: c?.title || "", description: c?.description || "" },
          )
        : [],
      extra_curricular: Array.isArray(b.extra_curricular)
        ? b.extra_curricular.map((e: any) =>
            typeof e === "string"
              ? { title: e, description: "" }
              : { title: e?.title || "", description: e?.description || "" },
          )
        : [],
      achievements: Array.isArray(b.achievements)
        ? b.achievements.map((a: any) =>
            typeof a === "string"
              ? { title: a, description: "" }
              : { title: a?.title || "", description: a?.description || "" },
          )
        : [],
    };
  } catch (err) {
    console.error("Error mapping backend resume:", err);
    return emptyResume();
  }
}

export const RESUME_KEY = ["base-resume"] as const;

export function useBaseResume(enabled = true) {
  const { token, ready } = useAuthToken();
  return useQuery({
    queryKey: [...RESUME_KEY, token],
    enabled: enabled && ready && !!token,
    retry: false,
    queryFn: async () => {
      try {
        console.log("Fetching base resume...");
        const { data } = await api.get("/base_resume/base_resume");
        return fromBackendResume(data);
      } catch (err: any) {
        console.error(
          "Error fetching base resume:",
          err?.response?.data || err.message,
        );
        if (err?.response?.status === 404) return null;
        throw err;
      }
    },
  });
}

export function useSaveResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      resume,
      exists,
    }: {
      resume: Resume;
      exists: boolean;
    }) => {
      const url = exists
        ? "/base_resume/update_base_resume"
        : "/base_resume/create_base_resume";
      const method = exists ? "put" : "post";
      const payload = toBackendResume(resume);
      const { data } = await api.request({ url, method, data: payload });
      return fromBackendResume(data);
    },
    onSuccess: (data) => {
      const token = getStoredToken();
      qc.setQueryData([...RESUME_KEY, token], data);
      qc.invalidateQueries({ queryKey: RESUME_KEY });
    },
  });
}

export function useGenerateResume() {
  return useMutation({
    mutationFn: async (jd_text: string) => {
      const response = await api.post(`/jd_resume/generate-resume`, undefined, {
        params: { jd_text },
        responseType: "blob",
      });

      const disposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];
      let filename = "";

      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"';\n]+)"?/);
        if (match && match[1]) {
          filename = match[1].trim();
        }
      }

      if (!filename) {
        try {
          const userStr =
            typeof window !== "undefined"
              ? window.localStorage.getItem("resumeai_user")
              : null;
          let nameSlug = "resume";
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.email) {
              nameSlug = user.email.split("@")[0].replace(/[.\s]+/g, "_");
            }
          }

          let company = "company";
          const matches = jd_text.match(
            /\b(cisco|google|microsoft|amazon|meta|apple|netflix|adobe|ibm|infosys|tata|tcs|wipro|accenture|deloitte)\b/i,
          );
          if (matches && matches[1]) {
            company = matches[1].toLowerCase();
          } else {
            const atMatch = jd_text.match(/at\s+([A-Za-z0-9]+)/);
            if (atMatch && atMatch[1]) {
              company = atMatch[1].toLowerCase();
            }
          }
          filename = `${nameSlug}_resume@${company}.pdf`;
        } catch (e) {
          filename = "generated_resume.pdf";
        }
      }

      return {
        blob: response.data as Blob,
        filename,
      };
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await api.post("/auth/login", {
        Email: payload.email,
        password: payload.password,
      });
      return data as { access_token?: string; token?: string; user?: any };
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      password: string;
    }) => {
      const { data } = await api.post("/auth/signup", {
        Name: payload.name,
        Email: payload.email,
        password: payload.password,
      });
      return data as { access_token?: string; token?: string; user?: any };
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post("/auth/forgot-password", {
        email,
      });
      return data as { message: string };
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: {
      password: string;
      accessToken: string;
      refreshToken: string;
    }) => {
      const { data } = await api.post("/auth/reset-password", {
        access_token: payload.accessToken,
        refresh_token: payload.refreshToken,
        password: payload.password,
      });
      return data as { message: string };
    },
  });
}

export function useValidateKey() {
  return useMutation({
    mutationFn: async (key: string) => {
      const { data } = await api.post("/jd_resume/validate_key", null, {
        headers: {
          "X-Google-Api-Key": key,
        },
      });
      return data as { valid: boolean };
    },
  });
}

