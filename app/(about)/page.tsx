import { SelectedPaper } from "@/components/publication-card";
import ResearchThemes from "@/components/research-themes";
import Container from "@/components/shared/container";
import TextLink from "@/components/shared/text-link";
import Social from "@/components/social";
import Link from "next/link";
import Script from "next/script";
import { newsItems } from "../db/news";
import { getPublications } from "../db/publications";
import { SITE_URL } from "../site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mustafa Sameen",
  jobTitle: "PhD Student",
  worksFor: {
    "@type": "Organization",
    name: "University of Florida",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Colorado College",
  },
  url: SITE_URL,
  sameAs: [
    "https://github.com/mustafasameen",
    "https://www.linkedin.com/in/mustafasameen/",
    "https://scholar.google.com/citations?user=a8DWRtUAAAAJ&hl=en",
  ],
};

const KEYWORDS = [
  "LLM agents",
  "Multi-agent simulation",
  "Behavioral modeling",
  "LLM evaluation",
  "GeoAI",
  "Disaster resilience",
];

function SectionHeading({
  label,
  href,
  linkLabel,
}: {
  label: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {label}
      </h2>
      <Link
        href={href}
        className="text-sm tracking-tight text-zinc-500 transition-colors hover:text-emerald-800 dark:text-zinc-400 dark:hover:text-emerald-300"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

export default function About() {
  const featured = getPublications()
    .filter((pub) => pub.metadata.featured === "true")
    .sort((a, b) => Number(b.metadata.year || 0) - Number(a.metadata.year || 0));
  const recentNews = newsItems.slice(0, 3);

  return (
    <Container size="large" className="container animate-enter">
      <div className="prose prose-zinc dark:prose-invert mt-5 text-zinc-800 dark:text-zinc-200">
        <p>
          I am a second-year Ph.D. student at the{" "}
          <TextLink href="https://www.ufl.edu">University of Florida</TextLink>
          , advised by{" "}
          <TextLink href="https://essie.ufl.edu/people/name/xilei-zhao/">
            Dr. Xilei Zhao
          </TextLink>{" "}
          in the{" "}
          <TextLink href="https://faculty.eng.ufl.edu/sermos-lab/">
            SERMoS Lab
          </TextLink>
          , and I am also pursuing an{" "}
          <TextLink href="https://msais.eng.ufl.edu">
            M.S. in Artificial Intelligence Systems
          </TextLink>
          . Before that, I graduated from{" "}
          <TextLink href="https://www.coloradocollege.edu">
            Colorado College
          </TextLink>{" "}
          with a double major in Computer Science and Mathematics.
        </p>
        <p>
          I build{" "}
          <span className="font-medium">
            AI systems that model human behavior
          </span>{" "}
          &mdash; LLM agents and multi-agent simulations grounded in behavioral
          theory, and the benchmarks that test whether they get it right. Much
          of my work is in{" "}
          <span className="font-medium">human mobility</span>, from everyday
          travel decisions to how people move before, during, and after
          disasters.
        </p>
      </div>
      <ul
        aria-label="Research interests"
        className="dot-list mt-4 max-w-[15rem] gap-y-1 sm:max-w-[22.5rem] text-xs text-zinc-500 dark:text-zinc-400"
      >
        {KEYWORDS.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>
      <div className="mt-8">
        <Social />
      </div>
      <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <SectionHeading
          label="Research"
          href="/experience"
          linkLabel="Experience"
        />
        <div className="mt-6">
          <ResearchThemes />
        </div>
      </section>
      <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <SectionHeading
          label="Selected publications"
          href="/publications"
          linkLabel="All publications"
        />
        <div className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
          {featured.map((pub) => (
            <div key={pub.slug} className="py-6 first:pt-0 last:pb-0">
              <SelectedPaper pub={pub} />
            </div>
          ))}
        </div>
      </section>
      <section className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <SectionHeading label="Recent news" href="/news" linkLabel="All news" />
        <ul className="mt-5 space-y-4">
          {recentNews.map((item, idx) => (
            <li
              key={idx}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="shrink-0 text-sm tabular-nums text-zinc-500 dark:text-zinc-400 sm:w-20">
                {item.month} {item.year}
              </span>
              <span className="text-[0.95rem] leading-relaxed text-neutral-700 dark:text-neutral-300">
                {item.content}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Container>
  );
}
