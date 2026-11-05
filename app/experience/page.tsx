import PageHeader from "@/components/page-header";
import Container from "@/components/shared/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description: "Research roles and what I worked on in each one.",
};

type Role = {
  org: string;
  orgUrl?: string;
  title: string;
  period: string;
  highlights: string[];
  tags: string[];
};

const roles: Role[] = [
  {
    org: "University of Florida — SERMoS Lab",
    orgUrl: "https://faculty.eng.ufl.edu/sermos-lab/",
    title: "Graduate Research Assistant",
    period: "Jul 2025 — Present",
    highlights: [
      "Researching LLM agents for transportation — multi-agent simulation of travel behavior and automated analysis of large-scale mobility data.",
      "Developed SAPA, a behavioral theory-guided LLM framework for ridesourcing mode-choice prediction.",
      "Co-developed GHOST, an open-source tool for bias-mitigated home detection from mobile location data (TRB 2026).",
    ],
    tags: ["LLM agents", "Multi-agent simulation", "Mobility data"],
  },
  {
    org: "MIT JTL-Transit Lab",
    orgUrl: "https://mobility.mit.edu/",
    title: "Summer Research Intern",
    period: "Jun 2025 — Jul 2025",
    highlights: [
      "Designed a Spatial-RAG pipeline over transit data (GTFS/GIS) for the Chicago Transit Authority.",
      "Prototyped LLM agents that reason about delay propagation and rerouting in transit networks.",
    ],
    tags: ["Spatial RAG", "Transit operations"],
  },
  {
    org: "Colorado College — Math & Computer Science",
    orgUrl: "https://www.coloradocollege.edu",
    title: "Undergraduate Researcher (Senior Thesis)",
    period: "Aug 2024 — May 2025",
    highlights: [
      "Built FORMAL, an agentic retrieval-augmented system that translates natural-language mathematics into Lean 4 code.",
      "Reached 92% syntactic correctness and 83% semantic accuracy on the Lean-Workbook benchmark using local LLMs.",
    ],
    tags: ["Lean 4", "Formal methods"],
  },
];

export default function Experience() {
  return (
    <Container size="large" className="container animate-enter">
      <PageHeader
        title="Where I've worked"
        subtitle="Research roles and what I worked on in each one."
      />
      <ol className="relative ml-1 border-l border-neutral-200 dark:border-neutral-800">
        {roles.map((role) => (
          <li key={role.org} className="relative pb-12 pl-8 last:pb-0">
            <span
              aria-hidden
              className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-emerald-500 ring-4 ring-zinc-50 dark:bg-emerald-400 dark:ring-zinc-950"
            />
            <article>
              <header className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {role.orgUrl ? (
                    <a
                      href={role.orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-emerald-800 dark:hover:text-emerald-300"
                    >
                      {role.org}
                    </a>
                  ) : (
                    role.org
                  )}
                </h2>
                <time className="shrink-0 text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
                  {role.period}
                </time>
              </header>
              <p className="mt-0.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                {role.title}
              </p>
              <ul className="mt-3 space-y-2">
                {role.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-3 text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-400"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-200 bg-white/80 px-2.5 py-0.5 text-xs font-medium tracking-tight text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Container>
  );
}
