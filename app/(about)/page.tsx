import { PublicationCard } from "@/components/publication-card";
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
  url: SITE_URL,
  sameAs: [
    "https://github.com/mustafasameen",
    "https://www.linkedin.com/in/mustafasameen/",
    "https://scholar.google.com/citations?user=a8DWRtUAAAAJ&hl=en",
  ],
};

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
      <h2 className="text-xs uppercase tracking-[0.2em] text-emerald-700/80 dark:text-emerald-400/80">
        {label}
      </h2>
      <Link
        href={href}
        className="text-sm tracking-tight text-neutral-500 transition-colors hover:text-emerald-800 dark:text-neutral-400 dark:hover:text-emerald-300"
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
          . Before that, I graduated from{" "}
          <TextLink href="https://www.coloradocollege.edu">
            Colorado College
          </TextLink>{" "}
          with a double major in Computer Science and Mathematics.
        </p>
        <p>
          My research uses{" "}
          <span className="font-medium">GPS and mobility data</span> with
          machine learning, including{" "}
          <span className="font-medium">large language models</span>, to study
          how people move before, during, and after disasters such as
          hurricanes, wildfires, and earthquakes.
        </p>
      </div>
      <div className="mt-8">
        <Social />
      </div>
      <section className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <SectionHeading
          label="Selected publications"
          href="/publications"
          linkLabel="All publications"
        />
        <div className="mt-5 space-y-5">
          {featured.map((pub) => (
            <PublicationCard key={pub.slug} pub={pub} compact />
          ))}
        </div>
      </section>
      <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <SectionHeading label="Recent news" href="/news" linkLabel="All news" />
        <ul className="mt-5 space-y-4">
          {recentNews.map((item, idx) => (
            <li
              key={idx}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 sm:w-20">
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
