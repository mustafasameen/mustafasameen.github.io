import PageHeader from "@/components/page-header";
import ResearchThemes from "@/components/research-themes";
import Container from "@/components/shared/container";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Experience",
  description: "Research roles, what I worked on in each one, and education.",
};

type Role = {
  org: string;
  orgUrl?: string;
  title: string;
  period: string;
  summary: string;
  tags: string[];
  body?: ReactNode;
};

const roles: Role[] = [
  {
    org: "University of Florida — SERMoS Lab",
    orgUrl: "https://faculty.eng.ufl.edu/sermos-lab/",
    title: "Graduate Research Assistant",
    period: "Jul 2025 — Present",
    summary:
      "Advised by Dr. Xilei Zhao. I build LLM agents and multi-agent simulations of human behavior, and the benchmarks that test them, across three threads.",
    tags: [
      "LLM agents",
      "Reinforcement learning",
      "Multi-agent simulation",
      "Mobility data",
      "Disaster resilience",
    ],
    body: <ResearchThemes layout="rows" />,
  },
  {
    org: "MIT JTL-Transit Lab",
    orgUrl: "https://mobility.mit.edu/",
    title: "Summer Research Intern",
    period: "Jun 2025 — Jul 2025",
    summary:
      "Designed a Spatial-RAG pipeline over transit data (GTFS and GIS) for the Chicago Transit Authority, and prototyped LLM agents that reason about delay propagation and rerouting in transit networks.",
    tags: ["Spatial RAG", "Transit operations"],
  },
  {
    org: "Colorado College — Math & Computer Science",
    orgUrl: "https://www.coloradocollege.edu",
    title: "Undergraduate Researcher (Senior Thesis)",
    period: "Aug 2024 — May 2025",
    summary:
      "Built FORMAL, an agentic retrieval-augmented system that translates natural-language mathematics into Lean 4. With local LLMs it reached 92% syntactic correctness and 83% semantic accuracy on the Lean-Workbook benchmark.",
    tags: ["Lean 4", "Formal methods"],
  },
];

type Degree = {
  school: string;
  schoolUrl: string;
  degree: ReactNode;
  note?: string;
};

const education: Degree[] = [
  {
    school: "University of Florida",
    schoolUrl: "https://www.ufl.edu",
    degree: "Ph.D.",
    note: "In progress",
  },
  {
    school: "University of Florida",
    schoolUrl: "https://msais.eng.ufl.edu",
    degree: "M.S. in Artificial Intelligence Systems",
    note: "In progress",
  },
  {
    school: "Colorado College",
    schoolUrl: "https://www.coloradocollege.edu",
    degree: "B.A., Computer Science and Mathematics (double major)",
  },
];

function OrgLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors hover:text-emerald-800 dark:hover:text-emerald-300"
    >
      {children}
    </a>
  );
}

export default function Experience() {
  return (
    <Container size="large" className="container animate-enter">
      <PageHeader
        title="Where I've worked"
        subtitle="Research roles, what I worked on in each, and education."
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
                  <OrgLink href={role.orgUrl}>{role.org}</OrgLink>
                </h2>
                <time className="shrink-0 text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
                  {role.period}
                </time>
              </header>
              <p className="mt-0.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                {role.title}
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-neutral-700 dark:text-neutral-300">
                {role.summary}
              </p>
              {role.body ? <div className="mt-6">{role.body}</div> : null}
              <ul
                aria-label="Topics"
                className="dot-list mt-5 gap-y-1 text-xs tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                {role.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>

      <section className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Education
        </h2>
        <ul className="mt-5 space-y-4">
          {education.map((d) => (
            <li
              key={`${d.schoolUrl}-${d.school}`}
              className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="shrink-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:w-44">
                <OrgLink href={d.schoolUrl}>{d.school}</OrgLink>
              </span>
              <span className="text-[0.95rem] leading-relaxed text-zinc-700 dark:text-zinc-300">
                {d.degree}
                {d.note ? (
                  <span className="block text-sm text-zinc-500 dark:text-zinc-400">
                    {d.note}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
