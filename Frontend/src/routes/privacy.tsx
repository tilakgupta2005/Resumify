import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  FileCheck,
  Scale,
  AlertCircle,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    title: "Privacy Policy | Resumify (Indian DPDP Act & IT Act Compliant)",
    meta: [
      {
        name: "description",
        content:
          "Resumify Privacy Policy adhering to Indian standards including the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-8 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center shadow-soft group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-foreground">
              Resumify
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-border bg-card hover:bg-muted text-foreground transition active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <Link
              to="/terms"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-primary/10 text-foreground hover:bg-primary/20 transition active:scale-95"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Badge Banner */}
      <section className="relative pt-12 pb-8 px-4 sm:px-8 border-b border-border/40 bg-muted/20">
        <div className="max-w-4xl mx-auto text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-foreground font-sans font-semibold text-xs tracking-wider uppercase mb-4"
          >
            <Shield className="h-3.5 w-3.5 text-primary" /> Indian Legal
            Compliance • DPDP Act 2023 & IT Act 2000
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-muted-foreground mt-3 text-sm sm:text-base leading-relaxed"
          >
            Last Updated:{" "}
            <span className="font-semibold text-foreground">{lastUpdated}</span>{" "}
            | Effective Date: {lastUpdated}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-xs sm:text-sm text-muted-foreground mt-2"
          >
            Formulated in compliance with the{" "}
            <span className="font-medium text-foreground">
              Digital Personal Data Protection Act, 2023 (DPDP Act)
            </span>
            , Section 43A of the{" "}
            <span className="font-medium text-foreground">
              Information Technology Act, 2000
            </span>
            , and the{" "}
            <span className="font-medium text-foreground">
              IT (Reasonable Security Practices and Procedures and Sensitive
              Personal Data or Information) Rules, 2011
            </span>
            .
          </motion.p>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-12 text-left">
        {/* Compliance Highlights Card */}
        <div className="card-surface p-6 sm:p-8 bg-card border border-border/80 rounded-2xl shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary/20 grid place-items-center text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">
              Key Privacy Commitments to Indian Users
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm mt-4">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Consent-First Architecture:</strong> Explicit,
                verifiable notice and consent under Section 6 of the DPDP Act
                2023.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>No Data Monetization:</strong> We never sell, rent, or
                trade your personal or career data to recruitment brokers or
                third parties.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Data Principal Rights:</strong> Full right to access,
                rectify, erase your resumes and withdraw consent anytime.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Statutory Grievance Redressal:</strong> Dedicated
                Grievance Officer based in India with swift turnaround times.
              </span>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">01.</span>{" "}
            Introduction & Scope
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Welcome to <strong>Resumify</strong> (&quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;), accessible via web applications
            developed and operated in the Republic of India. This Privacy Policy
            details how we collect, store, process, transfer, and safeguard
            personal information and Sensitive Personal Data or Information
            (SPDI) of our users (&quot;Data Principals&quot;) when utilizing our
            resume generation and career management platform.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            By registering, logging in, or using Resumify, you acknowledge that
            you have read, understood, and consented to the collection and
            handling of your data in accordance with this policy and Indian data
            protection statutes.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">02.</span>{" "}
            Categories of Data We Collect
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Under the DPDP Act 2023 and SPDI Rules 2011, we collect only
            necessary and proportionate personal data for specified purposes:
          </p>
          <div className="space-y-3 mt-2">
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Identity & Contact
                Information
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Full name, email address, password hash (salted and encrypted),
                contact phone number, and city/state of residence.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/60">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Career,
                Educational & Professional Credentials
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Educational degrees, schools/universities, work experiences, job
                titles, achievements, technical skills, certifications, and
                project summaries provided by you to compile your resumes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/60">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" /> Technical, Log & Device
                Information
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                IP address, browser type and version, operating system, session
                tokens, error telemetry, and timestamps required for
                cybersecurity under Indian law.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">03.</span> Purpose
            and Legal Grounds for Processing
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            In compliance with Section 4 and Section 6 of the DPDP Act 2023,
            personal data is processed solely for lawful purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted-foreground">
            <li>
              <strong>Service Delivery:</strong> To generate, tailor, store, and
              export ATS-compliant resumes and maintain user profiles.
            </li>
            <li>
              <strong>AI Content Enhancement:</strong> To analyze job
              descriptions submitted by you and produce relevant resume bullet
              points and summaries.
            </li>
            <li>
              <strong>Authentication & Security:</strong> To authenticate your
              account, verify password reset requests, and protect against
              fraudulent or unauthorized activity.
            </li>
            <li>
              <strong>Compliance with Indian Laws:</strong> To adhere to legal
              reporting or verification requests from authorized statutory
              authorities under the Information Technology Act, 2000.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">04.</span> AI
            Processing and Data Isolation
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Resumify incorporates artificial intelligence models to assist you
            in refining bullet points and customizing applications.
          </p>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs sm:text-sm text-muted-foreground space-y-2">
            <p>
              • <strong>No Public Model Training:</strong> Your private resumes
              and personal identifiers are not used to train publicly accessible
              foundation models.
            </p>
            <p>
              • <strong>Ephemerality:</strong> Job descriptions pasted into the
              AI module are processed transiently to generate matches and are
              not shared with external advertising entities.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">05.</span> Rights
            of the Data Principal (Indian Citizens)
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Under Chapter III of the Digital Personal Data Protection Act, 2023,
            you are endowed with distinct rights:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm mt-3">
            <div className="border border-border p-4 rounded-xl bg-card">
              <h4 className="font-bold text-foreground">
                1. Right to Access Information
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                You may request a summary of personal data being processed and
                identities of any data fiduciaries with whom data has been
                shared.
              </p>
            </div>
            <div className="border border-border p-4 rounded-xl bg-card">
              <h4 className="font-bold text-foreground">
                2. Right to Correction & Erasure
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                You can correct misleading or incomplete data, or permanently
                delete your account and associated resumes at any time through
                your Profile dashboard.
              </p>
            </div>
            <div className="border border-border p-4 rounded-xl bg-card">
              <h4 className="font-bold text-foreground">
                3. Right of Grievance Redressal
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                You have the right to readily accessible grievance redressal
                mechanisms regarding any act or omission of the Data Fiduciary.
              </p>
            </div>
            <div className="border border-border p-4 rounded-xl bg-card">
              <h4 className="font-bold text-foreground">
                4. Right to Nominate
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                You possess the statutory right to nominate another individual
                who will exercise your rights in the event of death or
                incapacity.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">06.</span> Security
            Practices & Safeguards
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            In compliance with Section 43A of the IT Act 2000 and the SPDI
            Rules, Resumify maintains comprehensive physical, organizational,
            and technological safeguards:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-muted-foreground">
            <li>
              End-to-end transport layer encryption (TLS 1.3/HTTPS) for all data
              in flight.
            </li>
            <li>
              Industry-standard cryptographic hashing (Argon2 / BCrypt) for user
              passwords.
            </li>
            <li>
              Role-based access controls ensuring strict isolation between user
              accounts.
            </li>
            <li>
              Continuous vulnerability assessment, automated log anomaly
              detection, and secure backup protocols.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">07.</span>{" "}
            Protection of Children&apos;s Personal Data
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            In strict compliance with Section 9 of the DPDP Act 2023, Resumify
            does not knowingly process personal data of children under the age
            of 18 without verifiable parental consent. If we learn that personal
            data of a minor has been collected without verifiable consent, we
            will take immediate steps to delete such data from our records.
          </p>
        </section>

        {/* Section 8: Grievance Redressal Mechanism */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">08.</span>{" "}
            Grievance Redressal Officer (Mandatory Indian Disclosure)
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pursuant to Rule 5(9) of the Information Technology (Reasonable
            Security Practices and Procedures and Sensitive Personal Data or
            Information) Rules, 2011 and Section 13 of the Digital Personal Data
            Protection Act, 2023, the designated Grievance Officer is:
          </p>

          <div className="card-surface p-6 sm:p-7 bg-card rounded-2xl border border-border space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Designation
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  Data Protection & Grievance Redressal Officer
                </p>
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Attention
                </span>
                <p className="font-semibold text-foreground mt-0.5">
                  Tilak Gupta (Founder & Lead Developer)
                </p>
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Grievance Email
                </span>
                <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary" />{" "}
                  testmail@resumify.com
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 text-xs text-muted-foreground flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <span>
                <strong>Statutory Timelines:</strong> In accordance with the
                Information Technology Rules, all grievances will be
                acknowledged within <strong>48 hours</strong> of receipt and
                resolved within <strong>30 days</strong> from the date of
                submission.
              </span>
            </div>
          </div>
        </section>

        {/* Section 9: Governing Law */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="text-primary font-mono text-lg">09.</span>{" "}
            Governing Law and Dispute Jurisdiction
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            This Privacy Policy and all disputes or claims arising out of or in
            connection with it shall be governed by and construed in accordance
            with the laws of the <strong>Republic of India</strong>. Subject to
            the dispute resolution provisions of the DPDP Act 2023, the
            competent courts in India shall have exclusive jurisdiction over all
            matters.
          </p>
        </section>

        {/* Bottom CTA Box */}
        <div className="p-6 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-foreground">
              Have inquiries about your personal data?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              You can contact our Grievance Officer or manage your resume
              information directly.
            </p>
          </div>
          <Link
            to="/auth"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 h-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-95 transition shadow-soft shrink-0 active:scale-95"
          >
            Access My Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-4 sm:px-8 bg-card/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm tracking-tight text-foreground">
              Resumify
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition">
              Home
            </Link>
            <Link to="/terms" className="hover:text-foreground transition">
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground font-semibold text-foreground"
            >
              Privacy Policy
            </Link>
            <a
              href="https://tilak_dev.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition font-medium"
            >
              Proudly developed by Tilak
            </a>
          </div>

          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Resumify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
