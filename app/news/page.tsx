import PageHeader from "@/components/page-header";
import Container from "@/components/shared/container";
import type { Metadata } from "next";
import { newsItems } from "../db/news";

export const metadata: Metadata = {
  title: "News",
  description: "Recent updates, milestones, and announcements.",
};

export default function NewsPage() {
  const years: string[] = [];
  for (const item of newsItems) {
    if (!years.includes(item.year)) years.push(item.year);
  }

  return (
    <Container size="large" className="container animate-enter">
      <PageHeader
        eyebrow="News"
        title="What's new"
        subtitle="Milestones, papers, and announcements."
      />
      <div className="space-y-12">
        {years.map((year) => (
          <section key={year} className="flex flex-col gap-4 sm:flex-row sm:gap-10">
            <h2 className="shrink-0 font-mono text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 sm:w-16 sm:pt-0.5">
              {year}
            </h2>
            <ul className="flex-1 space-y-6">
              {newsItems
                .filter((item) => item.year === year)
                .map((item, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 sm:w-10">
                      {item.month}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {item.content}
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
