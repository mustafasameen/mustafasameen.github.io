import PageHeader from "@/components/page-header";
import { PublicationCard } from "@/components/publication-card";
import Container from "@/components/shared/container";
import type { Metadata } from "next";
import { getPublications } from "../db/publications";

export const metadata: Metadata = {
  title: "Publications",
  description: "Research papers and preprints by Mustafa Sameen.",
};

export default function PublicationsPage() {
  const publications = getPublications();
  const years = Array.from(
    new Set(
      publications
        .map((pub) => pub.metadata.year?.trim())
        .filter((year): year is string => Boolean(year))
    )
  ).sort((a, b) => Number(b) - Number(a));

  return (
    <Container size="large" className="container animate-enter">
      <PageHeader
        eyebrow="Publications"
        title="Papers & preprints"
        subtitle="* denotes equal contribution"
      />
      <div className="space-y-12">
        {years.map((year) => (
          <section key={year} className="flex flex-col gap-4 sm:flex-row sm:gap-10">
            <h2 className="shrink-0 font-mono text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 sm:w-16 sm:pt-0.5">
              {year}
            </h2>
            <div className="flex-1 space-y-10">
              {publications
                .filter((pub) => pub.metadata.year?.trim() === year)
                .map((pub) => (
                  <PublicationCard key={pub.slug} pub={pub} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
