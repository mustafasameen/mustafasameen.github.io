import { getPublications } from "@/app/db/publications";
import Image from "next/image";

type Theme = {
  title: string;
  description: string;
  ongoing: string;
  papers: { slug: string; label: string; venue: string }[];
};

// Ongoing work is described, never named: the preprints are not out yet.
const THEMES: Theme[] = [
  {
    title: "Agents that act for people",
    description:
      "LLM agents that negotiate, decide and delegate on behalf of people and households.",
    ongoing:
      "Agents that act on one person's behalf, and agents that moderate group decisions.",
    papers: [{ slug: "pemant", label: "PEMAND", venue: "Under review" }],
  },
  {
    title: "Modeling individuals",
    description:
      "Behavior models grounded in theory and personal records, and benchmarks that test what LLMs recover.",
    ongoing:
      "Agents built from a person's own GPS trace that predict how they respond to change.",
    papers: [
      { slug: "gauge", label: "GAUGE", venue: "UMFM @ SIGSPATIAL 2026" },
      { slug: "sapa", label: "SAPA", venue: "Preprint" },
    ],
  },
  {
    title: "Mobility and disasters",
    description:
      "How people move before, during and after disasters, and tools that measure it from location data.",
    ongoing:
      "Everyday mobility, recorded before a hazard strikes, reveals who evacuates, who stays and when, across wildfires and hurricanes.",
    papers: [
      { slug: "look-both-ways", label: "Look Both Ways", venue: "HuMob @ SIGSPATIAL 2026" },
      { slug: "geoai-act", label: "GeoAI-Act", venue: "GeoAI @ SIGSPATIAL 2026" },
      { slug: "ghost-trb", label: "GHOST", venue: "TRB 2026" },
    ],
  },
];

function PaperChip({
  label,
  venue,
  href,
  image,
}: {
  label: string;
  venue: string;
  href: string;
  image?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("/publications") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5"
    >
      {image ? (
        <span className="block w-14 shrink-0 rounded-md border border-zinc-200 bg-white p-1 transition-colors group-hover:border-emerald-300 dark:border-zinc-800 dark:group-hover:border-emerald-700/70">
          <Image
            src={image}
            alt=""
            width={960}
            height={480}
            sizes="56px"
            className="aspect-[2/1] h-auto w-full object-contain dark:brightness-[0.9]"
          />
        </span>
      ) : null}
      <span className="min-w-0 leading-tight">
        <span className="block text-sm font-medium text-zinc-900 transition-colors group-hover:text-emerald-800 dark:text-zinc-100 dark:group-hover:text-emerald-300">
          {label}
        </span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
          {venue}
        </span>
      </span>
    </a>
  );
}

export default function ResearchThemes({
  layout = "columns",
}: {
  layout?: "columns" | "rows";
}) {
  const pubs = new Map(getPublications().map((p) => [p.slug, p.metadata]));
  const columns = layout === "columns";

  const papersFor = (theme: Theme) =>
    theme.papers.map((paper) => {
      const meta = pubs.get(paper.slug);
      return (
        <PaperChip
          key={paper.slug}
          label={paper.label}
          venue={paper.venue}
          href={meta?.pdfUrl || "/publications"}
          image={meta?.image}
        />
      );
    });

  const heading = (theme: Theme) => (
    <div>
      <h3 className="text-[0.95rem] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {theme.title}
      </h3>
      <p
        className={`mt-1.5 leading-relaxed text-zinc-700 dark:text-zinc-300 ${columns ? "text-[0.95rem] md:text-sm" : "text-[0.95rem]"}`}
      >
        {theme.description}
      </p>
    </div>
  );

  const ongoing = (theme: Theme) => (
    <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
      <span className="font-medium text-emerald-800 dark:text-emerald-300">
        In progress:
      </span>{" "}
      {theme.ongoing}
    </p>
  );

  if (columns) {
    // Home: papers are left out because Selected publications follows directly.
    // Subgrid keeps the descriptions and in-progress lines on shared rows.
    return (
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-3 md:gap-y-0">
        {THEMES.map((theme) => (
          <article
            key={theme.title}
            className="border-t-2 border-emerald-600/70 pt-4 dark:border-emerald-400/60 md:row-span-2 md:grid md:grid-rows-subgrid"
          >
            {heading(theme)}
            {ongoing(theme)}
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {THEMES.map((theme) => (
        <article
          key={theme.title}
          className="grid gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_14.5rem] sm:gap-8"
        >
          <div>
            {heading(theme)}
            {ongoing(theme)}
          </div>
          <div className="space-y-3">{papersFor(theme)}</div>
        </article>
      ))}
    </div>
  );
}
