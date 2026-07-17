import type { Publication } from "@/types/blog";

function renderAuthors(authors: string, coFirstAuthors: string) {
  const coFirstSet = new Set(
    coFirstAuthors
      .split(",")
      .map((name) => name.trim().toLowerCase())
      .filter(Boolean)
  );

  return authors.split(",").map((rawName, idx, arr) => {
    const name = rawName.trim();
    const label = coFirstSet.has(name.toLowerCase()) ? `${name}*` : name;
    const isMustafa = /^Mustafa\s+Sameen$/i.test(name);
    const node = isMustafa ? (
      <strong
        key={idx}
        className="font-semibold text-emerald-950 dark:text-emerald-50 tracking-tight"
      >
        {label}
      </strong>
    ) : (
      <span key={idx}>{label}</span>
    );

    if (idx === arr.length - 1) return node;
    return (
      <span key={`${idx}-wrap`}>
        {node}
        {", "}
      </span>
    );
  });
}

function Badge({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-2 inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white/80 px-2.5 py-0.5 align-middle text-[0.65rem] font-medium uppercase tracking-wide text-zinc-600 no-underline shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-900 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-100"
    >
      {label}
      <span aria-hidden>↗</span>
    </a>
  );
}

export function PublicationCard({
  pub,
  compact = false,
}: {
  pub: Publication;
  compact?: boolean;
}) {
  const pdfUrl = pub.metadata.pdfUrl?.trim();
  const codeUrl = pub.metadata.codeUrl?.trim();
  const year = pub.metadata.year?.trim();

  if (compact) {
    return (
      <article>
        <h3 className="font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 decoration-zinc-300 underline-offset-4 transition-colors hover:text-emerald-800 hover:decoration-emerald-400 dark:decoration-zinc-700 dark:hover:text-emerald-300"
            >
              {pub.metadata.title}
            </a>
          ) : (
            pub.metadata.title
          )}
        </h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {pub.metadata.venue}
          {year && <> · {year}</>}
        </p>
      </article>
    );
  }

  return (
    <article>
      <header>
        <h3 className="font-semibold leading-relaxed text-neutral-900 underline decoration-1 decoration-zinc-300 underline-offset-4 dark:text-neutral-100 dark:decoration-zinc-700">
          {pdfUrl ? (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              {pub.metadata.title}
            </a>
          ) : (
            <span>{pub.metadata.title}</span>
          )}
          {pdfUrl && <Badge label="PDF" href={pdfUrl} />}
          {codeUrl && <Badge label="Code" href={codeUrl} />}
        </h3>
        <p className="mt-1.5 text-[0.95rem] text-neutral-600 dark:text-neutral-400">
          {renderAuthors(pub.metadata.authors, pub.metadata.coFirstAuthors || "")}
        </p>
      </header>
      <footer className="mt-1.5 font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
        {pub.metadata.venue}
      </footer>
    </article>
  );
}
