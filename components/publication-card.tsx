import type { Publication } from "@/types/blog";
import Image from "next/image";

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
        className="font-semibold text-emerald-950 dark:text-emerald-50"
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

function venueWithYear(venue: string, year?: string) {
  const v = venue.trim();
  const y = year?.trim();
  if (!y || v.includes(y)) return v;
  return `${v}, ${y}`;
}

function paperLinks(meta: Publication["metadata"]) {
  return [
    { label: "Paper", href: meta.pdfUrl?.trim() },
    { label: "Code", href: meta.codeUrl?.trim() },
    { label: "Website", href: meta.projectUrl?.trim() },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
}

function PaperLinks({ meta }: { meta: Publication["metadata"] }) {
  return (
    <>
      {paperLinks(meta).map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-emerald-700 underline-offset-4 transition-colors hover:text-emerald-900 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {link.label}
        </a>
      ))}
    </>
  );
}

const titleLink =
  "transition-colors hover:text-emerald-800 dark:hover:text-emerald-300";

/** Full entry for the publications page. */
export function PublicationCard({ pub }: { pub: Publication }) {
  const meta = pub.metadata;
  const href = meta.pdfUrl?.trim() || meta.projectUrl?.trim();
  const image = meta.image?.trim();

  return (
    <article className="grid grid-cols-1 gap-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5">
      {image ? (
        <Thumb src={image} href={href} sizes="136px" className="hidden sm:block" />
      ) : (
        // Keep text aligned with the rows that have a figure.
        <div aria-hidden="true" className="hidden sm:block" />
      )}
      <div className="min-w-0">
        <h3 className="text-pretty font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={titleLink}>
              {meta.title}
            </a>
          ) : (
            meta.title
          )}
        </h3>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-zinc-600 dark:text-zinc-400">
          {renderAuthors(meta.authors, meta.coFirstAuthors || "")}
        </p>
        <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{meta.venue}</p>
        {paperLinks(meta).length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <PaperLinks meta={meta} />
          </div>
        )}
      </div>
    </article>
  );
}

/** Paper figure in a white card; links to the paper but stays out of tab order. */
function Thumb({
  src,
  href,
  sizes,
  className = "block",
}: {
  src: string;
  href?: string;
  sizes: string;
  className?: string;
}) {
  const img = (
    <Image
      src={src}
      alt=""
      width={960}
      height={480}
      sizes={sizes}
      className="aspect-[2/1] h-auto w-full object-contain dark:brightness-[0.9]"
    />
  );
  const cls =
    `${className} self-start rounded-lg border border-zinc-200 bg-white p-1.5 dark:border-zinc-800`;
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden="true"
      className={`${cls} transition-colors hover:border-emerald-300 dark:hover:border-emerald-700/70`}
    >
      {img}
    </a>
  ) : (
    <div className={cls}>{img}</div>
  );
}

/** Figure-led row for "Selected publications" on the home page. */
export function SelectedPaper({ pub }: { pub: Publication }) {
  const meta = pub.metadata;
  const href = meta.projectUrl?.trim() || meta.pdfUrl?.trim();
  const image = meta.image?.trim();

  return (
    <article className="grid grid-cols-1 gap-4 sm:grid-cols-[12.5rem_minmax(0,1fr)] sm:gap-6">
      {image && (
        <Thumb src={image} href={href} sizes="(min-width: 640px) 200px, 100vw" />
      )}
      <div className="min-w-0">
        <h3 className="text-pretty font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={titleLink}>
              {meta.title}
            </a>
          ) : (
            meta.title
          )}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {venueWithYear(meta.venue, meta.year)}
        </p>
        {meta.summary && (
          <p className="mt-2 text-pretty text-[0.94rem] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {meta.summary}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <PaperLinks meta={meta} />
        </div>
      </div>
    </article>
  );
}
